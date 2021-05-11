const { callExpression } = require('@babel/types');

module.exports = function (api) {
  api.cache(true);

  const plugins = ['@babel/plugin-transform-arrow-functions'];

  return {
    plugins,
  };
};
