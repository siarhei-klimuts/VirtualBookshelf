import BaseObject from './BaseObject';

angular.module('VirtualBookshelf')
.factory('LibraryObject', function (subclassOf) {
	var LibraryObject = function(params, geometry, material) {
		BaseObject.call(this, params, geometry, material);
	};

	LibraryObject.prototype = subclassOf(BaseObject);

	return LibraryObject;	
});