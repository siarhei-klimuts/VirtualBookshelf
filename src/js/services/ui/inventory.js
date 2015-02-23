angular.module('VirtualBookshelf')
.factory('inventory', function ($q, $log, SelectorMeta, User, Data, selector, environment, dialog, locator, blockUI) {
	var inventory = {};
	var blocker = 'inventory';

	inventory.search = null;
	inventory.list = null;

	inventory.expand = function(book) {
		// UI.menu.createBook.setBook(book);
	};

	inventory.block = function() {
		blockUI.instances.get(blocker).start();
	};

	inventory.unblock = function() {
		blockUI.instances.get(blocker).stop();
	};

	inventory.isShow = function() {
		return User.isAuthorized();
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
		this.expand({userId: User.getId()});
	};

	inventory.remove = function(book) {
		var scope = this;

		dialog.openConfirm('Delete book?').then(function () {
			scope.block();

			Data.deleteBook(book).then(function (res) {
				environment.removeBook(res.data);
				return scope.loadData();
			}).catch(function () {
				dialog.openError('Delete book error.');
			}).finally(function () {
				scope.unblock();
			});
		});
	};

	inventory.place = function(book, event) {
		var scope = this;
		var promise;
		var isBookPlaced = !!book.sectionId;

		event.stopPropagation();
		
		scope.block();
		promise = isBookPlaced ? locator.unplaceBook(book) : locator.placeBook(book);
		promise.then(function () {
			return scope.loadData();
		}).catch(function (error) {
			//TODO: show an error
			$log.error(error);
		}).finally(function () {
			scope.unblock(); 
		});
	};

	inventory.loadData = function() {
		var scope = this;
		var promise;

		scope.block();
		promise = $q.when(this.isShow() ? Data.getUserBooks(User.getId()) : null).then(function (books) {
			scope.list = books;
		}).finally(function () {
			scope.unblock();		
		});

		return promise;
	};

	return inventory;
});