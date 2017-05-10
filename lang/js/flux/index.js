import React, {Component} from 'react';
import {render} from 'react-dom';
import {Dispatcher} from 'flux';
import {Container, ReduceStore} from 'flux/utils';

// https://mae.chab.in/archives/2843
// # ReduceStore (suited for store)
// ++ http://qiita.com/sl2/items/ff7a07c00f545d245a5c#store-reducestore
// ++ https://github.com/facebook/flux/blob/master/src/stores/FluxReduceStore.js#L87
// )) やっぱ内側でコピーするようなことはしてない？
// stateを作成/保持し、actionをreduceしてstateを更新するクラス（Storeクラスを継承している）
// # Container (suited for view)
// View（React）のルートComponentをセットし、Viewをコントロールするクラス。
// 関連のあるStoreに変更があった際にそのstateを更新し、
// Viewに変更を通知する（ReactのsetState()メソッドのような振る舞い）。
// ++ http://qiita.com/sl2/items/ff7a07c00f545d245a5c#view-container
// ++ getStores(): 利用したいReduceStoreを指定します。
// ++ calculateState(): Container内で扱うstateオブジェクトを定義します。

const FOO_ACTION = 'FOO_ACTION';
const dispatcher = new Dispatcher();

class FooStore extends ReduceStore {
  getInitialState() {
    return {
      count: 0
    }
  }

  reduce(state, action) {
    if (action.type === FOO_ACTION) {
      return Object.assign({}, {count: state.count + 1});
    }
  }
}
const fooStore = new FooStore(dispatcher);

class FooContainer extends Component {
  static getStores() {
    return [fooStore];
  }

  static calculateState(prevState) {
    return {
      foo: fooStore.getState(),
    };
  }

  onClick() {
    return () => {
      dispatcher.dispatch({
        type: FOO_ACTION
      });
    };
  }

  render() {
    return (
      <div>
        <span>{this.state.foo.count}</span>
        <div onClick={this.onClick()}>click</div>
      </div>
    );
  }
}

const Foo = Container.create(FooContainer);
const root = document.createElement('div');
document.body.appendChild(root);
render(<Foo/>, root);
