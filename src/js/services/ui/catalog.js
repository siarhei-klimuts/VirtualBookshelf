angular.module('VirtualBookshelf')
.factory('catalog', function (Data, User, block) {
	var catalog = {};

	catalog.books = null;

	catalog.loadBooks = function() {
		var promise;

		block.inventory.start();
		promise = Data.getUserBooks(User.getId()).then(function (result) {
			catalog.books = result;
		}).finally(function () {
			block.inventory.stop();	
		});

		return promise;
	};

	return catalog;
});