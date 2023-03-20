import jwt from 'jsonwebtoken';
import jwks from 'jwks-rsa';
import ms from 'ms';

export function authenticateAccessToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    // Decode jwt payload
    var decoded = jwt.decode(token, { complete: true });
    var payload = decoded.payload;

    // Create jwks client
    var client = jwks({
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: ms('10h'),
        jwksUri: payload.iss + '/.well-known/jwks.json'
    });

    // Get public key for jwt
    function getKey(header, callback) {
        client.getSigningKey(header.kid, function (err, key) {
            if (err) return callback(err);

            var signingKey = key.getPublicKey() || key.rsaPublicKey;
            callback(null, signingKey);
        });
    }

    // Verify jwt
    jwt.verify(token, getKey, function (err, _) {
        if (err) return res.sendStatus(401);
        next();
    });
}