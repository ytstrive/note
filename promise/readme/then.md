### 返回新的 Promise 对象

```javascript
function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}
```

根据规范,`then` 方法必须返回一个新的`promise`对象,所以源码`then`方法第一步便是通过`new this.constructor(noop)`构造函数创建一个新的对象.

#### 异步回调

我们再回头查看`then`方法的源码该方法接收两个参数`onFulfillment` `onRejection`结合上一节讲的`promise`有两种状态变化`Pending->Fulfilled`或`Pending->Rejected`,所以这两个参数(函数)用来处理**状态变化之后**的事情.

- `onFulfillment`函数处理`Fulfilled`状态之后的事情.
- `onRejection`函数处理`Rejected`状态之后的事情.

了解了两个参数之后,我们看传入的两个参数(回调函数什么时候触发).源码里首先对状态进行了判断`if(_state)...else`,为什么会对状态进行判断,难道不是直接调用`onFulfillment`或`onRejection`函数就可以了.

上面对两个`onFulfillment` `onRejection`函数进行了描述(状态发生变化之后调用对应的函数),如果状态是`Pending`进入`then`方法该如何处理这种情况的存在(这就是为什么存在`if...else`).

```javascript
function onFulfillment(val) {
  console.log(val);
}
function onRejection(error) {
  console.log(error);
}
var p = new Promise((resolve, reject) => {
  //构造函数创建对象,此时的状态是Pending

  //此处用setTimeout模拟调用后端接口5秒之后返回结果(5秒之后改变状态)
  setTimeout(() => {
    resolve({ name: 'zhangsan' }); //得到数据,改变状态Pending->Fulfilled
    //or
    // reject(new Error('接口无响应')); //请求失败,改变状态Pending->Rejected
  }, 5000);
}).then(onFulfillment, onRejection);
```

以上代码示例模拟`Pending`状态进入`then`方法,代码自上而下执行创建对象,发起调用后端接口请求等待响应的同时,代码继续执行调用`then`方法时,所以进入`then`方法内会对状态做判断,我们接着看`else`内如何处理`Pending`状态.

```javascript
//源码
else {
  subscribe(parent, child, onFulfillment, onRejection);
}
function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}
```

在构造函数一节提到过的`发布/订阅`这里终于出现了,`else`内对尚处于`Pending`状态的情况直接存入订阅队列(等待状态改变触发).

**对于构造函数一节开头提到的 `then` 的回调函数却是异步执行,这里应该可以得到答案了.**

既然`else`里对`Pending`状态做了存入订阅队列的操作,那`if`里面应该是对`Fulfilled` `Rejected`状态做的处理吧.
什么情况会进入到`if`里?(创建对象之后,立刻改变状态)

```javascript
function onFulfillment(val) {
  console.log(val);
}
function onRejection(error) {
  console.log(error);
}
var p = new Promise((resolve, reject) => {
  //构造函数创建对象,此时的状态是Pending
  //立刻改变状态
  resolve(1); //改变状态Pending->Fulfilled
  //or
  // reject(new Error('error')); //改变状态Pending->Rejected
}).then(onFulfillment, onRejection);
```

上面示例代码模拟创建对象之后,立刻调用`resolve` 或`reject`函数改变初始化状态.我们还是看源码`if`内如何处理吧.

```javascript
// 源码
if (_state) {
  var callback = arguments[_state - 1];
  asap(function () {
    return invokeCallback(_state, child, callback, parent._result);
  });
}
```

由于`if`内只确定状态发生了变化,至于是从`Pending->Fulfilled` 还是 `Pending->Rejected`则是通过`_state`状态码确认,所以这里使用`arguments`获取状态对应的回调函数.

