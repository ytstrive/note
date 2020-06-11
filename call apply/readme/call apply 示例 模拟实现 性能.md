由于markdown排版问题建议从掘金阅读:<https://juejin.im/post/5eddb2c86fb9a047b11b5c67>

### 目录

- call
  - 定义
  - 示例
  - 模拟实现
- apply
  - 定义
  - 示例
  - 模拟实现
- 性能
  - 开源库如何使用call、apply
  - 无参数对比
  - 一个参数对比
  - 两个参数对比
  - 多个参数对比
- 问答
- 最后

### call

#### 定义

**call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数.**
定义、语法、更多示例参考 MDN:<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call>

我们结合下面的示例来解释定义中提到的以下两点指的是什么.

1. this
2. 一个或多个参数

#### 示例

华为粉和水果粉的某天...

<font color=Crimson>华为粉:在干嘛?</font>

<font color=MediumSeaGreen>水果粉:正在看 Are you OK 发布会</font>

<font color=Crimson>华为粉:还是我华为手机性能好,不信比个价</font>

<font color=MediumSeaGreen>水果粉:不在怕的,找计算器...大战三百回合...</font>

```javascript
//示例一
var huawei = { name: '华为', price: 0 }; //华为粉
var shuiguo = { name: '水果', price: 0 }; //水果粉
/**
 * 计算器
 *
 * @param {Number} args 价格
 * @returns 总价
 */
function calc(args = 0) {
  this.price = args;
  console.log(`手机品牌:${this.name};已投资:${this.price}`);
  return this.price;
}

console.log(calc.call(huawei, 3500)); //手机品牌:华为;已投资:3500
console.log(calc.call(shuiguo, 1299)); //手机品牌:水果;已投资:1299
```

从示例中我们看到`calc`函数充当计算器的角色,它不属于华为粉也不属于水果粉纯粹是独立的第三方(一个计算器而已,不能扛下所有...)那 `calc` 函数内部的 `this` 指向谁呢？这个取决于调用`*.call(thisArg)`方法时第一个参数.

如上面的示例中

- `calc.call(huawei, 3500)`第一个参数为`huawei`那执行`calc`函数时,内部的`this`便向了`huawei`
- `calc.call(shuiguo, 1299)`第一个参数为`shuiguo`那执行`calc`函数时,内部的`this`便向了`shuiguo`

**`call(thisArg)`方法的第一个参数表示 `this` 指向**
**`call(thisArg)`方法的第一个参数表示 `this` 指向**
**`call(thisArg)`方法的第一个参数表示 `this` 指向**

搞明白 1.this 指向之后我们继续看 2.一个或多个参数.故事还在继续...

<font color=Crimson>华为粉:第一回合 Are you OK?</font>

<font color=MediumSeaGreen>水果粉:是计算器的问题,再换个计算器</font>

<font >计算器:这个锅...</font>

```javascript
//示例二
var huawei = { name: '华为', price: 0 }; //华为粉
var shuiguo = { name: '水果', price: 0 }; //水果粉
/**
 * 计算器
 *
 * @param {Number} arg1 价格1
 * @param {Number} arg2 价格2
 * @returns 总价
 */
function calc2(arg1 = 0, arg2 = 0) {
  this.price = arg1 + arg2;
  console.log(`手机品牌:${this.name};已投资:${this.price}`);
  return this.price;
}

console.log(calc2.call(huawei, 3500, 5600)); //手机品牌:华为;已投资:9100
console.log(calc2.call(shuiguo, 1299, 3299)); //手机品牌:水果;已投资:4598
```

示例一的`calc`函数只接收一个参数那么在使用`call`只需要传递一个参数.
如示例`calc.call(huawei, 3500)`只需要把(价格)3500 作为参数传递进去

示例二的`calc2`函数接收 2 个参数那么在使用`call`传递 2 个参数.
如示例`calc2.call(shuiguo, 1299, 3299)`只需要把(价格)1299,(价格)3299 作为参数传递进去

此刻对`call`方法的使用方式有所了解了吧.

**调用`call(thisArg,arg1,arg2,arg3....)`方法时第一个参数表示`this`的指向,第二个参数...第 N 个参数表示参数列表 (如示例`calc`、`calc2`函数需要多少个参数则对应的传递多少个参数值)**

**调用`call(thisArg,arg1,arg2,arg3....)`方法时第一个参数表示`this`的指向,第二个参数...第 N 个参数表示参数列表 (如示例`calc`、`calc2`函数需要多少个参数则对应的传递多少个参数值)**

**调用`call(thisArg,arg1,arg2,arg3....)`方法时第一个参数表示`this`的指向,第二个参数...第 N 个参数表示参数列表 (如示例`calc`、`calc2`函数需要多少个参数则对应的传递多少个参数值)**

<font color=Crimson>华为粉:Are you OK?</font>

<font >计算器 calc:Are you OK?</font>

<font >计算器 calc2:Are you OK?</font>

<font color=MediumSeaGreen>水果粉:刚看完发布会,我准备路转粉了...以后请称呼我米粉</font>
...

通过华为粉与水果粉的示例演示`call`的使用方式,虽然自身没有任何方法但可以通过`call`的方式调用`calc` `calc2`函数为己所用.

以上通过定义结合示例的方式我们了解了`call`方法的使用,接下来我们尝试如何写一个`call`方法.

