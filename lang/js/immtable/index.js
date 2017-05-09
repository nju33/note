const {Map, List, Seq, fromJS, Range, is} = require('immutable');

const map1 = Map({ a: 1, b: 2, c: 3 })
const map2 = map1.set('b', 2);
const map3 = map1.set('b', 50);
console.log(map1.get('b')); // 2
console.log(map3.get('b')); // 50
console.log(is(map1, map2)); // true
console.log(map1.equals(map2)); // true
console.log(map1.equals(map3)); // false
console.log(map1.map((k, v) => `${k}:${v}`)); // Map { "a": "1:a", "b": "2:b", "c": "3:c" }
console.log(map1.merge(map3, {d: 4})); // Map { "a": 1, "b": 50, "c": 3, "d": 4 }
console.log(Seq(map1).map(n => n * 2)); // Seq { "a": 2, "b": 4, "c": 6 }
console.log(fromJS({a: 1})); // Map { "a": 1 }
console.log(map1.toJS()); // { a: 1, b: 2, c: 3 }
console.log(map1.toObject()); // { a: 1, b: 2, c: 3 }
console.log(JSON.stringify(map1)); // {"a":1,"b":2,"c":3}

const nestedMap1 = fromJS({a: { b: {c: 6}}});
const nestedMap2 = fromJS({a: {b: {d: 7}}});
(() => {
  const concated = nestedMap1.mergeDeep(nestedMap2);
  console.log(concated.getIn(['a', 'b', 'd'])); // 7
  const updated = concated.updateIn(['a', 'b', 'd'], () => 8);
  console.log(updated); // Map { "a": Map { "b": Map { "c": 6, "d": 8 } } }
})();

const list1 = List([1, 2, 3]);
const list2 = list1.push(4);
const list3 = list2.unshift(0);
const list4 = list1.concat(list3);
console.log(list1); // List [ 1, 2, 3 ]
console.log(list2); // List [ 1, 2, 3, 4 ]
console.log(list3); // List [ 0, 1, 2, 3, 4 ]
console.log(list4); // List [ 1, 2, 3, 0, 1, 2, 3, 4 ]
console.log(list3.get(0)); // 0
console.log(fromJS([1])); // List [ 1 ]
console.log(list1.toJS()); // [ 1, 2, 3 ]
console.log(list1.toArray()); // [ 1, 2, 3 ]
console.log(JSON.stringify(list1)); // [1,2,3]
const list5 = list4.withMutations(list => {
  list.push('a').push('b').push('c');
});
console.log(list5); // List [ 1, 2, 3, 0, 1, 2, 3, 4, "a", "b", "c" ]

// 以下はまだ処理されてない
const seq1 = Seq([ 1, 2, 3, 4, 5, 6, 7, 8 ])
  .filter(x => x % 2)
  .map(x => x * x)
const seq2 = Map({ a: 1, b: 2, c: 3 }).toSeq();
console.log(seq1); // Seq [ 1, 9, 25, 49 ]
console.log(seq1.get(0)); // 1
console.log(seq2); // Seq { "a": 1, "b": 2, "c": 3 }
console.log(seq2.flip()); // Seq { 1: "a", 2: "b", 3: "c" }

const range = Range(1, Infinity)
  .skip(1000)
  .map(n => -n)
  .filter(n => n % 2 === 0)
  .take(2)
  .reduce((r, n) => r * n, 1);
console.log(range); // 1006008
