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
    var headers = {
        'X_API_KEY' : 'kidamomsonytv',
        'Accept'    : 'application/vnd.kidamom.com;version=1'
    }
    var configBase = { headers: headers };
    var configAuth = angular.copy(configBase);
    var service = { };


    service.switchToken = function (token) {
        service.token = token;
        localStorage.setItem('token', token);
        configAuth.headers['AUTHORIZATION'] = token;
    }

    service.req = function (uri, method, data, auth) {
        if (auth && !service.token) {
            return $q.reject('NO_AUTH');
        }
        var config = auth ? angular.copy(configAuth) : angular.copy(configBase);
        config.method = method;
        config.url = appURI.api + uri;
        config.data = data;
        return $http(config).then(
            function success(response) { return response.data },
            function error(response) { return response.data }
        );
    }

    /* POST /token email,password -> identifier */
    service.login = function (email, password) {
        if (service.token) return $q.when(service.token);

        var $promise = service.req('/token', 'POST', { email: email, password: password });
        $promise.then(function success(result) {
            service.switchToken(result.identifier);
        })
        return $promise;
    }
    /* GET AUTH /token -> token isValid */
    service.checkToken = function () {
    }
    /* DELETE AUTH /token -> delete token */
    service.deleteToken = function () {

    }

    service.getProfiles = function () {
        return service.req('/account', 'GET', null, true);
    }

    service.getPlaylists = function () {
        return service.req('/playlists', 'GET', null, true);
    };

    service.getHomeMovies = function  () {
        return service.req('/home_movies', 'GET', null, service.token !== undefined);
    }


    // Load token from previous login
    if (localStorage.token) {
        service.token = localStorage.token;
        configAuth.headers['AUTHORIZATION'] = localStorage.token;
    }

    return service;
}])