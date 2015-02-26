angular.module('VirtualBookshelf')
.factory('catalog', function ($q, data, user, block) {
	var catalog = {};

	catalog.books = null;

	catalog.loadBooks = function() {
		var promise;
		var userId = user.getId();

		if(userId) {
			block.inventory.start();
			promise = $q.when(userId ? data.getUserBooks(userId) : null).then(function (result) {
				catalog.books = result;
			}).finally(function () {
				block.inventory.stop();	
			});
		}

		return promise;
	};

	return catalog;
});