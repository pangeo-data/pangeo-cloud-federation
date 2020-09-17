// Enrich profile with the locations where the user logs in
function getIp(user, context, callback) {

  user.user_metadata = user.user_metadata || {};

  user.user_metadata.geoip = context.request.geoip;

  auth0.users.updateUserMetadata(user.user_id, user.user_metadata)
    .then(() => {
      context.idToken['https://example.com/geoip'] = context.request.geoip;
      callback(null, user, context);
    })
    .catch((err) => {
      callback(err);
    });
}
