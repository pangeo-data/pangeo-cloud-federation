// Auth0 custom rule
// Check if the user is a member of all required Github organizations
//
// This rule need the following configurations values 
// REQUIRED_GITHUB_ORGS: github organizations logins (coma separated)
//
// Note: This rule should be used in conjuction with `add-github-orgs-to-user-meta.js`
//       Be sure to setup it to run after the first one.

function (user, context, callback) {
    if (
        // pass if provider is not github
        context.connectionStrategy !== 'github' ||
        // or if no org configured 
        !context.clientMetadata.REQUIRED_GITHUB_ORGS
    ) {
        return callback(null, user, context);
    }

    const requiredOrgs = context.clientMetadata.REQUIRED_GITHUB_ORGS.split(',');

    if (
        // pass if organizations are set
        user.user_metadata && user.user_metadata.github_orgs &&
        // and user is a member of all required orgs 
        requiredOrgs.some(r => user.user_metadata.github_orgs.includes(r))
    ) {
        return callback(null, user, context);
    }

    return callback(new UnauthorizedError('Access denied.'));
}
