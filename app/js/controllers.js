'use strict';
var VK_ENTER, VK_BACK_SPACE;

/* Controllers */

angular.module('kidamom.controllers', [])
  .config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      '**'
      ]);
  })
  
  .controller('Main', ['$scope', 'depth', '$rootScope', 'Menu', 'Backend', function ($scope, depth, rootScope, Menu, Backend){
    $scope.Menu = Menu;
    $scope.movieloading=true;

  	$scope.isMenuInactive = function(){
  		if(depth.get()==0)return false;
  		else return true;
  	}
    if(VK_ENTER == undefined) VK_ENTER=13;
    if(VK_BACK_SPACE == undefined) VK_BACK_SPACE=8;

    //key navigation. to be moved to a directive
    $scope.keyDown = function(e){
      var which = "";
      switch(e.which){
        case VK_ENTER:
          holdint = setTimeout(function(){
              holdint = setInterval(hold,300);
          },2000);
          which = "enter"; break;
        case VK_BACK_SPACE:
          which = 'back';
          if(depth.get() > 0)
            e.preventDefault();
          else {
            window.close();
          }
          break;
        case 38:
          if(!LoginContext)e.preventDefault();
          which = 'keyup'; break;
        case 40:
          if(!LoginContext)e.preventDefault();
          which = 'keydown'; break;
        case 37:
          if(!LoginContext)e.preventDefault();
          which = 'keyleft'; break;
        case 39:
          if(!LoginContext)e.preventDefault();
          which = 'keyright'; break;
        case VK_PLAY:
          which='play';break;
        case VK_PAUSE:
          which='pause';break;
        case VK_STOP:
          which='stop';break;
        case VK_TRACK_NEXT:
          which='next';break;
        case VK_TRACK_PREV:
          which='prev';break;
        case VK_FAST_FWD:
          which='fwd';break;
        case VK_REWIND:
          which='rwd';break;
      }
      if(which!="")
        rootScope.$broadcast(which);

        rootScope.$broadcast("keypress",which)

        //
    }
    function hold(){
        rootScope.$broadcast("enter");
    }
    var holdint=0;
    $scope.keyUp = function(e){
        if(e.which==VK_ENTER){
            clearInterval(holdint);
        }

    }

    //check if token is valid
    Backend.req('/token','get',null,true).
        then(function(d){
          if(d.isValid==false){
            Backend.logout();
            window.location.reload();
          }
        }
        );
  }])

  .controller('Search', ['$scope','$timeout', 'depth', 'Models', function ($scope, $timeout, depth, Models) {
    $scope.carousel = Models.carousel();
    $scope.keyboard = Models.keyboard();
    $scope.keyboard.visible = false;

    $scope.$on('enter', function () {
      depth.more();
      if (!$scope.keyboard.active) {
        $timeout(function () { $scope.keyboard.active = true; $scope.keyboard.visible = true; }, 20);
      }
    })

    $scope.$on('back', function () {
      if (depth.get() == 1) {
        $scope.keyboard.visible = false;
        $scope.keyboard.active = false;
        $scope.carousel.active = false;
      }
      depth.less();
    })
  }])
  
  .controller('Movies', ['$scope','$routeParams', 'Backend', function ($scope, $routeParams, Backend){
    var playlist = $routeParams.playlist;
    var dict = {
      "nofavourites":"В момента нямате добавени любими филмчета. Можете да си добавите от нашия сайт.",
      "nolastwatched":"Нямате последно гледани филмчета."
    }
    $scope.noItemsLabel=dict["no"+playlist];
    $scope.Menu.enable();
    Backend.getHomeMovies().then(function success(result) {
      $scope.items = result[playlist];
    })
  }])

  .controller('Play', ['$scope', '$routeParams', '$http', 'movie', 'playlist', 'Models', function ($scope, $routeParams, $http, movie, playlist, Models) {
    $scope.carousel = Models.carousel();
    $scope.keyboard = Models.keyboard();
    $scope.keyboard.visible = false;


    // $scope.carousel = {};
    $scope.Menu.visible = false;
    $scope.Menu.disable();
    $scope.movie = movie;

    $scope.playlist = playlist.movies;
    $scope.playlistId = playlist.id;

    $scope.languages=[];
    for(var i in $scope.movie.videos){
        $scope.languages.push({
            key:$scope.movie.videos[i].languageLocale,
            locale:langLocale[$scope.movie.videos[i].languageLocale],
            sources:$scope.movie.videos[i].sources
        })
    }



    movie.videos.forEach(function (item) {
      if (item.languageLocale === 'bg') $scope.movieUrl = item.sources.tv;
    });
    $scope.currentInList=0;
    if ($scope.playlist && $scope.playlist.length) {
      $scope.playlist.forEach(function (item, index) {
        if (item.id === movie.id)
          $scope.currentInList = index;
      });
    }
    else $scope.playlist = []
  }])
  .controller('Playlists', ['$scope', 'Backend', '$location', function ($scope, Backend, $location){
    $scope.Menu.enable();
    $scope.noItemsLabel="В момента нямате плейлисти. Можете да си съставите чрез нашия сайт.";
    Backend.getPlaylists().then(function success(playlists) {
      $scope.items = playlists;
      $scope.items.forEach(function (item) {
        if (item.movies.length) item.photo = item.movies[0].photo;
      })
    });

    $scope.$on('enter', function () {
      if (!$scope.carousel.item.movies.length) return;
      $location.path('/play/' + $scope.carousel.item.movies[0].id + "/" + $scope.carousel.item.id);
    })

  }])

  .controller('Users', ['$scope', 'depth', 'Backend', '$route', '$location', function ($scope, depth, Backend, $route, $location) {
    $scope.data = {};
    $scope.loggedIn = Backend.isAuth();
    $scope.carousel = {playLabel: "зареди профил"};

    $scope.back = function(){
      depth.less();
      LoginContext=false;
      $("#users input:first").blur();
    }

    if (!Backend.isAuth()) {
        $scope.items = [
          {
            id:null,
            photo:"img/logout.jpg",
            name:""
          }
        ]
        $scope.carousel.playLabel = "вход";
        $scope.$on("enter",function(){
          $location.path("/login")
        })
    }
    else {
      Backend.getProfiles().then(function success(profiles){
        $scope.items = profiles;
        $scope.items.forEach(function (item, index) {
          item.photo = item.avatar;
          if (item.id == Backend.profile) $scope.carousel.initial = index;
        });
        $scope.items.push({ id: null, photo: 'img/logout.jpg', name:"изход"})
      });
      $scope.$on('enter', function () {
        try{
        if ($scope.carousel.item.id !== null) {
          Backend.switchProfile($scope.carousel.item.id).then(function success(result) {
          })
        }
        else {
          Backend.logout();
          window.location.reload();
        }
        }catch(e){
      Backend.logout();
      window.location.href="#/";
      window.location.reload();
        }
        window.location.href="#/";
      })
    }
  }]).

controller('Login', ['$scope', 'Backend', 'depth', '$location', function ($scope, Backend, depth, $location) {
    $scope.Menu.visible = false;
    $scope.Menu.disable();
    $scope.vertical=1;
    $scope.pass = $scope.email = "";
    $scope.error = false;
    // var token;
    // posKeyboard();
    Backend.req('/token','post',null,false)
    .then(function(d){
      $scope.activationCode = d.identifier;
      // Backend.setToken(d.identifier);
      waitForResponse();
    })
    $scope.$on("back",function(){
      Backend.logout();
      window.location.href="#/";
      window.location.reload();
    })

    
    function waitForResponse () {
      var int = setInterval(function(){
        Backend.validateToken($scope.activationCode).
        then(function(d){
          if(d.data.isValid){
            clearInterval(int);
            Backend.setToken($scope.activationCode);
            window.location.href="#/";
            window.location.reload();
          }
        })
      },5000)
    }
    
}])

  var LoginContext = false;