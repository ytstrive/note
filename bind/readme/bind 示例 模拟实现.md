由于markdown排版问题建议从掘金阅读:<https://juejin.im/post/5ee03d2d6fb9a047fc30b487>

### 目录

- bind
  - 定义
  - 示例
  - 补充
  - 模拟实现
  - 测试模拟实现方法
- 问答
- 最后

建议先看一下之前写的关于`call` `apply`的部分对下面理解 `bind` 是有帮助的.(掘金对 markdown 排版支持的比较好)

掘金:<https://juejin.im/post/5eddb2c86fb9a047b11b5c67>

知乎:<https://zhuanlan.zhihu.com/p/146691872>

开始之前叨叨两点:

1. 遇到定义、语法等问题学会看 MDN:<https://developer.mozilla.org/zh-CN/docs/Web>
2. 以下大部分内容都是基于 MDN 内对 bind 方法的介绍进行了解的,所以已经背诵全文的就不要浪费时间了.

### bind

#### 定义

**bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。**

定义、语法、更多示例参考 MDN:<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind>

在定义中提到了以下三点:

1. 创建新函数
2. 第一个参数为新函数`this`上下文
3. 其它参数为新函数的参数

定义往往都是短而精的一句话,需要我们通过语法、示例来转化理解,所以开启下面的啰哩啰嗦.

#### 示例

```javascript
function test() {
  console.log('hello');
}
var fn = test.bind();
fn(); //hello
```

上面通过简单的示例定义变量`fn`接收`bind`方法的返回值(一个函数),然后执行此函数`fn()`验证了定义中提到的第一点**创建新函数(直白点就是调用`bind`方法返回值是一个函数)**

需要注意的是调用`bind`方法返回的新函数不会立即执行,需要手动调用(如上面的示例如果不执行`fn()`则该新函数永远不会自执行).

接着验证第二点**第一个参数为新函数`this`上下文**,还是通过撸示例代码对这句话进行理解吧.

开始之前先回顾以下`this`上下文,这里只需要知道每个函数都有自己的`this`就可以了,想要了解更多的话请参考 MDN:<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this>

```javascript
//关于this的简单示例一
function test() {
  console.log('hello', this);
}
test(); // hello Window(在浏览器中test函数内的this指向Window)
```

```javascript
//关于this的简单示例二
var huawei = {
  price: 7999,
  getPrice: function () {
    console.log(this, this.price);
  },
};
huawei.getPrice(); // {price:7999,getPrice:function} 7999
```

在上面的示例一、示例二中演示了简单的调用,`this`上下文在没有被改变的情况下均指向了默认对象(函数自身应该指向的对象).

现在再来理解**第一个参数为新函数`this`上下文**这句话应该可以理解是在说些什么(直白的说`bind`方法创建的新函数内的`this`指向第一个参数).

**通过`bind`方法创建的新函数内`this`指向第一个参数为对象,并且不可以改变**

**通过`bind`方法创建的新函数内`this`指向第一个参数为对象,并且不可以改变**

**通过`bind`方法创建的新函数内`this`指向第一个参数为对象,并且不可以改变**

先看一下调用`bind`方法无参数的情况下`this`的指向

```javascript
function test() {
  console.log('hello', this);
}
var fn1 = test.bind();
fn1(); // hello Window
var fn2 = test.bind(null);
fn2(); // hello Window
var fn3 = test.bind(undefined);
fn3(); // hello Window
```

上面示例分别演示了无参数、参数为`null` `undefined`的情况总结为一句话就是:

**无参数或参数为`null` `undefined`的情况下不对新函数内的`this`指向做更改**

**无参数或参数为`null` `undefined`的情况下不对新函数内的`this`指向做更改**

**无参数或参数为`null` `undefined`的情况下不对新函数内的`this`指向做更改**

接下来看一下传一个参数的情况,也就是上面提到的第一个参数作为新函数内`this`指向的对象