#### 模拟实现

1. 挂载到`Function`原型

要实现`call`方法的前提需要搞明白`call`方法是从哪里来的?如果看文章开头提到的 MDN 链接的话应该可以找到答案`Function.prototype.call`,所以我们也挂载到`Function`原型上.

```javascript
Function.prototype.call2 = function () {
  console.log('fn:call2');
};
function test() {
  console.log('fn:test');
}
test.call2(); //fn:call2
```

第一步已完成`call2`方法可以像`call`方法一样被调用.

2. 立即执行被调用函数

虽然第一步已经完成`call2`被执行了,但发现`test`函数并未执行所以当前需要解决这个问题,那么在`call2`方法内该如何调用`test`函数(立即执行)？

关于`this`指向有一种情况看方法由谁调用的,`this`便指向谁,如`test.call2`这种情况,`call2`方法是由`test`调用的,所以`call2`方法内的`this`便指向`test`所以我们需要验证一下.

```javascript
Function.prototype.call2 = function () {
  console.log('fn:call2');
  console.log('this:', this);
};
function test() {
  console.log('fn:test');
}
test.call2(); //fn:call2 //this:function test()

//再次验证this指向
function base() {
  console.log('fn:base');
}
base.call2(); //fn:call2 //this:function base()
```

通过` test``base `函数验证`call2`方法内的`this`确实分别指向了`test` `base`,所以

**关于`this`指向有一种情况看方法由谁调用的,`this`便指向谁**

**关于`this`指向有一种情况看方法由谁调用的,`this`便指向谁**

**关于`this`指向有一种情况看方法由谁调用的,`this`便指向谁**

这样一来我们可以直接在`call2`方法内立即执行调用的函数

```javascript
Function.prototype.call2 = function () {
  this();
};
function test() {
  console.log('fn:test');
}
test.call2(); //fn:call2 //fn:test
```

经过上面 2 个步骤`call2`已经完成了`call`一半的功能可以处理无任何参数的情况,但还需再接再厉分析如何处理带参数的情况.

3. 参数处理

相对于前面 2 个步骤,对参数处理啰嗦的比较多一些希望耐心品下去...仔细品,先回顾一下原生的`call`是怎么接收参数

```javascript
function test(arg1) {
  console.log('接收到的参数:', arg1);
}
test.call(null, 1); //1

function test2(arg1, arg2) {
  console.log('接收到的参数:', arg1, arg2);
}
test2.call(null, 1, 'a'); //1,'a'

function test3(arg1, arg2, arg3) {
  console.log('接收到的参数:', arg1, arg2, arg3);
}
test3.call(null, 1, 'a', [{ name: 'zhangsan' }, true]); //1,'a',[{ name: 'zhangsan' }, true]
```

上面示例分别演示了调用原生`call`方法时传递一个到多个参数的情况,针对第一个参数的处理我们在后面会讲解(如果忘记第一个参数是做什么用途的,可以返回开头看 MDN 链接关于定义、语法...),`call`方法会把参数原封不动的传递给函数,所以我们先模拟一下对参数的处理(声明:先不处理第一参数).

原生`call`方法可以接收 N 多参数,那我们是否需要定义`call2`方法接收 N 多参数呢？如下面的示例

```javascript
Function.prototype.call2 = function (arg1,arg2,arg3,arg4,....) {

  this();
};
```

显然这样传参数是不可取的(因为根本不知道要传多少个参数...),别忘了函数内有一个`arguments`类数组对象,如果不知道请自行脑补或参考 MDN:<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments>,所以我们通过它可以获取到参数

```javascript
Function.prototype.call2 = function () {
  this();
  for (var i = 0, len = arguments.length; i < len; i++) {
    console.log('call2接收到的参数:', arguments[i]);
  }
};
function test(arg1) {
  console.log('接收到的参数:', arg1);
}
test.call2(null, 1);

function test2(arg1, arg2) {
  console.log('接收到的参数:', arg1, arg2);
}
test2.call2(null, 1, 'a');

function test3(arg1, arg2, arg3) {
  console.log('接收到的参数:', arg1, arg2, arg3);
}
test3.call2(null, 1, 'a', [{ name: 'zhangsan' }, true]);
```

这样我们把原生`call`方法换成模拟的`call2`方法看一下输出结果,无论`test` `test2` `test3`函数调用`call2`方法传递多少个参数,`call2`方法体内都会正确输出.

参数接收的问题是解决了,可`call2`方法体内怎么把这些参数传递给对应的函数呢,如`test`函数接收 1 个参数、`test2`函数接收 2 个参数、`test3`函数接收 3 个参数,而目前为止`call2`方法只是循环接收到了这些参数而已.

好吧,接着撸...

```javascript
Function.prototype.call2 = function () {
  var arr = [];
  for (var i = 0, len = arguments.length; i < len; i++) {
    arr.push(arguments[i]);
  }
  this(arr);
};
function test(arg1) {
  console.log('接收到的参数:', arg1);
}
test.call2(null, 1); //[null, 1]
function test2(arg1, arg2) {
  console.log('接收到的参数:', arg1, arg2);
}
test2.call2(null, 1, 'a'); //[null, 1, "a"], undefined

function test3(arg1, arg2, arg3) {
  console.log('接收到的参数:', arg1, arg2, arg3);
}
test3.call2(null, 1, 'a', [{ name: 'zhangsan' }, true]); //[null, 1, "a", Array(2)], undefined, undefined
```

