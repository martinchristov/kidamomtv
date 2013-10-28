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

.directive('icon',function(){
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
})
.directive('carousel', ['$rootScope', 'Movies', function ($rootScope, Movies) {
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
				window.location.href = "#/play/"+scope.currentItem.id;
			});

		}
	};
}])
.directive('videoplayer', [function () {
	return {
		restrict: 'E',
		replace:true,
		templateUrl: "partials/videoplayer.html",
		link: function (scope, iElement, iAttrs) {
			
			//instantiate player
			var player;
			setTimeout(function(){
				var vjs = videojs("videoplayer",{controls:false});
				player = vjs.player_;
				iconFactory.produce($("#controls"))
			},300);
			
			//setup video controls
			scope.showControls = true;
			scope.menuItem = 4;
			scope.playing = false;

			scope.controls = [
				{ icon:"src", fill:"#fff", tsf:"" },
				{ icon:"next", fill:"#fff", tsf:"s0.9r180" },
				{ icon:"forward", fill:"#fff", tsf:"s1.4r180" },
				{ icon:"pause", fill:"#fff", tsf:"" },
				{ icon:"play", fill:"#fff", tsf:"" },
				{ icon:"forward", fill:"#fff", tsf:"s1.4" },
				{ icon:"next", fill:"#fff", tsf:"s0.9" },
				{ icon:"subs", fill:"#fff", tsf:"" }
			];


			//bind key listeners

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
					scope.showControls=true;
				}
				else {
					//pause
					if(scope.playing && scope.menuItem==3){
						scope.playing=false;
						scope.menuItem=4;
						player.pause();
					}
					//play
					else if(!scope.playing && scope.menuItem==4) {
						scope.playing=true;
						scope.menuItem=3;
						player.play();
					}
					//backward
					else if(scope.menuItem==2){

					}
					//forward
					else if(scope.menuItem==5){
						
					}
					//prev
					else if(scope.menuItem==1){
						
					}
					//next
					else if(scope.menuItem==6){
						
					}
					//subs
					else if(scope.menuItem==7){
						
					}
					//search
					else if(scope.menuItem==0){
						
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
