const babel = require('babel-core');
const codeStr = '[1, 2, 3, 4].forEach((item) => console.log(item));';

const result = babel.transform(codeStr, {
  plugins: ['babel-plugin-transform-es2015-arrow-functions'],
});

console.log('输出结果:',result.code);