如上面的示例,首先想到把这些参数存入数组调用`this(arr)`函数时把数组作为参数传递,然而看到结果的时候还是太年轻...

数据是传到了各函数内但格式不对,和原生`call`方法还是有差别的,`call`方法可以参数格式化一一对应,模拟的`call2`方法输出的第一个参数全部是数组,后面参数都是`undefined`看来姿势不对继续改进.

如何把参数一一对应的传递给函数?

数组转换成字符串,如下面的示例

```javascript
Function.prototype.call2 = function () {
  var arr = [];
  for (var i = 0, len = arguments.length; i < len; i++) {
    arr.push(arguments[i]);
  }
  this('' + arr);
};
function test3(arg1, arg2, arg3) {
  console.log('接收到的参数:', arg1, arg2, arg3);
}
test3.call2(null, 1, 'a', [{ name: 'zhangsan' }, true]); //,1,a,[object Object],true undefined undefined
```

这种方式只是把第一个参数值由数组类型`[null, 1, "a", Array(2)]`变成了字符串类型`,1,a,[object Object],true`,而且对于对象类型转换成字符串`[object Object]`也不是我们想要的后面的参数还是`undefined`,还是没解决问题,接着改进.

什么方式可以把字符串编译成可执行的代码?

eval 函数会将传入的字符串当做 JavaScript 代码进行执行

eval 参考 MDN:<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval>

```javascript
Function.prototype.call2 = function () {
  var arr = [];
  for (var i = 0, len = arguments.length; i < len; i++) {
    arr.push(arguments[i]);
  }
  eval('this(arr)');
};
function test3(arg1, arg2, arg3) {
  console.log('接收到的参数:', arg1, arg2, arg3);
}
test3.call2(null, 1, 'a', [{ name: 'zhangsan' }, true]); //[null, 1, "a", Array(2)] undefined undefined
```

看到结果之后发现问题又回去了,原来`eval('this(arr)')`解析字符串时发现`arr`是个变量开始解析`arr`把值传给了`this(arr)`函数,如下面的示例

```javascript
var arr = [1, 'a', [{ name: 'zhangsan' }, true]];
console.log(eval('arr'));
```

既然`eval`函数能够解析字符串...变量,那再改进一下.

```javascript
Function.prototype.call2 = function () {
  var arr = [];
  for (var i = 0, len = arguments.length; i < len; i++) {
    arr.push('arguments[' + i + ']');
  }
  eval('this(arr)');
};
function test3(arg1, arg2, arg3) {
  console.log('接收到的参数:', arg1, arg2, arg3);
}
test3.call2(null, 1, 'a', [{ name: 'zhangsan' }, true]); //["arguments[0]", "arguments[1]", "arguments[2]", "arguments[3]"] undefined undefined
```

这次`arr`数组里不存数值了(避免对各种引用(复合)类型做判断...转换,如`{ name: 'zhangsan' }=>[object Object]`的情况发生),所以把`arguments[0]` `arguments[1]`...作为字符串存入数组之后让`eval`函数解析字符串.

看到这个解析结果,`arr`参数是解析了但数组内的这些字符串并未被解析成对应的值`["arguments[0]", "arguments[1]", "arguments[2]", "arguments[3]"]`,看来是对`eval`函数有什么误会吧,它负责解析字符串为可执行代码,但`arr`变量是数组类型又不是字符串,为什么要解析.所以把`arr`数组转换成字符串呢？

```javascript
Function.prototype.call2 = function () {
  var arr = [];
  for (var i = 0, len = arguments.length; i < len; i++) {
    arr.push('arguments[' + i + ']');
  }
  eval('this(' + arr + ')');
};
function test3(arg1, arg2, arg3) {
  console.log('接收到的参数:', arg1, arg2, arg3);
}
test3.call2(null, 1, 'a', [{ name: 'zhangsan' }, true]); //null 1 a
```

看到结果的那一刻,终于把这个参数问题解决了.

所以再回顾一下我们让`eval`函数做了什么.记住就一句话 **让它解析字符串**,把上面的示例写的再直观一点(拼接字符串的形式)

```javascript
Function.prototype.call2 = function () {
  var str = '';
  for (var i = 0, len = arguments.length; i < len; i++) {
    str += 'arguments[' + i + '],';
  }
  str = str.substring(0, str.length - 1);
  eval('this(' + str + ')');
};
function test3(arg1, arg2, arg3) {
  console.log('接收到的参数:', arg1, arg2, arg3);
}
test3.call2(null, 1, 'a', [{ name: 'zhangsan' }, true]); //null 1 a
```

**关于参数处理部分在啰嗦一点点**

1. `eval('this(str)')`

2. `eval('this('+str+')')`

```javascript
Function.prototype.call2 = function () {
  var str = '';
  for (var i = 0, len = arguments.length; i < len; i++) {
    str += 'arguments[' + i + '],';
  }
  str = str.substring(0, str.length - 1);
  console.log('1.', 'this(str)'); //this(str)
  console.log('2.', 'this(' + str + ')'); //this(arguments[0],arguments[1],arguments[2],arguments[3])
};
function test3(arg1, arg2, arg3) {
  console.log('接收到的参数:', arg1, arg2, arg3);
}
test3.call2(null, 1, 'a', [{ name: 'zhangsan' }, true]);
```

