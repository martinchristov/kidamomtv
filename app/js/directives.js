'use strict';

/* Directives */


angular.module('kidamom.directives', []).
directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}])
.directive('mainmenu',['depth', 'Menu', '$location', function (depth, Menu, $location){
	return {
		restrict: "E",
		replace: true,
		templateUrl: "partials/menu.html",
		link: function (scope, el, attrs) {
			scope.menu = Menu.getItems();
			scope.scrollH=50;
			scope.menuItem=1;
			scope.menu.some(function (item, index) {
				if (item.href.indexOf($location.$$path) !== -1) {
					scope.menuItem = index;
					return true;
				}
			})
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
.directive('videoplayer', ['$route', '$location', "depth",function ($route,$location, depth) {
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
				{ action:"speech", icon:"speech", fill:"#fff", tsf:"" }
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
					// skip over hidden pause/play controls
					if(scope.menuItem>0)scope.menuItem--;
					if(!scope.playing&&scope.menuItem==3)scope.menuItem--;
					else if(scope.playing&&scope.menuItem==4)scope.menuItem--;
				}
			})
			scope.$on("keyright",function(){
				if(scope.showControls)
				{
					// skip over hidden pause/play controls
					if(scope.menuItem<scope.controls.length-1)scope.menuItem++;
					if(scope.playing&&scope.menuItem==4)scope.menuItem++;
					else if(!scope.playing&&scope.menuItem==3)scope.menuItem++;
				}
				
			})

			//control actions on enter
			window.$location = $location;
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
					}
					else if(action=="prev"){
						if (scope.currentInList > 0) {
							var movieid = scope.playlist[scope.currentInList - 1].id;
							var playlistid = scope.playlistId;
							$location.path('/play/' + movieid + "/" + playlistid);
							$location.replace();
						}
					}
					else if(action=="next"){
						if (scope.currentInList < scope.playlist.length - 1) {
							var movieid = scope.playlist[scope.currentInList + 1].id;
							var playlistid = scope.playlistId;
							$location.path('/play/' + movieid + "/" + playlistid);
							$location.replace();
						}
					}
					else if(action=="subs"){
						
					}
					else if(action=="search"){
						scope.showControls=false;
						depth.more();
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
						depth.less();
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
.directive('search', ['$rootScope', 'depth', '$http', 'Backend', function ($rootScope, depth, $http, Backend) {
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
			scope.keyboard="абвгдежзийклмнопрстуфхцчшщъьюя< 0123456789";
			// scope.keyboard="джу";
			scope.curChar = 0;
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
				try{
					scope.sugPos = scope.center - cur.position().left - cur.width() - 15;
				}
				catch(e){
					console.log(scope.curSug, sugsDom.find('li'))
				}
				
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
				if(scope.searchLevel<3&&depth.get()>0){
					if(scope.items.length==0&&scope.searchLevel==2)return;
					scope.searchLevel++;
				}
			})
			scope.$on("keyup",function(){
				if(scope.searchLevel>1)scope.searchLevel--;
			})

			scope.$on("enter",function(){
				if(scope.searchLevel==1){
					// $http.get(appURI.search+"?s="+scope.suggestions[0]).success(function(data){
					// 	scope.items = data;
					// 	scope.currentItem = scope.items[0];
					// })
					var promise = Backend.search(scope.suggestions[scope.curSug])
					promise.then(function(res){
						// scope.items = res;
						scope.items=res;

						scope.currentItem = scope.items[0];
						scope.searchLevel=3;
					})
				}
				if(scope.searchLevel==2){
					var ch = scope.keyboard[scope.curChar];
					if(scope.curSug>0){
						scope.suggestions = [scope.suggestions[scope.curSug]];
						scope.curSug=0;
					}
					if(ch!="<")
						scope.suggestions[scope.curSug]+=scope.keyboard[scope.curChar];
					else scope.suggestions[scope.curSug] = scope.suggestions[scope.curSug].substr(0,scope.suggestions[scope.curSug].length-1)
					

					var prom = Backend.searchahead(scope.suggestions[scope.curSug])
					prom.then(function(res){
						//success
						scope.suggestions = [scope.suggestions[0]];
						for(var i in res){
							scope.suggestions.push(res[i].title)
						}
					})
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


.directive('playmovie', ['$location','depth', function ($location,depth) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			scope.$on("enter", function () {
				if(depth.get()==0||scope.searchLevel==3)
					$location.path("/play/" + scope.currentItem.id);
			})
		}
	}
}])
