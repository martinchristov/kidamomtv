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
		templateUrl: "partials/menu.html",
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

.directive('icon',[function(){
	return {
		restrict:"A",
		link:function link (scope,el,attrs) {
			// attrs.icon
			
			scope.$watch('menuItem',function(newVal,oldVal){
				if(attrs.index==oldVal){
					if(el.data('svg'))
					el.data('svg').animate({fill:attrs.iconfill},300)
				}
				else if(attrs.index==newVal){
					if(el.data('svg'))
					el.data('svg').animate({fill:"#ff2e43"},300)

				}
			})
		}
	}
}])
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
		}
	};
}])
.directive('videoplayer', ['$compile',function (compile) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			//instantiate player
			//var player;
			setTimeout(function(){
				window.player = videojs("videoplayer",{controls:false});
				iconFactory.produce($("#controls"))
			},300);
			//setup video controls
			scope.showControls = true;
			scope.menuItem = 4;
			scope.playing = false;
			scope.searchOn=false;

			scope.controls = [
				{ action:"search", icon:"src", fill:"#fff", tsf:"" },
				{ action:"prev", icon:"next", fill:"#fff", tsf:"s0.9r180" },
				{ action:"backward", icon:"forward", fill:"#fff", tsf:"s1.4r180" },
				{ action:"pause", icon:"pause", fill:"#fff", tsf:"" },
				{ action:"play", icon:"play", fill:"#fff", tsf:"" },
				{ action:"forward", icon:"forward", fill:"#fff", tsf:"s1.4" },
				{ action:"next", icon:"next", fill:"#fff", tsf:"s0.9" },
				{ action:"subs", icon:"subs", fill:"#fff", tsf:"" }
			];

			//setup playlist


			//KEY LISTENERS

			//navigate controls

			scope.$on("keyleft",function(){
				if(scope.menuItem>0)scope.menuItem--;
				if(!scope.playing&&scope.menuItem==3)scope.menuItem--;
				else if(scope.playing&&scope.menuItem==4)scope.menuItem--;
			})
			scope.$on("keyright",function(){
				if(scope.menuItem<scope.controls.length-1)scope.menuItem++;
				if(scope.playing&&scope.menuItem==4)scope.menuItem++;
				else if(!scope.playing&&scope.menuItem==3)scope.menuItem++;
			})

			//control actions on enter

			scope.$on("enter",function(){
				if (scope.showControls==false) {
					if(scope.searchOn==false)
					scope.showControls=true;
				}
				else {
					var action = scope.controls[scope.menuItem].action;
					
					if(action=="pause" && scope.playing){
						scope.playing=false;
						scope.menuItem=4;
						player.pause();
					}
					else if(action=="play" && !scope.playing) {
						scope.playing=true;
						scope.menuItem=3;
						player.play();
					}

					else if(action=="backward"){
						player.pause();
						var at = player.currentTime();
						console.log(at);
						player.currentTime(Math.max(at - 5, 0));
						player.play();
					}
					else if(action=="forward"){
						var at = player.currentTime();
						console.log(at);
						player.currentTime(at + 5);	
					}
					else if(action=="prev"){
						
					}
					else if(action=="next"){
						
					}
					else if(action=="subs"){
						
					}
					else if(action=="search"){
						console.log('here')
						var el = compile('<search></search>')(scope);
						$("body").append(el);
						scope.showControls=false;
						scope.searchOn=true;
					}
				}
			})
			scope.$on("back",function(){
				if (scope.showControls) {
					scope.showControls=false;
				}
				else{
					history.back();
				}
			})
		}
	};
}])
.directive('search', ['$rootScope', 'depth', '$http', function ($rootScope, depth, $http) {
	return {
		restrict: 'E',
		replace:true,
		templateUrl:"partials/search-directive.html",
		link: function (scope, iElement, iAttrs) {
			scope.level = 2;
			//levels represent vertical focus.
			// 1 are suggestions
			// 2 - keyboard
			// 3 - carousel

			scope.keyboard="abcdefghijklmnopqrstuvwxyz< 0123456789";
			scope.curChar = 15;
			scope.center = $(window).width()/2;

			depth.more();

			scope.suggestions = [
				""
			]
			scope.curSug=0;

			var sugsDom = $("#src-head ul:first");
			function evalSugWidth () {
				var w = 0;
				sugsDom.find('li').each(function(){
					w+=$(this).width()+26;
				})
				scope.sugWidth=w;
			}
			function evalSugPos () {
				var cur = $(sugsDom.find('li')[scope.curSug]);
				scope.sugPos = scope.center - cur.position().left - cur.width() - 15;
			}
			setTimeout(function(){
				evalSugWidth();
				evalSugPos();
				scope.$apply();
			},100);


			//key listeners
			scope.$on("keyleft",function(){
				if(scope.level==1){
					if(scope.curSug>0){
						scope.curSug--;
						evalSugPos();
					}
				}
				else if(scope.level==2){
					if(scope.curChar>0)scope.curChar--;
				}
			})
			scope.$on("keyright",function(){
				if(scope.level==1){
					if(scope.curSug<scope.suggestions.length-1){
						scope.curSug++;
						evalSugPos();
					}
				}
				else if(scope.level==2){
					if(scope.curChar<scope.keyboard.length-1)scope.curChar++;
				}
			})

			scope.$on("keydown",function(){
				if(scope.level<3)scope.level++;
			})
			scope.$on("keyup",function(){
				if(scope.level>1)scope.level--;
			})

			scope.$on("enter",function(){
				if(scope.level==2){
					var ch = scope.keyboard[scope.curChar];
					if(ch!="<")
						scope.suggestions[scope.curSug]+=scope.keyboard[scope.curChar];
					else scope.suggestions[scope.curSug] = scope.suggestions[scope.curSug].substr(0,scope.suggestions[scope.curSug].length-1)
					setTimeout(function(){
						evalSugWidth();
						evalSugPos();
						scope.$apply();
					},100);
					
					// scope.$apply();
				}
			})
		}
	};
}])


.directive('playmovie', ['$location', function ($location) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			scope.$on("enter", function () {
				$location.path("/play/" + iAttrs.playmovie)
			})
		}
	}
}])