上面两种方式是完全不同的解析效果
**第一种`'this(str)'`整体是字符串,传递给`eval('this(str)')`函数.**
**第二种`'this('+str+')'`先对变量`str`进行解析,然后把整体作为字符串传递给`eval('this(arguments[0],arguments[1],arguments[2],arguments[3])')`函数.**

最后纠正一点,调用原生`call`方法时不会把第一个参数传递给函数的,所以这里`call2`方法内的`for`循环下标我们从 1 开始(后面讲解第一个参数的处理).

```javascript
//原生call示例
function test(arg1) {
  console.log('接收到的参数:', arg1);
}
test.call(null, 1); //1
function test2(arg1, arg2) {
  console.log('接收到的参数:', arg1, arg2);
}
test2.call(null, 1, 'a'); //1 a

function test3(arg1, arg2, arg3) {
  console.log('接收到的参数:', arg1, arg2, arg3);
}
test3.call(null, 1, 'a', [{ name: 'zhangsan' }, true]); //1 a [{name:"zhangsan"},true]
```

```javascript
//模拟实现示例
Function.prototype.call2 = function () {
  var arr = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    arr.push('arguments[' + i + ']');
  }
  eval('this(' + arr + ')');
};
function test(arg1) {
  console.log('接收到的参数:', arg1);
}
test.call2(null, 1); //1
function test2(arg1, arg2) {
  console.log('接收到的参数:', arg1, arg2);
}
test2.call2(null, 1, 'a'); //1 a

function test3(arg1, arg2, arg3) {
  console.log('接收到的参数:', arg1, arg2, arg3);
}
test3.call2(null, 1, 'a', [{ name: 'zhangsan' }, true]); //1 a [{name:"zhangsan"},true]
```

关于参数部分只能品.细品...不能再啰里八嗦...

4. 第一个参数处理

上面罗列 1.2.3 点对第一个参数始终避而不谈,单列第 4 点介绍看来距离原生`call`的实现越来越近了.

回顾一下华为粉和水果粉的例子,如果换成`call2`方法看能实现多少.

```javascript
Function.prototype.call2 = function () {
  var arr = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    arr.push('arguments[' + i + ']');
  }
  eval('this(' + arr + ')');
};

//示例一
var huawei = { name: '华为', price: 0 }; //华为粉
var shuiguo = { name: '水果', price: 0 }; //水果粉
/**
 * 计算器
 *
 * @param {Number} args 价格
 * @returns 总价
 */
function calc(args = 0) {
  this.price = args;
  console.log(`手机品牌:${this.name};已投资:${this.price}`);
  return this.price;
}

console.log(calc.call2(huawei, 3500)); //手机品牌:;已投资:3500
console.log(calc.call2(shuiguo, 1299)); //手机品牌:;已投资:1299
```

看到输出结果好吧,又要开始啰嗦了...目前为止我们在`call2`内没有对第一个参数做任何处理,所以能输出正确结果的话直播吃...

那输出结果为什么已投资会显示而手机品牌缺失了,那我们先分析一下这种情况产生的原因,既然`calc`函数内输出了`this.price`那直接打印`console.log(this)`看一下指向哪里便明白了.

```javascript
Function.prototype.call2 = function () {
  var arr = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    arr.push('arguments[' + i + ']');
  }
  eval('this(' + arr + ')');
};

//示例一
var huawei = { name: '华为', price: 0 }; //华为粉
var shuiguo = { name: '水果', price: 0 }; //水果粉
/**
 * 计算器
 *
 * @param {Number} args 价格
 * @returns 总价
 */
function calc(args = 0) {
  this.price = args;
  console.log(this); //Window
  console.log(`手机品牌:${this.name};已投资:${this.price}`);
  return this.price;
}

console.log(calc.call2(huawei, 3500)); //手机品牌:;已投资:3500
console.log(calc.call2(shuiguo, 1299)); //手机品牌:;已投资:1299
```

`this`指向了`Window`对象,也就是说`this.price`挂载到了`Window`对象上,间接的说明`call2`方法内如果不对第一个参数做任何处理,`calc`函数上下文`this`直接指向全局对象.

我们再看调用原生`call`方法时,`calc`函数内的`this`指向.

```javascript
//示例一
var huawei = { name: '华为', price: 0 }; //华为粉
var shuiguo = { name: '水果', price: 0 }; //水果粉
/**
 * 计算器
 *
 * @param {Number} args 价格
 * @returns 总价
 */
function calc(args = 0) {
  this.price = args;
  console.log(this);
  console.log(`手机品牌:${this.name};已投资:${this.price}`);
  return this.price;
}

console.log(calc.call(huawei, 3500)); //{name: "华为", price: 3500}//手机品牌:华为;已投资:3500
console.log(calc.call(shuiguo, 1299)); //{name: "水果", price: 1299}//手机品牌:水果;已投资:1299
```

执行`calc.call(huawei, 3500)`时`this`指向了`huawei`,执行`calc.call(shuiguo, 1299)`时`this`指向了`shuiguo`,根据输出结果说明原生`call`方法内把上下文`this`指向了第一个参数,在验证之前想一个问题如果没有使用`call`方法的情况下该怎么做.

