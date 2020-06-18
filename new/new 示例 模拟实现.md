由于markdown排版问题建议从掘金阅读:<https://juejin.im/post/5eeb0c01518825659b308700>

### 目录

- new
  - 定义
  - 示例
  - 模拟实现
- 问答
- 最后

### new

#### 定义

**new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例.**
定义、语法、更多示例参考 MDN:<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new>

在定义中提到了以下两点:

1. 创建一个用户定义的对象类型的实例
2. 具有构造函数的内置对象的实例

定义往往都是短而精的一句话,需要我们通过语法、示例来转化理解,所以开启下面的啰哩啰嗦.

还是结合示例来解释一下定义中提到的两点指的是什么.

#### 示例

```javascript
//示例一 自定义构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}
var obj = new Person('xiaoming', 18);
console.log(obj instanceof Person); //true
```

```javascript
//示例一 自定义构造函数(class类写法)
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
var obj = new Person('xiaoming', 18);
console.log(obj instanceof Person); //true
```

示例一的两个例子描述了定义中提到的第一点**1.创建一个用户定义的对象类型的实例**.

- 自定义了一个 `Person` 构造函数(对象类型)
- 通过`new`运算符创建了`Person`构造函数的实例 `obj`.

为了验证`obj`是否属于`Person`类型,所以又通过`instanceof`运算符进行了校验.

```javascript
//示例二 内置函数
var arr = new Array();
var set = new Set();
var map = new Map();
console.log(arr instanceof Array); //true
console.log(set instanceof Set); //true
console.log(map instanceof Map); //true
```

示例二则验证了定义中的第二点**2. 具有构造函数的内置对象的实例**.

#### 模拟实现

在 MDN 中提到过关于`new`运算符的操作有如下 4 个步骤:

1. 创建一个空的简单 JavaScript 对象（即{}）
2. 链接该对象（即设置该对象的构造函数）到另一个对象
3. 将步骤 1 新创建的对象作为 this 的上下文
4. 如果该函数没有返回对象，则返回 this

所以我们按照这 4 步骤模拟看能否模拟出一个`new`,由于`new`是一个操作符而我们无法在 js 内新增一个操作符如`var obj=new2 Person()`;这个`new2`无法解析只能新增一个自定义函数`new2`模拟`new`的实现过程(也就说在自定义函数内实现上面的 4 个步骤).

```javascript
function new2(ctor) {
  //1.创建一个空的简单 JavaScript 对象（即{}）
  var obj = {};
  //2.链接该对象（即设置该对象的构造函数）到另一个对象
  obj.constructor = ctor;
  //3.将步骤 1 新创建的对象作为 this 的上下文
  var result = ctor.apply(obj, arguments);
  //4.如果该函数没有返回对象，则返回 this
  return typeof result === 'object' ? result : obj;
}
```

上面`new2`函数是按照 4 个步骤的字面意思大体写了一个模拟实现,接下来就是验证每一步.

首先看一下 MDN 关于`new`运算符的语法

`new constructor[([arguments])]`

`constructor`

一个指定对象实例的类型的类或函数.

`arguments`

一个用于被 constructor 调用的参数列表.

根据语法描述`constructor`表示的是一个类或函数(如上面示例一`new Person()`的`Person`必须是一个类或函数),`arguments`是一个参数列表也就是说参数个数不定,所以`new2`函数需要做两点操作(判断`ctor`参数是否为函数、获取参数列表)

```javascript
/**
 *
 *
 * @param {Function} ctor 一个指定对象实例的类型的类或函数
 * @returns object
 */
function new2(ctor) {
  var FILTERLIST = ['Symbol', 'BigInt']; //基本数据类型(这两个类型构造函数属于function但不可以使用new创建所以需要排除)
  //先判断是否为函数,如果不是函数则无法创建实例
  if (
    typeof ctor !== 'function' ||
    (typeof ctor === 'function' && FILTERLIST.indexOf(ctor.name) !== -1)
  ) {
    throw new TypeError(ctor + ' is not a constructor');
  }
  //获取参数列表
  var args = Array.prototype.slice.call(arguments, 1);
  //1.创建一个空的简单 JavaScript 对象（即{}）
  var obj = {};
  //2.链接该对象（即设置该对象的构造函数）到另一个对象
  obj.constructor = ctor;
  //3.将步骤 1 新创建的对象作为 this 的上下文
  var result = ctor.apply(obj, args); //参数列表args传递给ctor函数
  //4.如果该函数没有返回对象，则返回 this
  return typeof result === 'object' ? result : obj;
}
```

