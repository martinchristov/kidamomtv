'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('kidamom.services', []).
  value('version', '0.1').

  service('depth', [function () {
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
  }])
