import {BookObject} from 'lib3d';
import {SelectorMetaDto} from 'lib3d';
import {selector} from 'lib3d';

angular.module('VirtualBookshelf')
.controller('InventoryCtrl', function (user, bookEdit, catalog) {
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