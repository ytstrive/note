开始之前建议先看一下之前写的一遍关于**如何实现函数防抖 underscore lodash 关于 debounce 的理解**的文章
链接地址:<https://juejin.im/post/5f1fe9d4f265da22bb7b4b30>

由于 markdown 排版问题建议从掘金阅读:<https://juejin.im/post/6861851053139492872>

### 目录

- 概念
- 实现
- 参考
  - throttle 之 underscore 篇
  - throttle 之 lodash 篇
- 完善
- 问答
- 总结

### 概念

关于节流是没有标准定义的,所以只能意会...

**在某时间段内多次触发相同事件,则每间隔一段时间执行一次事件.**

最直白的描述可以理解为家里的水龙头以固定的间隔时间嘀嗒嘀嗒...称为节流.

现实生活中有哪些场景？看一下节假日的高速、景区场景...

![throttle-1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3800d375a3e44421b3cc5867cd150c7d~tplv-k3u1fbpfcp-zoom-1.image)

![throttle-2](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c11fcd09f37e47269fc56082a8daf60c~tplv-k3u1fbpfcp-zoom-1.image)

每逢节假日高速、景区都会开始节流模式,如高速收费站每间隔 10 分钟通过 4 辆车,景区每间隔 20 分钟入园 30 人....

所以把这些概念代入日程生活还是不难理解的,想一想在开发中搜索框的实时检索的场景是不是可以使用节流实现呢?

![throttle-baidu](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26e29d4787204b86a85cc28fbb1c3b53~tplv-k3u1fbpfcp-zoom-1.image)

重要的事情有必要再说三遍:

**记住:节流每间隔一段时间执行一次！**

**记住:节流每间隔一段时间执行一次！**

**记住:节流每间隔一段时间执行一次！**

根据上面的一些介绍,应该知道节流是用来解决某时间段内高频率触发相同事件而做的性能优化,所以没有什么特定的场景完全根据业务需求而定.

### 实现

我们以 div 容器的 mousemove 事件为场景梳理一个清单,看大概需要几个步骤:

1. 实现事件处理函数.

2. 使用 setTimeout 创建定时器,到时间触发处理函数.

```html
<html>
  <head>
    <meta charset="utf-8" />
    <title>mousemove</title>
    <style type="text/css">
      #main {
        width: 400px;
        height: 200px;
        margin: 0 auto;
        line-height: 200px;
        text-align: center;
        color: #fff;
        background-color: #31a6bb;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div id="main">0</div>
    <script type="text/javascript">
      var count = 0;
      var mainDom = document.getElementById('main');
      //正常操作无任何优化,div容器绑定mousemove事件处理函数.
      mainDom.addEventListener('mousemove', mousemove);
      function mousemove() {
        mainDom.innerHTML = ++count;
        console.log('触发mousemove事件.');
      }
    </script>
  </body>
</html>
```

以上代码如下图,只是给 div 容器绑定了 mousemove 事件,随着鼠标不断移动数字也不断累加...
![throttle-mousemove](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/750000f74120478d9323cc96eaa3705b~tplv-k3u1fbpfcp-zoom-1.image)

实现事件处理函数.

```html
<html>
  <head>
    <meta charset="utf-8" />
    <title>mousemove</title>
    <style type="text/css">
      #main {
        width: 400px;
        height: 200px;
        margin: 0 auto;
        line-height: 200px;
        text-align: center;
        color: #fff;
        background-color: #31a6bb;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div id="main">0</div>
    <script type="text/javascript">
      var count = 0;
      var mainDom = document.getElementById('main');
      function mousemove() {
        mainDom.innerHTML = ++count;
        console.log('触发mousemove事件.');
      }
      /**
       *
       * 节流函数
       * @param {Function} fn 执行函数
       * @param {Number} wait 等待时间
       * @returns Function 可执行函数
       */
      function throttle(fn, wait) {
        return fn;
      }
      mainDom.addEventListener('mousemove', throttle(mousemove, 1000));
    </script>
  </body>
</html>
```

接下来我们看一下第 2 步该如何实现,首先是添加定时器.

```html
<html>
  <head>
    <meta charset="utf-8" />
    <title>mousemove</title>
    <style type="text/css">
      #main {
        width: 400px;
        height: 200px;
        margin: 0 auto;
        line-height: 200px;
        text-align: center;
        color: #fff;
        background-color: #31a6bb;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div id="main">0</div>
    <script type="text/javascript">
      var count = 0;
      var mainDom = document.getElementById('main');

      function mousemove() {
        mainDom.innerHTML = ++count;
        console.log('触发mousemove事件.');
      }
      /**
       *
       * 节流函数
       * @param {Function} fn 执行函数
       * @param {Number} wait 等待时间
       * @returns Function 可执行函数
       */
      function throttle(fn, wait) {
        return function () {
          console.log('----匿名函数---'); //会高频率的打印到控制台
          setTimeout(fn, wait);
        };
      }
      mainDom.addEventListener('mousemove', throttle(mousemove, 1000));
    </script>
  </body>
</html>
```

