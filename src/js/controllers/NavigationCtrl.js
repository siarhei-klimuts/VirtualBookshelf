import {navigation} from 'lib3d';

angular.module('VirtualBookshelf')
.controller('NavigationCtrl', function () {
	this.stop = navigation.goStop;
	this.forward = navigation.goForward;
	this.backward = navigation.goBackward;
	this.left = navigation.goLeft;
	this.right = navigation.goRight;
});