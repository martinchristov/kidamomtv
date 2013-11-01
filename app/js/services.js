'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('kidamom.services', [])
  .value('version', '0.1')
  .service('depth', [function () {
  	var state = 0, maxState = 3;
  	return {
  		more:function(){
  			state++;
  			if(maxState<state)state = maxState;
  		},
  		less:function(){
  			state--;
  			if(state<0)state=0;
  		},
  		get:function(){
  			return state;
  		}
  	}
  }]).
  service('Playlist', [function () {
    var movieItems = [
      {
          id:22,
          photo:"sampledata/1.jpg",
          title:"The nut job",
          desc:"Surly, a curmudgeon, independent squirrel is banished from his park and forced to survive in the city. Lucky for him, he stumbles on the one thing that may be able to save his life, and the rest of park community, as they gear up for winter - Maury's Nut Store.",
          duration:95,
          age:6,
          url: 'http://www.auby.no/files/video_tests/h264_1080p_hp_4.1_40mbps_birds.mkv'
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
    ]

    return {
        getMovie:function(id){
            
        }
    }
  }])
  .service('Movies', [function () {
    
    var movies = [
        {
          id:22,
          photo:"sampledata/1.jpg",
          title:"The nut job",
          desc:"Surly, a curmudgeon, independent squirrel is banished from his park and forced to survive in the city. Lucky for him, he stumbles on the one thing that may be able to save his life, and the rest of park community, as they gear up for winter - Maury's Nut Store.",
          duration:95,
          age:6,
          url: 'http://www.auby.no/files/video_tests/h264_1080p_hp_4.1_40mbps_birds.mkv'
        },
        {
          id:22,
          photo:"sampledata/2.jpg",
          title:"Epic",
          desc:"lorem ipsum some more text here",
          duration:95,
          age:6,
        },
        {
          id:22,
          photo:"sampledata/3.jpg",
          title:"The croods",
          desc:"lorem ipsum some more text here",
          duration:95,
          age:6
        },
        {
          id:22,
          photo:"sampledata/4.jpg",
          title:"Cloudy with a chance of meatballs",
          desc:"lorem ipsum some more text here",
          duration:95,
          age:6
        },
        {
          id:22,
          photo:"sampledata/3.jpg",
          title:"The croods",
          desc:"lorem ipsum some more text here",
          duration:95,
          age:6
        },
        {
          id:22,
          photo:"sampledata/4.jpg",
          title:"Cloudy with a chance of meatballs",
          desc:"lorem ipsum some more text here",
          duration:95,
          age:6
        }]
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
