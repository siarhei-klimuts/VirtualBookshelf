import SelectorMeta from '../models/SelectorMeta';
import ShelfObject from '../models/ShelfObject';
import BookObject from '../models/BookObject';
import SectionObject from '../models/SectionObject';

import environment from '../scene/environment';
import highlight from '../scene/highlight';
import {preview} from '../scene/preview';

export var selector = {};

var selected = new SelectorMeta();
var focused = new SelectorMeta();

selector.placing = false;

selector.getSelectedId = function() {
	return selected.id;
};

selector.focus = function(meta) {
	var obj;

	if(!meta.equals(focused)) {
		focused = meta;

		if(!focused.isEmpty()) {
			obj = selector.getFocusedObject();
			highlight.focus(obj);
		}
	}
};

selector.selectFocused = function() {
	selector.select(focused);
};

selector.select = function(meta) {
	var obj = getObject(meta);
	
	selector.unselect();
	selected = meta;

	highlight.select(obj);
	highlight.focus(null);

	selector.placing = false;
};

selector.unselect = function() {
	if(!selected.isEmpty()) {
		highlight.select(null);
		selected = new SelectorMeta();
	}

	preview.disable();
};

selector.getSelectedObject = function() {
	return getObject(selected);
};

selector.getFocusedObject = function() {
	return getObject(focused);
};

function getObject(meta) {
	var object;

	if(!meta.isEmpty()) {
		object = isShelf(meta) ? environment.getShelf(meta.parentId, meta.id)
			: isBook(meta) ? environment.getBook(meta.id)
			: isSection(meta) ? environment.getSection(meta.id)
			: null;
	}

	return object;	
}

selector.isSelectedEditable = function() {
	return selector.isSelectedBook() || selector.isSelectedSection();
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

function isShelf(meta) {
	return meta.type === ShelfObject.TYPE;
}

function isBook(meta) {
	return meta.type === BookObject.TYPE;
}

function isSection(meta) {
	return meta.type === SectionObject.TYPE;
}