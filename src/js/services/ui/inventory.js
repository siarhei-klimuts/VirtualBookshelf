angular.module('VirtualBookshelf')
.factory('inventory', function ($log, SelectorMeta, user, data, bookEdit, selector, environment, dialog, locator, catalog, block) {
	var inventory = {};

	inventory.search = null;

	inventory.expand = function(book) {
		bookEdit.setBook(book);
	};

	inventory.isShow = function() {
		return user.isAuthorized();
	};

	inventory.isBookSelected = function(id) {
		return selector.isBookSelected(id);
	};

	inventory.select = function(dto) {
		var book = environment.getBook(dto.id);
		var meta = new SelectorMeta(book);

		selector.select(meta);
	};

	inventory.addBook = function() {
		this.expand({userId: user.getId()});
	};

	inventory.delete = function(book) {
		dialog.openConfirm('Delete book?').then(function () {
			block.inventory.start();

			data.deleteBook(book).then(function (res) {
				if(selector.isBookSelected(book.id)) {
					selector.unselect();
				}

				environment.removeBook(res.data);
				return catalog.loadBooks();
			}).catch(function () {
				dialog.openError('Delete book error.');
			}).finally(function () {
				block.inventory.stop();
			});
		});
	};

	inventory.place = function(book, event) {
		var promise;
		var isBookPlaced = !!book.sectionId;

		event.stopPropagation();
		
		block.inventory.start();
		promise = isBookPlaced ? locator.unplaceBook(book) : locator.placeBook(book);
		promise.then(function () {
			return catalog.loadBooks();
		}).catch(function (error) {
			//TODO: show an error
			$log.error(error);
		}).finally(function () {
			block.inventory.stop();
		});
	};

	return inventory;
});