'use strict';

/* Directives */


// angular.module('kidamom.directives', []).
//   directive('appVersion', ['version', function(version) {
//     return function(scope, elm, attrs) {
//       elm.text(version);
//     };
//   }]);

kidamom.directive('shortcut',function(){
  	console.log('was here')
  	return {
	    restrict: 'E',
	    replace: true,
	    scope: true,
	    link:    function postLink(scope, iElement, iAttrs){
	    	console.log('was here')
	      jQuery(document).on('keypress', function(e){
	         scope.$apply(scope.keyPressed(e));
	       });
	    }
	  };
  })
