'use strict';

if (!System.support.webgl || !System.support.canvas || !System.support.requestAnimationFrame) {
  console.error('System not supported...');
  document.location.href = './error.html';
}
