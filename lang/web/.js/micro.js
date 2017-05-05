// 今のとこ相性良くない
// https://github.com/zeit/micro/issues/235
//
// const cluster = require('cluster');
//

// yarn add micro microrouter
// required node >= 7.6.0
const {send} = require('micro');
const {router, get} = require('microrouter');

const hello = (req, res) =>
  send(res, 200, `Hello ${req.params.who}`)

const notfound = (req, res) =>
  send(res, 404, 'Not found route')

module.exports = router(
  get('/:who', hello),
  get('/*', notfound)
);