解决了语法中提到的两个问题之后,需要验证一下`new2`还存在哪些问题.

```javascript
function new2(ctor) {
  var FILTERLIST = ['Symbol', 'BigInt']; //基本数据类型(这两个类型构造函数属于function但不可以使用new创建所以需要排除)
  //先判断是否为函数,如果不是函数则无法创建实例
  if (
    typeof ctor !== 'function' ||
    (typeof ctor === 'function' && FILTERLIST.indexOf(ctor.name) !== -1)
  ) {
    throw new TypeError(ctor + ' is not a constructor');
  }
  //获取参数列表
  var args = Array.prototype.slice.call(arguments, 1);
  //1.创建一个空的简单 JavaScript 对象（即{}）
  var obj = {};
  //2.链接该对象（即设置该对象的构造函数）到另一个对象
  obj.constructor = ctor;
  //3.将步骤 1 新创建的对象作为 this 的上下文
  var result = ctor.apply(obj, args); //参数列表args传递给ctor函数
  //4.如果该函数没有返回对象，则返回 this
  return typeof result === 'object' ? result : obj;
}
function Person(name, age) {
  this.name = name;
  this.age = age;
}
var obj = new2(Person, 'xiaoming', 18);
console.log(obj.name); //xiaoming
console.log(obj.age); //18
console.log(obj instanceof Person); //false

function Phone(name) {
  this.name = name;
}
var huawei = new2(Phone, 'huawei');
console.log(huawei.name); //huawei
console.log(huawei instanceof Phone); //false

console.log(new2(1)); //TypeError
console.log(new2('name')); //TypeError
console.log(new2(Symbol)); //TypeError
console.log(new2(BigInt)); //TypeError
```

示例中演示了调用`new2`函数的几种情况

1. 传不同的对象实例类型如`new2(Person)` `new2(Phone)`
2. 传多个参数如`new2(Person, 'xiaoming', 18)` `new2(Phone, 'huawei')`
3. 禁止创建非函数实例如`new2(1)` `new2('name')`

如果仔细看的话,会发现`obj instanceof Person` `huawei instanceof Phone`均为`false`而调用原生`new`则是`true`,所以还需要接着看问题出在了哪里.

首先查看`instanceof`运算符的定义**instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上**

定义、语法、更多示例参考 MDN:<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof>

再看 MDN 的示例发现问题出现在了第 2 个步骤**2.链接该对象（即设置该对象的构造函数）到另一个对象**按照字面意思的理解写成了`obj.constructor = ctor;`
但实例与构造函数之间是通过`实例.__proto__=构造函数.prototype`存在关系的(实例的原型链指向构造函数的原型).所以改为了`obj.__proto__=ctor.prototype`之后又测试了一次.

**或者可以使用`Object.setPrototypeOf(obj, ctor.prototype)`代替`obj.__proto__=ctor.prototype`这种写法.**

**或者可以使用`Object.setPrototypeOf(obj, ctor.prototype)`代替`obj.__proto__=ctor.prototype`这种写法.**

**或者可以使用`Object.setPrototypeOf(obj, ctor.prototype)`代替`obj.__proto__=ctor.prototype`这种写法.**

```javascript
function new2(ctor) {
  var FILTERLIST = ['Symbol', 'BigInt']; //基本数据类型(这两个类型构造函数属于function但不可以使用new创建所以需要排除)
  //先判断是否为函数,如果不是函数则无法创建实例
  if (
    typeof ctor !== 'function' ||
    (typeof ctor === 'function' && FILTERLIST.indexOf(ctor.name) !== -1)
  ) {
    throw new TypeError(ctor + ' is not a constructor');
  }
  //获取参数列表
  var args = Array.prototype.slice.call(arguments, 1);
  //1.创建一个空的简单 JavaScript 对象（即{}）
  var obj = {};
  //2.链接该对象（即设置该对象的构造函数）到另一个对象
  obj.__proto__ = ctor.prototype;
  //3.将步骤 1 新创建的对象作为 this 的上下文
  var result = ctor.apply(obj, args); //参数列表args传递给ctor函数
  //4.如果该函数没有返回对象，则返回 this
  return typeof result === 'object' ? result : obj;
}
function Person(name, age) {
  this.name = name;
  this.age = age;
}
var obj = new2(Person, 'xiaoming', 18);
console.log(obj.name); //xiaoming
console.log(obj.age); //18
console.log(obj instanceof Person); //true

function Phone(name) {
  this.name = name;
}
var huawei = new2(Phone, 'huawei');
console.log(huawei.name); //huawei
console.log(huawei instanceof Phone); //true
```