```javascript
/**
 *
 * @param {Function} resolver 创建对象时接收一个参数,类型Function
 */
function Promise(resolver) {
  this._result = this._state = undefined;
  this._subscribers = [];

  initializePromise(this, resolver);
}
Promise.prototype.then = function (onFulfillment, onRejection) {
  //判断状态
  var _state = this._state;
  if (_state) {
    //通过状态码,获取对应的回调函数
    var callback = arguments[_state - 1];
    console.log('当前状态:', this._state, '对应的回调函数:', callback);
  } else {
    console.log('当前状态:', this._state, '存入队列');
  }
};
/**
 *
 * @param {Promise} promise
 * @param {Function} resolver
 */
function initializePromise(promise, resolver) {
  resolver(
    (value) => {
      resolvePromise(promise, value);
    },
    (value) => {
      rejectPromise(promise, value);
    }
  );
}
function resolvePromise(promise, value) {
  promise._state = 1;
  console.log('resolvePromise', value, '改变状态:', promise._state);
}
function rejectPromise(promise, value) {
  promise._state = 2;
  console.log('rejectPromise', value, '改变状态:', promise._state);
}
function onFulfillment(value) {
  console.log('Fulfilled', value);
}
function onRejection(error) {
  console.log('Fulfilled', error);
}
(function test() {
  new Promise((resolve, reject) => {
    console.log('创建对象');
    //立刻改变状态
    resolve();
  }).then(onFulfillment, onRejection);
})();
```

以上示例模拟了`arguments`的使用.(或自行检索使用方法)

到目前为止,`then`创建了`promise`新对象,通过`arguments`获取到当前状态对应的回调函数,接下来是否会立即触发回调函数我们继续看源码.

```javascript
//源码
if (_state) {
  var callback = arguments[_state - 1];
  asap(function () {
    return invokeCallback(_state, child, callback, parent._result);
  });
}
var len = 0;
var queue = new Array(1000);
var customSchedulerFn = void 0;
var scheduleFlush = void 0;
function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
}
function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}
```

**asap ＝ as soon as possible 越快越好**

**invokeCallback= 调用回调**

看到这些函数名距离....调用...回调函数..不远了所以细品,细细品接下来的处理流程.

**首先看`asap`函数做了什么.**

- 函数接收两个参数
  - callback 回调函数
  - arg 参数
- 参数存入队列
- 判断 len 长度
  - 这里判断`len===2`的原因在于初始化`queue`数组长度为 1000 但值为`undefined`,将参数存入数组并判断长度只为**确定数组内有值(可立即执行的函数)**.
- customSchedulerFn
  - 对开发者提供了`setScheduler`方法对`customSchedulerFn`赋值实现定制化调用队列,(假如在此次准备开始调用队列之前还有其它事情要处理完成之后才可以调用,则可以实现 `customSchedulerFn` 函数)这里不做过多说明.
- scheduleFlush
  - 这个函数针对不同的执行环境(Node、浏览器)等做了处理,由于我们在浏览器端执行,所以直接看`useMutationObserver`函数.

```javascript
//源码
function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}
```

`BrowserMutationObserver`使用参考 <https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver>

**`useMutationObserver`函数做了什么.**

- 初始化对象的`new BrowserMutationObserver(flush)`的`flush`参数和`asap`函数内调用`customSchedulerFn(flush)`函数传入的`flush`是一样的.(无论是开发者实现`customSchedulerFn`函数还是按计划调用的`scheduleFlush`函数最后一步都是调用`flush`函数).

**最后调用的`flush`函数又做了什么.**

```javascript
//源码
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}
```

- flush 函数内执行`queue`队列上的各个回调函数
- 清空队列,重置 len=0

#### invokeCallback 函数

```javascript
//源码
function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
    value = void 0,
    error = void 0,
    succeeded = true;

  if (hasCallback) {
    try {
      value = callback(detail);
    } catch (e) {
      succeeded = false;
      error = e;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (succeeded === false) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}
```

之所以把`invokeCallback`函数放到最后讲解,主要是根据代码执行顺序而已(如果不了解`invokeCallback`函数是怎么被调用的,请再看一下本节关于`异步回调`部分的讲解).

**`invokeCallback` 函数做了什么**

