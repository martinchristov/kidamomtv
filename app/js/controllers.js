'use strict';

/* Controllers */

angular.module('kidamom.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }])
  .controller('Main', ['$scope', function($scope){
  	$scope.keyPressed = function(e){
  		$scope.keyCode = e.which;
  	}
  }])