'use strict';


// Declare app level module which depends on filters, and services
var kidamom = angular.module('kidamom', [
  'ngRoute',
  'kidamom.filters',
  'kidamom.services',
  // 'kidamom.directives',
  'kidamom.controllers'
])

kidamom.directive('asd',function(){console.log('wtf')})