- 参数部分

  - `settled` 当前状态
  - `promise` promise 对象(指`then`方法内创建的 promise 子对象)
  - `callback` 回调函数(指`then`方法的参数`onFulfillment`或`onRejection`函数)
  - `detail` 传递的 value 值

- `callback`类型判断

  - Function 类型则执行函数获取返回值`value = callback(detail)`
  - 非 Functoin 类型则直接做赋值操作 `else{value = detail}`

- 对新(子)`promise`对象的操作
  - 根据不同的判断条件调用对应的方法(`resolve` `reject` `fulfill`)修改新(子)`promise`对象的状态

以上就是对`then`方法内的操作理解(如果有不明白的先多看几次整个过程).

#### 补充

这里有必要再次说一下`then`方法内的执行步骤

- 创建新(子)`promsie`对象
- 判断状态
  - `Pending`状态通过调用`subscribe`函数把回调函数存入`_subscribers`订阅队列,等待状态发生改变触发发布`publish`函数
  - `Fulfilled`或`Rejected`状态通过调用`asap`函数把回调函数存入`queue`队列等待立刻执行(循环队列内的回调函数)
- 返回新(子)`promsie`对象

可以理解`promise`有两个队列

1. 立刻执行队列-状态是`Fulfilled`或`Rejected`的回调函数存入此队列
2. 订阅队列-状态是`Pending`的回调函数存入此队列

#### 示例解析

**以下示例`Promise`构造函数来源于 es6-promise.js 请与浏览器内置`Promise`区分.**

> 示例一 演示立刻执行队列的过程(初始化对象,立刻改变状态)

```javascript
new ES6Promise((resolve, reject) => {
  console.log('init.');
  resolve(0); //状态Pending->Fulfilled
}).then(
  (value) => {
    //由于构造函数内状态立刻发生了变化,此回调函数存入立刻执行队列
    console.log('接收到的值为:', value);
    return value + 1;
  },
  (error) => {
    return new Error('msg');
  }
);
// init.
// 接收到的值为:0
```

执行过程解析:

- 1.创建对象,输出`init.`
- 2.立刻调用`resolve`方法
  - 2.1`resolve`源码内改变状态
- 3.调用`then`方法
  - 3.1`then`源码内创建新(子)`promise`对象
  - 3.2 判断当前状态为`Fulfilled`,立刻调用`asap`方法将回调方法存入队列,等待立刻执行.
- 4.`then`方法返回新(子)`promise`对象

> 示例二 演示订阅队列的过程(初始化对象,8 秒后改变状态)

```javascript
new ES6Promise((resolve, reject) => {
  console.log('init.');
  setTimeout(() => {
    resolve(0); //状态Pending->Fulfilled
  }, 8000);
}).then(
  (value) => {
    //由于构造函数内状态为Pending,此回调函数存入订阅队列
    console.log('接收到的值为:', value);
    return value + 1;
  },
  (error) => {
    return new Error('msg');
  }
);
// init.
// 接收到的值为:0
```

执行过程解析:

- 1.创建对象,输出`init.`
- 2.调用`then`方法
  - 2.1`then`源码内创建新(子)`promise`对象
  - 2.2 判断当前状态为`Pending`,调用`subscribe`函数把回调函数存入订阅队列,等待状态发生变化触发发布`publish`函数
- 3.`setTimeout`触发`resolve`函数
  - 3.1`resolve`源码内改变状态,触发发布`publish`函数
- 4.`then`方法返回新(子)`promise`对象

> 示例三 演示订阅队列的过程(订阅队列存在多个回调函数的情况)

```javascript
new ES6Promise((resolve, reject) => {
  console.log('init.');
  setTimeout(() => {
    resolve(0); //状态Pending->Fulfilled
  }, 8000);
})
  .then(
    (value) => {
      //由于构造函数内状态为Pending,此回调函数存入订阅队列
      console.log('接收到的值为:', value);
      return value + 1;
    },
    (error) => {
      return new Error('msg');
    }
  )
  .then(
    (value) => {
      //由于上一个then返回的新(子)promise对象的状态是Pending,所以此回调函数存入订阅队列
      console.log('接收到的值为:', value);
      return value + 1;
    },
    (error) => {
      return new Error('msg');
    }
  );
// init.
// 接收到的值为:0
// 接收到的值为:1
```

