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
		restrict:"E",
		replace:true,
		template: 
			'<div>'+
			'<ul id="menu" style="top:{{-menuItem*50}}px">'+
				'<li ng-repeat="item in menu" ng-class="{current:menuItem==$index}">'+
					'<a><i icon data-index="{{$index}}" class="{{item.icon}}" data-attrs=\'{"transform":"{{item.tsf}}"}\'></i></a>'+
				'</li>'+
			'</ul>'+
			'<div id="titles">'+
				'<h1 ng-repeat="item in menu" ng-class="{current:menuItem==$index}" style="margin-top:{{(-menuItem+$index)*scrollH}}px">'+
				'{{item.title}}</h1>'+
			'</div>'+
			'</div>',
		link:function(scope,el,attrs){
			
			if(scope.loggedIn){
				scope.menu=[
					{
						title:"Search",
						icon:"src", tsf:"s1", href:"#/search"
					},{
						title:"Recommended",
						icon:"v-5", tsf:"s1", href:"#/movies/recommended"
					},{
						title:"Popular",
						icon:"people", tsf:"s1.35", href:"#/movies/popular"
					},{
						title:"New",
						icon:"sticker", tsf:"s1.3", href:"#/movies/new"
					},{
						title:"Last watched",
						icon:"eye", tsf:"s1.2", href:"#/movies/lastwatch"
					},{
						title:"Favorites",
						icon:"heart", tsf:"s1", href:"#/movies/favorites"
					},{
						title:"Playlists",
						icon:"folder", tsf:"s1", href:"#/playlists"
					},{
						title:"Users",
						icon:"logout", tsf:"s1", href:"#/users"
					}
				]
			}
			else {
				scope.menu=[
					{
						title:"Search",
						icon:"src", tsf:"s1", href:"#/search"
					},{
						title:"Popular",
						icon:"people", tsf:"s1.35", href:"#/movies/popular"
					},{
						title:"New",
						icon:"sticker", tsf:"s1.3", href:"#/movies/new"
					},{
						title:"Users",
						icon:"logout", tsf:"s1", href:"#/users"
					}
				]
			}
			scope.menuItem=1;
			scope.keyPressed = function(e){
				if(e.which==38){
					//up
					if(scope.menuItem>0){
						scope.menuItem--;
						clearInterval(scope.tmt);
						scope.tmt = setTimeout(function(){
							window.location.href=scope.menu[scope.menuItem].href;
						},300);
						
					}
		  		}
		  		else if(e.which==40){
		  			//down 
		  			if(scope.menuItem<scope.menu.length-1){
		  				scope.menuItem++;
						clearInterval(scope.tmt);
						scope.tmt = setTimeout(function(){
							window.location.href=scope.menu[scope.menuItem].href;
						},300);
					}
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