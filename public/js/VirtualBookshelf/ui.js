VirtualBookshelf.UI = VirtualBookshelf.UI || {};

VirtualBookshelf.UI.MenuNode = function(id) {
	this.id = id;
};
VirtualBookshelf.UI.MenuNode.prototype = {
	constructor: VirtualBookshelf.UI.MenuNode,
	show: function() {
		this.clear();
		VirtualBookshelf.UI.show(this.container);
	},
	hide: function() {
		VirtualBookshelf.UI.hide(this.container);
	},
	setValues: function(dataObject, fields) {
		if(dataObject && fields && fields.length) {
			for(var i = fields.length - 1; i >= 0; i--) {
				if(this[fields[i]]) {
					this[fields[i]].value = dataObject[fields[i]];
				}
			}
		}
	},
	clear: function() {
		this.model.selectedIndex = 0;
		this.texture.selectedIndex = 0;
		this.cover.value = null;
		this.author.value = null;
		this.title.value = null;
	}
}

VirtualBookshelf.UI.menu = {
	login: new VirtualBookshelf.UI.MenuNode('UI_LOGIN'),
	createLibrary: new VirtualBookshelf.UI.MenuNode('UI_LIBRARY_CREATE'),
	selectLibrary: new VirtualBookshelf.UI.MenuNode('UI_LIBRARY_SELECT'),
	libraryMenu: new VirtualBookshelf.UI.MenuNode('UI_LIBRARY_MENU'),
	sectionMenu: new VirtualBookshelf.UI.MenuNode('UI_SECTION_MENU'),
	createBook: new VirtualBookshelf.UI.MenuNode('UI_CREATE_BOOK'),
	saveDialog: new VirtualBookshelf.UI.MenuNode('UI_SAVE_DIALOG')
};

VirtualBookshelf.UI.init = function() {
	VirtualBookshelf.UI.loadMenuNodes();
	VirtualBookshelf.UI.searchForUIs();
	VirtualBookshelf.UI.initControlsData();
	VirtualBookshelf.UI.initControlsEvents();
	VirtualBookshelf.UI.refresh();
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
	scope.sectionMenu = document.getElementById('UI_SECTION_MENU');
	scope.saveDialog = document.getElementById('UI_SAVE_DIALOG');
}

VirtualBookshelf.UI.loadMenuNodes = function() {
	var menu = VirtualBookshelf.UI.menu;
	
	for(key in menu) {
		var menuNode = menu[key];

		if(menuNode && menuNode.id) {
			menuNode.container = document.getElementById(menuNode.id);
			var controls = menuNode.container.querySelectorAll('input, select, a, canvas');

			for(var j = controls.length - 1; j >= 0; j--) {
				var control = controls[j];

				if(control && (control.name || control.id)) {
					menuNode[control.name || control.id] = control;
				}
			}
		}
	};
}

VirtualBookshelf.UI.initControlsData = function() {
	var scope = VirtualBookshelf.UI;

	// fill selects by availible options
	VirtualBookshelf.Data.getUIData(function (err, data) {
		if(!err && data) {
			if(!scope.libraryCreatePanelSelect.options.length && data.libraries) {
				scope.fillElement(scope.libraryCreatePanelSelect, data.libraries, {value: 'model', text: 'label'});
			}
			if(!scope.sectionCreateDropdown.options.length && data.bookshelves) {
				scope.fillElement(scope.sectionCreateDropdown, data.bookshelves, {value: 'model', text: 'label'});
			}
			if(!scope.menu.createBook.model.options.length && data.books) {
				scope.fillElement(scope.menu.createBook.model, data.books, {value: 'model', text: 'label'});
			}
			if(!scope.menu.createBook.texture.options.length && data.bookTextures) {
				scope.fillElement(scope.menu.createBook.texture, data.bookTextures, {value: 'image', text: 'label'});
			}
		}
	});
}