执行过程解析:

- 同示例二,唯一不同的是订阅队列存在多个回调函数

图示:

<!-- | 1.立刻执行队列 | 2.订阅队列  |
| -------------- | ----------- |
|                | 第一个 then |
|                | 第二个 then | -->
![then-1](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a12e84650c2547a9834803518441446f~tplv-k3u1fbpfcp-watermark.image)

**这种链式调用,可以理解为当前`.then()`方法是由上一个`.then()`方法返回的新(子)`promise`对象调的)**

> 示例四 演示立刻执行队列、订阅队列的过程

```javascript
new ES6Promise((resolve, reject) => {
  console.log('init.');
  resolve(0); //状态Pending->Fulfilled
})
  .then(
    (value) => {
      //由于构造函数内状态为Fulfilled,此回调函数存入立刻执行队列
      console.log('接收到的值为:', value);
      return value + 1;
    },
    (error) => {
      return new Error('msg');
    }
  )
  .then(
    (value) => {
      //由于上一个then返回的新(子)promise对象的状态是Pending,所以此回调函数存入订阅队列
      console.log('接收到的值为:', value);
      return value + 1;
    },
    (error) => {
      return new Error('msg');
    }
  );
// init.
// 接收到的值为:0
// 接收到的值为:1
```

执行过程解析:

- 1.创建对象,输出`init.`
- 2.立刻调用`resolve`方法
  - 2.1`resolve`源码内改变状态
- 3.调用第一个`then`方法
  - 3.1`then`源码内创建新(子)`promise`对象
  - 3.2 判断当前状态为`Fulfilled`,立刻调用`asap`方法将回调方法存入队列,等待立刻执行.
  - 3.3 `then`方法返回新(子)`promise`对象
- 4.调用第二个`then`方法(被 3.3 返回的新(子)`promise`对象调用)
  - 4.1`then`源码内创建新(子)`promise`对象
  - 4.2 判断(3.3 返回的新(子)`promise`对象)当前状态为`Pending`,调用`subscribe`函数把回调函数存入订阅队列,等待状态发生变化触发发布`publish`函数
  - 4.3 返回新(子)`promise`对象

图示:

<!-- | 1.立刻执行队列 | 2.订阅队列  |
| -------------- | ----------- |
| 第一个 then    | 第二个 then | -->

![then-2](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82d3c33fa7fe4efa929d1e9338393fa7~tplv-k3u1fbpfcp-watermark.image)

> 示例五 演示多个立刻执行队列、订阅队列的过程

```javascript
new ES6Promise((resolve, reject) => {
  console.log('init.1');
  resolve(); //状态Pending->Fulfilled
})
  .then(() => {
    //由于构造函数内状态为Fulfilled,此回调函数存入立刻执行队列
    console.log('then1.1');
    new ES6Promise((resolve, reject) => {
      console.log('init.2');
      setTimeout(() => {
        resolve(); //状态Pending->Fulfilled
      }, 8000);
    })
      .then(() => {
        //由于构造函数内状态为Pending,此回调函数存入订阅队列
        console.log('then2.1');
      })
      .then(() => {
        //由于上一个then返回的新(子)promise对象的状态是Pending,所以此回调函数存入订阅队列
        console.log('then2.2');
      });
  })
  .then(() => {
    //由于上一个then返回的新(子)promise对象的状态是Pending,所以此回调函数存入订阅队列
    console.log('then1.2');
  });

new ES6Promise((resolve, reject) => {
  console.log('init.3');
  resolve(); //状态Pending->Fulfilled
})
  .then(() => {
    //由于构造函数内状态为Fulfilled,此回调函数存入立刻执行队列
    console.log('then3.1');
  })
  .then(() => {
    //由于上一个then返回的新(子)promise对象的状态是Pending,所以此回调函数存入订阅队列
    console.log('then3.2');
  });
//init.1
//init.3
//then1.1
//init.2
//then3.1
//then1.2
//then3.2
//then2.1
//then2.2
```

