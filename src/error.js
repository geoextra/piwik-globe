$(document).ready( function() {
  'use strict';

  $.material.init();
  if (System.support.webgl) {
  	$('#webgl').prop('checked', true);
  }
  if (System.support.canvas && System.support.requestAnimationFrame) {
  	$('#canreq').prop('checked', true);
  }
});
