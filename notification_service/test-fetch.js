const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8082,
  path: '/api/dlq/events',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + process.argv[2]
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