![throttle-mousemove-settimeout](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cc00cd777564665ad2225d57f65e994~tplv-k3u1fbpfcp-zoom-1.image)

如果看上图感觉哪里有一点不对？说明你确实带着思考在看这篇文章,仔细观察发现控制台首先输出 109 次`----匿名函数---`,其次过几秒之后计数器开始不断的从 0 累加到了 109 同时控制台输出`触发mousemove事件.`,确实没实现概念中的节流(只是延迟了计数器而已).

那么问题出在哪里？

控制台不断的输出`----匿名函数---`这句话,说明鼠标一直在不间断的移动所以一直触发绑定的`mousemove`事件,从而持续输出.——这是肯定没问题的.

那就只剩下定时器,从代码来看目前是只要触发一次`mousemove`事件就会创建一次定时器,这么说来移动 109 次的话就会创建 109 次定时器.所以原因出在每次触发事件都会创建一次定时器而导致的.

接下来就是添加条件控制定时器的创建次数.如触发事件(移动)109 次只创建 3 次定时器是不是就实现节流了呢？

```html
<html>
  <head>
    <meta charset="utf-8" />
    <title>mousemove</title>
    <style type="text/css">
      #main {
        width: 400px;
        height: 200px;
        margin: 0 auto;
        line-height: 200px;
        text-align: center;
        color: #fff;
        background-color: #31a6bb;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div id="main">0</div>
    <script type="text/javascript">
      var count = 0;
      var mainDom = document.getElementById('main');

      function mousemove() {
        mainDom.innerHTML = ++count;
        console.log('触发mousemove事件.');
      }
      /**
       *
       * 节流函数
       * @param {Function} fn 执行函数
       * @param {Number} wait 等待时间
       * @returns Function 可执行函数
       */
      function throttle(fn, wait) {
        var timerId = null; //标记是否创建定时器
        return function () {
          console.log('----匿名函数---'); //会高频率的打印到控制台
          //如果未创建则进入`if`创建定时器,这样便控制了定时器的创建次数(匿名函数每次都会触发,但匿名函数内的定时器不在像之前被频繁创建而是根据timerId判断是否存在再创建)
          if (!timerId) {
            //记录创建的定时器
            timerId = setTimeout(function () {
              //为什么timerId要放在setTimeout内重置为null?
              //由于if根据timerId判断是否创建定时器,从而控制定时器的创建次数以便实现真正的节流
              //简答讲只有本次定时器执行了,才可以timerId = null创建下一次的定时器...以此...类推...
              timerId = null;
              fn(); //到时间执行事件处理函数
            }, wait);
          }
        };
      }
      mainDom.addEventListener('mousemove', throttle(mousemove, 1000));
    </script>
  </body>
</html>
```

![throttle-mousemove-settimeout-2](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e53167b09924d058b10f0678358cb84~tplv-k3u1fbpfcp-zoom-1.image)

看一下上面的效果是不是实现了和概念一致**节流每间隔一段时间执行一次**

### 参考

虽然实现了函数节流的功能,但对比 underscore、lodash 对于 throttle 的实现还是差很多...所以我们先参考这两个库如何实现 throttle,在做完善.

#### throttle 之 underscore 篇

源码基于 v1.10.2 版本,直接在源码上添加理解注释.

```javascript
/**
 *
 * underscore. throttle 函数理解
 * @param {Function } 事件处理函数
 * @param {Number} wait 触发的时间
 * @param {Object} options 选项配置{leading:true,trailing:true}
 * leading:true(默认),首次触发事件则立即执行事件处理函数
 * leading:false 首次触发事件则不立即执行事件处理函数
 * trailing:true(默认),触发事件结束后再执行一次事件处理函数
 * trailing:false 触发事件结束后不执行事件处理函数
 * @returns Function 可执行函数
 */
function throttle(func, wait, options) {
  //timeout记录定时器状态
  //context上下文
  //args传递参数
  //result记录func函数返回值(事件处理函数有可能会存在返回值的情况)
  var timeout, context, args, result;
  var previous = 0; //上次触发节流时间
  if (!options) options = {}; //选项配置

  var later = function () {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  var throttled = function () {
    var _now = now();

    if (!previous && options.leading === false) previous = _now;
    //判断触发节流事件的时间差
    //剩余时间=等待执行事件的时间-(当前触发节流事件的时间-上次触发节流事件的时间)
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    //时间差<=0 说明此次触发节流事件的时间与上次触发节流事件的时间间隔大于设置的等待时间,可以执行配置的事件处理函数
    //时间差>等待时间 说明手动设置了系统时间,如当前是 2020-08-17 10:27 38 ,下一秒 修改了系统时间为 2020-08-17 10:25 38,
    //最后计算出来的时差则是 remaining > wait
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
  //添加静态方法,取消定时器
  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}
```

