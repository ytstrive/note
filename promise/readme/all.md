### all

#### 构造函数做了什么

```javascript
var promises = [
  new ES6Promise((resolve, reject) => {
    resolve(1);
  }),
  new ES6Promise((resolve, reject) => {
    resolve(2);
  }),
];
ES6Promise.all(promises).then((value) => {
  console.log(value);
});
//[1,2]
```

我们先从上面的示例猜测一下`all`大概会做哪些操作.

1. `all`方法的参数是一个`promise`数组,最基本的应该对参数判断
2. `promise.all().then()`通过`all`方法可以链式调用`then`方法,说明`all`方法返回的是一个`promise`对象,我们暂且称为父`promise`对象.
3. `then(value)`参数`value`返回的是一组有序的值,说明内部应该会顺序记录每个`promsie`对象的状态和返回值
4. 调用`then`方法的前提条件应该是所有的`promise`对象状态改变之后,触发条件改变父`promsie`对象的状态

带着这些猜测开始我们的源码解析.

```javascript
//源码
function all(entries) {
  return new Enumerator(this, entries).promise;
}
function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate(input);
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    reject(this.promise, validationError());
  }
}
```

首先`all`方法通过`new`创建对象的形式返回一个`promise`对象这也印证了上面我们说的第 2 点,接下来我们直接看`Enumerator`构造函数内是做了哪些操作.
从参数开始吧.

- `Constructor`参数(类型 Function),从参数名知道它接收一个构造函数,这个构造函数是谁呢？我们再看`all`方法传递是`this`,这个`this`又指谁,那我们再看示例是如何调用`all`方法的.`ES6Promise.all(promises)`,现在知道`this`指的是这个`ES6Promise`构造函数了
- `input`参数(类型 Array),一组`promsie`对象

`this._instanceConstructor = Constructor;this.promise = new Constructor(noop);`通过构造函数`new`创建对象,还记得`all`方法内`return new Enumerator(this, entries).promise`
返回的`promise`吗？没错就是这个`this.promise`,这样外部就可以通过这个`promsie`对象链式调用`then`等方法了.

`if (isArray(input))else`还是对参数下手了...印证了上面我们说的第 1 点,首先看`else`内对非数组做了什么处理?调用`reject`函数改变当前`promsie`的状态为`Rejected`到此就结束了.还是看`if`吧
感觉需要罗列一下

- `this.length`记录`promise`数组长度
- **`this._remaining`这个划重点,记录还剩下多少个`promise`对象未发生变化(简单理解有多少个`promise`未执行)默认都没执行所以`this._remaining=input.length`**
- `this._result`记录每个`promsie`对象最终的返回值.

通过这些参数也印证了上面我们说的第 3 点,还是继续看如何处理每个`promise`对象的.

`if (this.length === 0)`数组为空的话调用`fulfill`函数改变当前`promsie`的状态为`Fulfilled`到此就结束了.
`else`我们先看一下`this._remaining === 0`这说明每个`promise`对象的状态都已经改变为`Fulfilled`所以也是调用`fulfill`函数改变当前`promsie`的状态为`Fulfilled`到此就结束了.(像上面的示例便是这种情况,通过`new`创建各个`promise`对象时在构造函数的回调内立刻改变状态`resolve()`).

通过对构造函数的解析是不是得出的结论就是上面的前 3 点内容.

#### 顺序执行

我们还是重点看一下`_enumerate`方法做了什么,毕竟是从这里真正开始的.

```javascript
//源码
Enumerator.prototype._enumerate = function _enumerate(input) {
  for (var i = 0; this._state === PENDING && i < input.length; i++) {
    this._eachEntry(input[i], i);
  }
};
```

`_enumerate`方法循环迭代的每个`promsie`对象,没搞明白`this._state === PENDING`这个判断存在的作用(首先这个`this._state`不是指`this.promsie._state`,也没看到其它地方对这个`this._state`有操作)所以暂且忽略它,看`_eachEntry`方法如何处理每个`promise`对象.

