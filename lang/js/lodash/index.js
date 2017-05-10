const _ = require('lodash');

let result;

// objectでisNullなプロパティを削除
result = _.omitBy({
  a: null,
  b: 1,
  c: null
}, _.isNull);
console.log(result); // { b: 1 }

// nullな値を削除
result = _.compact([1, null, 2]);
console.log(result); // [ 1, 2 ]
