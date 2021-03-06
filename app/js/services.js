'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('kidamom.services', [])
.value('version', '0.1')
.service('depth', [function () {
    var state = 0, maxState = 1;
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
                        style:'font-size:29px; margin:4px 0 0 3px;',icon:"src", href:"#/search"
                    },{
                        title:"Препоръчани",
                        style:'font-size:34px',icon:"v-5", href:"#/movies/recommended"
                    },{
                        title:"Най-гледани",
                        style:'margin:5px 0 0 -1px',icon:"people", href:"#/movies/popular"
                    },{
                        title:"Нови",
                        style:'font-size:34px',icon:"sticker", href:"#/movies/new"
                    },{
                        title:"Последно гледани",
                        style:'margin:8px 0 0 2px; font-size:24px',icon:"eye", href:"#/movies/lastwatched"
                    },{
                        title:"Любими",
                        style:'margin:7px 0 0 4px',icon:"heart", href:"#/movies/favourites"
                    },{
                        title:"Плейлисти",
                        style:'font-size:22px; margin:8px 0 0 6px;',icon:"folder", href:"#/playlists"
                    },{
                        title:"Профили",
                        style:'font-size:32px;margin-top:2px;',icon:"logout", href:"#/users"
                    }
                ];
            }
            else {
                return [
                    {
                        title:"Търсене",
                        style:"font-size:29px; margin:4px 0 0 3px;", icon:"src", href:"#/search"
                    },{
                        title:"Най-гледани",
                        style:"margin:5px 0 0 -1px", icon:"people", href:"#/movies/popular"
                    },{
                        title:"Нови",
                        style:"font-size:34px", icon:"sticker", href:"#/movies/new"
                    },{
                        title:"Профили",
                        style:"font-size:32px;margin-top:2px;", icon:"logout", href:"#/users"
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
    var homeMoviesCache = null;

    service.setToken = function (token) {
        service.token = token;
        localStorage.token = token;
        configAuth.headers['AUTHORIZATION'] = token;
    }
    service.setProfile = function (profile) {
        service.profile = profile.id;
        localStorage.profile = profile.id;
    }
    service.logout = function () {
        service.token = null;
        service.profile = null;
        delete localStorage.token ;
        delete localStorage.profile;
        delete configAuth.headers.AUTHORIZATION;
    }
    // service.logout();

    service.isAuth = function () {
        return service.token !== undefined;
    }

    service.validateToken = function(token){
        // var headers = 
        var config = {
            url:appURI.api+'/token',
            method:'GET',
            headers:{
                'X_API_KEY' : 'kidamomsonytv',
                'Accept'    : 'application/vnd.kidamom.com;version=1',
                'AUTHORIZATION':token
            }
        }
        return $http(config);
    }

    service.req = function (uri, method, data, auth) {
        if (auth && !service.token) {
            return $q.reject('NO_AUTH');
        }
        var config = auth ? angular.copy(configAuth) : angular.copy(configBase);
        config.method = method;
        config.url = appURI.api + uri;
        if (config.method === 'GET' && data !== null) {
            config.url += "/" + data.join('/');
        }
        else {
            config.data = data;
        }
        return $http(config).then(
            function success(response) { return response.data },
            function error(response) {
                if (response.status == 501) {
                    service.logout;
                    window.location.reload();
                }
                else if(response.status==402){
                    error402();
                }
                throw response;
            }
        );
    }

    /* POST /token (AUTH) email,password -> identifier */
    service.login = function (email, password) {
        if (service.token) return $q.when(service.token);
        // email = "martin.christov@gmail.com"; password="772323";
        var $promise = service.req('/token', 'POST', { email: email, password: password })
        $promise.then(function success (response) {
            // service.setProfile(response);
            if(response.hasOwnProperty("identifier")){
                // service.setToken(response.identifier);
            }
            return service.req('/profile', 'GET', null, true)
        }).then(function success (response) {
            // window.location.href="#/";
            // window.location.reload();
        });
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
        return service.req('/token/switch', 'POST', { profile_id : profileId }, true)
            .then(function success(result) {
                service.setToken(result.identifier);
                service.setProfile({ id: profileId});
            });
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
        return service.req('/search/', 'GET', [ query ], service.token !== undefined);
    }
    service.searchahead = function (query) {
        return service.req('/search_ahead/', 'GET', [ query ], service.token !== undefined);
    }
    service.getHomeMovies = function  () {
        if (homeMoviesCache) return $q.when(homeMoviesCache);
        return service.req('/home_movies', 'GET', null, service.token !== undefined).then(function (result) {
            homeMoviesCache = result;
            return result;
        })
    }

    var DEBUG = false;
    service.getMovie = function (id) {
        if (DEBUG) {
            return $http.get(appURI.getmovie + "?id=" + id).then(function success(result) { return result.data; });
        }
        else {
            return service.req('/movies', 'GET', [ id ], true);
        }
    }
    service.getPlaylist = function (id) {
        if (DEBUG) {
            return $http.get(appURI.getplaylist + "?id=" + id).then(function success(result) { return result.data.movies; });
        }
        else {
            return service.req('/playlists', 'GET', [ id ], true);
        }
    }


    // Remember me
    if (localStorage.token) {
        service.token = localStorage.token;
        service.profile = localStorage.profile;
        configAuth.headers['AUTHORIZATION'] = localStorage.token;
    }

    return service;
}])
.service('Models', [function ModelsService() {
    var models = {};
    models.carousel = function () {
        return {
            loading: false,
            active: false,
            items: [],
            index: null,
            selected: null,
            playLabel: "пусни"
        }
    }
    models.keyboard = function () {
        return {
            active: false,
            keys: [],
            index: null,
            selected: null,
            top: 0,
            center: 0,
        }
    }
    return models;
}])