执行过程解析:

- 1.创建对象,输出`init.1`
- 2.立刻调用`resolve`方法
  - 2.1`resolve`源码内改变状态
- 3.调用`then1.1`
  - 3.1`then`源码内创建新(子)`promise`对象
  - 3.2 判断当前状态为`Fulfilled`,立刻调用`asap`方法将回调方法存入队列,等待立刻执行.
  - 3.3 `then`方法返回新(子)`promise`对象
- 4.调用`then1.2`
  - 4.1`then`源码内创建新(子)`promise`对象
  - 4.2 判断当前状态为`Pending`,调用`subscribe`函数把回调函数存入订阅队列,等待状态发生变化触发发布`publish`函数
  - 4.3 返回新(子)`promise`对象
- 5.创建对象,输出`init.3`
- 6.立刻调用`resolve`方法
  - 6.1`resolve`源码内改变状态
- 7.调用`then3.1`
  - 7.1`then`源码内创建新(子)`promise`对象
  - 7.2 判断当前状态为`Fulfilled`,立刻调用`asap`方法将回调方法存入队列,等待立刻执行.
  - 7.3 `then`方法返回新(子)`promise`对象
- 8.调用`then3.2`

  - 8.1`then`源码内创建新(子)`promise`对象
  - 8.2 判断当前状态为`Pending`,调用`subscribe`函数把回调函数存入订阅队列,等待状态发生变

至此代码自上而下执行同步函数、异步(回调)函数放入队列的过程已经梳理完,剩下便是执行回调函数时看是否有新的对象加入队列.

- 9.`then1.1`回调函数执行
  - 9.1 创建对象,输出`init.2`
- 10.调用`then2.1`
  - 10.1`then`源码内创建新(子)`promise`对象
  - 10.2 判断当前状态为`Pending`,调用`subscribe`函数把回调函数存入订阅队列,等待状态发生变化触发发布`publish`函数
  - 10.3 返回新(子)`promise`对象
- 11.调用`then.2.2`
  - 11.1`then`源码内创建新(子)`promise`对象
  - 11.2 判断当前状态为`Pending`,调用`subscribe`函数把回调函数存入订阅队列,等待状态发生变化触发发布`publish`函数
  - 11.3 返回新(子)`promise`对象

上面的执行过程解析确实比较复杂,所以我们直接看哪些存入立刻执行队列,哪些存入订阅队列就可以了.

图示:

<!-- | 0.同步方法 | 1.立刻执行队列                     | 2.订阅队列 |
| ---------- | ---------------------------------- | ---------- |
| init.1     | then1.1(执行回调函数时输出 init.2) | then1.2    |
| init.3     | then3.1                            | then3.2    |
|            |                                    | then2.1    |
|            |                                    | then2.2    | -->

![then-3](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c380107777b449380113e2cb9b06c2c~tplv-k3u1fbpfcp-watermark.image)

按照图示最终输出结果:
**`init.1->init.3->then1.1->init.2->then3.1->then1.2->then3.2->then2.1->then2.2`**

> 示例六 演示返回值是`promise`对象(看是否会改变执行顺序)

