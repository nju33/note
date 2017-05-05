const cluster = require('cluster');

if (cluster.isMaster) {
  const cpuLen = require('os').cpus().length;
  Array(cpuLen).fill().forEach(() => {
      cluster.fork();
  });
  cluster.on('exit', (worker, code, signal) => {
    console.log(
      'Worker %d died with code/signal %s. Restarting worker...',
      worker.process.pid,
      signal || code
    );
    cluster.fork();
  });
  return;
}

// yarn add koa koa-router@next koa-logger
// reuqired node >= 7.6.0
const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');

const app = new Koa();
const router = new Router();

app.use(logger());

router.get('/', ctx => {
  console.log(cluster.worker.id);
  const start = ~~(Math.random() * 10) + 20;
  const result = fib(start);
  ctx.body = `${start}: ${result}`;
});
router.get('/:who', c => c.body = `Hello ${ctx.params.who}`);
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async c => c.body = 'Not found');

app.listen(process.env.PORT || 3333);

function fib(n) {
  if(n <= 1) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}