```javascript
var huawei = { name: '华为' };
var xiaomi = { name: '小米' };
function getName() {
  return `手机品牌:${this.name}`;
}
var huaweiGetName = getName.bind(huawei);
var xiaomiGetName = getName.bind(xiaomi);

console.log(huaweiGetName()); //手机品牌:华为
console.log(xiaomiGetName()); //手机品牌:小米
```

如上面的示例中

- `getName.bind(huawei)` 调用`bind`方法第一个参数`huawei`,执行新函数时内部的`this`便向了`huawei`
- `getName.bind(xiaomi)` 调用`bind`方法第一个参数`xiaomi`,执行新函数时内部的`this`便向了`xiaomi`

所以这就是上面定义提到的第二点**第一个参数为新函数`this`上下文**

关于定义提到的第三点**其它参数为新函数的参数**还是举个例子吧.

```javascript
var huawei = { name: '华为', orig: 0, discount: 0, now: 0 };
var xiaomi = { name: '小米', orig: 0, discount: 0, now: 0 };
/**
 * 计算器
 *
 * @param {Number} orig 原价
 * @param {Number} discount 折扣
 * @returns 现价
 */
function calc(orig, discount) {
  this.orig = orig;
  this.discount = discount;
  this.now = parseInt(this.orig * this.discount);
  console.log(`手机品牌:${this.name};原价:${this.orig};现价:${this.now}`);
  return this.now;
}
var huaweiCalc = calc.bind(huawei);
var xiaomiCalc = calc.bind(xiaomi);

console.log(huaweiCalc(3500, 0.9)); //手机品牌:华为;原价:3500;现价:3150
console.log(xiaomiCalc(2999, 0.85)); //手机品牌:小米;原价:2999;现价:2549
```

关于第三点还是比较好理解的,通过上面的示例可以看出调用新函数`huaweiCalc` `xiaomiCalc`时传递了 2 个参数,这里只需要搞明白一点传多少个参数,参数类型是怎么决定的.

哪个函数调用了`bind`方法,它需要多少个参数那么创建的新函数就传递多少个参数,如上面的示例`calc(orig, discount)`函数需要 2 个参数那么通过`calc.bind()`创建的新函数就传递 2 个参数(注:这里提到的 2 个参数是除第一个参数`this`指定的对象之外需要 2 个参数)

```javascript
if ('上面啰嗦的已经会全文背诵了') {
  console.log('继续看下面补充部分.');
} else {
  console.log('从头开始.');
  return;
}
```

#### 补充

1. 关于`this`指向第一个参数

在示例部分已经介绍过`bind`方法创建的新函数内`this`指向第一个参数,如果仔细看 MDN 关于参数的介绍总会有一些特殊情况的存在,所以下面结合示例看有哪些需要注意的.

```javascript
function Phone(name) {
  this.name = name;
  this.say = function () {
    console.log(`品牌:${this.name};`);
  };
  this.getName = function () {
    this.say();
  };
  this.getName2 = function () {
    var fn = this.say.bind();
    fn();
  };
  this.getName3 = function () {
    var that = this;
    setTimeout(function () {
      var fn = that.say.bind();
      fn();
    }, 2000);
  };
  this.getName4 = function () {
    setTimeout(this.say.bind(), 2000);
  };
  this.getName5 = function () {
    setTimeout(() => {
      var fn = this.say.bind();
      fn();
    }, 2000);
  };
}
var huawei = new Phone('华为');
huawei.getName(); //品牌:华为;
huawei.getName2(); //品牌:;
huawei.getName3(); //品牌:;
huawei.getName4(); //品牌:;
huawei.getName5(); //品牌:;
```

示例只有`huawei.getName();`正常输出结果,其它全部覆灭所以前面不敢啰嗦这么多,怕直接关闭页面(挥一挥衣袖不带走一片云彩).接下来我们逐个分析.

- `getName`方法

关于`this`指向有一种情况看方法由谁调用的,`this`便指向谁,在`getName`方法内`say`是由当前`this`调用,所以`say`方法内的`this`就是当前这个`this`对象,那么就会正常输出.

- `getName2`方法