```javascript
//示例一
var huawei = {
  name: '华为',
  price: 0,
  calc: function (args = 0) {
    this.price = args;
    console.log(this);
    console.log(`手机品牌:${this.name};已投资:${this.price}`);
    return this.price;
  },
}; //华为粉

var shuiguo = {
  name: '水果',
  price: 0,
  calc: function (args = 0) {
    this.price = args;
    console.log(this);
    console.log(`手机品牌:${this.name};已投资:${this.price}`);
    return this.price;
  },
}; //水果粉

console.log(huawei.calc(3500)); //{name: "华为", price: 3500}//手机品牌:华为;已投资:3500
console.log(shuiguo.calc(1299)); //{name: "水果", price: 1299}//手机品牌:水果;已投资:1299
```

上面的示例演示了对象`huawei` `shuiguo`分别有自己的`calc`方法并且各自调用输出结果正确,我们看`call2`目前具备哪些前提条件

1. 第一个参数(如`huawei` `shuiguo`对象)
2. 获取函数可执行
3. 能正确参数传递

是不是把 2.函数作为 1.第一个参数的一个方法,类似上面的示例就能正确输出接下来验证一下.

```javascript
Function.prototype.call2 = function () {
  //获取第一个参数
  var context = arguments[0] || window;
  //定义一个函数名(函数名与外部调用传递的名称一致只是加了前缀与后缀)
  var fnName = '__' + this.name + '__';
  //对象下挂载该函数
  context[fnName] = this;
  var arr = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    arr.push('arguments[' + i + ']');
  }
  eval('context[fnName](' + arr + ')');
};

//示例一
var huawei = { name: '华为', price: 0 }; //华为粉
var shuiguo = { name: '水果', price: 0 }; //水果粉
/**
 * 计算器
 *
 * @param {Number} args 价格
 * @returns 总价
 */
function calc(args = 0) {
  this.price = args;
  console.log(`手机品牌:${this.name};已投资:${this.price}`);
  return this.price;
}

console.log(calc.call2(huawei, 3500)); //手机品牌:华为;已投资:3500
console.log(calc.call2(shuiguo, 1299)); //手机品牌:水果;已投资:1299
```

一个模拟的`call`基本功能已实现,剩下的就是逐步完善,列清单查漏补缺.

1. 函数存在返回值的情况
2. `call2`内部给第一个参数挂载函数之后,需要删除(因为第一个参数本身没有此函数,是主动挂载,所以最后需要删除)
3. `call2`内部对第一参数做类型判断

```javascript
Function.prototype.call2 = function () {
  //获取第一个参数
  var context = arguments[0];
  if (null === context || undefined === context) {
    context = window; //指向全局对象
  } else if (['string', 'number', 'boolean'].indexOf(typeof context) != -1) {
    context = Object(context); //像原生call一样指向包装对象
  }
  //定义一个函数名(函数名与外部调用传递的名称一致只是加了前缀与后缀)
  var fnName = '__' + this.name + '__';
  //第一个参数挂载该函数
  context[fnName] = this;
  //判断是否挂载成功(如第一个参数类型是Symbol)
  if (!context[fnName]) {
    context = Object(context);
    context[fnName] = this;
  }
  var arr = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    arr.push('arguments[' + i + ']');
  }
  var result = eval('context[fnName](' + arr + ')');
  delete context[fnName];
  return result;
};

//测试
function test(v) {
  console.log(this);
  return v;
}
console.log(test.call2()); //Window
console.log(test.call2(undefined)); //Window
console.log(test.call2(null)); ////Window
console.log(test.call2(1)); //Number
console.log(test.call2('a')); //String
console.log(test.call2(false)); //Boolean
console.log(test.call2({ name: 'zhangsan' })); //{ name: "zhangsan" }
console.log(test.call2(/[1-9][0-9]*/)); ///[1-9][0-9]*/
console.log(test.call2(Symbol())); //Symbol
console.log(test.call2(new Set())); //Set
console.log(test.call2(new Map())); //Map
console.log(test.call2(this, 'hello')); //Window
```

至此一个不完美的模拟实现`call`完成了.

```javascript
Function.prototype.call2 = function () {
  var context = arguments[0];
  if (null === context || undefined === context) {
    context = window;
  } else if (['string', 'number', 'boolean'].indexOf(typeof context) != -1) {
    context = Object(context);
  }
  var fnName = '__' + this.name + '__';
  context[fnName] = this;
  if (!context[fnName]) {
    context = Object(context);
    context[fnName] = this;
  }
  var arr = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    arr.push('arguments[' + i + ']');
  }
  var result = eval('context[fnName](' + arr + ')');
  delete context[fnName];
  return result;
};
```

针对`call`啰嗦了 N 多,愿 `apply` 三言两语

### apply

#### 定义

**apply() 方法调用一个具有给定 this 值的函数，以及作为一个数组（或类似数组对象）提供的参数.**
定义、语法、更多示例参考 MDN:<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply>

示例之前我们还是先看一下`apply`方法能否实现`call`方法的效果.

