'use strict';

/* Directives */


angular.module('kidamom.directives', []).
directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}])
.directive('mainmenu',['depth','$rootScope',function(depth,rootScope){
	return {
		restrict:"E",
		replace:true,
		template: 
			'<div>'+
			'<ul id="menu" ng-class="{inactive:isMenuInactive()}" style="top:{{-menuItem*50}}px">'+
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
			scope.scrollH=50;
			scope.menuItem=1;
			scope.$on('keyup',function(){
				if(depth.get()==0)
				if(scope.menuItem>0){
					scope.menuItem--;
					clearInterval(scope.tmt);
					scope.tmt = setTimeout(function(){
						window.location.href=scope.menu[scope.menuItem].href;
					},300);
				}
			})
			scope.$on('keydown',function(){
				if(depth.get()==0)
				if(scope.menuItem<scope.menu.length-1){
	  				scope.menuItem++;
					clearInterval(scope.tmt);
					scope.tmt = setTimeout(function(){
						window.location.href=scope.menu[scope.menuItem].href;
					},300);
				}
			})

		}
	}
}])

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
.directive('carousel', ['$rootScope', 'Movies', '$location', function ($rootScope, Movies, $location) {
	return {
		restrict: 'E',
		template:
			'<div class="carousel">'+
				'<div class="holder" style="width:{{items.length*180+160+125}}px; margin-left:{{-currentItemIndex*180-135}}px">'+
					'<div class="item" ng-repeat="item in items" ng-class="{current:(item==currentItem)}">'+
						'<img ng-src="{{item.photo}}">'+
					'</div>'+
				'</div>'+
			'</div>',
		link: function (scope, iElement, iAttrs) {
			scope.currentItemIndex = 0;
			scope.currentItem = scope.items[0];
			scope.$on("keyleft",function(){
					scope.currentItemIndex--;
		  			if(scope.currentItemIndex<0)scope.currentItemIndex=0;
			  		scope.currentItem = scope.items[scope.currentItemIndex];
				})
			scope.$on("keyright",function(){
					scope.currentItemIndex++;
		  			if(scope.currentItemIndex>=scope.items.length)scope.currentItemIndex=scope.items.length-1;
		  			scope.currentItem = scope.items[scope.currentItemIndex];
				})
			scope.$on("enter", function () {
				// Movies.select(scope.currentItemIndex);
				$location.path("/play/" + scope.currentItem.id);
			});

		}
	};
}])
.directive('videoplayer', [function () {
	return {
		restrict: 'E',
		templateUrl: "partials/videoplayer.html",
		link: function (scope, iElement, iAttrs) {
		}
	};
}])