方法内通过调用`this.say.bind()`方法创建一个新函数,但是调用`bind`方法时没有传参数,这种情况下`this`无法指向第一个参数,那么就不做任何更改使用默认对象,这种情况在上面有提到过**无参数或参数为`null` `undefined`的情况下不对新函数内的`this`指向做更改**,所以执行`fn()`函数`this`便指向了默认`Window`对象,而`Window`对象内没有`name`属性所以`this.name`获取不到.

- `getName3`方法

首先需要知道默认情况下`setTimeout`内的`this`是指向`Window`,(直白讲`setTimeout`内的`this`指向`window`,而`window`下没有`say`方法,所以不能直接写成~~this.say~~)那么就明白为什么要先定义`var that=this`,剩下的问题就和第二个是一样的.

- `getName4`方法

由于`setTimeout`方法第一个参数是`function`函数,而调用`bind`方法是创建了一个新函数所以这里直接简写成这种形式(),剩下的问题还是和第二个是一样的.

- `getName5`方法

这种尖头函数语法糖的写法只是解决了`getName3`提到的关于`setTimeout`方法`this`的问题,剩下的问题依然和第二个是一样的.

所以正确姿势如下

```javascript
function Phone(name) {
  this.name = name;
  this.say = function () {
    console.log(`品牌:${this.name};`);
  };
  this.getName = function () {
    this.say();
  };
  this.getName2 = function () {
    var fn = this.say.bind(this);
    fn();
  };
  this.getName3 = function () {
    var that = this;
    setTimeout(function () {
      var fn = that.say.bind(that);
      fn();
    }, 2000);
  };
  this.getName4 = function () {
    setTimeout(this.say.bind(this), 2000);
  };
  this.getName5 = function () {
    setTimeout(() => {
      var fn = this.say.bind(this);
      fn();
    }, 2000);
  };
}
var huawei = new Phone('华为');
huawei.getName(); //品牌:华为;
huawei.getName2(); //品牌:华为;
huawei.getName3(); //品牌:华为;
huawei.getName4(); //品牌:华为;
huawei.getName5(); //品牌:华为;
```

看到这里是否总结了上面示例全部都是一个问题:

**调用`bind`方法,想要改变`this`指向必须传第一个参数**

**调用`bind`方法,想要改变`this`指向必须传第一个参数**

**调用`bind`方法,想要改变`this`指向必须传第一个参数**

2. 即使传递了第一个参数也会被忽略的情况

同样在 MDN 关于参数的介绍中还提到了通过`new`运算符构造的函数会忽略第一个参数值,这句话什么意思呢？还是撸个示例吧.

```javascript
var huawei = { name: '华为' };
function Phone() {
  console.log(`品牌:${this.name};`);
}

var huaweiFn = Phone.bind(huawei);
huaweiFn(); //品牌:华为
```

上面的示例是一个通过`bind`方法创建新函数且绑定了第一个参数(新函数`this`指向第一个参数)正确输出结果,如果通过`new`稍微改变一下呢.

```javascript
var huawei = { name: '华为' };
function Phone() {
  console.log(`品牌:${this.name};`);
}
var huaweiFn = Phone.bind(huawei);
var huaweiObj = new huaweiFn(); //品牌: undefined
```

为什么通过`new`构造函数的形式输出结果却是`undefined`,再次确认调用`bind`方法也指定了第一个参数一切看起来好像都没问题.不过也确实验证了 MDN 上提到的**通过`new`运算符构造的函数会忽略第一个参数值**

这个结果不怪撸的代码有问题,是因为通过`new`构造函数的形式会把`this`指向内部创建的一个新对象上(这里指`huaweiObj`)所以通过`new`的形式调用`bind`创建的函数第一个参数传什么都不好使.那其它参数好使不？把上面的示例改动一下看看.

```javascript
var huawei = { name: '华为' };
function Phone(price, discount) {
  console.log(`品牌:${this.name};价格:${price};折扣:${discount}`);
}
var huaweiFn = Phone.bind(huawei);
var huaweiObj = new huaweiFn(3500, 0.9); //品牌: undefined;价格:3500;折扣:0.9
```

