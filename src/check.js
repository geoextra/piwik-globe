if (!System.support.canvas || !System.support.webgl) {
  console.error('System not supported...');
  document.location.href = './error.html';
} else {
  console.log('Parsed check!');
}