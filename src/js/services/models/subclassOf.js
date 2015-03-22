angular.module('VirtualBookshelf')
.factory('subclassOf', function () {
	function _subclassOf() {}

	function subclassOf(base) {
	    _subclassOf.prototype = base.prototype;
	    return new _subclassOf();
	}

	return subclassOf;
});