示例中价格和折扣是通过参数的形式传递`new huaweiFn(3500,0.9)`,并且也正常输出了所以划重点:

**使用`new`运算符调用`bind`创建的新函数第一个参数会被忽略,其它参数正常使用**

**使用`new`运算符调用`bind`创建的新函数第一个参数会被忽略,其它参数正常使用**

**使用`new`运算符调用`bind`创建的新函数第一个参数会被忽略,其它参数正常使用**

如果还有精力接着往下看其它参数的使用姿势.

3. 预设初始参数

这部分也是从 MDN 中看到的**bind() 的另一个最简单的用法是使一个函数拥有预设的初始参数。只要将这些参数（如果有的话）作为 bind() 的参数写在 this 后面。当绑定函数被调用时，这些参数会被插入到目标函数的参数列表的开始位置，传递给绑定函数的参数会跟在它们后面**但在之前的示例中从未使用过,相对于上面啰嗦的一堆其实很简单.

```javascript
var huawei = { name: '华为', orig: 0, discount: 0, now: 0 };
var xiaomi = { name: '小米', orig: 0, discount: 0, now: 0 };
/**
 * 计算器
 *
 * @param {Number} orig 原价
 * @param {Number} discount 折扣
 * @returns 现价
 */
function calc(orig, discount) {
  this.orig = orig;
  this.discount = discount;
  this.now = parseInt(this.orig * this.discount);
  console.log(`手机品牌:${this.name};原价:${this.orig};现价:${this.now}`);
  return this.now;
}
var huaweiCalc = calc.bind(huawei, 3500);
var xiaomiCalc = calc.bind(xiaomi, 2999);

console.log(huaweiCalc(0.9)); //手机品牌:华为;原价:3500;现价:3150
console.log(xiaomiCalc(0.85)); //手机品牌:小米;原价:2999;现价:2549
```

仔细看有没有发现和之前示例有什么区别,再认真看一下这里`calc.bind(huawei,3500)` `calc.bind(xiaomi,2999)`,调用`bind`方法除了传第一个参数之外后面又传了一个参数,当然了这里不仅可以传一个参数,多个也是可以的,取决于`calc`函数需要多少个参数,如`calc.bind(huawei,3500,0.9)` `calc.bind(xiaomi,2999,0.85)`这种方式就是预设初始参数,在调用新函数时这些预设初始参数会放到参数列表前面.

如示例中`calc`函数需要 2 个参数`orig, discount`,所以通过`bind`方法创建新函数时`bind(huawei,3500)`把价格作为预设初始参数,之后调用新函数时只需要再传递一个参数`huaweiCalc(0.9);`即可(不需要像之前那样~~huaweiCalc(3500,0.9)~~)

#### 模拟实现

1. 挂载到`Function`原型

要实现`bind`方法的前提需要搞明白`bind`方法是从哪里来的?如果看文章开头提到的 MDN 链接的话应该可以找到答案`Function.prototype.bind`,所以我们也挂载到`Function`原型上.

```javascript
Function.prototype.bind2 = function () {};
function test() {
  console.log('fn:test');
}
test.bind2();
```

第一步已完成`bind2`方法可以像`bind`方法一样被调用.

2. 创建新函数

调用原生`bind`方法会创建新函数,其实就是`bind`方法内返回一个函数.

```javascript
Function.prototype.bind2 = function () {
  var bindFn = function () {
    console.log('bind2.newFn');
  };
  return bindFn; //返回新函数供外部调用
};
function test() {
  console.log('fn:test');
}
var fn = test.bind2(); //定义变量fn 接收bind2方法的返回值(一个函数)
fn(); //bind2.newFn
```

3. 对第一个参数的处理

`bind`方法把第一个参数作为新函数`this`上下文(也就是将新函数内的`this`指向第一个参数),所以这一步便是改变新函数`this`指向第一个参数.