```javascript
//示例一
var huawei = { name: '华为', price: 0 }; //华为粉
var shuiguo = { name: '水果', price: 0 }; //水果粉
/**
 * 计算器
 *
 * @param {Number} args 价格
 * @returns 总价
 */
function calc(args = 0) {
  this.price = args;
  console.log(`手机品牌:${this.name};已投资:${this.price}`);
  return this.price;
}

console.log(calc.apply(huawei, [3500])); //手机品牌:华为;已投资:3500
console.log(calc.apply(shuiguo, [1299])); //手机品牌:水果;已投资:1299
```

```javascript
//示例二
var huawei = { name: '华为', price: 0 }; //华为粉
var shuiguo = { name: '水果', price: 0 }; //水果粉
/**
 * 计算器
 *
 * @param {Number} arg1 价格1
 * @param {Number} arg2 价格2
 * @returns 总价
 */
function calc2(arg1 = 0, arg2 = 0) {
  this.price = arg1 + arg2;
  console.log(`手机品牌:${this.name};已投资:${this.price}`);
  return this.price;
}

console.log(calc2.apply(huawei, [3500, 5600])); //手机品牌:华为;已投资:9100
console.log(calc2.apply(shuiguo, [1299, 3299])); //手机品牌:水果;已投资:4598
```

通过示例说明`call`方法可以实现的`apply`方法也同样可以,我们开始示例.

#### 示例

华为粉和米粉的再次相遇

<font color=Crimson>华为粉:Are you OK? 假米粉</font>

<font color=MediumSeaGreen>米粉:为发烧而生!</font>

<font color=Crimson>华为粉:口号都喊上了,看来这次是遇到真爱</font>

<font color=MediumSeaGreen>米粉:上次那两个计算器不行,这次我们直接上科学计算器一决高下</font>

<font color=Crimson>华为粉:满足你,看来是脸不疼了</font>

```javascript
//apply 示例
var huawei = { name: '华为', price: 0 }; //华为粉
var xiaomi = { name: '小米', price: 0 }; //米粉
/**
 * 科学计算器
 *
 * @param {Number} arg1 价格
 * @returns 总价
 */
function calc() {
  this.price = Array.from(arguments).reduce((total, num) => {
    return total + num;
  });
  console.log(`手机品牌:${this.name};已投资:${this.price}`);
  return this.price;
}

console.log(calc.apply(huawei, [3500, 5600, 4188])); //手机品牌:华为;已投资:13288
console.log(calc.apply(xiaomi, [1299, 3299, 3999])); //手机品牌:小米;已投资:8597
console.log(calc.apply(huawei, [3500, 5600, 4188, 7988])); //手机品牌:华为;已投资:21276
console.log(calc.apply(xiaomi, [1299, 3299, 3999, 4999])); //手机品牌:小米;已投资:13596
```

<font color=Crimson>华为粉:Are you OK?</font>

<font color=MediumSeaGreen>米粉:来日方长...</font>

通过上面的示例说明`call`方法与`apply`方法只是第二个参数不同,可以总结为以下两点:

1. 第一个参数均表示`this`上下文.
2. `call`方法从第二个参数开始可以有多个参数,`apply`第二个参数只能为数组类型且没有更多参数.

#### 模拟实现

既然`apply`方法的定义明确表示只接收 2 个参数(第一个上下文`this`,第二个数组类型),那模拟的`apply2`方法就可以固定形参数量(不必要像`call2`方法因为参数不固定只能通过`arguments`获取).

```javascript
Function.prototype.apply2 = function (context, args) {
  if (null === context || undefined === context) {
    context = window; //指向全局对象
  } else if (['string', 'number', 'boolean'].indexOf(typeof context) != -1) {
    context = Object(context); //像原生call一样指向包装对象
  }
  //定义一个函数名(函数名与外部调用传递的名称一致只是加了前缀与后缀)
  var fnName = '__' + this.name + '__';
  //第一个参数挂载该函数
  context[fnName] = this;
  //判断是否挂载成功(如第一个参数类型是Symbol)
  if (!context[fnName]) {
    context = Object(context);
    context[fnName] = this;
  }
  var arr = [];
  if (Object.prototype.toString.call(args) === '[object Array]') {
    for (var i = 0, len = args.length; i < len; i++) {
      arr.push('args[' + i + ']');
    }
  }
  var result = eval('context[fnName](' + arr + ')');
  delete context[fnName];
  return result;
};
//测试
function test(v) {
  console.log(this);
  return v;
}
console.log(test.apply2());
console.log(test.apply2(undefined));
console.log(test.apply2(null));
console.log(test.apply2(1));
console.log(test.apply2('a'));
console.log(test.apply2(false));
console.log(test.apply2({ name: 'zhangsan' }));
console.log(test.apply2(/[1-9][0-9]*/));
console.log(test.apply2(Symbol()));
console.log(test.apply2(new Set()));
console.log(test.apply2(new Map()));
console.log(test.apply2(this, 'hello'));
console.log(test.apply2(this, ['hello']));
```

以上就是关于` call``apply `方法的示例和模拟实现,既然在使用上区别不大那性能方面是否会有所不同所以继续了解性能...

### 性能

#### 开源库如何使用call、apply

在开始性能测试之前,先看一下部分库的源码内是如何操作`call` `apply`方法.

