var firebase = require('firebase');
var md5 = require('md5');

firebase.initializeApp({
    serviceAccount: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: `-----BEGIN PRIVATE KEY-----\n${process.env.FIREBASE_PRIVATE_KEY}\n-----END PRIVATE KEY-----\n`
    }
});

exports.getCustomTokenVK = function (req, res) {
    var uid;
    var token;

    if (isVkAuthKeyValid(req.query.viewer_id, req.query.auth_key)) {
        uid = req.params.uid;
        token = firebase.auth().createCustomToken(uid);
        res.json(token);
    } else {
        res.send(403);           
    }
};

function isVkAuthKeyValid(viewerId, authKey) {
    var hash = md5(`${process.env.VKONTAKTE_IFRAME_APP_ID}_${viewerId}_${process.env.VKONTAKTE_IFRAME_APP_SECRET}`);
    return authKey === hash;
}