步骤 2 就这样解决了(看来之前对字面理解有误...),关于步骤 3 改变`this`指向则直接使用了`apply`方法.
之前写过关于**call apply 示例 模拟实现 性能**的文章感兴趣可以看一下<https://juejin.im/post/5eddb2c86fb9a047b11b5c67>

关于步骤 4**如果该函数没有返回对象，则返回 this** 可能啰嗦的比较多一点(没看错关于一个返回值竟然要啰嗦 N 多),还是先通过示例看原生`new`是怎么处理返回值.

```javascript
//没有返回值
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.say = function () {
  console.log('name:', this.name);
};
var p = new Person('xiaoming', 18);
console.log(p.say()); //name:xiaoming
```

```javascript
//返回值为基本(原始)数据类型
function Person(name, age) {
  this.name = name;
  this.age = age;
  return 'hello';
}
Person.prototype.say = function () {
  console.log('name:', this.name);
};
var p = new Person('xiaoming', 18);
console.log(p.say()); //name:xiaoming
```

```javascript
//返回值为基本(原始)数据类型 Symbol
function Person(name, age) {
  this.name = name;
  this.age = age;
  return Symbol(1);
}
Person.prototype.say = function () {
  console.log('name:', this.name);
};
var p = new Person('xiaoming', 18);
console.log(p.say()); //name:xiaoming
```

```javascript
//返回值为复合(对象)类型
function Person(name, age) {
  this.name = name;
  this.age = age;
  return {
    score: 100,
  };
}
Person.prototype.say = function () {
  console.log('name:', this.name);
};
var p = new Person('xiaoming', 18);
console.log(p.name); //undefined
console.log(p.age); //undefined
console.log(p.score); //100
console.log(p.say()); //TypeError:p.say is not a function
```

```javascript
//返回值为复合(对象)类型
function Person(name, age) {
  this.name = name;
  this.age = age;
  return [];
}
Person.prototype.say = function () {
  console.log('name:', this.name);
};
var p = new Person('xiaoming', 18);
console.log(p); //[]
console.log(p instanceof Array); //true
console.log(p.say()); //TypeError:p.say is not a function
```

```javascript
//返回值为复合(对象)类型
function Person(name, age) {
  this.name = name;
  this.age = age;
  return Map;
  // return Symbol;
  // return new String("1");
}
Person.prototype.say = function () {
  console.log('name:', this.name);
};
var p = new Person('xiaoming', 18);
console.log(p); //
console.log(p.say()); //TypeError:p.say is not a function
```

看了上面那么多关于返回值的示例我们来总结一下:

1. 无返回值,则返回`this`(这里的`this`指的就是步骤 1 提到的`new`内部的新建的对象`var obj={}`,该对象的`obj.__proto__=构造函数.prototype`原型链指向了构造函数的原型所以只有返回该对象,外部才可以调用原型链上的方法如示例`p.say()`)
2. 返回值为基本(原始)数据类型,对这种返回结果不做任何处理返回`this`(可以理解为和第一点)
3. 返回值为复合(对象)类型,直接返回结果不对外返回`this`,**所以外部就无法使用原型链上的方法如示例`p.say()`直接抛错**

从第三点延伸一点**一般情况下构造函数内是不需要有返回值的**

既然我们总结完步骤 4 需要处理的返回值,所以需要对模拟实现修改一下.

```javascript
function new2(ctor) {
  var FILTERLIST = ['Symbol', 'BigInt']; //基本数据类型(这两个类型构造函数属于function但不可以使用new创建所以需要排除)
  //先判断是否为函数,如果不是函数则无法创建实例
  if (
    typeof ctor !== 'function' ||
    (typeof ctor === 'function' && FILTERLIST.indexOf(ctor.name) !== -1)
  ) {
    throw new TypeError(ctor + ' is not a constructor');
  }
  //获取参数列表
  var args = Array.prototype.slice.call(arguments, 1);
  //1.创建一个空的简单 JavaScript 对象（即{}）
  var obj = {};
  //2.链接该对象（即设置该对象的构造函数）到另一个对象
  obj.__proto__ = ctor.prototype;
  //3.将步骤 1 新创建的对象作为 this 的上下文
  var result = ctor.apply(obj, args); //参数列表args传递给ctor函数
  //4.如果该函数没有返回对象，则返回 this
  return result instanceof Object ||
    (!(result instanceof Object) &&
      typeof result === 'object' &&
      typeof result.toString === 'undefined')
    ? result
    : obj;
}
```

