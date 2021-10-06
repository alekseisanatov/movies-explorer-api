const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const allowedCors = [
  'https://sanatov.nomoredomains.monster',
  'http://sanatov.nomoredomains.monster',
  'https://api.sanatov.nomoredomains.monster',
  'http://api.sanatov.nomoredomains.monster',
  'http://localhost:3000'
];

// eslint-disable-next-line consistent-return
const corsCheck = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next(); // пропускаем запрос дальше
};

module.exports = { corsCheck };