```javascript
// new ES6Promise((resolve, reject) => {
//   console.log('init.1');
//   resolve(); //状态Pending->Fulfilled
// })
//   .then(() => {
//     //由于构造函数内状态为Fulfilled,此回调函数存入立刻执行队列
//     console.log('then1.1');
//     new ES6Promise((resolve, reject) => {
//       console.log('init.2');
//       setTimeout(() => {
//         resolve(); //状态Pending->Fulfilled
//       }, 8000);
//     })
//       .then(() => {
//         //由于构造函数内状态为Pending,此回调函数存入订阅队列
//         console.log('then2.1');
//       })
//       .then(() => {
//         //由于上一个then返回的新(子)promise对象的状态是Pending,所以此回调函数存入订阅队列
//         console.log('then2.2');
//       });
//   })
//   .then(() => {
//     //由于上一个then返回的新(子)promise对象的状态是Pending,所以此回调函数存入订阅队列
//     console.log('then1.2');
//   });
//  //init.1
//  //then1.1
//  //init.2
//  //then1.2
//  //then2.1
//  //then2.2

new ES6Promise((resolve, reject) => {
  console.log('init.1');
  resolve(); //状态Pending->Fulfilled
})
  .then(() => {
    //由于构造函数内状态为Fulfilled,此回调函数存入立刻执行队列
    console.log('then1.1');
    return new ES6Promise((resolve, reject) => {
      console.log('init.2');
      setTimeout(() => {
        resolve(); //状态Pending->Fulfilled
      }, 8000);
    })
      .then(() => {
        //由于构造函数内状态为Pending,此回调函数存入订阅队列
        console.log('then2.1');
      })
      .then(() => {
        //由于上一个then返回的新(子)promise对象的状态是Pending,所以此回调函数存入订阅队列
        console.log('then2.2');
      });
  })
  .then(() => {
    //由于上一个then返回的新(子)promise对象的状态是Pending,所以此回调函数存入订阅队列
    console.log('then1.2');
  });
//init.1
//then1.1
//init.2
//then2.1
//then2.2
//then1.2
```

示例六注释代码为没有`return`返回`promise`对象的情况可以看一下输出结果.(此处不做解析)

执行过程解析:

- 想必大家已经知道如何分析了(这里忽略过程解析),我们直接看图示

图示:

<!-- | 0.同步方法 | 1.立刻执行队列                     | 2.订阅队列  |
| ---------- | ---------------------------------- | ----------- |
| init.1     | then1.1(执行回调函数时输出 init.2) | ~~then1.2~~ |
|            |                                    | then2.1     |
|            |                                    | then2.2     | -->

![then-4](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9c33d12d1d747babceb79e2a95df5ce~tplv-k3u1fbpfcp-watermark.image)

按照之前的示例过程解析上面的图示应该是没错的输入结果应该是`init.1->then1.1->init.2->then1.2->then2.1->then2.2`
但是我们测试之后发现正确的结果却是这样的:`init.1->then1.1->init.2->then2.1->then2.2->then1.2`是什么原因导致出现这种问题?
既然多了一个`return`返回`promise`对象,那我们就从返回值开始
在`then`方法的回调函数里可以返回任何值(基本数据类型、引用(复合)数据类型),那源码内部是如何区别处理呢?
还是对源码进行一步一步分析吧,没有其它捷径...

```javascript
//源码
function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    var then$$1 = void 0;
    try {
      then$$1 = value.then;
    } catch (error) {
      reject(promise, error);
      return;
    }
    handleMaybeThenable(promise, value, then$$1);
  } else {
    fulfill(promise, value);
  }
}
function selfFulfillment() {
  return new TypeError('You cannot resolve a promise with itself');
}
```

**`resolve`函数对`value`返回值做了什么.**

- `if(promise === value)`如果返回值和当前`promise`对象一样则调用`selfFulfillment`函数抛错(不可以返回对象本身)
- `else if(objectOrFunction(value))`如果返回值是`object`或`function`类型则需要做如下处理
  - `then$$1 = value.then;`由于上面已经判断`value`是对象或函数,所以此处默认它具有`then`属性或方法
  - 调用`handleMaybeThenable`函数做进一步处理
- `else`返回值是基本数据类型则直接调用`fulfill`函数改变状态

```javascript
//源码
function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (
    maybeThenable.constructor === promise.constructor &&
    then$$1 === then &&
    maybeThenable.constructor.resolve === resolve$1
  ) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}
```

**`handleMaybeThenable`函数又做了什么.**

关于`Thenable`可以理解为类似`promise`一样含有`then`方法的对象

- `if`多个判断验证参数`maybeThenable`是否为`promise`对象

  - 调用`handleOwnThenable`函数,按照