VirtualBookshelf.UI.initControlsEvents = function() {
	VirtualBookshelf.UI.menu.createBook.model.onchange = VirtualBookshelf.UI.changeModel;
	VirtualBookshelf.UI.menu.createBook.texture.onchange = VirtualBookshelf.UI.changeBookTexture;
	VirtualBookshelf.UI.menu.createBook.cover.onchange = VirtualBookshelf.UI.changeBookCover;
	VirtualBookshelf.UI.menu.createBook.author.onchange = VirtualBookshelf.UI.changeValue;
	VirtualBookshelf.UI.menu.createBook.title.onchange = VirtualBookshelf.UI.changeValue;
	VirtualBookshelf.UI.menu.createBook.editCover.onclick = VirtualBookshelf.UI.switchEdited;
	VirtualBookshelf.UI.menu.createBook.editAuthor.onclick = VirtualBookshelf.UI.switchEdited;
	VirtualBookshelf.UI.menu.createBook.editTitle.onclick = VirtualBookshelf.UI.switchEdited;
	VirtualBookshelf.UI.menu.createBook.ok.onclick = VirtualBookshelf.UI.saveBook;
	VirtualBookshelf.UI.menu.createBook.cancel.onclick = VirtualBookshelf.UI.cancelBookEdit;
}

// library create
VirtualBookshelf.UI.showLibraryCreate = function() {
	VirtualBookshelf.UI.show(VirtualBookshelf.UI.libraryCreatePanel);
}

