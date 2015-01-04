angular.module('VirtualBookshelf')
.factory('selector', function ($rootScope, BookObject, ShelfObject, SectionObject, environment) {
	var selector = {};

	var selected = null;
	var focused = null;
	
	var SelectedObject = function(selectedObject) {
		if(selectedObject) {
			this.id = selectedObject.id;
			this.parentId = selectedObject.parent.id;
			this.type = selectedObject.getType();
		}
	};//TODO: recheck
	SelectedObject.prototype.equals = function(meta) {
		return !((!!meta !== !!this.id)
			|| meta
				&& (meta.id !== this.id
					|| meta.parentId !== this.parentId
					|| meta.type !== this.type));
	};

	selector.focus = function(focusedObject) {
		var newFocused = new SelectedObject(focusedObject);

		if(!newFocused.equals(focused)) {
			unhighlight(focused);

			if(focusedObject && !newFocused.equals(selected)) {
				focused = newFocused;
				highlight(focused, 0x55ffff);
			} else {
				focused = null;
			}
		}
	};

	var highlight = function(meta, color) {
		var obj = getObject(meta);

		obj && obj.material.color.setHex(color);
		isShelf(meta) && (obj.visible = true);
	};

	var unhighlight = function(meta) {
		var obj = getObject(meta);

		obj && obj.material.color.setHex(0xffffff);
		isShelf(meta) && (obj.visible = false);
	};

	selector.select = function() {
		if(focused && !focused.equals(selected)) {
			selector.unselect();
			selected = focused;
			//TODO: make it possible to have selected and focused object at the same time
			// this will make possible to unselect object when clicking on empty space
			// and do not uselect it when klicking on it twice
			selector.focus(null);
			highlight(selected, 0x55ff55);
			$rootScope.$apply();
		}
	};

	selector.selectBook = function(bookId) {
		var book = environment.getBook(bookId);
		var newSelected = new SelectedObject(book);

		if(!newSelected.equals(selected)) {
			selector.unselect();
			selected = newSelected;
			selector.focus(null);
			highlight(selected, 0x55ff55);
		}
	};

	selector.unselect = function() {
		if(selected) {
			unhighlight(selected);
			selected = null;
		}
	};

	selector.getSelectedObject = function() {
		return getObject(selected);
	};

	var getObject = function(meta) {
		var object;

		if(meta) {
			object = isShelf(meta) ? environment.getShelf(meta.parentId, meta.id)
				: isBook(meta) ? environment.getBook(meta.id)
				: isSection(meta) ? environment.getSection(meta.id)
				: null;
		}

		return object;	
	};

	selector.isBookSelected = function(id) {
		return isBook(selected) && selected.id === id;
	};

	selector.isSelectedShelf = function() {
		return isShelf(selected);
	};

	selector.isSelectedBook = function() {
		return isBook(selected);
	};

	selector.isSelectedSection = function() {
		return isSection(selected);
	};

	var isShelf = function(meta) {
		return meta && meta.type === ShelfObject.TYPE;
	};

	var isBook = function(meta) {
		return meta && meta.type === BookObject.TYPE;
	};

	var isSection = function(meta) {
		return meta && meta.type === SectionObject.TYPE;
	};

	return selector;
});