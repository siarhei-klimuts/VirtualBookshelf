VirtualBookshelf.UI = VirtualBookshelf.UI || {};

VirtualBookshelf.UI.init = function() {
	var scope = VirtualBookshelf.UI;

	scope.searchForUIs();
	scope.refresh();
}

VirtualBookshelf.UI.searchForUIs = function() {
	var scope = VirtualBookshelf.UI;

	scope.loginPanel = document.getElementById('UI_LOGIN');
	scope.libraryCreatePanel = document.getElementById('UI_LIBRARY_CREATE');
	scope.libraryCreatePanelSelect = document.getElementById('UI_LIBRARY_CREATE_SELECT');
	scope.librarySelectPanel = document.getElementById('UI_LIBRARY_SELECT');
	scope.librarySelectPanelDropdown = document.getElementById('UI_LIBRARY_SELECT_DROPDOWN');
	scope.libraryMenuPanel = document.getElementById('UI_LIBRARY_MENU');
	scope.sectionCreateDropdown = document.getElementById('UI_SECTION_CREATE_DROPDOWN');
	scope.createBookPanel = document.getElementById('UI_CREATE_BOOK');
	scope.createBookObject = document.getElementById('UI_CREATE_BOOK_OBJECT');
	scope.createBookAuthor = document.getElementById('UI_CREATE_BOOK_AUTHOR');
	scope.createBookTitle = document.getElementById('UI_CREATE_BOOK_TITLE');
}

// library create
VirtualBookshelf.UI.showLibraryCreate = function() {
	VirtualBookshelf.UI.show(VirtualBookshelf.UI.libraryCreatePanel);

	if(!VirtualBookshelf.UI.libraryCreatePanelSelect.options.length) {
		VirtualBookshelf.Data.getLibraryObjects(function(err, result) {
			if(err) return;

			VirtualBookshelf.UI.fillElement(VirtualBookshelf.UI.libraryCreatePanelSelect, result, {value: 'id', text: 'model'});
		});
	}
}

VirtualBookshelf.UI.createLibrary = function() {
	var libraryObjectId = VirtualBookshelf.UI.getSelectedOption(VirtualBookshelf.UI.libraryCreatePanelSelect);

	if(libraryObjectId) {
		VirtualBookshelf.Data.postLibrary(libraryObjectId, function(err, result) {
			if(err) return;

			if(result) {
				VirtualBookshelf.loadLibrary(result.id);
				VirtualBookshelf.UI.hide(VirtualBookshelf.UI.libraryCreatePanel);
			}
		});
	}
}

// library select
VirtualBookshelf.UI.showLibrarySelect = function(libraries) {
	VirtualBookshelf.UI.show(VirtualBookshelf.UI.librarySelectPanel);
	if(!VirtualBookshelf.UI.librarySelectPanelDropdown.options.length) {
		VirtualBookshelf.UI.fillElement(VirtualBookshelf.UI.librarySelectPanelDropdown, libraries, {value: 'id', text: 'id'});
	}
}

VirtualBookshelf.UI.selectLibrary = function() {
	var libraryId = VirtualBookshelf.UI.getSelectedOption(VirtualBookshelf.UI.librarySelectPanelDropdown);

	if(libraryId) {
		VirtualBookshelf.loadLibrary(libraryId);
		VirtualBookshelf.UI.hide(VirtualBookshelf.UI.librarySelectPanel);
	}
}

// library menu
VirtualBookshelf.UI.showLibraryMenu = function() {
	VirtualBookshelf.UI.show(VirtualBookshelf.UI.libraryMenuPanel);
	
	if(!VirtualBookshelf.UI.sectionCreateDropdown.options.length) {
		VirtualBookshelf.Data.getSectionObjects(function(err, result) {
			if(!err) {
				VirtualBookshelf.UI.fillElement(VirtualBookshelf.UI.sectionCreateDropdown, result, {value: 'id', text: 'model'});
			}
		});
	}
}

VirtualBookshelf.UI.createSection = function() {
	var sectionObjectId = VirtualBookshelf.UI.getSelectedOption(VirtualBookshelf.UI.sectionCreateDropdown);
	if(sectionObjectId && VirtualBookshelf.library && VirtualBookshelf.library.id) {
		VirtualBookshelf.Data.postSection(sectionObjectId, VirtualBookshelf.library.id, function(err, result) {
			if(!err && result) {
				VirtualBookshelf.loadLibrary(VirtualBookshelf.library.id);
			}
		});
	}
}

// create book

VirtualBookshelf.UI.showCreateBook = function() {
	VirtualBookshelf.UI.show(VirtualBookshelf.UI.createBookPanel);

	if(!VirtualBookshelf.UI.createBookObject.options.length) {
		VirtualBookshelf.Data.getBookObjects(function(err, result) {
			if(!err) {
				VirtualBookshelf.UI.fillElement(VirtualBookshelf.UI.createBookObject, result, {value: 'id', text: 'model'});
			}
		});
	}
}

VirtualBookshelf.UI.hideCreateBook = function() {
	VirtualBookshelf.UI.hide(VirtualBookshelf.UI.createBookPanel);
}

VirtualBookshelf.UI.cerateBook = function() {
	var book = {
		bookObjectId: VirtualBookshelf.UI.getSelectedOption(VirtualBookshelf.UI.createBookObject),
		author: VirtualBookshelf.UI.createBookAuthor.value,
		title: VirtualBookshelf.UI.createBookTitle.value,
	};

	if(book.bookObjectId) {
		VirtualBookshelf.Data.postBook(book, function(err, result) {
			if(!err && result) {
				//TODO: show created book
				//VirtualBookshelf.loadLibrary(VirtualBookshelf.library.id);
			}
		});
	}
}

// utils

VirtualBookshelf.UI.getSelectedOption = function(element) {
	var result;
	
	if(element && element.options) {
		var option = element.options[element.selectedIndex];
		if(option) {
			result = option.value;
		}
	}

	return result;
}

VirtualBookshelf.UI.fillElement = function(element, data, fields) {
	if(!(element instanceof HTMLSelectElement)
		|| (!data || !data.length)
		|| (!fields || !fields.value || !fields.text)) {

		return;
	}

	data.forEach(function(object) {
		if(object[fields.text] && object[fields.value]) {
			var option = document.createElement('option');
			option.innerHTML = object[fields.text];
			option.value = object[fields.value];

			element.appendChild(option);
		}
	});
}

VirtualBookshelf.UI.show = function(element) {
	if(element instanceof HTMLDivElement) {
		element.style.display = 'block';
	}
}

VirtualBookshelf.UI.hide = function(element) {
	if(element instanceof HTMLDivElement) {
		element.style.display = 'none';
	}
}

VirtualBookshelf.UI.refresh = function() {
	var scope = VirtualBookshelf.UI;

	if(VirtualBookshelf.user) {
		scope.hide(scope.loginPanel);
	} else {
		scope.show(scope.loginPanel);
		scope.hide(scope.libraryMenuPanel);
	}

	if(VirtualBookshelf.user && VirtualBookshelf.library) {
		VirtualBookshelf.UI.showLibraryMenu();
	}
}