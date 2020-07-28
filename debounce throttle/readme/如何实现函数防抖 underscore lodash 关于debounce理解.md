由于 markdown 排版问题建议从掘金阅读:<https://juejin.im/post/5f1fe9d4f265da22bb7b4b30>

### 目录

- 概念
- 实现
- 参考
  - debounce 之 underscore 篇
  - debounce 之 lodash 篇
- 完善
- 问答
- 总结

### 概念

关于防抖是没有标准定义的,所以只能意会...

**在某时间段内多次触发相同事件,仅执行一次触发的事件.**

这句话是什么意思呢?首先看日常生活中的挤地铁、公交场景.

![debounce-1](https://user-gold-cdn.xitu.io/2020/7/28/17394abd2878d013?w=227&h=389&f=gif&s=1358471)

![debounce-2](https://user-gold-cdn.xitu.io/2020/7/28/17394ac3739ea469?w=320&h=184&f=gif&s=1543746)

![debounce-3](https://user-gold-cdn.xitu.io/2020/7/28/17394ac858cb8c8d?w=210&h=241&f=gif&s=1714788)

在挤地铁、公交的时候,大家开始陆陆续续上车,司机师傅一定会等最后一个上车之后才关门发车(在整个过程中无论上多少个宝宝都无所谓,司机师傅只看最后一个宝宝有没有上车,才触发关门)驶向幼儿园方向.

这里我们将场景分解如下:

- 事件:关门发车
- 何时触发事件:每上一个宝宝之后 5 秒触发一次

注:如 1 号宝宝上车之后等待 5 秒关门,在这 5 秒期间 2、3 号宝宝陆续上车了,那么就以 3 号宝宝上车之后等待 5 秒关门,总之以最后一个宝宝上车之后等待 5 秒关门.

在开发中又有哪些场景需要使用呢？

浏览器窗口的缩放 resize 事件

![debounce-resize](https://user-gold-cdn.xitu.io/2020/7/28/17394ae13f8994a0?w=1100&h=692&f=gif&s=3197366)

浏览器滚动条 scroll 事件

![debounce-scroll](https://user-gold-cdn.xitu.io/2020/7/28/17394ae75ba7b948?w=708&h=678&f=gif&s=555762)

重要的事情有必要再说三遍:

**记住:防抖仅执行一次!**

**记住:防抖仅执行一次!**

**记住:防抖仅执行一次!**

根据上面的一些介绍,应该知道防抖用来解决某时间段内高频率触发相同事件而做的性能优化,所以没有什么特定的场景完全根据业务需求而定.

### 实现

介绍完概念相关后,我们一起看如何实现防抖.

我们以浏览器窗口缩放 resize 事件为场景梳理一个清单,看大概需要几个步骤:

1. 实现事件处理函数.

2. 使用 setTimeout 创建定时器,到时间触发处理函数.

3. 每次创建定时器之前,首先取消上次定时器.

```html
<html>
  <head>
    <title>resize</title>
    <script type="text/javascript">
      //正常操作无任何优化,拖拽缩放浏览器窗口会不断的触发事件处理函数.
      function resize() {
        console.log('触发缩放浏览器窗口resize事件.');
      }
      window.onresize = resize;
    </script>
  </head>
  <body>
    <p>改变浏览器窗口的大小触发resize事件.</p>
  </body>
</html>
```

实现事件处理函数.

```html
<html>
  <head>
    <title>resize</title>
    <script type="text/javascript">
      function resize() {
        console.log('触发缩放浏览器窗口resize事件.');
      }
      /**
       *
       * 防抖函数
       * @param {Function} fn 执行函数
       * @param {Number} wait 等待时间
       * @returns Function
       */
      function debounce(fn, wait) {
        return fn;
      }
      //这里强调一下window.onresize接收的是一个可执行函数.因为每次触发resize事件都需要调用可执行函数,所以执行debounce()函数返回值是一个可执行函数.
      window.onresize = debounce(resize, 3000);
    </script>
  </head>
  <body>
    <p>改变浏览器窗口的大小触发resize事件.</p>
  </body>
</html>
```

以上只是通过步骤分析创建了一个大体结构,接下来我们开始使用 setTimeout 创建定时器,到时间触发处理函数.

```html
<html>
  <head>
    <title>resize</title>
    <script type="text/javascript">
      function resize() {
        console.log('触发缩放浏览器窗口resize事件.');
      }
      /**
       *
       * 防抖函数
       * @param {Function} fn 执行函数
       * @param {Number} wait 等待时间
       * @returns Function
       */
      function debounce(fn, wait) {
        //由于之前直接返回 return fn(时间处理函数),没有添加定时器所以会高频率的触发事件处理函数.
        //这里return 返回匿名函数供onresize事件触发,虽然该匿名函数同样会被高频率的触发,但匿名函数内使用了定时器,降低了fn事件处理函数的频率,不信？你执行一下.
        return function () {
          console.log('----匿名函数---'); //会高频率的打印到控制台
          setTimeout(fn, wait); //使用定时器到时间执行fn函数(降低被触发的频率)
        };
      }
      //这里强调一下window.onresize接收的是一个可执行函数.因为每次触发resize事件都需要调用可执行函数,所以执行debounce()函数返回值是一个可执行函数.
      window.onresize = debounce(resize, 3000);
    </script>
  </head>
  <body>
    <p>改变浏览器窗口的大小触发resize事件.</p>
  </body>
</html>
```

如果执行过上面的代码效果应该和下面的动图差不多,对比`----匿名函数---`的输出频率会发现使用定时器执行的函数输出`触发缩放浏览器窗口resize事件.`的频率降低了很多...

![debounce-resize-settimeout](https://user-gold-cdn.xitu.io/2020/7/28/17394b16c03fd43c?w=786&h=620&f=gif&s=2098578)

至此回顾防抖概念**在某时间段内多次触发相同事件,仅执行一次触发的事件.**,虽然降低了频率但距离概念中提到的只执行一次触发事件还差第三步-每次创建定时器之前,首先取消上次定时器.

```html
<html>
  <head>
    <title>resize</title>
    <script type="text/javascript">
      function resize() {
        console.log('触发缩放浏览器窗口resize事件.');
      }
      /**
       *
       * 防抖函数
       * @param {Function} fn 执行函数
       * @param {Number} wait 等待时间
       * @returns Function
       */
      function debounce(fn, wait) {
        var timerId = null;
        //由于之前直接返回 return fn(时间处理函数),没有添加定时器所以会高频率的触发事件处理函数.
        //这里return 返回匿名函数供onresize事件触发,虽然该匿名函数同样会被高频率的触发,但匿名函数内使用了定时器,降低了fn事件处理函数的频率,不信？你执行一下.
        return function () {
          console.log('----匿名函数---'); //会高频率的打印到控制台
          if (timerId !== null) {
            clearTimeout(timerId); //取消之前创建的定时器
          }
          timerId = setTimeout(fn, wait); //设置此次定时器
        };
      }
      //这里强调一下window.onresize接收的是一个可执行函数.因为每次触发resize事件都需要调用可执行函数,所以执行debounce()函数返回值是一个可执行函数.
      window.onresize = debounce(resize, 3000);
    </script>
  </head>
  <body>
    <p>改变浏览器窗口的大小触发resize事件.</p>
  </body>
</html>
```

![debounce-resize-settimeout-2](https://user-gold-cdn.xitu.io/2020/7/28/17394bea9ff1bb2b?w=786&h=620&f=gif&s=4653137)

按照上面的三个步骤已全部实现了,在浏览器窗口不断缩放时创建的定时器函数不在像之前低频率执行,而是等浏览器窗口停止缩放后 3000ms(3 秒)才执行了缩放事件,这就是为什么需要第三步的存在.

### 参考

虽然实现了函数防抖的功能,但对比 underscore、lodash 对于 debounce 的实现还是差很多...所以我们先参考这两个库如何实现 debounce,在做完善.

#### debounce 之 underscore 篇

源码基于 v1.10.2 版本,直接在源码上添加理解注释.

```javascript
/**
 *
 * underscore. debounce 函数理解
 * @param {Function } 事件处理函数
 * @param {Number} wait 触发的时间
 * @param {Boolean} immediate 是否立即执行事件处理函数
 * @returns Function 可执行函数
 */
function debounce(func, wait, immediate) {
  //timeout记录定时器是否已创建
  //result记录func函数返回值(事件处理函数有可能会存在返回值的情况)
  var timeout, result;

  var later = function (context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  // 了解restArguments函数之前先看一下ES6的rest参数语法,参考https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters
  // restArguments是underscore提供的用来实现类似ES6 的rest参数语法的一个函数,此函数返回一个可执行的function
  // 这里调用restArguments函数只是用来对参数做处理(非重点),或者可以把它当作一个匿名函数即可.
  // var debounced=function(){}
  var debounced = restArguments(function (args) {
    //如果定时器存在则取消(这样无论触发多少次定时器,都会把之前的先取消下面重新开始设置定时器,以确保只触发一次定时器).
    if (timeout) clearTimeout(timeout);
    //按照我们上面介绍防抖概念时讲到防抖仅执行一次,配合挤公交、地铁场景会发现仅'执行的这一次'一般情况下是最后一次触发事件时执行,但确实存在首次触发事件即执行的业务场景.所以immediate参数是用来判断以下两种情况
    //true:1.第一次触发事件立即执行事件处理函数;
    //false:2.最后一次触发事件执行事件处理函数;
    //无论哪种情况还是那句话"防抖仅执行一次!"
    //我们直接看if内如何做到第一次触发事件立即执行事件处理函数,后面的全部取消的.
    if (immediate) {
      //既然进入if说明immediate=true需要立即执行
      //首先获取定时器是否存在
      var callNow = !timeout;
      //划重点-划重点-划重点
      //其次创建定时器,等待到时间触发事件处理函数,注意这里虽然触发了定时器,但later函数内if(args)永远为false,简单而言就是触发了定时器,定时器内的函数不会触发,因为通过setTimeout(later, wait)这种形式触发later函数是无法传递参数的,所以later函数内(context, args)皆为undefined;这样配合下面的if(callNow)便做到了首次触发之后,后面的全部取消(不执行).
      timeout = setTimeout(later, wait);
      //if(定时器不存在),不需要通过setTimeout设置定时器而是立即执行func函数,这样就做到了首次触发事件立即执行
      if (callNow) result = func.apply(this, args);
    } else {
      //delay作为underscore的工具函数,主要做了2件事情
      //1.调用restArguments对参数做处理
      //2.返回setTimeout
      //或者直观理解为timeout=setTimeout(later,wait);只不过这样无法给later传参数,所以这里delay函数内部把this、args参数通过restArguments传递later函数
      timeout = delay(later, wait, this, args);
    }
    //关于这个返回值啰嗦一下,如果immediate=true进入if会获取到result返回值;相反immediate=false,result一直为undefined
    //为什么会出现这种情况,由于进入if(immediate)会立即执行函数result = func.apply(this, args),所以会获取到返回值;而else内由于delay函数其实是一个setTimeout定时器,由于代码异步执行,还未等到触发时间,代码已经执行了return result;所以出现了result=undefined的情况.
    return result;
  });
  //添加静态方法,取消定时器
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}
```

对于源码的理解还需要多品一下...所以把上面的理解总结大概以下几点:

- 实现事件处理函数(debounced)

- 实现立即执行、最后一次执行(immediate)

- 处理参数

- 处理返回值

- 实现取消定时器(debounced.cancel)

#### debounce 之 lodash 篇

源码基于 v4.17.15 版本,直接在源码上添加理解注释.

```javascript
/**
 *
 * lodash. debounce 函数理解
 * @param {Function } 事件处理函数
 * @param {Number} wait 触发的时间
 * @param {Object} options 选项配置
 * @returns Function 可执行函数
 */
function debounce(func, wait, options) {
  var lastArgs,
    lastThis,
    maxWait, //最大等待时间(间隔时间),这个参数其实是作为节流使用的
    result,
    timerId,
    lastCallTime, //最后一次触发事件的时间(毫秒数)
    lastInvokeTime = 0, //最后一次执行事件处理函数的时间(毫秒数)
    leading = false, //首次触发事件则立即执行事件处理函数
    maxing = false, // 是否开启,根据该参数其实就是判断了是否开始节流模式
    trailing = true; //最后一次触发事件后,等到时间执行事件处理函数

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0; //等待时间
  if (isObject(options)) {
    leading = !!options.leading; //转换为Boolean类型
    maxing = 'maxWait' in options; //如果配置了最大等待时间说明要实现节流的效果,根据最大间隔时间来间断的触发事件
    maxWait = maxing
      ? nativeMax(toNumber(options.maxWait) || 0, wait)
      : maxWait; //设置最大间隔时间
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  /**
   *
   * 立即执行(调用)事件处理函数(func)
   * @param {Number} time 调用时间(毫秒数)
   * @returns
   */
  function invokeFunc(time) {
    var args = lastArgs,
      thisArg = lastThis;

    lastArgs = lastThis = undefined; //重置
    lastInvokeTime = time; //重置最后一次执行事件处理函数的时间=此次时间(毫秒数)
    result = func.apply(thisArg, args); //执行func
    return result;
  }
  /**
   * 划重点-划重点-划重点
   * 从函数名来此函数只负责判断首次触发事件是否需要调用invokeFunc函数(立即执行事件处理函数)
   * 但它还创建了一个定时器,为什么要做两件事情(1.判断是否立即执行事件函数;2.创建定时器)???
   * 做第一件事情是它的本分应该做的,第二件事情创建定时器是为了后续的操作铺路
   * 别忘了防抖函数debounce第三个参数是可以配置{leading:true,trailing:true}两个参数都为true的情况存在
   * 即leading:true首次触发事件立即执行事件处理函数,同时trailing:true最后一次触发事件后执行事件处理函数
   * 所以这里创建定时器是为后面的trailing:true的情况做准备.
   * 为什么会出现允许都为true的情况,可以看文章结尾问答部分第一问题
   * @param {Number} time 调用时间(毫秒数)
   * @returns
   */
  function leadingEdge(time) {
    lastInvokeTime = time; //重置最后一次执行事件处理函数的时间=此次时间(毫秒数)
    timerId = setTimeout(timerExpired, wait); //创建定时器
    //根据leading选项判断是否需要调用invokeFunc
    return leading ? invokeFunc(time) : result;
  }
  /**
   *
   * 计算触发setTimout的时间
   * @param {*} time
   * @returns
   */
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime,
      timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }
  /**
   *
   * 根据时间计算时差是否应该发起调用
   * @param {Number} time
   * @returns Boolean
   */
  function shouldInvoke(time) {
    //两次防抖时间差=本次触发防抖的时间-上次(最后一次)触发防抖的时间
    //(节流模式用到)事件处理函数时间差=本次触发防抖的时间-上次(最后一次)执行事件处理函数的时间
    var timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime;

    //以下对各种情况做判断,只要有一项返回true则发起调用
    //1. lastCallTime === undefined 如果值为undefined说明是首次触发(因为lastCallTime初始化为undefined)
    //2. timeSinceLastCall >= wait  两次防抖时间差大于设置的防抖函数等待时间,说明此次防抖与上次防抖不是同一批次防抖,而是又一次重新开始(啰嗦的比较绕),如下面的示例
    // 如定时器需要5秒后执行,在5秒期间不断触发debounced事件的时候,会计算这期间每次触发防抖事件的时间差,
    //如果时间差小于设置的等待时间5秒,则说明是在5秒内发生的事件返回false,相反如果大于5秒说明不是在1-5秒内发生的事件则返回ture
    //3. timeSinceLastCall < 0 时间难道不是下一秒永远大于上一秒吗？如果手动调整了系统时间穿越回去某一天了,那时差是不是就小于0了(过去某时间-现在某时间<0)
    //4. maxing && timeSinceLastInvoke >= maxWait maxing为true说明是设置了间隔时间(开启了节流模式),
    // timeSinceLastInvoke >= maxWait 判断事件处理函数的时间差是否大于设置的最大间隔事件.

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }
  /**
   *
   * 定时器到时间之后需要执行的函数 setTimeout(timerExpired, wait)
   * 不断的重新计算剩余时间
   * @returns
   */
  function timerExpired() {
    var time = now();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // 重新计算时间
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  /**
   *
   * 判断最后一次触发事件后是否需要调用invokeFunc函数(立即执行事件处理函数)
   * 默认trailing:true 采用最后一次触发事件后执行事件处理函数
   * @param {Number} time 调用时间(毫秒数)
   * @returns
   */
  function trailingEdge(time) {
    timerId = undefined;
    //根据trailing选项、lastArgs 判断是否需要调用invokeFunc
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }
  /**
   *
   * 取消定时器
   */
  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }
  /**
   *
   * 立即触发处理函数
   * @returns
   */
  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }
  /**
   *
   * 返回一个可执行函数
   * var debounced=function(){}
   * @returns
   */
  function debounced() {
    var time = now(),
      isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      //maxing设置间隔时间(节流模式)
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
```

### 完善

看过 lodash 的这段代码,原谅我词穷了...既然无法像 underscore、lodash 做的那么优秀,对于自己写的防抖至少应该补充完善以下几点:

- 配置首次触发立即执行函数或最后一次触发事件后执行函数

- 参数处理

- 返回值

```html
<html>
  <head>
    <title>resize</title>
    <script type="text/javascript">
      function resize() {
        console.log('触发缩放浏览器窗口resize事件.');
        return 'resize函数被调用了.';
      }
      /**
       *
       * 防抖函数
       * @param {Function} fn 执行函数
       * @param {Number} wait 等待时间
       * @param {Boolean} immediate 立即执行
       * @returns Function
       */
      function debounce(fn, wait, immediate) {
        var timerId = null;
        var result;
        //由于之前直接返回 return fn(时间处理函数),没有添加定时器所以会高频率的触发事件处理函数.
        //这里return 返回匿名函数供onresize事件触发,虽然该匿名函数同样会被高频率的触发,但匿名函数内使用了定时器,降低了fn事件处理函数的频率,不信？你执行一下.
        return function () {
          var that = this;
          var args = arguments;
          if (timerId !== null) {
            clearTimeout(timerId); //取消之前创建的定时器
          }
          if (immediate) {
            if (timerId === null) {
              //立即执行
              result = fn.apply(that, args);
            }
            //上面立即执行事件处理函数之后,创建定时器到时间设置timerId=null,
            //以保证wait期间内不断触发事件也不会执行,如果不这样设置上面的if无法判断timerId的状态会持续触发
            timerId = setTimeout(function () {
              timerId = null;
            }, wait);
          } else {
            timerId = setTimeout(function () {
              //这里即使通过result接收返回值,外部也无法接收到(原因同debounce 之 underscore 篇提到的一样)
              result = fn.apply(that, args);
            }, wait); //设置此次定时器
          }
          return result;
        };
      }
      //这里强调一下window.onresize接收的是一个可执行函数.因为每次触发resize事件都需要调用可执行函数,所以执行debounce()函数返回值是一个可执行函数.
      window.onresize = debounce(resize, 3000, false);
    </script>
  </head>
  <body>
    <p>改变浏览器窗口的大小触发resize事件.</p>
  </body>
</html>
```

### 问答

> 前面提到过防抖仅执行一次,为什么 lodash 版本的 `debounce` 可以通过参数配置首次触发事件执行事件处理函数+最后一次触发事件后执行事件处理函数

重要的事情再说一遍:**记住:防抖仅执行一次!**

无论是首次触发事件执行事件处理函数还是最后一次触发事件后执行事件处理函数,只是执行时间不同而已,不信你看 underscore 版本的防抖函数`debounce`第三个参数`immediate`只是用来判断实现立即执行或最后一次执行,不允许出现执行 2 次的情况存在.

再回到 lodash 版本的`debounce`,如果仔细看你会发现`debounce`第三个参数的默认配置`{leading:false,trailing :true}`,也就是说认可防抖仅执行一次的,之所以允许配置`{leading:true,trailing :true}`的情况存在是由于 lodash 的`throttle`节流函数的实现是通过调用`debounce`函数完成的,所以可以理解为`{leading:true,trailing :true,maxWait:1000}`此处的 2 个`true`和`maxWait`参数都是为节流函数提供的.

所以要使用 lodash 的防抖或节流需要配合业务场景,尽量少出现使用防抖的时候配置`{leading:false,trailing :true}`这种场景混用情况的存在.**(此场景属于每间隔一段时间执行一次事件处理函数应该使用节流函数)**

> underscore、 lodash 的防抖有什么不同之处.

underscore 更直接的循环使用**触发事件->取消定时器->设置定时器**;而 lodash 则通过计算时间差的方式设置定时器;

underscore 把防抖、节流分为 2 个独立的函数各司其职,而 lodash 的节流函数内部则是调用了防抖函数,通过配置项进行区分.

### 总结

以上就是对如何实现函数防抖 underscore lodash 关于 debounce 解析的理解,还望多多指教.
