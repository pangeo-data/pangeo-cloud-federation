// Auth0 custom rule
// Add Github Organizations to the user metadata
//
// This rule need the following configurations values 
// AUTH0_DOMAIN_NAME: your auth0 domain name
// MANAGEMENT_CLIENT_ID: your auth0 management api client id
// MANAGEMENT_CLIENT_SECRET: your auth0 management api client secret
//
// You have to create an Management API Application with proper
// scope to allow rule to fetch user organizations.
// Note: Youre Github social application must request the `read:org` scope!
//
// Auth0 UI workflow: 
// - Go to Applications, create new application
// - Name: Auth0 Management API
// - Type: Machine to Machine App
// - Select API: Auth0 Management API
// - Add read:user_idp_tokens scope
// - Go to Application settings, you'll find your ID and SECRET

function (user, context, callback) {
    // This rule below is specific to Github
    if (context.connectionStrategy !== 'github') {
        return callback(null, user, context);
    }

    function getManagementApiAccessToken(cb) {
        const cacheKey = "apiv2TokenToReadUserIdpToken";
        const cachedToken = global[cacheKey];
        if (cachedToken) {
            if (cachedToken.expirationDate > new Date()) {
                console.log("Reusing cached token that expires in " + cachedToken.expirationDate);
                return cb(null, cachedToken.token);
            }
            console.log('Cached token found but expired.');
        } else {
            console.log('Cached token not found.');
        }
        const AuthenticationClient = require('auth0@2.13.0').AuthenticationClient;
        const authClient = new AuthenticationClient({
            domain: configuration.AUTH0_DOMAIN_NAME,
            clientId: configuration.MANAGEMENT_CLIENT_ID,
            clientSecret: configuration.MANAGEMENT_CLIENT_SECRET
        });
        console.log("Getting new api v2 access token");
        authClient.clientCredentialsGrant({
            audience: 'https://' + configuration.AUTH0_DOMAIN_NAME + '/api/v2/'
        }, function (err, response) {
            if (err) {
                return cb(err);
            }
            const expirationDate = new Date();
            expirationDate.setSeconds(expirationDate.getSeconds() + response.expires_in - 60);
            // store token in cache
            console.log("Storing token, expires in " + expirationDate);
            global[cacheKey] = {
                expirationDate: expirationDate,
                token: response.access_token
            };
            cb(null, response.access_token);
        });
    }

    function getGithubAccessToken(apiToken, cb) {
        const ManagementClient = require('auth0@2.13.0').ManagementClient;
        const management = new ManagementClient({
            token: apiToken,
            domain: configuration.AUTH0_DOMAIN_NAME
        });
        management.users.get({
                id: user.user_id
            })
            .then(function (read_user) {
                const githubIdentity = _.find(read_user.identities, {
                    connection: 'github'
                });
                if (githubIdentity) {
                    if (githubIdentity.access_token) {
                        return cb(null, githubIdentity.access_token);
                    } else {
                        return cb(new Error("Could not find github access token."));
                    }
                } else {
                    return cb(new Error("Could not find github identity."));
                }
            })
            .catch(function (err) {
                return cb(err);
            });
    }

    function getGithubEndpoint(url, accessToken, callback) {
        require('request').get(url, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'User-Agent': 'Auth0-Custom-Rule'
            },
            json: true
        }, (err, resp, body) => {
            if (resp.statusCode !== 200) {
                return callback(new Error('Error retrieving data from github: ' + body || err));
            }
            return callback(err, body);
        });
    }


    return getManagementApiAccessToken(function (err, token) {
        if (err) {
            return callback(err);
        }
        return getGithubAccessToken(token, function (err, githubToken) {
            if (err) {
                return callback(err);
            }
            const url = 'https://api.github.com/user/orgs';
            return getGithubEndpoint(url, githubToken, function (err, githubBody) {
              if (err) {
                return callback(err);
              }
              user.user_metadata = user.user_metadata || {};
              user.user_metadata.github_orgs = githubBody.map(i => i.login);
 
              return auth0.users.updateUserMetadata(user.user_id, user.user_metadata)
              .then(function(){
                return callback(null, user, context);
              })
              .catch(function(err){
                return callback(err);
              });
            });
        });
    });
}