```javascript
// backbone v1.4.10
var triggerEvents = function (events, args) {
  var ev,
    i = -1,
    l = events.length,
    a1 = args[0],
    a2 = args[1],
    a3 = args[2];
  switch (args.length) {
    case 0:
      while (++i < l) (ev = events[i]).callback.call(ev.ctx);
      return;
    case 1:
      while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1);
      return;
    case 2:
      while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2);
      return;
    case 3:
      while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
      return;
    default:
      while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
      return;
  }
};
```

```javascript
//lodash v4.17.15
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
```

```javascript
// underscore v1.10.2
function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1:
      return function (value) {
        return func.call(context, value);
      };
    // The 2-argument case is omitted because we’re not using it.
    case 3:
      return function (value, index, collection) {
        return func.call(context, value, index, collection);
      };
    case 4:
      return function (accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
  }
  return function () {
    return func.apply(context, arguments);
  };
}
```

以上列举的几个库源码内均根据参数数量判断调用`call` `apply`,所以以下分别对几种情况进行测试(本文使用`Benchmark`对两个方法做性能测试),以下性能测试示例分别运行了三次.

#### 无参数对比

```javascript
// 无参数对比
var suite = new Benchmark.Suite();
function test0() {}
function call0() {
  test0.call();
}
function apply0() {
  test0.apply();
}
suite
  .add('call无参数', () => {
    call0();
  })
  .add('apply无参数', () => {
    apply0();
  })
  .on('cycle', (ev) => {
    console.log('执行结果:', String(ev.target));
  })
  .on('complete', function () {
    console.log('较快的为:' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
```