- `else`非`promise`对象

  - `if (then$$1 === undefined)`没有`then`属性或方法,直接调用`fulfill`函数改变状态

  - `else if (isFunction(then$$1))`确定是`function`类型(如`function Person(){},Person.then=function(){};`参数`maybeThenable=Person` `then$$1=Person.then`)
    - 调用`handleForeignThenable`函数处理带有自定义`then`方法的情况
  - `else`,含有`then`属性的引用(复合)数据类型(如`{name:"zhagnsan",then:'-'}`),直接调用`fulfill`函数改变状态

```javascript
function Pro() {}
Pro.then = function (resolve, reject) {
  //...
};
new ES6Promise((resolve, reject) => {
  console.log('init.1');
  resolve(0);
})
  .then((v) => {
    console.log('then1.1');
    return new Pro();
  })
  .then((v) => {
    console.log('then1.2', v);
  });
```

以上示例会把返回值当作没有`then`方法做处理.

因为`Pro`虽然有静态方法`then`但返回值是通过`new`创建的一个`Pro`对象,而对象上并没有`then`方法,所以源码`resolve`函数内`then$$1 = value.then`为`undefined`.

```javascript
//源码
function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(
      thenable,
      undefined,
      function (value) {
        return resolve(promise, value);
      },
      function (reason) {
        return reject(promise, reason);
      }
    );
  }
}
```

**`handleOwnThenable`函数如何处理返回值为`promise`对象**
首先`handleOwnThenable`函数按照返回值`promise`对象的状态进行处理

- 参数`thenable`接收的是返回值`promise`对象
- `if`、`else`处理状态为`Fulfilled` `Rejected`的情况,说明返回值`promise`对象的一系列链式`then`方法调用已完成,所以调用`fulfill` `reject`函数,继续执行之前的`promise`对象的队列并且
  把`then`的返回值`thenable._result`传递给之前`promise`对象
- `else`处理状态为`Pending`的情况,如果返回值`promise`对象的状态未发生改变,则先存到订阅队列(注意这里的两个匿名函数是为改变之前的`promise`对象的状态准备的).然后等待返回值`promise`对象的状态改变调用一系列`then`方法

所以示例六的正确图示如下:

<!-- | 0.同步方法 | 1.立刻执行队列                     | 2.订阅队列 |
| ---------- | ---------------------------------- | ---------- |
| init.1     | then1.1(执行回调函数时输出 init.2) | then2.1    |
|            |                                    | then2.2    |
|            |                                    | then1.2    | -->

![then-5](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/807ad418fe124d958ace1c2a709ac076~tplv-k3u1fbpfcp-watermark.image)

重要的事情说三遍

**只要返回值是`promise`对象,则调用`handleOwnThenable`函数,之前的队列会在返回值`promise`对象的`then`方法之后执行**

**只要返回值是`promise`对象,则调用`handleOwnThenable`函数,之前的队列会在返回值`promise`对象的`then`方法之后执行**

**只要返回值是`promise`对象,则调用`handleOwnThenable`函数,之前的队列会在返回值`promise`对象的`then`方法之后执行**

```javascript
//源码
function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(
      then$$1,
      thenable,
      function (value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      },
      function (reason) {
        if (sealed) {
          return;
        }
        sealed = true;

        reject(promise, reason);
      },
      'Settle: ' + (promise._label || ' unknown promise')
    );

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}
function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}
```

**`handleForeignThenable`函数如何处理自定义`then`方法**

- 首先看到`asap`函数应该立刻明白源码把这种`thenable`的情况作为像`promise`的`then`方法一样进行处理了.

重要的事情说三遍

**对于这种`thenable`源码会作为像`then`一样处理**

**对于这种`thenable`源码会作为像`then`一样处理**

**对于这种`thenable`源码会作为像`then`一样处理**

#### 问答

> 为什么 then 要返回新的 `promsie`对象?

首先我们看以下两个示例代码

