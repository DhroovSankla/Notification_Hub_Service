const http = require('http');

function postJson(url, data, token) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: body ? JSON.parse(body) : {} });
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

function getJson(url, token) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'GET',
      headers: {}
    };
    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: body ? JSON.parse(body) : {} });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  try {
    console.log("1. Logging in as admin...");
    const loginRes = await postJson('http://localhost:8082/api/auth/login', { username: 'admin' });
    const token = loginRes.body.token;
    console.log("Token obtained:", token);

    console.log("\n2. Getting current fault status...");
    let faultStatus = await getJson('http://localhost:8082/api/simulation/fault-status', token);
    console.log("Fault Status:", faultStatus.body);

    console.log("\n3. Activating fault mode...");
    const toggleRes = await postJson('http://localhost:8082/api/simulation/toggle-fault', { active: true }, token);
    console.log("Toggle Res:", toggleRes.body);

    console.log("\n4. Submitting a new student to App 1...");
    const studentRes = await postJson('http://localhost:8080/api/students', {
      name: 'Automated Test',
      email: 'autotest@gmail.com',
      rollNumber: 'AUTO_' + Date.now(),
      department: 'CS'
    }, token);
    console.log("Student Creation Status:", studentRes.statusCode);

    console.log("\n5. Waiting 3 seconds for Kafka propagation...");
    await new Promise(r => setTimeout(r, 3000));

    console.log("\n6. Fetching DLQ events...");
    const dlqEvents = await getJson('http://localhost:8082/api/dlq/events', token);
    console.log("DLQ Events Status:", dlqEvents.statusCode);
    console.log("DLQ Events Body:", dlqEvents.body);

  } catch (err) {
    console.error("Test failed:", err);
  }
}

run();
