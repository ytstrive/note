const getMsg = () => {
  const name = 'Babel';
  document.getElementById(
    'output'
  ).innerHTML = `Hello ${name} version:${Babel.version}`;
};
getMsg();
