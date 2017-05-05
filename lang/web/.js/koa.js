// yarn add koa koa-router@next koa-logger
// reuqired node >= 7.6.0
const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');

const app = new Koa();
const router = new Router();

app.use(logger());

router.get('/', ctx => {
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
