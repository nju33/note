const {execFile, spawn} = require('child_process');
process.stdin.setEncoding('utf-8');

const wc = spawn('wc', []);
wc.stdin.setEncoding('utf-8');
wc.stdout.on('data', data => {
  console.log(data.toString());
});

setTimeout(() => {
  execFile('date', ['+%H:%M:%S'], (err, time) => {
    if (err !== null) {
      throw err;
    }
    process.stdin.write(time + '\n');
    wc.stdin.write(time + '\n');
    wc.stdin.end();
  });
}, 1000);
