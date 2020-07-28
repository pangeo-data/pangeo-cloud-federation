// https://gravitational.com/blog/aws-github-sso/
// Uses first org in REQUIRED_GITHUB_ORGS application list?
function (user, context, callback) {
  // access token to talk to github API
  var github = user.identities.filter(function (id){
     return id.provider === 'github';
  })[0];
  var access_token = github.access_token;
  request.get({
      baseUrl: "https://api.github.com/",
      uri: "/user/teams?per_page=100",
      headers: {
        // use token authorization to talk to github API
        "Authorization": "token "+access_token,
        // Remember the Application name registered in github?
        // use it to set User-Agent or request will fail
        "User-Agent": "Auth0",
      }
    }, function(err, res, data){
        user.err = err;
        if(data){
          // extract github team names to array
          var github_teams = JSON.parse(data).map(function(team){
            if(team.organization.login === 'pangeo-data'){
            return team.organization.login + "/" + team.slug;
            }
          });
          // add teams to the application metadata
          user.app_metadata = user.app_metadata || {};
          // update the app_metadata that will be part of the response
          user.app_metadata.roles = github_teams;

          // persist the app_metadata update
          auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
          .then(function(){
              callback(null, user, context);
          })
          .catch(function(err){
              callback(err);
          });
        }
    });
 }
