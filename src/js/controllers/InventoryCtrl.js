import SelectorMetaDto from 'js/services/models/SelectorMetaDto';
import BookObject from 'js/services/models/BookObject';

angular.module('VirtualBookshelf')
.controller('InventoryCtrl', function (user, bookEdit, selector, catalog) {
	this.isShow = function() {
		return user.isAuthorized();
	};

	this.isBookSelected = function(id) {
		return selector.isBookSelected(id);
	};

	this.select = function(dto) {
		var meta = new SelectorMetaDto(BookObject.TYPE, dto.id);
		selector.select(meta);
	};

	this.addBook = function() {
		bookEdit.show({userId: user.getId()});
	};

	this.catalog = catalog;
});