```javascript
//示例一
var p1 = new ES6Promise((resolve, reject) => {
  console.log('init.1');
  resolve(0); //状态Pending->Fulfilled
});
p1.then((v) => {
  console.log('then1.1', v);
  return v + 1;
});

p1.then((v) => {
  console.log('then1.2', v);
  return v + 1;
});
p1.then((v) => {
  console.log('then1.3', v);
  return v + 1;
});
//init.1
//init.1 0
//init.1 0
//init.3 0
```

```javascript
//示例二

var p1 = new ES6Promise((resolve, reject) => {
  console.log('init.1');
  resolve(0); //状态Pending->Fulfilled
});
var p2 = p1.then((v) => {
  console.log('then1.1', v);
  return v + 1;
});
console.log(p2);
var p3 = p2.then((v) => {
  console.log('then1.2', v);
  return v + 1;
});

var p4 = p3.then((v) => {
  console.log('then1.3', v);
  return v + 1;
});

//init.1
//init.1 0
//init.1 1
//init.3 2
```

我们知道之所以可以链式调用是因为方法内返回的是一个对象,使用对象调用方法形成链式调用.
如上面示例一通过对象调用`then`方法这种写法是没问题的,但你会发现输出结果和预期的不符合,问题出在哪里？
`promise`是基于状态变化进行操作的,所以当示例一中`resolve(0);`状态发生变化之后,所有`p1.then`方法几乎同时调用(因为都是使用的同一个`p1`对象).

我们再看示例二每次调用`then`则是通过返回的新对象,并且传递的值都是上一个`then`的返回值.

根据以上两个示例我们似乎知道了为什么要返回新的 `promsie`对象

**`promsie`是基于状态变化操作的,每次返回新对象都是初始化状态,把控制权交给开发者(按需异步改变状态触发操作)确保了执行顺序.**

> 如果一直是 pending 状态, `then`里的`onFulfillment` `onRejection`函数是否会调用

如果状态初始化之后未发生变化,那么无论有多少个链式`then`方法都不会被触发调用.

> 怎么知道源码`then`方法内`if(_state)`是对`Fulfilled` `Rejected`状态做处理,`else`是对`Pending`状态做处理

1. 创建对象(初始化)时的等待状态`Pending`.(es6-promise 源码内 undefined 表示`Pending`)
2. 成功(解决)时的状态`Fulfilled`.(es6-promise 源码内 1 表示`Fulfilled`)
3. 失败(拒绝)时的状态`Rejected`.(es6-promise 源码内 2 表示`Rejected`)

其实在状态变化一节中已经提到过,源码内使用` 1``2 `作为`Fulfilled` `Rejected`的状态码 所以只有当状态是`1` `2`的时候才会进入`if`语句.

> 为什么遇到返回值是`promise`的时候要先执行?

```javascript
new ES6Promise((resolve, reject) => {
  console.log('init.1');
  resolve();
})
  .then(() => {
    console.log('then1.1');
    return new ES6Promise((resolve, reject) => {
      console.log('init.2');
      resolve(0);
    })
      .then((v) => {
        console.log('then2.1', v);
        return v + 1;
      })
      .then((v) => {
        console.log('then2.2', v);
        return v + 1;
      });
  })
  .then((v) => {
    console.log('then1.2', v);
  });
//init.1
//then1.1
//init.2
//then2.1 0
//then2.2 1
//then1.2 2
```

这个问题上面示例六已经已经从源码分析的角度知道了答案,这次我们结合上面的示例(和示例六类似)从结果倒推,因为我们知道`then`方法是异步执行的(什么时候执行取决于状态的变化)所以遇到返回值是`promise`对象的情况(如上面示例`then1.1`函数返回值是`promise`对象),返回对象的链式调用`then`方法还没执行完毕,就开始调用`then1.2`的函数那方法怎么能接收到返回值呢(如上面示例 `then2.2`函数如果在`then1.2`回调函数之后执行,那么`then1.2`永远接收不到`then2.2`函数的返回值).

**所以简单的理解先执行返回对象的链式`then`方法,就是为了确保其它`then`可以获取到正确的返回值**

关于`then`一节啰嗦的比较多所以还需要品.细品.细细品.
