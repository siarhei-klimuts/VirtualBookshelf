import * as lib3d from 'lib3d';

angular.module('VirtualBookshelf')
.factory('catalog', function ($q, data, block) {
	var catalog = {};

	catalog.books = null;
	catalog.selectedId = null;

	catalog.loadBooks = function(userId) {
		var promise;

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

	catalog.getBook = function(id) {
		return catalog.books ? 
			catalog.books.find(dto => dto.id == id) : 
			null;
	};

	catalog.select = function(dto) {
		var meta = new lib3d.SelectorMetaDto(lib3d.BookObject.TYPE, dto.id);
		lib3d.selector.select(meta);
		catalog.selectedId = dto.id;
	};

	return catalog;
});