```javascript
Function.prototype.bind2 = function () {
  var that = this;
  //获取第一个参数
  var context = arguments[0];
  var bindFn = function () {
    return that.apply(context); //调用apply方法改变this指向第一个参数context
  };
  return bindFn; //返回新函数供外部调用
};
var huawei = { name: '华为' };
var xiaomi = { name: '小米' };
function getName() {
  return `手机品牌:${this.name}`;
}
var huaweiGetName = getName.bind2(huawei);
var xiaomiGetName = getName.bind2(xiaomi);

console.log(huaweiGetName()); //手机品牌:华为
console.log(xiaomiGetName()); //手机品牌:小米
```

4. 其它参数

```javascript
Function.prototype.bind2 = function () {
  var that = this;
  //获取第一个参数
  var context = arguments[0];
  var bindFn = function () {
    //外部调用此函数有可能会传递参数(参数个数不定,所以直接把arguments传递出去)
    return that.apply(context, arguments);
  };
  return bindFn; //返回新函数供外部调用
};
var huawei = { name: '华为', orig: 0, discount: 0, now: 0 };
var xiaomi = { name: '小米', orig: 0, discount: 0, now: 0 };
/**
 * 计算器
 *
 * @param {Number} orig 原价
 * @param {Number} discount 折扣
 * @returns 现价
 */
function calc(orig, discount) {
  this.orig = orig;
  this.discount = discount;
  this.now = parseInt(this.orig * this.discount);
  console.log(`手机品牌:${this.name};原价:${this.orig};现价:${this.now}`);
  return this.now;
}
var huaweiCalc = calc.bind2(huawei);
var xiaomiCalc = calc.bind2(xiaomi);

console.log(huaweiCalc(3500, 0.9)); //手机品牌:华为;原价:3500;现价:3150
console.log(xiaomiCalc(2999, 0.85)); //手机品牌:小米;原价:2999;现价:2549
```

上面 4 个步骤已经实现了低配版`bind`方法.接下来还需要打磨一下,列清单查漏补缺.

1. `call2`内部对第一个参数做类型判断
2. 通过`new`运算符构造的函数会忽略第一个参数值
3. 预设初始参数

关于第二点这里插一句,仔细品下面的三个示例.

```javascript
// 示例一 通过`new`创建的对象即可以访问构造函数的属性也可以访问原型中的方法
function Phone(name) {
  this.name = name;
}
Phone.prototype.getName = function () {
  return this.name;
};
Phone.prototype.say = function () {
  console.log(`手机品牌:${this.name}`);
};
var huawei = new Phone('华为');
console.log(huawei.name); //华为
console.log(huawei.getName()); //华为
huawei.say(); //手机品牌:华为
```

```javascript
//示例二 原生bind方法创建的新函数不含prototype原型
function Phone(name) {
  this.name = name;
}
Phone.prototype.getName = function () {
  return this.name;
};
Phone.prototype.say = function () {
  console.log('手机品牌:' + this.name);
};
var fn = Phone.bind();
console.log(Phone.prototype); //{getName: ƒ, say: ƒ, constructor: ƒ}
console.log(fn.prototype); //undefined
```

```javascript
//示例三 通过原生bind方法创建新函数,使用new创建的实例对象含有prototype原型
function Phone(name) {
  this.name = name;
}
Phone.prototype.getName = function () {
  return this.name;
};
Phone.prototype.say = function () {
  console.log('手机品牌:' + this.name);
};
var fn = Phone.bind();
var obj = new fn();
console.log(obj.__proto__); //{getName: ƒ, say: ƒ, constructor: ƒ}
console.log(obj.__proto__ === Phone.prototype); //true
console.log(obj instanceof Phone); //true
console.log(obj instanceof fn); //true
```

如果对上面的三个示例搞明白了下面模拟实现内就会处理`new`实例对象的情况,不要眨眼.

