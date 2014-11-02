VirtualBookshelf.UI = VirtualBookshelf.UI || {};

VirtualBookshelf.UI.MenuNode = function(container) {
	this.container = container;
};
VirtualBookshelf.UI.MenuNode.prototype = {
	constructor: VirtualBookshelf.UI.MenuNode,
	show: function() {
		this.clear();
		VirtualBookshelf.UI._show(this.container);
	},
	hide: function() {
		VirtualBookshelf.UI._hide(this.container);
	},
	clear: function() {}
}

VirtualBookshelf.UI.menu = {};

VirtualBookshelf.UI.menuFunctions = {
	sectionMenu: {
		isMoveOption: function() {
			return this.translateMove.checked;
		},
		isRotateOption: function() {
			return this.translateRotate.checked;
		}
	},
	createBook: {
		clear: function() {
			this.model.selectedIndex = 0;
			this.texture.selectedIndex = 0;
			this.cover.value = null;
			this.author.value = null;
			this.authorSize.value = null;
			this.authorColor.value = null;
			this.title.value = null;
			this.titleSize.value = null;
			this.titleColor.value = null;
		},
		setValues: function() {
			if(VirtualBookshelf.selected.isBook()) {
				var book = VirtualBookshelf.selected.object;

				this.model.value = book.model;
				this.texture.value = book.texture.toString();
				this.cover.value = book.cover.toString();
				this.author.value = book.author.toString();
				this.authorSize.value = book.author.size;
				this.authorColor.value = book.author.color;
				this.title.value = book.title.toString();
				this.titleSize.value = book.title.size;
				this.titleColor.value = book.title.color;
			}
		}
	},
	inventory: {
		refresh: function() {
			var
				books,
				book,
				li,
				i;

			this.books.innerHTML = '';

			if(!VirtualBookshelf.Controls.Pocket.isEmpty()) {
				books = VirtualBookshelf.Controls.Pocket.getBooks();
				for(i in books) {
					book = books[i];
					li = document.createElement('li');
					li.innerText = book.title;
					li.value = book.id;
					this.books.appendChild(li);
				}

				this.show();
			}
		}
	},
	feedback: {
		close: function() {
			this._closed = true;
			this.hide();
		},
		refresh: function() {
			if(!this._closed) {
				this.show();
			}
		}
	},
	navigation: {
		goStop: function() {
			VirtualBookshelf.Controls.goStop();
		},
		goForward: function() {
			VirtualBookshelf.Controls.goForward();
		},
		goBackward: function() {
			VirtualBookshelf.Controls.goBackward();
		},
		goLeft: function() {
			VirtualBookshelf.Controls.goLeft();
		},
		goRight: function() {
			VirtualBookshelf.Controls.goRight();
		}
	}
};

VirtualBookshelf.UI.init = function() {
	VirtualBookshelf.UI.loadMenuNodes();
	VirtualBookshelf.UI.applyMenuFunctions();

	VirtualBookshelf.UI.initControlsData();
	VirtualBookshelf.UI.initControlsEvents();
	VirtualBookshelf.UI.refresh();
};

VirtualBookshelf.UI.applyMenuFunctions = function() {
	for(node in this.menuFunctions) {
		for(functionName in this.menuFunctions[node]) {
			this.menu[node][functionName] = this.menuFunctions[node][functionName];
		}
	}
};

VirtualBookshelf.UI.loadMenuNodes = function() {
	var 
		menuNode,
		container,
		containerAttribute,
		controls,
		control,
		menuControlAttribute,
		i, j,
		nodes;

	nodes = document.querySelectorAll('div.ui > div.uiPanel[menuNode]');

	for(i = nodes.length - 1; i >= 0; i--) {
		container = nodes[i];
		containerAttribute = container.getAttribute('menuNode');
		menuNode = new VirtualBookshelf.UI.MenuNode(container),
		controls = container.querySelectorAll('[menuControl]');

		for(j = controls.length - 1; j >= 0; j--) {
			control = controls[j];
			menuControlAttribute = control.getAttribute('menuControl');
			if(control && (menuControlAttribute)) {
				menuNode[menuControlAttribute] = control;
			}
		}

		this.menu[containerAttribute] = menuNode;
	}
};