```javascript
//源码
Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
  var c = this._instanceConstructor;
  var resolve$$1 = c.resolve;

  if (resolve$$1 === resolve$1) {
    var _then = void 0;
    var error = void 0;
    var didError = false;
    try {
      _then = entry.then;
    } catch (e) {
      didError = true;
      error = e;
    }

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise$1) {
      var promise = new c(noop);
      if (didError) {
        reject(promise, error);
      } else {
        handleMaybeThenable(promise, entry, _then);
      }
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(
        new c(function (resolve$$1) {
          return resolve$$1(entry);
        }),
        is
      );
    }
  } else {
    this._willSettleAt(resolve$$1(entry), i);
  }
};
```

首先是通过`_instanceConstructor`获取`resolve`静态方法(如果不知道`this._instanceConstructor`是什么请从本节开头再看几次).
`if (resolve$$1 === resolve$1)`这里为什么要先判断参数的`resolve`静态方法与源码的`resolve$1`函数是否相等,还记得`then`一节提到过的`Thenable`吗？如果`new Enumerator(Constructor,input)`创建对象时传递的参数`Constructor`是类似`Promise`函数呢？所以对于这种情况直接进入`else`做处理,那`if`就可以专注处理状态变化的事情.
对于这么多`if...else if...else`判断还是顺序来看一下.

```javascript
// 源码
if (_then === then && entry._state !== PENDING) {
  this._settledAt(entry._state, i, entry._result);
}
```

对于`if`判断还是比较好理解的,判断循环迭代的每个`promise`对象的`then`方法与源码中的`then`函数相等并且迭代的`promise`对象的状态已经发生了变化(不再是初始化的`Pending`状态),想想本节开头的示例是不是就是这种情况.所以直接调用`_settledAt`方法处理状态变化之后的事情,既然已经提到`_settledAt`方法,我们看这方法做了哪些后面不再单独介绍`_settledAt`方法.
**简单一句话`if`处理状态为`Fulfilled`或`Rejected`的操作**

```javascript
// 源码
Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};
```

从参数开始看起

- state 循环迭代的`promise`对象的状态
- i 循环迭代的`promise`对象在数组中的索引位置
- value 循环迭代的`promise`对象传递的值

`if (promise._state === PENDING)`只有在父`promse`的状态为`Pending`的情况才可以执行其它操作,从而再一次证明之前在状态变化一节提到的
**状态只会是从 `Pending->Fulfilled`或`Pending->Rejected`改变一次且不可逆.**

`this._remaining--`对剩余未执行的`promise`对象数量递减-1,接下来的`if (state === REJECTED)`是重点,这里判断是`REJECTED`状态的话要立刻调用`reject(promise, value)`函数为什么要这样操作?

举个例子:
长跑小组赛,A 组[A1(promise1),A2(promise2),A3(promise3)]三个队员在长跑过程中,组员 A2(promise2)由于发生意外(脚崴了)告诉评委(父 promise),评委立刻把 A 组成绩取消了`(reject(promise, value))`,那 A 组无论其他队员 A1(promise1)、A3(promise3)现在是什么状态都不重要了.

所以现在明白为什么要这样操作了吧(当迭代的某个`promise`对象的状态为`REJECTED`时要立刻调用`reject(promise, value)`).

把上面的例子转换为示例代码如下

```javascript
//示例一
var promises = [
  new ES6Promise((resolve, reject) => {
    resolve('组员A1一切正常');
  }),
  new ES6Promise((resolve, reject) => {
    reject(new Error('组员A2脚崴了'));
  }),
  new ES6Promise((resolve, reject) => {
    resolve('组员A3一切正常');
  }),
];
ES6Promise.all(promises).then(
  (data) => {
    console.log(data);
  },
  (error) => {
    console.log(error);
  }
);
// 示例二
var promises = [
  new ES6Promise((resolve, reject) => {
    resolve('组员A1一切正常');
  }),
  new ES6Promise((resolve, reject) => {
    resolve('组员A2一切正常');
  }),
  new ES6Promise((resolve, reject) => {
    reject(new Error('组员A3脚崴了'));
  }),
];
ES6Promise.all(promises).then(
  (data) => {
    console.log(data);
  },
  (error) => {
    console.log(error);
  }
);
// 示例三
var promises = [
  new ES6Promise((resolve, reject) => {
    resolve('组员A1一切正常');
  }),
  new ES6Promise((resolve, reject) => {
    resolve('组员A2一切正常');
  }),
  new ES6Promise((resolve, reject) => {
    resolve('组员A3一切正常');
  }),
];
ES6Promise.all(promises).then(
  (data) => {
    console.log(data);
  },
  (error) => {
    console.log(error);
  }
);
```

