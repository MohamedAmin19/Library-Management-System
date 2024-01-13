const auth = require('basic-auth');

const basicAuthMiddleware = (req, res, next) => {
    const credentials = auth(req);

    const USERNAME = process.env.BASIC_AUTH_USERNAME;
    const PASSWORD = process.env.BASIC_AUTH_PASSWORD;


    if (!credentials || credentials.name !== USERNAME || credentials.pass !== PASSWORD) {
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        return res.status(401).send('Access denied');
    }
    next();
};

module.exports = basicAuthMiddleware;
