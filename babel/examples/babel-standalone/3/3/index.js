import { randomStr, random } from 'other';
import userInfo from 'userInfo';
function init() {
  document.getElementById('output').innerHTML = `Hello ${
    userInfo.name
  } ${randomStr} ${random()}`;
}

init();