VirtualBookshelf.UI.initControlsData = function() {
	var scope = VirtualBookshelf.UI;

	// fill selects by availible options
	VirtualBookshelf.Data.getUIData(function (err, data) {
		if(!err && data) {
			if(!scope.menu.createLibrary.model.options.length && data.libraries) {
				scope.fillElement(scope.menu.createLibrary.model, data.libraries, {value: 'model', text: 'label'});
			}
			if(!scope.menu.libraryMenu.model.options.length && data.bookshelves) {
				scope.fillElement(scope.menu.libraryMenu.model, data.bookshelves, {value: 'model', text: 'label'});
			}
			if(!scope.menu.createBook.model.options.length && data.books) {
				scope.fillElement(scope.menu.createBook.model, data.books, {value: 'model', text: 'label'});
			}
			if(!scope.menu.createBook.texture.options.length && data.bookTextures) {
				scope.fillElement(scope.menu.createBook.texture, data.bookTextures, {value: 'image', text: 'label'});
			}
		}
	});

	VirtualBookshelf.Data.getLibraries(function (err, result) {
		if(!err && result) {
			if(!scope.menu.selectLibrary.library.options.length) {
				scope.fillElement(scope.menu.selectLibrary.library, result, {value: 'id', text: 'id'});
			}
		}
	});
}

VirtualBookshelf.UI.initControlsEvents = function() {
	VirtualBookshelf.UI.menu.createBook.model.onchange = VirtualBookshelf.UI.changeModel;
	VirtualBookshelf.UI.menu.createBook.texture.onchange = VirtualBookshelf.UI.changeBookTexture;
	VirtualBookshelf.UI.menu.createBook.cover.onchange = VirtualBookshelf.UI.changeBookCover;
	VirtualBookshelf.UI.menu.createBook.author.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'text');
	VirtualBookshelf.UI.menu.createBook.authorSize.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'size');
	VirtualBookshelf.UI.menu.createBook.authorColor.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'color');
	VirtualBookshelf.UI.menu.createBook.title.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'text');
	VirtualBookshelf.UI.menu.createBook.titleSize.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'size');
	VirtualBookshelf.UI.menu.createBook.titleColor.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'color');
	VirtualBookshelf.UI.menu.createBook.editCover.onclick = VirtualBookshelf.UI.switchEdited;
	VirtualBookshelf.UI.menu.createBook.editAuthor.onclick = VirtualBookshelf.UI.switchEdited;
	VirtualBookshelf.UI.menu.createBook.editTitle.onclick = VirtualBookshelf.UI.switchEdited;
	VirtualBookshelf.UI.menu.createBook.ok.onclick = VirtualBookshelf.UI.saveBook;
	VirtualBookshelf.UI.menu.createBook.cancel.onclick = VirtualBookshelf.UI.cancelBookEdit;

	this.menu.feedback.submit.onclick = this.submitFeedback;

	this.menu.navigation.left.onmousedown = this.menu.navigation.goLeft;
	this.menu.navigation.right.onmousedown = this.menu.navigation.goRight;
	this.menu.navigation.up.onmousedown = this.menu.navigation.goForward;
	this.menu.navigation.down.onmousedown = this.menu.navigation.goBackward;
 	
 	this.menu.navigation.left.onmouseup
	= this.menu.navigation.left.onmouseout
 	= this.menu.navigation.right.onmouseup
 	= this.menu.navigation.right.onmouseout 
 	= this.menu.navigation.up.onmouseup
 	= this.menu.navigation.up.onmouseout 
 	= this.menu.navigation.down.onmouseup
 	= this.menu.navigation.down.onmouseout 
		= this.menu.navigation.goStop;
};