VirtualBookshelf.UI.createLibrary = function() {
	var libraryModel = VirtualBookshelf.UI.getSelectedOption(VirtualBookshelf.UI.libraryCreatePanelSelect);

	if(libraryModel) {
		VirtualBookshelf.Data.postLibrary(libraryModel, function (err, result) {
			if(!err && result) {
				//TODO: add library without reload
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
}

VirtualBookshelf.UI.createSection = function() {
	var sectionModel = VirtualBookshelf.UI.getSelectedOption(VirtualBookshelf.UI.sectionCreateDropdown);

	if(sectionModel && VirtualBookshelf.library && VirtualBookshelf.library.id) {
		var sectionData = {
			model: sectionModel,
			libraryId: VirtualBookshelf.library.id,
			userId: VirtualBookshelf.user.id
		};

		VirtualBookshelf.Data.postSection(sectionData, function (err, result) {
			if(!err && result) {
				VirtualBookshelf.loadLibrary(VirtualBookshelf.library.id);
			}
		});
	}
}

// section menu

VirtualBookshelf.UI.showSectionMenu = function() {
	VirtualBookshelf.UI.show(VirtualBookshelf.UI.sectionMenu);
}

// create book

VirtualBookshelf.UI.showCreateBook = function() {
	var menuNode = VirtualBookshelf.UI.menu.createBook;

	if(VirtualBookshelf.selected.isBook()) {
		menuNode.show();
		menuNode.setValues(VirtualBookshelf.selected.object.dataObject, ['model', 'texture', 'cover', 'author', 'title']);
	} else if(VirtualBookshelf.selected.isSection()) {
		var section = VirtualBookshelf.selected.object;
		var shelf = section.getShelfByPoint(VirtualBookshelf.selected.point);
		var freePosition = section.getGetFreeShelfPosition(shelf, {x: 0.05, y: 0.12, z: 0.1}); 
		if(freePosition) {
			var dataObject = {
				model: menuNode.model.value, 
				texture: menuNode.texture.value, 
				cover: menuNode.cover.value,
				pos_x: freePosition.x,
				pos_y: freePosition.y,
				pos_z: freePosition.z,
				sectionId: section.dataObject.id,
				shelfId: shelf.id,
				userId: VirtualBookshelf.user.id
			};

			VirtualBookshelf.Data.createBook(dataObject, function (book, dataObject) {
				menuNode.show();
				book.parent = shelf;
				VirtualBookshelf.selected.object = book;
				VirtualBookshelf.selected.get();
			});
		} else {
			alert('There is no free space on selected shelf.');
		}
	}
}

VirtualBookshelf.UI.changeModel = function() {
	if(VirtualBookshelf.selected.isBook()) {
		var oldBook = VirtualBookshelf.selected.object;
		var dataObject = {
			model: this.value,
			texture: oldBook.texture.toString(),
			cover: oldBook.cover.toString()
		};

		VirtualBookshelf.Data.createBook(dataObject, function (book, dataObject) {
			book.copyState(oldBook);
		});
	}
}

VirtualBookshelf.UI.changeBookTexture = function() {
	if(VirtualBookshelf.selected.isBook()) {
		var book = VirtualBookshelf.selected.object;
		book.texture.load(this.value, false, function () {
			book.updateTexture();
		});
	}
}

VirtualBookshelf.UI.changeBookCover = function() {
	if(VirtualBookshelf.selected.isBook()) {
		var book = VirtualBookshelf.selected.object;
		book.cover.load(this.value, true, function() {
			book.updateTexture();
		});
	}
}

VirtualBookshelf.UI.changeValue = function() {
	if(VirtualBookshelf.selected.isBook()) {
		var book = VirtualBookshelf.selected.object;

		if(book[this.name].setText) {
			book[this.name].setText(this.value);
		} else {
			book[this.name] = this.value;
		}

		book.updateTexture();
	}
}

VirtualBookshelf.UI.switchEdited = function() {
	var activeElemets = document.querySelectorAll('a.activeEdit');

	for(var i = activeElemets.length - 1; i >= 0; i--) {
		activeElemets[i].className = 'inactiveEdit';
	};

	var previousEdited = VirtualBookshelf.UI.menu.createBook.edited;
	var currentEdited = this.getAttribute('edit');

	if(previousEdited != currentEdited) {
		this.className = 'activeEdit';
		VirtualBookshelf.UI.menu.createBook.edited = currentEdited;
	} else {
		VirtualBookshelf.UI.menu.createBook.edited = null;
	}
}

VirtualBookshelf.UI.saveBook = function() {
	if(VirtualBookshelf.selected.isBook()) {
		VirtualBookshelf.selected.invocate('save');
		VirtualBookshelf.selected.put();
		VirtualBookshelf.selected.clear();
	}
}

VirtualBookshelf.UI.cancelBookEdit = function() {
	if(VirtualBookshelf.selected.isBook()) {
		VirtualBookshelf.selected.invocate('refresh');
		VirtualBookshelf.selected.put();
		VirtualBookshelf.selected.clear();
	}
}

// save dialog

VirtualBookshelf.UI.showSaveDialog = function() {
	VirtualBookshelf.UI.show(VirtualBookshelf.UI.saveDialog);
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

	data.forEach(function (object) {
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

VirtualBookshelf.UI.hideAll = function() {
	for(key in VirtualBookshelf.UI.menu) {
		VirtualBookshelf.UI.menu[key].hide();
	}
}

VirtualBookshelf.UI.refresh = function() {
	var scope = VirtualBookshelf.UI;
	scope.hideAll();

	if(VirtualBookshelf.user) {
		scope.hide(scope.loginPanel);
		if(VirtualBookshelf.library) {
			VirtualBookshelf.UI.showLibraryMenu();
		}
		if(VirtualBookshelf.selected.object instanceof VirtualBookshelf.Section) {
			scope.showSectionMenu();
		}
		if(VirtualBookshelf.selected.object instanceof VirtualBookshelf.Book) {
			scope.showCreateBook();
		}
		if(Object.getOwnPropertyNames(VirtualBookshelf.Controls.changedObjects).length) {
			scope.showSaveDialog();
		}
	} else {
		scope.show(scope.loginPanel);
		scope.hide(scope.libraryMenuPanel);
	}
}