#### throttle 之 lodash 篇

源码基于 v4.17.15 版本,直接在源码上添加理解注释.

```javascript
/**
 *
 * lodash. throttle 函数理解
 * @param {Function } 事件处理函数
 * @param {Number} wait 触发的时间
 * @param {Object} options 选项配置{leading:true,trailing:true,maxWait:wait}
 * leading:true(默认),首次触发事件则立即执行事件处理函数
 * leading:false 首次触发事件则不立即执行事件处理函数
 * trailing:true(默认),触发事件结束后再执行一次事件处理函数
 * trailing:false 触发事件结束后不执行事件处理函数
 * maxWait:最大等待时间(间隔时间)
 * @returns Function 可执行函数
 */
function throttle(func, wait, options) {
  var leading = true,
    trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    leading: leading,
    maxWait: wait,
    trailing: trailing,
  });
}
```

关于 lodash 版本的`throttle`由于是调用的`debounce`所以不在过多解释,可以看文章开头提到的之前写过的`debounce`的文章.

### 完善

看过 underscore、lodash 的节流之后...虽然无法与巨人相提并论,但也需要相对完善一下.

- 配置首次触发立即执行函数或最后一次触发事件后执行函数

- 参数处理

- 返回值

```html
<html>
  <head>
    <meta charset="utf-8" />
    <title>mousemove</title>
    <style type="text/css">
      #main {
        width: 400px;
        height: 200px;
        margin: 0 auto;
        line-height: 200px;
        text-align: center;
        color: #fff;
        background-color: #31a6bb;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div id="main">0</div>
    <script type="text/javascript">
      var count = 0;
      var mainDom = document.getElementById('main');

      function mousemove() {
        mainDom.innerHTML = ++count;
        console.log('触发mousemove事件.');
        return Math.random()
      }
      /**
       *
       * 节流函数
       * @param {Function} fn 执行函数
       * @param {Number} wait 等待时间
       * @param {Object} options 选项配置{leading:true,trailing:true}
       * @returns Function 可执行函数
       */
      function throttle(fn, wait, options) {
        var timerId = null; //标记是否创建定时器
        var result;
        var previous = 0;
        if (!options) {
          options = { leading: true, trailing: true };
        }

        return function () {
          var that = this;
          var args = arguments;
          var _now = new Date().getTime();
          var remaining = wait - (_now - previous);
          //计算时间差、配置leading:true 开启首次触发事件立即执行函数
          if (
            (remaining <= 0 || remaining > wait) &&
            options.leading !== false
          ) {
            if (timerId) {
              clearTimeout(timerId);
              timerId = null;
            }
            //上面使用clearTimeout是为了保证在下面立即执行的fn函数之前不在有之前创建的定时器去执行fn方法,(防止定时器执行+立即执行导致同一时间多次执行的问题)
            previous = _now;
            result = fn.apply(that, args);
          }
          //如果未创建则进入`if`创建定时器,这样便控制了定时器的创建次数(匿名函数每次都会触发,但匿名函数内的定时器不在像之前被频繁创建而是根据timerId判断是否存在再创建)
          if (!timerId && options.trailing !== false) {
            //记录创建的定时器
            timerId = setTimeout(function () {
              //为什么timerId要放在setTimeout内重置为null?
              //由于if根据timerId判断是否创建定时器,从而控制定时器的创建次数以便实现真正的节流
              //简答讲只有本次定时器执行了,才可以timerId = null创建下一次的定时器...以此...类推...
              timerId = null;
              previous = new Date().getTime();//记录最近一次触发fn事件的时间
              result = fn.apply(that, args); //到时间执行事件处理函数
            }, wait);
          }
          return result;
        };
      }
      mainDom.addEventListener('mousemove', throttle(mousemove, 1000));
    </script>
  </body>
</html>

```

### 总结

以上就是对如何实现函数防抖 underscore lodash 关于 throttle 的理解,还望多多指教.