上面的示例一、示例二无论`promsie`对象在数组什么位置,只要有一个状态变为`Rejected`(调用`reject`函数),则调用`then(onFulfillment, onRejection)`方法的`onRejection`回调函数,所以只有当数组中所有的`promise`对象状态变为`Fulfilled`才会调用`onFulfillment`回调函数接收到返回值(如示例三).

相对于`if`那`else`就简单多了`this._result[i] = value`在结果集中对应的索引位置存入值.

`this._remaining === 0`判断是否还有未执行`promse`对象,如果全部执行完毕则调用`fulfill(promise, this._result)`函数改变父`promise`的状态.

有没有感觉讲到这里已经验证了上面提到的第 4 点.

讲完了`if`还是继续看`else if (typeof _then !== 'function')`对于有这种`entry.then`有`then`但检测类型不是`function`的情况做处理也比较简单`this._remaining--`对剩余未执行的`promise`对象数量递减-1 并且`this._result[i] = entry`在结果集中对应的索引位置存入值(这个值就是对象本身).

`else if (c === Promise$1)`这个判断的存在又有什么意义呢?
前面的`if (_then === then && entry._state !== PENDING)` `else if (typeof _then !== 'function')`都是针对循环迭代的`promise`对象做操作,(`c`的值是通过`new Enumerator(Constructor,input)`创建对象时外部传入的所以不确定`c`是否与源码内的`Promise$1`是同一个函数)而这里一旦验证`c`与源码内的`Promise$1`为同一个函数,可以直接使用`handleMaybeThenable`函数方便做剩下的操作.

`else`直接调用`resolve$$1`方法创建一个状态为`Fulfilled`的`promise`对象,调用`_willSettleAt`方法存入订阅队列.

最后我们补充一点:
上面看到在多个判断条件内调用了`_willSettleAt`方法,为什么这个方法会引起重视呢,又或者知道循环迭代`promise`对象状态是`Fulfilled`或`Rejected`的话会调用`_settledAt`方法做处理(包含通知父`promsie`是否需要更改状态).(上面对该方法已做过解析),刚才在`else if (c === Promise$1)`也讲过`Pending`状态的处理,但处理之后怎么通知父`promise`呢？所以我们还是带着问题解析`_willSettleAt`方法看是否能得到答案.

```javascript
// 源码
Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
  var enumerator = this;

  subscribe(
    promise,
    undefined,
    function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    },
    function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    }
  );
};
```

还是从参数开始

- promise 这个参数不是指循环迭代的`promise`对象,而是指存入订阅队列专门用来通知父`promise`做操作的`promise`对象,简单理解是专门负责 循环迭代的`promise`对象与父`promsie`对象之前通信的一个桥梁`promsie`
- i 循环迭代的`promise`对象索引值

调用`subscribe`函数把这个桥梁`promsie`存入订阅队列,当循环迭代的`promise`对象状态发生变化时,根据状态`Fulfilled`或`Rejected`调用桥梁`promise`对应的回调函数`function (value){..};`或`function (reason) {...}`把当前迭代的`promise`对象的状态、索引、返回值通过`enumerator._settledAt`方法传递给父`promise`做处理.

以上是对`all`静态方法内部执行过程的解析啰嗦的内容稍为多一点总结一下:

- 验证上面的 4 点内容
- 循环迭代的`promise`对象状态为`Rejected`情况的处理(长跑小组赛示例)
- 循环迭代的`promise`对象状态为`Pending`的情况如何与父`promsie`的通信
