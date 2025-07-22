const morgan = require('morgan');
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`
};

// Custom morgan token for response time with color
morgan.token('response-time-colored', (req, res) => {
  const time = res.responseTime;
  if (time < 100) return colors.green(time + 'ms');
  if (time < 500) return colors.yellow(time + 'ms');
  return colors.red(time + 'ms');
});

// Custom morgan token for status code with color
morgan.token('status-colored', (req, res) => {
  const status = res.statusCode;
  if (status < 300) return colors.green(status);
  if (status < 400) return colors.cyan(status);
  if (status < 500) return colors.yellow(status);
  return colors.red(status);
});

// Custom morgan token for method with color
morgan.token('method-colored', (req, res) => {
  const method = req.method;
  switch (method) {
    case 'GET':
      return colors.cyan(method);
    case 'POST':
      return colors.green(method);
    case 'PUT':
    case 'PATCH':
      return colors.yellow(method);
    case 'DELETE':
      return colors.red(method);
    default:
      return colors.gray(method);
  }
});

// Development logging format
const developmentFormat = morgan((tokens, req, res) => {
  return [
    '\n',
    colors.gray('⤷'),
    tokens['method-colored'](req, res),
    colors.gray(tokens.url(req, res)),
    tokens['status-colored'](req, res),
    tokens['response-time-colored'](req, res),
    colors.gray('- ' + tokens.date(req, res)),
    '\n'
  ].join(' ');
});

// Production logging format
const productionFormat = morgan('combined');

// Request logging middleware
const requestLogger = (req, res, next) => {
  // Add response time calculation
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    res.responseTime = Math.round((diff[0] * 1e3 + diff[1] * 1e-6) * 100) / 100;
  });

  // Use appropriate format based on environment
  if (process.env.NODE_ENV === 'development') {
    developmentFormat(req, res, next);
  } else {
    productionFormat(req, res, next);
  }
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  console.error(colors.red('\nError Log:'));
  console.error(colors.red('Timestamp:'), new Date().toISOString());
  console.error(colors.red('Request URL:'), req.originalUrl);
  console.error(colors.red('Request Method:'), req.method);
  console.error(colors.red('Error Name:'), err.name);
  console.error(colors.red('Error Message:'), err.message);
  
  if (process.env.NODE_ENV === 'development') {
    console.error(colors.red('Stack Trace:'), err.stack);
  }
  
  console.error('\n');
  next(err);
};

module.exports = {
  requestLogger,
  errorLogger
}; 