```javascript
Function.prototype.bind2 = function () {
  var that = this;
  var slice = Array.prototype.slice;
  //获取第一个参数
  var context = arguments[0];
  //获取其它参数(预设初始参数)
  var arr = slice.call(arguments, 1);
  if (null === context || undefined === context) {
    context = this; //指向默认
  } else if (['string', 'number', 'boolean'].indexOf(typeof context) != -1) {
    context = Object(context); //像原生bind一样指向包装对象
  }

  var bindFn = function () {
    //处理new 创建实例的调用方式
    if (this instanceof bindFn) {
      // 这里划重点
      //1.还记得补充部分讲过即使传递了第一个参数也会被忽略的情况(通过`new`运算符构造的函数会忽略第一个参数值) if内根本没有对一个参数有过任何操作的代码,所以看到这里是否明白了.
      //2. 上面提到过使用`new`运算符调用`bind`创建的新函数第一个参数会被忽略,其它参数正常使用,这里应该看出来了吧调用apply方法时把其它参数通过第二个参数传递出去
      return that.apply(this, arr.concat(slice.call(arguments)));
    } else {
      //arr.concat(slice.call(arguments)) 把预设初始参数和调用bindFn函数传递的不确定个数的参数arguments合并之后传递出去
      return that.apply(context, arr.concat(slice.call(arguments)));
    }
  };

  //如果存在prototype说明可能存在通过new创建实例的方式调用的
  if (that.prototype) {
    //这里需要把bindFn函数的原型指向调用`bind2`方法的函数上可参考上面示例三(与原生bind方法保持一致)
    // bindFn.prototype = that.prototype;
    //上面这种直接赋值的存在一个问题,如果bindFn.prototype函数的原型修改会影响that.prototype的原型,如bindFn函数的原型新增一个方法bindFn.prototype.getPrice=function(){}的话that.prototype原型上也会新增,因为是引用的同一个对象,所以需要通过中间函数来解决这个问题.
    function Empty() {}
    Empty.prototype = that.prototype; //先将中间函数Empty的原型指向that.prototype
    bindFn.prototype = new Empty(); //bindFn函数的原型指向中间函数的实例对象
    Empty.prototype = null; //断开中间函数与that.prototype的关系
  }
  return bindFn; //返回新函数供外部调用
};
```

**无注释代码版本如下**

```javascript
Function.prototype.bind2 = function () {
  var that = this;
  var slice = Array.prototype.slice;
  var context = arguments[0];
  var arr = slice.call(arguments, 1);
  if (null === context || undefined === context) {
    context = this;
  } else if (['string', 'number', 'boolean'].indexOf(typeof context) != -1) {
    context = Object(context);
  }
  var bindFn = function () {
    if (this instanceof bindFn) {
      return that.apply(this, arr.concat(slice.call(arguments)));
    } else {
      return that.apply(context, arr.concat(slice.call(arguments)));
    }
  };
  if (that.prototype) {
    function Empty() {}
    Empty.prototype = that.prototype;
    bindFn.prototype = new Empty();
    Empty.prototype = null;
  }
  return bindFn;
};
```

#### 测试模拟实现方法

把上面的示例通过`bind2`方法运行一次

```javascript
//示例一 普通调用
Function.prototype.bind2 = function () {
  var that = this;
  var slice = Array.prototype.slice;
  var context = arguments[0];
  var arr = slice.call(arguments, 1);
  if (null === context || undefined === context) {
    context = this;
  } else if (['string', 'number', 'boolean'].indexOf(typeof context) != -1) {
    context = Object(context);
  }
  var bindFn = function () {
    if (this instanceof bindFn) {
      return that.apply(this, arr.concat(slice.call(arguments)));
    } else {
      return that.apply(context, arr.concat(slice.call(arguments)));
    }
  };
  if (that.prototype) {
    function Empty() {}
    Empty.prototype = that.prototype;
    bindFn.prototype = new Empty();
    Empty.prototype = null;
  }
  return bindFn;
};
var huawei = { name: '华为', orig: 0, discount: 0, now: 0 };
var xiaomi = { name: '小米', orig: 0, discount: 0, now: 0 };
/**
 * 计算器
 *
 * @param {Number} orig 原价
 * @param {Number} discount 折扣
 * @returns 现价
 */
function calc(orig, discount) {
  this.orig = orig;
  this.discount = discount;
  this.now = parseInt(this.orig * this.discount);
  console.log(`手机品牌:${this.name};原价:${this.orig};现价:${this.now}`);
  return this.now;
}
var huaweiCalc = calc.bind2(huawei, 3500); //预设初始参数
var xiaomiCalc = calc.bind2(xiaomi); //未预设

console.log(huaweiCalc(0.9)); //手机品牌:华为;原价:3500;现价:3150
console.log(xiaomiCalc(2999, 0.85)); //手机品牌:小米;原价:2999;现价:2549
```

