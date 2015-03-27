angular.module('VirtualBookshelf')
.controller('CreateLibraryCtrl', function (createLibrary) {
	this.list = createLibrary.list;
	this.model = createLibrary.model;
	this.getImg = createLibrary.getImg;
	this.create = createLibrary.create;
});