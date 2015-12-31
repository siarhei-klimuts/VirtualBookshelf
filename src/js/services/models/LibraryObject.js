import BaseObject from './BaseObject';

export default class LibraryObject extends BaseObject {
	constructor(params, geometry, material) {
		super(params, geometry, material);
	}
}

//TODO: for test, remove after test repaired
angular.module('VirtualBookshelf')
.factory('LibraryObject', function () {
	return LibraryObject;	
});