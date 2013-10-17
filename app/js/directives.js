'use strict';

/* Directives */


angular.module('kidamom.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
.directive('shortcut', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    link:    function postLink(scope, iElement, iAttrs){
      jQuery(document).on('keydown', function(e){
         scope.$apply(scope.keyPressed(e));
         // scope.keyCode = e.which;
       });
    }
  };
})
.directive('mainmenu',function(){
	return {
		link:function(scope,el,attrs){
			scope.menuItem=1;
			var menuItems = 7;
			scope.keyPressed = function(e){
				if(e.which==38){
					//up
					if(scope.menuItem>0)scope.menuItem--;
		  		}
		  		else if(e.which==40){
		  			//down 
		  			if(scope.menuItem<menuItems)scope.menuItem++;
		  		}
			}
		}
	}
})
.directive('icon',function(){
	return {
		restrict:"A",
		link:function link (scope,el,attrs) {
			// attrs.icon
			scope.$watch('menuItem',function(newVal,oldVal){
				if(attrs.index==oldVal){
					if(el.data('svg'))
					el.data('svg').animate({fill:"#5b5b5b"},300)
				}
				else if(attrs.index==newVal){
					if(el.data('svg'))
					el.data('svg').animate({fill:"#ff2e43"},300)

				}
			})
		}
	}
})