angular.module('VirtualBookshelf')
.factory('catalog', function ($q, Data, User, block) {
	var catalog = {};

	catalog.books = null;

	catalog.loadBooks = function() {
		var promise;
		var userId = User.getId();

		if(userId) {
			block.inventory.start();
			promise = $q.when(userId ? Data.getUserBooks(userId) : null).then(function (result) {
				catalog.books = result;
			}).finally(function () {
				block.inventory.stop();	
			});
		}

		return promise;
	};

	return catalog;
});