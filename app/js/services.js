'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('kidamom.services', [])
.value('version', '0.1')
.service('depth', [function () {
    var state = 0, maxState = 3;
    return {
        more:function() {
          state++;
          if(maxState<state)state = maxState;
        },
        less:function() {
            state--;
            if(state<0)state=0;
        },
        get:function() {
            return state;
        }
    }
}])
.service('Playlist', [function () {
    var movieItems = [
        {
            id:22,
            photo:"sampledata/1.jpg",
            title:"The nut job",
            desc:"Surly, a curmudgeon, independent squirrel is banished from his park and forced to survive in the city. Lucky for him, he stumbles on the one thing that may be able to save his life, and the rest of park community, as they gear up for winter - Maury's Nut Store.",
            duration:95,
            age:6,
            url: 'sampledata/cloudy.mp4'
        },
        {
            id:23,
            photo:"sampledata/2.jpg",
            title:"Epic",
            desc:"lorem ipsum some more text here",
            duration:95,
            age:6,
        },
        {
            id:24,
            photo:"sampledata/3.jpg",
            title:"The croods",
            desc:"lorem ipsum some more text here",
            duration:95,
            age:6
        },
        {
            id:25,
            photo:"sampledata/4.jpg",
            title:"Cloudy with a chance of meatballs",
            desc:"lorem ipsum some more text here",
            duration:95,
            age:6
        },
        {
            id:26,
            photo:"sampledata/3.jpg",
            title:"The croods",
            desc:"lorem ipsum some more text here",
            duration:95,
            age:6
        },
        {
            id:27,
            photo:"sampledata/4.jpg",
            title:"Cloudy with a chance of meatballs",
            desc:"lorem ipsum some more text here",
            duration:95,
            age:6
        }
    ] // movieitems

    return {
        getMovie:function(id){

        }
    }
}])
.service('Movies', [function () {

    var movies = [
    {
        id:1,
        photo:"sampledata/Donkey_Xote_movie_poster.jpg",
        title:"Донке Хоте",
        desc:"Ще стигнат ли Руси, Дон Кихот и Росинант до края на тяхното приключение? И ако стигнат, ще успеят ли да победят Рицаря на Полумесеца?",
        duration:95,
        age:6,
        url: 'http://79.124.63.33/vod/_definst_/Donkey/bg/smil:desktop.smil/playlist.m3u8'
    },
    {
        id:2,
        photo:"sampledata/Umnikyt-Jack.jpg",
        title:"Умникът Джаk",
        desc:"Умникът Джак е смело, весело и необикновено зверче.",
        duration:95,
        age:6
    },
    {
        id:3,
        photo:"sampledata/happy-elf.jpg",
        title:"Щастливият Елф",
        desc:"Това удивително анимационно филмче ще зазвъни празнично с много смях и веселие.",
        duration:95,
        age:6
    },
    {
        id:4,
        photo:"sampledata/Kaspyr-Koleda.jpg",
        title:"Каспър",
        desc:"В навечерието на Коледа, Каспър е в отлично настроение!",
        duration:95,
        age:6
    },
    {
        id:5,
        photo:"sampledata/masha.jpg",
        title:"Маша и Мечо",
        desc:"Най-популярният анимационен сериал, любим на малки и големи!",
        duration:95,
        age:6
    }];

    var selectedMovie = null;
    return {
        getAll: function() {
            return movies;
        },
        getSelected: function () {
            return selectedMovie;
        },
        select: function (index) {
            selectedMovie = movies[index];
        }
    }
}])
.service('Menu', ['depth', function (depth) {
    return {
        visible: true,
        disable: function () { depth.more(); },
        enable: function () { while (depth.get() != 0) depth.less(); this.visible = true; }
    }
}])
.service('Backend', ['$http', '$q', function BackendService($http, $q) {
    var config_base = { headers: { 'X_API_KEY': 'kidamomsonytv', 'Accept': 'application/vnd.kidamom.com;version=1' }};
    var config_auth = angular.copy(config_base);
    var service = {};

    service.identifier = localStorage.getItem('identifier');
    config_auth.headers['AUTHORIZATION'] = service.identifier;
    service.login = function (email, password) {
        if (service.identifier) return $q.when(service.identifier);

        var $promise = $http.post(appURI.api + "/token", { email: email, password: password}, config_base);
        $promise.then(function success(response) {
            var id = response.data.identifier;
            service.identifier = id;
            localStorage.setItem('identifier', id);
            config_auth.headers['AUTHORIZATION'] = id;
        });
        return $promise;
    }
    service.getProfiles = function () {
        if (!service.identifier) return [];

        var $promise = $http.get(appURI.api + "/account", config_auth).then(function success(response) { 
          return response.data.profiles;  
        });
        return $promise;
    }

    service.login = function (email, password) {
        if (service.identifier) return service.identifier;

        var $promise = $http.post(appURI.api + "/token", { email: email, password: password}, config_base);
        $promise.then(function success(response) {
            var id = response.data.identifier;
            service.identifier = id;
            localStorage.setItem('identifier', id);
            config_auth.headers['AUTHORIZATION'] = id;
      });
        return $promise;
    }

    service.getPlaylists = function () {
        if (!service.identifier) return [];

        var $promise = $http.get(appURI.api + "/playlists", config_auth).then(function success(response) {
            return response.data;
        })
        return $promise;
    };

    service.getHomeMovies = function  () {
        if (!service.identifier) return [];
        var $promise = $http.get(appURI.api + "/home_movies", config_auth).then(function success(response) {
            return response.data;
        })
        return $promise;
    }

    return service;
}])
/*.service('Login', ['$http', function LoginService($http) {
    var 
}])*/
/*.service('Backend', ['$http', function BackendService($http) {
    var config_base = { headers: { 'X_API_KEY': 'kidamomsonytv', 'Accept': 'application/vnd.kidamom.com;version=1' } };

    var service = {};

    service.get = function (uri, data, auth) {
        return $http.
    }
}])*/