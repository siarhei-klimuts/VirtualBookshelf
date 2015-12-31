import navigation from 'js/services/navigation';

angular.module('VirtualBookshelf')
.controller('NavigationCtrl', function () {
	this.stop = navigation.goStop;
	this.forward = navigation.goForward;
	this.backward = navigation.goBackward;
	this.left = navigation.goLeft;
	this.right = navigation.goRight;
});