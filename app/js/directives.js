'use strict';

/* Directives */


angular.module('kidamom.directives', []).
directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}])
.directive('mainmenu',['depth','$rootScope', 'Backend', function (depth, rootScope, Backend){
	return {
		restrict:"E",
		replace:true,
		templateUrl: "partials/menu.html",
		link:function(scope,el,attrs){
			console.log(Backend);
			if(Backend.identifier){
				scope.menu=[
					{
						title:"Търсене",
						icon:"src", tsf:"s1", href:"#/search"
					},{
						title:"Препоръчани",
						icon:"v-5", tsf:"s1", href:"#/movies/recommended"
					},{
						title:"Най-гледани",
						icon:"people", tsf:"s1.35", href:"#/movies/popular"
					},{
						title:"Нови",
						icon:"sticker", tsf:"s1.3", href:"#/movies/new"
					},{
						title:"Последно гледани",
						icon:"eye", tsf:"s1.2", href:"#/movies/lastwatch"
					},{
						title:"Любими",
						icon:"heart", tsf:"s1", href:"#/movies/favorites"
					},{
						title:"Плейлисти",
						icon:"folder", tsf:"s1", href:"#/playlists"
					},{
						title:"Профили",
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


	        $(document).ready(function(){
	          setTimeout(function(){
	            iconFactory = new IconFactory("js/icons.json",{fill:"#5b5b5b"});
	            iconFactory.produce($("body"))
	          },100);
	            
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
					'<div class="item" ng-repeat="item in items" ng-class="{current:(item==currentItem), faded:($index<currentItemIndex)}">'+
						'<img ng-src="{{item.photo}}">'+
					'</div>'+
				'</div>'+
			'</div>',
		link: function (scope, iElement, iAttrs) {
			scope.currentItemIndex = 0;
			if(scope.hasOwnProperty("items"))scope.currentItem = scope.items[0];
			scope.$on("keyleft",function(){
				if(scope.searchLevel==3||scope.searchLevel==undefined){
					scope.currentItemIndex--;
		  			if(scope.currentItemIndex<0)scope.currentItemIndex=0;
			  		scope.currentItem = scope.items[scope.currentItemIndex];
			  	}
			})
			scope.$on("keyright",function(){
				if(scope.searchLevel==3||scope.searchLevel==undefined){
					scope.currentItemIndex++;
		  			if(scope.currentItemIndex>=scope.items.length)scope.currentItemIndex=scope.items.length-1;
		  			scope.currentItem = scope.items[scope.currentItemIndex];

		  		}

			})
		}
	};
}])
.directive('videoplayer', ['$compile',function (compile) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			//instantiate player
			var player = document.querySelector('video');
			window.player = player;
			setTimeout(function(){
				//player = videojs("videoplayer",{controls:false});
				iconFactory.produce($("#controls"))
			},300);
			//setup video controls
			scope.showControls = true;
			scope.menuItem = 4;
			scope.playing = false;
			scope.searchOn=false;
			scope.center = $(window).width()/2;

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

			//update progress bar
			var timeupd=0;
			scope.progress=0;
			player.addEventListener("timeupdate",function(){
				timeupd++;
				if(timeupd%3==0){
					scope.progress=player.currentTime/player.duration;
					scope.$apply();
				}
			})

			//setup playlist


			//KEY LISTENERS

			//navigate controls

			scope.$on("keyleft",function(){
				if(scope.showControls)
				{
					if(scope.menuItem>0)scope.menuItem--;
					if(!scope.playing&&scope.menuItem==3)scope.menuItem--;
					else if(scope.playing&&scope.menuItem==4)scope.menuItem--;
				}
			})
			scope.$on("keyright",function(){
				if(scope.showControls)
				{
					if(scope.menuItem<scope.controls.length-1)scope.menuItem++;
					if(scope.playing&&scope.menuItem==4)scope.menuItem++;
					else if(!scope.playing&&scope.menuItem==3)scope.menuItem++;
				}
				
			})

			//control actions on enter

			scope.$on("enter",function(){
				if (scope.showControls==false) {
					if(scope.searchLevel<1)
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
						player.currentTime -= 10;
						scope.progress=player.currentTime/player.duration;
					}
					else if(action=="forward"){
						player.currentTime += 10;
						scope.progress=player.currentTime/player.duration;
						// scope.$apply();
					}
					else if(action=="prev"){
						
					}
					else if(action=="next"){
						
					}
					else if(action=="subs"){
						
					}
					else if(action=="search"){
						scope.showControls=false;
						setTimeout(function(){
							scope.searchLevel=2;
							scope.$apply();
						},20);
					}
				}
			})
			scope.$on("back",function(){
				if (scope.showControls) {
					scope.showControls=false;
				}
				else{
					if(scope.searchLevel>0){
						scope.searchLevel=0;
						scope.showControls=true;
					}
					else
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
			scope.items=[];
			scope.searchLevel = 0;
			//levels represent vertical focus.
			// 1 are suggestions
			// 2 - keyboard
			// 3 - carousel

			scope.keyboard="abcdefghijklmnopqrstuvwxyz< 0123456789";
			scope.curChar = 15;
			scope.center = $(window).width()/2;

			// depth.more();

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
				if(scope.searchLevel==1){
					if(scope.curSug>0){
						scope.curSug--;
						evalSugPos();
					}
				}
				else if(scope.searchLevel==2){
					if(scope.curChar>0)scope.curChar--;
				}
			})
			scope.$on("keyright",function(){
				if(scope.searchLevel==1){
					if(scope.curSug<scope.suggestions.length-1){
						scope.curSug++;
						evalSugPos();
					}
				}
				else if(scope.searchLevel==2){
					if(scope.curChar<scope.keyboard.length-1)scope.curChar++;
				}
			})

			scope.$on("keydown",function(){
				if(scope.searchLevel<3)scope.searchLevel++;
			})
			scope.$on("keyup",function(){
				if(scope.searchLevel>1)scope.searchLevel--;
			})

			scope.$on("enter",function(){
				if(scope.searchLevel==1){
					$http.get(appURI.search+"?s="+scope.suggestions[0]).success(function(data){
						scope.items = data;
						scope.currentItem = scope.items[0];
					})
				}
				if(scope.searchLevel==2){
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
				$location.path("/play/1")
			})
		}
	}
}])