VirtualBookshelf.UI.submitFeedback = function() {
	var dataObject = {
		message: VirtualBookshelf.UI.menu.feedback.message.value,
		userId: VirtualBookshelf.user && VirtualBookshelf.user.id
	};

	if(dataObject.message) {
		VirtualBookshelf.Data.postFeedback(dataObject, function(err, result) {
			if(!err && result) {
				VirtualBookshelf.UI.menu.feedback.close();
			}
		});
	} else {
		VirtualBookshelf.UI.menu.feedback.close();
	}
};

// library create
VirtualBookshelf.UI.showLibraryCreate = function() {
	this.menu.createLibrary.show();
}

VirtualBookshelf.UI.createLibrary = function() {
	var libraryModel = VirtualBookshelf.UI.getSelectedOption(VirtualBookshelf.UI.menu.createLibrary.model);

	if(libraryModel) {
		VirtualBookshelf.Data.postLibrary(libraryModel, function (err, result) {
			if(!err && result) {
				//TODO: add library without reload
				VirtualBookshelf.loadLibrary(result.id);
				VirtualBookshelf.UI.menu.createLibrary.hide();
			}
		});
	}
}

// library select
VirtualBookshelf.UI.selectLibrary = function() {
	var libraryId = VirtualBookshelf.UI.getSelectedOption(VirtualBookshelf.UI.menu.selectLibrary.library);

	if(libraryId) {
		VirtualBookshelf.loadLibrary(libraryId);
		VirtualBookshelf.UI.menu.selectLibrary.hide();
	}
}

// library menu

VirtualBookshelf.UI.createSection = function() {
	var sectionModel = VirtualBookshelf.UI.getSelectedOption(VirtualBookshelf.UI.menu.libraryMenu.model);

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

// create book

VirtualBookshelf.UI.showCreateBook = function() {
	var menuNode = VirtualBookshelf.UI.menu.createBook;

	if(VirtualBookshelf.selected.isBook()) {
		menuNode.show();
		menuNode.setValues();
	} else if(VirtualBookshelf.selected.isSection()) {
		var section = VirtualBookshelf.selected.object;
		var shelf = section.getShelfByPoint(VirtualBookshelf.selected.point);
		var freePosition = section.getGetFreeShelfPosition(shelf, {x: 0.05, y: 0.12, z: 0.1}); 
		if(freePosition) {
			menuNode.show();

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

VirtualBookshelf.UI.changeSpecificValue = function(field, property) {
	return function () {
		if(VirtualBookshelf.selected.isBook()) {
			VirtualBookshelf.selected.object[field][property] = this.value;
			VirtualBookshelf.selected.object.updateTexture();
		}
	};
};

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
	console.log('onclick');
	if(VirtualBookshelf.selected.isBook()) {
		var book = VirtualBookshelf.selected.object;

		VirtualBookshelf.selected.put();
		book.save();
	}
}

VirtualBookshelf.UI.cancelBookEdit = function() {
	if(VirtualBookshelf.selected.isBook()) {
		var book = VirtualBookshelf.selected.object;
		
		VirtualBookshelf.selected.put();
		book.refresh();
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

	data.forEach(function (object) {
		if(object[fields.text] && object[fields.value]) {
			var option = document.createElement('option');
			option.innerHTML = object[fields.text];
			option.value = object[fields.value];

			element.appendChild(option);
		}
	});
}

VirtualBookshelf.UI._show = function(element) {
	if(element instanceof HTMLDivElement) {
		element.style.display = 'block';
	}
}

VirtualBookshelf.UI._hide = function(element) {
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
	this.hideAll();
	this.menu.feedback.refresh();
	this.menu.navigation.show();

	if(VirtualBookshelf.user.isAuthorized()) {
		if(VirtualBookshelf.library) {
			this.menu.libraryMenu.show();
		}
		if(VirtualBookshelf.selected.object instanceof VirtualBookshelf.Section) {
			this.menu.sectionMenu.show();
		}
		if(VirtualBookshelf.selected.object instanceof VirtualBookshelf.Book) {
			this.showCreateBook();
		}
		this.menu.inventory.refresh();
		this.menu.selectLibrary.show();		
	} else {
		this.menu.login.show();
	}
}