ops/sec(执行(运转)次数(速度)/每秒),输出结果:
![](https://user-gold-cdn.xitu.io/2020/6/8/17292e6bbcf4a38a?w=667&h=63&f=png&s=25603)
![](https://user-gold-cdn.xitu.io/2020/6/8/17292e7cb19d8f0e?w=666&h=62&f=png&s=23551)
![](https://user-gold-cdn.xitu.io/2020/6/8/17292e7e096c34c3?w=666&h=61&f=png&s=24001)

#### 一个参数对比

```javascript
// 一个参数
var suite = new Benchmark.Suite();
function test1(arg1) {
  return arg1;
}
function call1() {
  test1.call(null, 'a');
}
function apply1() {
  test1.apply(null, ['a']);
}
suite
  .add('call一个参数', () => {
    call1();
  })
  .add('apply一个参数', () => {
    apply1();
  })
  .on('cycle', (ev) => {
    console.log('执行结果:', String(ev.target));
  })
  .on('complete', function () {
    console.log('较快的为:' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
```

ops/sec(执行(运转)次数(速度)/每秒),输出结果:
![](https://user-gold-cdn.xitu.io/2020/6/8/17292e54840f8459?w=666&h=59&f=png&s=22631)
![](https://user-gold-cdn.xitu.io/2020/6/8/17292e9a0222f2f4?w=667&h=60&f=png&s=22789)
![](https://user-gold-cdn.xitu.io/2020/6/8/17292e9b50a91b59?w=664&h=60&f=png&s=22621)

#### 两个参数对比

```javascript
//两个参数
var suite = new Benchmark.Suite();
function test2(arg1, arg2) {
  return arg1;
}
function call2() {
  test2.call(null, 'a', 2);
}
function apply2() {
  test2.apply(null, ['a', 2]);
}
suite
  .add('call两个参数', () => {
    call2();
  })
  .add('apply两个参数', () => {
    apply2();
  })
  .on('cycle', (ev) => {
    console.log('执行结果:', String(ev.target));
  })
  .on('complete', function () {
    console.log('较快的为:' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
```

ops/sec(执行(运转)次数(速度)/每秒),输出结果:
![](https://user-gold-cdn.xitu.io/2020/6/8/17292ea0d3c1f5b6?w=665&h=61&f=png&s=23450)
![](https://user-gold-cdn.xitu.io/2020/6/8/17292ea2a4edff3b?w=665&h=58&f=png&s=23615)
![](https://user-gold-cdn.xitu.io/2020/6/8/17292ea48cef7131?w=664&h=57&f=png&s=23781)

#### 三个参数对比

```javascript
//三个参数
var suite = new Benchmark.Suite();
function test3(arg1, arg2, arg3) {
  return arg1;
}
function call3() {
  test3.call(null, 'a', 2, { name: '华为', price: 0 });
}
function apply3() {
  test3.apply(null, ['a', 2, { name: '华为', price: 0 }]);
}
suite
  .add('call三个参数', () => {
    call3();
  })
  .add('apply三个参数', () => {
    apply3();
  })
  .on('cycle', (ev) => {
    console.log('执行结果:', String(ev.target));
  })
  .on('complete', function () {
    console.log('较快的为:' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
```

ops/sec(执行(运转)次数(速度)/每秒),输出结果:
![](https://user-gold-cdn.xitu.io/2020/6/8/17292eb818b80853?w=666&h=59&f=png&s=23422)
![](https://user-gold-cdn.xitu.io/2020/6/8/17292eb909707755?w=663&h=60&f=png&s=23103)
![](https://user-gold-cdn.xitu.io/2020/6/8/17292eb9c662ba13?w=662&h=60&f=png&s=23433)

#### 多个参数对比

```javascript
//多个参数
var suite = new Benchmark.Suite();
function testM(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
  return arg1;
}
function callM() {
  testM.call(
    null,
    'a',
    2,
    { name: '华为', price: 0 },
    new Set(),
    new Map(),
    true,
    Symbol()
  );
}
function applyM() {
  testM.apply(null, [
    'a',
    2,
    { name: '华为', price: 0 },
    new Set(),
    new Map(),
    true,
    Symbol(),
  ]);
}
suite
  .add('call多个参数', () => {
    callM();
  })
  .add('apply多个参数', () => {
    applyM();
  })
  .on('cycle', (ev) => {
    console.log('执行结果:', String(ev.target));
  })
  .on('complete', function () {
    console.log('较快的为:' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
```

ops/sec(执行(运转)次数(速度)/每秒),输出结果:
![](https://user-gold-cdn.xitu.io/2020/6/8/17292ec0ea69a309?w=660&h=59&f=png&s=23685)
![](https://user-gold-cdn.xitu.io/2020/6/8/17292ec1b537c748?w=661&h=59&f=png&s=23475)
![](https://user-gold-cdn.xitu.io/2020/6/8/17292ec27d241180?w=664&h=59&f=png&s=23221)

除了无参数之外,所有的测试无一例外都是`call`性能高于`apply`,所以可以从上面的模拟实现(看实现步骤有何不同)找一下`call`方法快的原因.

**至于 `call` `apply`方法如果在函数明确形参数量的情况下尽量使用`call`当然了开心就好.**

### 问答

> 调用`call`方法如果没有任何参数,那 `this` 会指向谁?

```javascript
function test() {
  console.log('this:', this);
}
console.log(test.call()); //this:Window
```

```javascript
'use strict';
function test() {
  console.log('this:', this);
}
console.log(test.call()); //this:undefined
```

**严格模式下 this 指向 undefined**

**严格模式下 this 指向 undefined**

**严格模式下 this 指向 undefined**

> 调用`call`方法参数为`null` `undefined`,又指向谁?

```javascript
function test() {
  console.log('this:', this);
}
console.log(test.call(null)); //this:Window
console.log(test.call(undefined)); //this:Window
```

非严格模式下参数为空或`null` `undefined` 的情况全部指向了全局 `Window`.

> 关于`call`返回值

调用`call`方法时,如果调用者没有返回值则默认返回 `undefined`;

```javascript
//函数没有返回值则返回undefined
function test() {}
var val = test.call();
console.log(val); //undefined
```

```javascript
//函数有返回值的情况
function test(v) {
  return v + 1;
}
var val = test.call(null, 16);
console.log(val); //17
```

如果仔细看一下上面的示例`calc` `calc2`函数也是具有返回值.

> `call`实现继承示例

```javascript
function Phone(name, model, price) {
  this.say = function () {
    console.log(`品牌:${name};型号:${model};价格:${price}`);
  };
}
function HuaWei(model, price) {
  Phone.call(this, 'huawei', model, price);
}

function XiaoMi(model, price) {
  Phone.call(this, 'xiaomi', model, price);
}

var huawei = new HuaWei('mate30', 3969);
huawei.say(); //品牌:huawei;型号:mate30;价格:3969
var xiaomi = new XiaoMi('xiaomi10', 3799);
xiaomi.say(); //品牌:xiaomi;型号:xiaomi10;价格:3799
```

上面的示例是基于 `call` 实现继承的一种方式,或者可以变为下面这种写法

```javascript
function Phone() {
  this.name = '';
  this.model = '';
  this.price = 0;
  this.say = function () {
    console.log(`品牌:${this.name};型号:${this.model};价格:${this.price}`);
  };
}
function HuaWei(model, price) {
  Phone.call(this);
  this.name = 'huawei';
  this.model = model;
  this.price = price;
}

function XiaoMi(model, price) {
  Phone.call(this);
  this.name = 'xiaomi';
  this.model = model;
  this.price = price;
}

var huawei = new HuaWei('mate30', 3969);
huawei.say(); //品牌:huawei;型号:mate30;价格:3969
var xiaomi = new XiaoMi('xiaomi10', 3799);
xiaomi.say(); //品牌:xiaomi;型号:xiaomi10;价格:3799
```

这种形式有个细节需要注意,在子类`HuaWei` `XiaoMi`函数体内如果把`Phone.call(this);`放在最后会输出什么结果？

```javascript
function HuaWei(model, price) {
  this.name = 'huawei';
  this.model = model;
  this.price = price;
  Phone.call(this);
}

function XiaoMi(model, price) {
  this.name = 'xiaomi';
  this.model = model;
  this.price = price;
  Phone.call(this);
}
```

> 模拟实现`call2`关于参数部分可以使用 es6 的扩展运算符...

```javascript
Function.prototype.call2 = function () {
  var arr = Array.from(arguments);
  this(...arr.slice(1));
};
function test(arg1) {
  console.log('接收到的参数:', arg1);
}
test.call2(null, 1); //1
function test2(arg1, arg2) {
  console.log('接收到的参数:', arg1, arg2);
}
test2.call2(null, 1, 'a'); //1 a

function test3(arg1, arg2, arg3) {
  console.log('接收到的参数:', arg1, arg2, arg3);
}
test3.call2(null, 1, 'a', [{ name: 'zhangsan' }, true]); //1 a [{name:"zhangsan"},true]
```

### 最后

网上有很多基于 es6 的实现,可以自行脑补.

以上章节就是目前对 `call` `apply`方法的理解,还望多多指教.