```javascript
//示例二 通过new创建实例对象
Function.prototype.bind2 = function () {
  var that = this;
  var slice = Array.prototype.slice;
  var context = arguments[0];
  var arr = slice.call(arguments, 1);
  if (null === context || undefined === context) {
    context = this;
  } else if (['string', 'number', 'boolean'].indexOf(typeof context) != -1) {
    context = Object(context);
  }
  var bindFn = function () {
    if (this instanceof bindFn) {
      return that.apply(this, arr.concat(slice.call(arguments)));
    } else {
      return that.apply(context, arr.concat(slice.call(arguments)));
    }
  };
  if (that.prototype) {
    function Empty() {}
    Empty.prototype = that.prototype;
    bindFn.prototype = new Empty();
    Empty.prototype = null;
  }
  return bindFn;
};
function Phone(name) {
  this.name = name;
}
Phone.prototype.getName = function () {
  return this.name;
};
Phone.prototype.say = function () {
  console.log('手机品牌:' + this.name);
};
var fn = Phone.bind2();
var obj = new fn('华为');
console.log(obj.getName()); //华为
console.log(obj.say()); //手机品牌:华为
```

### 问答

> 如何使用`bind`方法

由于 `bind`方法是挂载到`Function`原型,所以只有函数可以调用`bind`方法

> `call` `apply` `bind` 方法对比

| 方法名 | 参数                                                            | 执行                |
| ------ | --------------------------------------------------------------- | ------------------- |
| call   | 接收多个参数(第一个参数改变 `this` 指向,其它参数为参数列表) | 立即执行            |
| apply  | 接收 2 个参数(第一个参数改变 `this` 指向,第二个参数为数组类型)  | 立即执行            |
| bind   | 同 call                                                         | 创建新函数,手动调用 |

> 模拟实现 bind2 方法内为`if(that.prototype)`为什么不放在`bindFn`函数的`if(this instanceof bindFn)`内

首先如果能提出这个问题说明真的是睁大眼睛认真看了.

```javascript
Function.prototype.bind2 = function () {
  var that = this;
  var slice = Array.prototype.slice;
  var context = arguments[0];
  var arr = slice.call(arguments, 1);
  if (null === context || undefined === context) {
    context = this;
  } else if (['string', 'number', 'boolean'].indexOf(typeof context) != -1) {
    context = Object(context);
  }

  var bindFn = function () {
    if (this instanceof bindFn) {
      //如果下面这段代码从外面放到这里执行的话,存在以下几个问题
      // 1. 既然能进入if(this instanceof bindFn)说明一定是通过new创建实例对象的形式调用的,那么下面的if(that.prototype)可以不需要判断,直接处理bindFn函数的prototype即可
      if (that.prototype) {
        function Empty() {}
        Empty.prototype = that.prototype;
        bindFn.prototype = new Empty();
        Empty.prototype = null;
      }
      // 2. 由于上面执行bindFn.prototype = new Empty();所以bindFn函数的原型发生了变化,那么下面的that.apply(this)这个this就不在是bindFn的实例了,this instanceof bindFn 则是false,那么创建的实例对象就无法使用原型上挂载的各个方法了.
      // 3. 除非你搞撸了下面这一行代码
      // this.__proto__=bindFn.prototype;//重新指向
      return that.apply(this, arr.concat(slice.call(arguments)));
    } else {
      return that.apply(context, arr.concat(slice.call(arguments)));
    }
  };
  return bindFn;
};
```

### 最后

以上章节就是目前对 `bind`方法的理解,还望多多指教.
