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
.service('Menu', ['depth', 'Backend', function (depth, Backend) {
    return {
        visible: true,
        disable: function () { depth.more(); },
        enable: function () { while (depth.get() != 0) depth.less(); this.visible = true; },
        getItems: function () { 
            if(Backend.isAuth()){
                return [
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
                        icon:"eye", tsf:"s1.2", href:"#/movies/lastwatched"
                    },{
                        title:"Любими",
                        icon:"heart", tsf:"s1", href:"#/movies/favourites"
                    },{
                        title:"Плейлисти",
                        icon:"folder", tsf:"s1", href:"#/playlists"
                    },{
                        title:"Профили",
                        icon:"logout", tsf:"s1", href:"#/users"
                    }
                ];
            }
            else {
                return [
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
                ];
            }
        },
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


    service.setToken = function (token) {
        service.token = token;
        localStorage.token = token;
        configAuth.headers['AUTHORIZATION'] = token;
    }

    service.req = function (uri, method, data, auth) {
        if (auth && !service.token) {
            return $q.reject('NO_AUTH');
        }
        var config = auth ? angular.copy(configAuth) : angular.copy(configBase);
        config.method = method;
        config.url = appURI.api + uri;
        if (config.method === 'GET') config.params = data;
        else config.data = data;
        return $http(config).then(
            function success(response) { return response.data },
            function error(response) { return response.data }
        );
    }

    service.isAuth = function () {
        return service.token !== undefined;
    }

    /* POST /token (AUTH) email,password -> identifier */
    service.login = function (email, password) {
        if (service.token) return $q.when(service.token);

        var $promise = service.req('/token', 'POST', { email: email, password: password });
        $promise.then(function success(result) {
            service.setToken(result.identifier);
        })
        return $promise;
    }
    /* GET /token (AUTH) -> isValid */
    service.checkToken = function () {
    }
    /* DELETE /token (AUTH) ->  */
    service.deleteToken = function () {

    }
    /* POST /token/switch (AUTH) profileId -> profile */
    service.switchProfile = function (profileId) {
        return service.req('/token/switch', 'POST', { profile_id : profileId }, true);
    }
    /* GET /playlists (AUTH) -> array of playlists */
    service.getPlaylists = function () {
        return service.req('/playlists', 'GET', null, true);
    };
    service.getProfiles = function () {
        return service.req('/account', 'GET', null, true).then(function success(result) {
            return result.profiles;
        })
    }
    service.search = function (query) {
        return service.req('/search', GET, { query: query }, true);
    }
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