无注释版本

```javascript
function new2(ctor) {
  var FILTERLIST = ['Symbol', 'BigInt'];
  if (
    typeof ctor !== 'function' ||
    (typeof ctor === 'function' && FILTERLIST.indexOf(ctor.name) !== -1)
  ) {
    throw new TypeError(ctor + ' is not a constructor');
  }
  var args = Array.prototype.slice.call(arguments, 1);
  var obj = {};
  obj.__proto__ = ctor.prototype;
  var result = ctor.apply(obj, args);
  return result instanceof Object ||
    (!(result instanceof Object) &&
      typeof result === 'object' &&
      typeof result.toString === 'undefined')
    ? result
    : obj;
}
```

以上便是模拟实现的整个过程,`new2`函数和原生`new`运算符可能还有一些差别但整体效果应该无异.

### 问答

> JavaScript 为什么存在`new`运算符

首先 JavaScript 语言是支持面向对象(Object-oriented programming,OOP)编程的,在 JavaScript 用一种称为构建函数的特殊函数(注:一个构建函数通常是大写字母开头，这样便于区分构建函数和普通函数)来定义对象和它们的特征.

通过使用`new`运算符基于构造函数创建出需要的对象(实例),将对象的数据和特征函数按需联结至相应对象.

参考 MDN:<https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Object-oriented_JS>

仔细想一下自己常用的 jQuery、underscore、lodash 为什么都是返回一个函数而不是一个普通的`{}`对象,是不是也支持面向对象的形式调用呢？

> `new2`函数是如何处理参数的?

需要明确一点,自定义的构造函数接收的参数个数是不固定的,如`function Person(name,age){}` `function Phone(name){}`,所以`new2`函数无法固定形参数量如`function new2(arg1)` `function new2(arg1,arg2)` `function new2(arg1,arg2,arg3)`这里唯一确定的第一个参数必须是函数类型所以`new2`函数只写了一个形参,其它参数均通过`arguments`获取(当然也可以一个形参都不写,全部通过`arguments`获取)然后进行处理.

> `new2`函数对返回值的处理看上去为什么那么繁琐.

原生`new`运算符对返回值如何处理无从得知可能更复杂一点,但上面通过示例总结的关于返回值的 3 点内容就说明确实需要一些处理.

1. 为什么开始使用的是`return typeof result === 'object' ? result : obj;`

起初根据步骤 4 字面意思**如果该函数没有返回对象，则返回 this**所以直接使用`typeof`区别了基本(原始)数据类型和其他任何对象`object`,在
一般情况下还是可以处理的如下面示例

```javascript
function new2(ctor) {
  var FILTERLIST = ['Symbol', 'BigInt'];
  if (
    typeof ctor !== 'function' ||
    (typeof ctor === 'function' && FILTERLIST.indexOf(ctor.name) !== -1)
  ) {
    throw new TypeError(ctor + ' is not a constructor');
  }
  var args = Array.prototype.slice.call(arguments, 1);
  var obj = {};
  obj.__proto__ = ctor.prototype;
  var result = ctor.apply(obj, args);
  return typeof result === 'object' ? result : obj;
}
function Person(name, age) {
  this.name = name;
  this.age = age;
  // return "name";
  // return Symbol(1);
  //以上为基本(原始)数据类型,以下为typeof 'object'
  // return new String('1');
  // return new Number(1);
  // return {};
  // return [1,2,3];
  // return new Map();
}
Person.prototype.say = function () {
  console.log('name:', this.name);
};
var p1 = new Person('xiaoming', 18);
var p2 = new2(Person, 'xiaoming', 18);
console.log(p1, p2);
```

像上面这种普通的返回值原生`new`运算符和自定义`new2`函数结果是一样的(此处暂且忽略处理`return null`后面会讲到),使用`typeof`可以满足但如果返回值是一个`function`呢？如下面的示例

