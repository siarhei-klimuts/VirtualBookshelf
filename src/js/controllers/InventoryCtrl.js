angular.module('VirtualBookshelf')
.controller('InventoryCtrl', function (user, bookEdit, catalog) {
	this.isShow = function() {
		return user.isAuthorized();
	};

	this.addBook = function() {
		bookEdit.show({userId: user.getId()});
	};

	this.select = catalog.select;
	this.catalog = catalog;
});