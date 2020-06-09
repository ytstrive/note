//ops/sec(执行(运转)次数(速度)/每秒)

// 无参数对比
// var suite = new Benchmark.Suite();
// function test0() {};
// function call0() {
//   test0.call();
// }
// function apply0() {
//   test0.apply();
// }
// suite
//   .add('call无参数', () => {
//     call0();
//   })
//   .add('apply无参数', () => {
//     apply0();
//   })
//   .on('cycle', (ev) => {
//     console.log('执行结果:', String(ev.target));
//   })
//   .on('complete', function () {
//     console.log('较快的为:' + this.filter('fastest').map('name'));
//   })
//   .run({ async: true });
//---------------------------------

// 一个参数
// var suite = new Benchmark.Suite();
// function test1(arg1) {
//   return arg1;
// }
// function call1() {
//   test1.call(null, 'a');
// }
// function apply1() {
//   test1.apply(null, ['a']);
// }
// suite
//   .add('call一个参数', () => {
//     call1();
//   })
//   .add('apply一个参数', () => {
//     apply1();
//   })
//   .on('cycle', (ev) => {
//     console.log('执行结果:', String(ev.target));
//   })
//   .on('complete', function () {
//     console.log('较快的为:' + this.filter('fastest').map('name'));
//   })
//   .run({ async: true });
//---------------------------------

//两个参数
// var suite = new Benchmark.Suite();
// function test2(arg1, arg2) {
//   return arg1;
// }
// function call2() {
//   test2.call(null, 'a', 2);
// }
// function apply2() {
//   test2.apply(null, ['a', 2]);
// }
// suite
//   .add('call两个参数', () => {
//     call2();
//   })
//   .add('apply两个参数', () => {
//     apply2();
//   })
//   .on('cycle', (ev) => {
//     console.log('执行结果:', String(ev.target));
//   })
//   .on('complete', function () {
//     console.log('较快的为:' + this.filter('fastest').map('name'));
//   })
//   .run({ async: true });
//---------------------------------

//三个参数
// var suite = new Benchmark.Suite();
// function test3(arg1, arg2, arg3) {
//   return arg1;
// }
// function call3() {
//   test3.call(null, 'a', 2, { name: '华为', price: 0 });
// }
// function apply3() {
//   test3.apply(null, ['a', 2, { name: '华为', price: 0 }]);
// }
// suite
//   .add('call三个参数', () => {
//     call3();
//   })
//   .add('apply三个参数', () => {
//     apply3();
//   })
//   .on('cycle', (ev) => {
//     console.log('执行结果:', String(ev.target));
//   })
//   .on('complete', function () {
//     console.log('较快的为:' + this.filter('fastest').map('name'));
//   })
//   .run({ async: true });
//---------------------------------

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
    Symbol()
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