```javascript
function new2(ctor) {
  var FILTERLIST = ['Symbol', 'BigInt'];
  if (
    typeof ctor !== 'function' ||
    (typeof ctor === 'function' && FILTERLIST.indexOf(ctor.name) !== -1)
  ) {
    throw new TypeError(ctor + ' is not a constructor');
  }
  var args = Array.prototype.slice.call(arguments, 1);
  var obj = {};
  obj.__proto__ = ctor.prototype;
  var result = ctor.apply(obj, args);
  return typeof result === 'object' ? result : obj;
}
function Person(name, age) {
  this.name = name;
  this.age = age;
  return Array;
  return Symbol;
  return function () {};
  return Map;
}
Person.prototype.say = function () {
  console.log('name:', this.name);
};
var p1 = new Person('xiaoming', 18);
var p2 = new2(Person, 'xiaoming', 18);
console.log(p1, p2);
```

这种返回值原生`new`运算符会作为对象一样返回(上面讲第四步骤示例**返回值为复合(对象)类型**也介绍过),而自定义`new2`函数使用`typeof`运算符判断不符合对象`typeof Array //function`与原生`new`运算符结果不符,所以需要改进对返回值的判断,使用`instanceof`运算符把`Array instanceof Object` `Symbol instanceof Object`都归为对象——(还是看如何理解第 4 步骤中提到**如果该函数没有返回对象，则返回 this**对象的含义)

2. 使用`instanceof`运算符,为什么还需要繁琐的判断?

```javascript
function new2(ctor) {
  var FILTERLIST = ['Symbol', 'BigInt'];
  if (
    typeof ctor !== 'function' ||
    (typeof ctor === 'function' && FILTERLIST.indexOf(ctor.name) !== -1)
  ) {
    throw new TypeError(ctor + ' is not a constructor');
  }
  var args = Array.prototype.slice.call(arguments, 1);
  var obj = {};
  obj.__proto__ = ctor.prototype;
  var result = ctor.apply(obj, args);
  return result instanceof Object ? result : obj;
}
```

上面 1.提到过稍后介绍`null`这种特殊情况,之前在使用`typeof`运算符时,如果返回值是`return null`的话`typeof null //"object"`判断是`"object"`
判断有误所以需要改进`return typeof result ==='object' ? result||obj : obj;`对`typeof`判断为`'object'`的结果再做一次判断`result||obj`
但现在使用`instanceof`运算符可以忽略这个判断了(因为 `null instanceof Object`为`false`).

但是,但是来了,`return Object.create(null)`这种情况的存在该如何处理?

先看原生`new`运算符的示例

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  return Object.create(null);
}
Person.prototype.say = function () {
  console.log('name:', this.name);
};
var p1 = new Person('xiaoming', 18);
console.log(p1); //{}
```

把它判断为对象返回了,既然这样我们的`instanceof`运算符会怎么判断这个呢？`Object.create(null) instanceof Object //false`不符合对象,虽然是通过`Object.create`创建的但就是不符合对象,(因为通过`Object.create(null)`创建出来的对象没有继承更没有任何属性、方法比如`toString`方法),既然`new`把它作为对象可以返回,那`instanceof`运算符判断为`false`也是要保持与`new`一致把对象返回,所以才会出现`(!(result instanceof Object) &&typeof result ==='object' &&typeof result.toString === 'undefined')`这种判断方式(用来处理`Object.create(null)`这种情况的存在).

```javascript
function new2(ctor) {
  var FILTERLIST = ['Symbol', 'BigInt'];
  if (
    typeof ctor !== 'function' ||
    (typeof ctor === 'function' && FILTERLIST.indexOf(ctor.name) !== -1)
  ) {
    throw new TypeError(ctor + ' is not a constructor');
  }
  var args = Array.prototype.slice.call(arguments, 1);
  var obj = {};
  obj.__proto__ = ctor.prototype;
  var result = ctor.apply(obj, args);
  return result instanceof Object ||
    (!(result instanceof Object) &&
      typeof result === 'object' &&
      typeof result.toString === 'undefined')
    ? result
    : obj;
}
function Person(name, age) {
  this.name = name;
  this.age = age;
  return Object.create(null);
}
Person.prototype.say = function () {
  console.log('name:', this.name);
};
var p1 = new Person('xiaoming', 18);
var p2 = new2(Person, 'xiaoming', 18);
console.log(p1, p2); //{} {}
```

### 最后

以上章节就是目前对 `new`运算符的理解,还望多多指教.
