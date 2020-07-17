// Auth0 custom rule
// Check if the user is a member of all required Github organizations
//
// This rule need the following configurations values 
// REQUIRED_GITHUB_TEAMS: github teams logins (fmt 'org-name/team-name', coma separated)
//
// Note: This rule should be used in conjuction with `add-github-orgs-to-user-meta.js`
//       Be sure to setup it to run after the first one.

function (user, context, callback) {
    if (
        // pass if provider is not github
        context.connectionStrategy !== 'github' ||
        // or if no org configured 
        !context.clientMetadata.REQUIRED_GITHUB_TEAMS
    ) {
        return callback(null, user, context);
    }

    const requiredTeams = context.clientMetadata.REQUIRED_GITHUB_TEAMS.split(',');

    if (
        user.app_metadata && user.app_metadata.roles &&
        requiredTeams.some(r => user.app_metadata.roles.includes(r))
    ) {
        return callback(null, user, context);
    }

    return callback(new UnauthorizedError('User is not part of REQUIRED_GITHUB_TEAMS.'));
}
