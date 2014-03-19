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

			function selectMenuItem(url) {
				scope.menu.some(function (item, index) {
					if (url.indexOf(item.href) !== -1) {
						scope.menuItem = index;
						return true;
					}
				})
			}
			selectMenuItem($location.$$absUrl);
			scope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
				selectMenuItem(newUrl);
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
}]).
directive('keyboard', ["$sce",function ($sce) {
	return {
		restrict: 'E',
		templateUrl:"partials/keyboard.html",
		link: function (scope, iElement, iAttrs) {
			// scope.keyboard="abcdefghijklmnopqrstuvwxyz< 0123456789!@#$%^&*()_-+=[]{};:?.,";
			scope.keyboard=['<img src="img/shift.png" class="shift">',"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "_", "-", ".", '<img src="img/backspace.png" class="shift">', " ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "+", "=", "[", "]", "{", "}", ";", ":", "?", ","];
			scope.curChar = 0;
			scope.center = $(window).width()/2;

			scope.rawHtml = function(i) {
			    return $sce.trustAsHtml(scope.keyboard[i]);
		  	};
		}
	}	
}])
.directive('carousel', ['$rootScope', 'Movies', '$location', function ($rootScope, Movies, $location) {
	return {
		restrict: 'E',
		templateUrl: 'partials/carousel.html',
		scope: { 
			items: "=?items",
			carousel: "=model",
			searchLevel: "=",
		},
		link: function (scope, iElement, iAttrs) {
			var max = 30;
			if (!scope.carousel) scope.carousel = {playLabel: "пусни"};
			scope.carousel.visible=true;
			function init() {
				if (!scope.items) { 
					scope.carousel.loading = true; 
					scope.carousel.length = 0;
				}
				else {
					scope.carousel.loading = false;
					scope.carousel.index = scope.carousel.initial || 0;
					scope.carousel.item = scope.items[scope.carousel.index];
					scope.carousel.length = Math.min(scope.items.length, max);
				}
			}
			init();

			scope.$watch('items', function (newValue) {
				init();
			});
			scope.$on("keyleft",function(){
				if(scope.searchLevel==3 || scope.carousel.active || (scope.carousel.active === undefined && scope.searchLevel === undefined)){
					scope.carousel.index--;
		  			if(scope.carousel.index<0)scope.carousel.index=0;
			  		scope.carousel.item = scope.items[scope.carousel.index];
			  	}
			})
			scope.$on("keyright",function(){
				if(scope.searchLevel==3 || scope.carousel.active || (scope.carousel.active === undefined && scope.searchLevel === undefined)){
					scope.carousel.index++;
		  			if(scope.carousel.index>= scope.carousel.length) 
		  				scope.carousel.index = scope.carousel.length - 1;
		  			scope.carousel.item = scope.items[scope.carousel.index];
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
			scope.player = player;
			
			//setup video controls
			scope.showControls = true;
			scope.menuItem = 4;
			scope.playing = false;
			scope.searchOn=false;
			scope.center = $(window).width()/2;
			scope.controlTimeout = null;
			scope.$parent.movieloading=true;

			scope.controls = [
				{ style:"", action:"search", icon:"src", fill:"#fff", tsf:"" },
				{ style:"-webkit-transform:rotate(180deg);-o-transform:rotate(180deg);margin:-12px 0 0 -1px;", action:"prev", icon:"next", fill:"#fff", tsf:"s0.9r180" },
				{ style:"-webkit-transform:rotate(180deg);-o-transform:rotate(180deg);font-size:24px;margin:-14px 0 0 7px;", action:"backward", icon:"forward", fill:"#fff", tsf:"s1.4r180" },
				{ style:"", action:"pause", icon:"pause", fill:"#fff", tsf:"" },
				{ style:"font-size:30px; margin-top:-2px;", action:"play", icon:"play", fill:"#fff", tsf:"" },
				{ style:"font-size:24px;margin:2px 0 0 -7px;", action:"forward", icon:"forward", fill:"#fff", tsf:"s1.4" },
				{ style:"", action:"next", icon:"next", fill:"#fff", tsf:"s0.9" },
				{ style:"font-size:32px;margin-top:-3px", action:"speech", icon:"globe", fill:"#fff", tsf:"s1.1" },
				{ style:"font-size:32px;margin-top:-2px", action:"back", icon:"back", fill:"#fff", tsf:"s0.9" }
			];

			// player.addEventListener("loadstart",function(){
			// 	scope.$parent.movieloading=false;
			// })
			// setTimeout(function(){
			// 	scope.$parent.movieLoaded();
			// },2000);
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

			player.addEventListener('ended', function () {
				if (scope.playlist && scope.playlist.length > scope.currentInList) {
					var movieid = scope.playlist[scope.currentInList + 1].id;
					var playlistid = scope.playlistId;
					$location.path('/play/' + movieid + "/" + playlistid);
					$location.replace();
				}
				else {
					$location.path('/');
				}
			});
			//remove loading
			player.addEventListener("canplaythrough",function(){
				$("#videoplayer").css({height:$(window).height()})
				setTimeout(function(){
					// scope.$parent.movieLoaded();
					scope.$parent.movieloading=false;
					scope.playing=true;
					scope.menuItem=3;
					scope.controlsx = scope.menuItem*50+60;
					player.play();
					if(scope.continueFromTime!=undefined){
						player.currentTime = scope.continueFromTime;
						delete scope.continueFromTime;
					}
					hideint = setTimeout(hideControls,5000);
					setTimeout(function(){
						$("#watermark").addClass("compact")
					},10000);
				},5000);
			})

			//setup playlist


			//KEY LISTENERS

			//navigate controls
			scope.controlsx = 3*50+60;

			scope.$on("keyleft",function(){

				if(scope.showControls)
				{
					// skip over hidden pause/play controls
					if(scope.menuItem>0)scope.menuItem--;
					if(!scope.playing&&scope.menuItem==3)scope.menuItem--;
					else if(scope.playing&&scope.menuItem==4)scope.menuItem--;

					//skip over disabled next/prev
					if(scope.menuItem==1&&scope.currentInList==0)scope.menuItem--;
					else if(scope.menuItem==6&&(scope.playlist.length==0||scope.currentInList+1==scope.playlist.length))scope.menuItem--;


					scope.controlsx = scope.menuItem*50+60;
					if(scope.menuItem>3)scope.controlsx-=50;
				}
			})
			scope.$on("keyright",function(){
				if(scope.showControls)
				{
					// skip over hidden pause/play controls
					if(scope.menuItem<scope.controls.length-1)scope.menuItem++;
					if(scope.playing&&scope.menuItem==4)scope.menuItem++;
					else if(!scope.playing&&scope.menuItem==3)scope.menuItem++;

					//skip over disabled next/prev
					if(scope.menuItem==1&&scope.currentInList==0)scope.menuItem++;
					else if(scope.menuItem==6&&(scope.playlist.length==0||scope.currentInList+1==scope.playlist.length))scope.menuItem++;


					scope.controlsx = scope.menuItem*50+60;
					if(scope.menuItem>3)scope.controlsx-=50;
				}
				
			})

			//control actions on enter
			window.$location = $location;
			scope.$on("keypress",function(e,which){
				if(scope.showControls){
					clearInterval(hideint);
					hideint = setTimeout(hideControls,5000)
				}
				else {
					if(!scope.searchOn&&scope.showLanguage!=true&&which!='back')scope.showControls=true;
				}
			})
			var hideint= 0;
			function hideControls(){
				scope.showControls=false;
				scope.$apply();
			}
			scope.$on("enter",function(){
				clearInterval(hideint)
				if (scope.showControls==false) {
					// if(scope.searchLevel<1)
					// 	scope.showControls=true;
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
						player.currentTime -= 30;
						scope.progress=player.currentTime/player.duration;
					}
					else if(action=="forward"){
						player.currentTime += 30;
						scope.progress=player.currentTime/player.duration;
					}
					else if(action=="prev" && scope.playlist){
						if (scope.currentInList > 0) {
							var movieid = scope.playlist[scope.currentInList - 1].id;
							var playlistid = scope.playlistId;
							$location.path('/play/' + movieid + "/" + playlistid);
							$location.replace();
						}
					}
					else if(action=="next" && scope.playlist){
						if (scope.currentInList < scope.playlist.length - 1) {
							var movieid = scope.playlist[scope.currentInList + 1].id;
							var playlistid = scope.playlistId;
							$location.path('/play/' + movieid + "/" + playlistid);
							$location.replace();
						}
					}
					else if(action=="speech"){
						depth.more();
						setTimeout(function(){
							scope.showControls=false;
							scope.showLanguage=true;
							scope.$apply();
						},20);
					}
					else if(action=="search"){
						depth.more();
						setTimeout(function(){
							scope.showControls=false;
							scope.searchOn=true;
							// scope.searchLevel=2;

							scope.keyboard.active = true; 
							scope.keyboard.visible = true;
							scope.carousel.visible = true;
							scope.carousel.active=false;

							scope.$apply();
						},20);
					}
					else if(action=="back"){
						$location.path("/")
					}
				}
			})
			scope.$on("back",function(){
				if (scope.showControls) {
					scope.showControls=false;
				}
				else if(scope.showLanguage){
					scope.showLanguage=false;
					scope.showControls=true;
				}
				else{
					if(scope.searchOn){
						// depth.less();
						// scope.searchLevel=0;
						scope.showControls=true;
						scope.searchOn=false;
						scope.keyboard.visible=false;
						scope.keyboard.active=false;
						scope.carousel.visible=false;
						scope.carousel.active=false;
					}
					else
						$location.path("/")
				}
			})

			//native RC keys

			scope.$on("play",function(){
				if(scope.playing==false){
					scope.playing=true;
					scope.menuItem=3;
					player.play();
				}
			})
			scope.$on("pause",function(){
				if(scope.playing){
					scope.playing=false;
					scope.menuItem=4;
					player.pause();
				}
			})
			scope.$on("stop",function(){
				$location.path("/")
			})
			scope.$on("fwd",function(){
				player.currentTime += 30;
				scope.progress=player.currentTime/player.duration;
			})
			scope.$on("rwd",function(){
				player.currentTime -= 30;
				scope.progress=player.currentTime/player.duration;
			})
			scope.$on("prev",function(){
				if(scope.playlist){
					if (scope.currentInList > 0) {
							var movieid = scope.playlist[scope.currentInList - 1].id;
							var playlistid = scope.playlistId;
							$location.path('/play/' + movieid + "/" + playlistid);
							$location.replace();
						}
				}
			})
			scope.$on("next",function(){
				if(scope.playlist){
					if (scope.currentInList < scope.playlist.length - 1) {
							var movieid = scope.playlist[scope.currentInList + 1].id;
							var playlistid = scope.playlistId;
							$location.path('/play/' + movieid + "/" + playlistid);
							$location.replace();
						}
				}
			})
		}
	};
}])

.directive('language', ['depth', function (depth) {
	return {
		restrict: 'E',
		replace:'true',
		templateUrl:"partials/language.html",
		link: function (scope, iElement, iAttrs) {
			scope.curLang = 0;
			if (localStorage.lang) {
				scope.languages.forEach(function (lang, index) {
					if (lang.key == localStorage.lang) {
						scope.curLang = index;
					}
				});
			}
			scope.$on("keydown",function(){
				if(scope.showLanguage){

					if(scope.curLang<scope.languages.length-1){
						scope.curLang++;
					}
					else if(scope.curLang==scope.languages.length-1){
						scope.showLanguage=false;
						scope.showControls=true;
					}
				}
			})
			scope.$on("keyup",function(){
				if(scope.showLanguage){
					if(scope.curLang>0)scope.curLang--;
				}
			})
			scope.$on("enter",function(){
				if(scope.showLanguage){
					if (localStorage.lang !== scope.languages[scope.curLang].key) {
						scope.continueFromTime = scope.player.currentTime;
						scope.movieUrl = scope.movie.videos[scope.curLang].sources.tv;
						scope.player.load();
						scope.$parent.movieloading=true;
						$("#watermark").removeClass("compact");
						localStorage.lang = scope.languages[scope.curLang].key;
					}
					scope.showLanguage=false;
				}
			})
		}
	};
}])

.directive('search', ['$rootScope', 'depth', '$timeout', 'Backend', function ($rootScope, depth, $timeout, Backend) {
	return {
		restrict: 'E',
		replace:true,
		templateUrl:"partials/search-directive.html",
		link: function (scope, iElement, iAttrs) {
			scope.items=[];

			// scope.keyboard="abcdefghijklmnopqrstuvwxyz< 0123456789";
			scope.keyboard="< абвгдежзийклмнопрстуфхцчшщъьюя0123456789";
			// scope.keyboard="джу";
			scope.center = $(window).width()/2;

			scope.sug = {};
			scope.sug.text = "";
			scope.sug.dom = $("#src-head ul:first");
			scope.sug.evalWidth = function () {
				var w = 0;
				scope.sug.dom.find('li').each(function(){
					w+=$(this).width()+26;
				})
				scope.sug.width=w;
			}
			scope.sug.evalPos = function () {
				var cur = $(scope.sug.dom.find('li')[scope.sug.current]);
				try{
					scope.sug.pos = scope.center - cur.position().left - cur.width() - 15;
				}
				catch(e){
					console.log(scope.sug.current, scope.sug.dom.find('li'))
				}
			}
			$timeout(function () {
				scope.carousel.loading = false;
				scope.sug.evalWidth();
				scope.sug.evalPos();
			}, 100);

			//key listeners
			scope.$on("keyleft",function(){
				if (scope.keyboardActive && scope.curChar > 0) {
					scope.curChar--;
				}
			})
			scope.$on("keyright",function(){
				if (scope.keyboardActive && scope.curChar < scope.keyboard.length) {
					scope.curChar++;
				}
			})

			scope.$on("keydown",function(){
				if(scope.searchLevel<3&&depth.get()>0&&scope.searchOn!=false){
					if(scope.items.length==0&&scope.searchLevel==2)return;
					scope.searchLevel++;
				}
			})
			scope.$on("keyup",function(){
				if(scope.searchLevel>1&&scope.searchOn!=false)scope.searchLevel--;
			})

			scope.$on("enter",function(){
				if(scope.searchLevel==1){
					scope.carousel.loading = true;
					var promise = Backend.search(scope.suggestions[scope.curSug])
					promise.then(function(res){
						// scope.items = res;
						scope.items=res;
						scope.items.forEach(function (item) {
				          item.duration = (item.duration/60).toFixed();
				        })
						scope.carousel.item = scope.items[0];
						scope.searchLevel=3;
						scope.carousel.loading = false;
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
					},300);
					
					// scope.$apply();
				}
			})
		}
	};
}])

.directive('searchnew', ['depth', 'Backend', '$timeout', function (depth, Backend, $timeout) {
	return {
		restrict : 'E',
		replace : true,
		templateUrl : "partials/searchnew.html",
		link: function (scope, iElement, iAttrs) {
			scope.keyboard.keys = "< абвгдежзийклмнопрстуфхцчшщъьюя0123456789";
			scope.keyboard.center = $(window).width()/2;

			scope.items=[];

			scope.$on('enter', function () {
				if (scope.keyboard.active) {
					if (scope.keyboard.selected != "<") {
						scope.sug.text += scope.keyboard.selected;
					}
					else {
						scope.sug.text = scope.sug.text.slice(0, -1);
					}
					$timeout(function(){
						scope.sug.evalWidth();
						scope.sug.evalPos();
					},300);
					// Load suggestions
					if (scope.sug.text.length >= 3) {
						scope.carousel.loading = true;
						var promise = Backend.search(scope.sug.text);
						promise.then(function(res){
							scope.items=res;
							scope.items.forEach(function (item) {
				          		item.duration = (item.duration/60).toFixed();
				        	})
							scope.carousel.item = scope.items[0];
							scope.carousel.loading = false;
						})
					}
				}// if (scope.keyboard.active)
				else if (scope.carousel.active) {

				}
			})

			scope.$on('keyup', function () {
				if (scope.carousel.active) {
					console.log('up');
					scope.carousel.active = false;
					scope.keyboard.active = true;
				}
			})
			scope.$on('keydown', function () {
				if (scope.keyboard.active) {
					console.log('down')
					scope.carousel.active = true;
					scope.keyboard.active = false;
				}
			})
			scope.sug = {};
			scope.sug.text = "";
			scope.sug.dom = $("#src-head ul:first");
			scope.sug.evalWidth = function () {
				var w = 0;
				scope.sug.dom.find('li').each(function(){
					w+=$(this).width()+26;
				})
				scope.sug.width=w;
			}
			scope.sug.evalPos = function () {
				var cur = $(scope.sug.dom.find('li'));
				try{
					scope.sug.pos = scope.keyboard.center - cur.position().left - cur.width() - 15;
				}
				catch(e){
					console.log(scope.sug.current, scope.sug.dom.find('li'))
				}
			}
			$timeout(function () {
				scope.carousel.loading = false;
				scope.sug.evalWidth();
				scope.sug.evalPos();
			}, 100);
			/*
			scope.$on("keydown",function(){
				if(scope.searchLevel<3&&depth.get()>0&&scope.searchOn!=false){
					if(scope.items.length==0&&scope.searchLevel==2)return;
					scope.searchLevel++;
				}
			})
			scope.$on("keyup",function(){
				if(scope.searchLevel>1&&scope.searchOn!=false)scope.searchLevel--;
			})

			scope.$on("enter",function(){
				if(scope.searchLevel==1){
					scope.carousel.loading = true;
					var promise = Backend.search(scope.suggestions[scope.curSug])
					promise.then(function(res){
						// scope.items = res;
						scope.items=res;
						scope.items.forEach(function (item) {
				          item.duration = (item.duration/60).toFixed();
				        })
						scope.carousel.item = scope.items[0];
						scope.searchLevel=3;
						scope.carousel.loading = false;
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
					},300);
					
					// scope.$apply();
				}
			})*/
		}
	};
}])

.directive('keyboardnew', [ function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/keyboardnew.html',
		scope: {
			keyboard: "=model",
		},
		link: function (scope, iElement, iAttrs) {
			scope.goto = function (newIndex) {
				if (scope.keyboard.keys.length < newIndex + 1) return;
				scope.keyboard.index = newIndex;
				scope.keyboard.selected = scope.keyboard.keys[newIndex];
			}
			scope.left = function () { 
				if (scope.keyboard.active && scope.keyboard.index>0) return scope.goto(scope.keyboard.index - 1); 
			}
			scope.right = function () { if (scope.keyboard.active) return scope.goto(scope.keyboard.index + 1); }


			if (scope.keyboard.index === null) {
				scope.goto(0)
			}
			scope.$on('keyleft', scope.left);
			scope.$on('keyright', scope.right);
		}
	}
}])


.directive('playmovie', ['$location','depth', 'Backend', function ($location,depth, Backend) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			scope.$on("enter", function () {
				if(depth.get()==0||scope.searchLevel==3|| scope.carousel.active){
					delete localStorage.lang;
					if(Backend.isAuth()) 
						$location.path("/play/" + scope.carousel.item.id);
					else $location.path("/users")
				}
			})
		}
	}
}])
