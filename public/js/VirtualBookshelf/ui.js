VirtualBookshelf.UI = VirtualBookshelf.UI || {};

VirtualBookshelf.UI.BOOK_IMAGE_URL = '/obj/books/{model}/img.jpg';

VirtualBookshelf.UI.init = function($q, user, data, blockUI) {
	VirtualBookshelf.UI.$q = $q;
	VirtualBookshelf.UI.user = user;
	VirtualBookshelf.UI.blockUI = blockUI;

	return VirtualBookshelf.UI;
};

VirtualBookshelf.UI.menu = {
	selectLibrary: {
		list: [],
		updateList: function() {
			var scope = this;

		    VirtualBookshelf.Data.getLibraries(function (err, result) {
		        if(!err && result) {
		            scope.list = result;
		        }
		    });
		},
		go: function(id) {
			if(id) {
				VirtualBookshelf.loadLibrary(id);
			}
		}
	},
	createLibrary: {
		list: [],
		model: null,

		getImg: function() {
			return this.model ? '/obj/libraries/{model}/img.jpg'.replace('{model}', this.model) : null;
		},
		create: function() {
			if(this.model) {
				VirtualBookshelf.Data.postLibrary(this.model, function (err, result) {
					if(!err && result) {
						//TODO: add library without reload
						VirtualBookshelf.loadLibrary(result.id);
						VirtualBookshelf.UI.menu.show = null; // TODO: hide after go 
						VirtualBookshelf.UI.menu.selectLibrary.updateList();
					}
				});
			}
		}		
	},
	createSection: {
		list: [],
		model: null,
		
		getImg: function() {
			return this.model ? '/obj/sections/{model}/img.jpg'.replace('{model}', this.model) : null;
		},
		create: function() {
			if(this.model) {
				var sectionData = {
					model: this.model,
					userId: VirtualBookshelf.UI.user.id
				};

				VirtualBookshelf.Data.postSection(sectionData, function (err, result) {
					if(!err && result) {
						//TODO: refactor
					}
				});
			}
		}
	},
	// sectionMenu: {
	// 	isMoveOption: function() {
	// 		return true;
	// 	},
	// 	isRotateOption: function() {
	// 		return false;
	// 	}
	// },
	feedback: {
		message: null,
		show: true,

		close: function() {
			this.show = false;
		},
		submit: function() {
			var dataObject;
			
			if(this.message) {
				dataObject = {
					message: this.message,
					userId: VirtualBookshelf.UI.user && VirtualBookshelf.UI.user.id
				};

				VirtualBookshelf.Data.postFeedback(dataObject, function(err, result) {
					// TODO: 
				});
			}

			this.close();
		}
	},
	navigation: {
		stop: function() {
			VirtualBookshelf.Controls.goStop();
		},
		forward: function() {
			VirtualBookshelf.Controls.goForward();
		},
		backward: function() {
			VirtualBookshelf.Controls.goBackward();
		},
		left: function() {
			VirtualBookshelf.Controls.goLeft();
		},
		right: function() {
			VirtualBookshelf.Controls.goRight();
		}
	},
	login: {
		// TODO: oauth.io
		isShow: function() {
			return !VirtualBookshelf.UI.user.isAuthorized();
		}
	},
	inventory: {
		search: null,
		list: null,
		blocker: 'inventory',
	
		expand: function(book) {
			VirtualBookshelf.UI.menu.createBook.setBook(book);
		},
		block: function() {
			VirtualBookshelf.UI.blockUI.instances.get(this.blocker).start();
		},
		unblock: function() {
			VirtualBookshelf.UI.blockUI.instances.get(this.blocker).stop();
		},
		isShow: function() {
			return VirtualBookshelf.UI.user.isAuthorized();
		},
		addBook: function() {
			var scope = this;

			scope.block();
			VirtualBookshelf.Data.postBook({userId: VirtualBookshelf.UI.user.getId()})
				.then(function (res) {
					scope.expand(res.data);
					return scope.loadData();
				})
				.then(function (res) {
					//TODO: research, looks rigth
				})
				.finally(function (res) {
					scope.unblock();
				})
				.catch(function (res) {
					//TODO: show an error
				});
		},
		remove: function(book) {
			var scope = this;

			scope.block();
			VirtualBookshelf.Data.deleteBook(book)
				.then(function (res) {
					return scope.loadData();
				})
				.catch(function (res) {
					//TODO: show an error
				})
				.finally(function (res) {
					scope.unblock();
				});
		},
		loadData: function() {
			var scope = this;
			var $q = VirtualBookshelf.UI.$q;
			var promise;

			scope.block();
			promise = $q.when(this.isShow() ? VirtualBookshelf.Data.getUserBooks(VirtualBookshelf.UI.user.getId()) : null)
				.then(function (books) {
					scope.list = books;
				})
				.finally(function () {
					scope.unblock();		
				});

			return promise;
		}
	},
	createBook: {
		list: [],
		book: {},

		setBook: function(book) {
			this.book = {}; // create new object for unbind from scope
			if(book) {
				this.book.id = book.id;
				this.book.userId = book.userId;
				this.book.model = book.model;
				this.book.cover = book.cover;
				this.book.title = book.title;
				this.book.author = book.author;
			}
		},
		getImg: function() {
			return this.book.model ? VirtualBookshelf.UI.BOOK_IMAGE_URL.replace('{model}', this.book.model) : null;
		},
		isShow: function() {
			return !!this.book.id;
		},
		save: function() {
			var scope = this;

			
			VirtualBookshelf.UI.menu.inventory.block();
			VirtualBookshelf.Data.postBook(this.book)
				.then(function (res) {
					scope.cancel();
					return VirtualBookshelf.UI.menu.inventory.loadData()
				})
				.catch(function (res) {
					//TODO: show error
				})
				.finally(function (res) {
					VirtualBookshelf.UI.menu.inventory.unblock();
				});
		},
		cancel: function() {
			this.setBook();
		}
	}
};

VirtualBookshelf.UI.initControlsData = function() {
	var scope = VirtualBookshelf.UI;

	VirtualBookshelf.Data.getUIData(function (err, data) {
		if(!err && data) {
			scope.menu.createLibrary.list = data.libraries;
			scope.menu.createSection.list = data.bookshelves;
			scope.menu.createBook.list = data.books;
		}
	});

	VirtualBookshelf.UI.menu.selectLibrary.updateList();
	VirtualBookshelf.UI.menu.inventory.loadData();
}

// VirtualBookshelf.UI.initControlsEvents = function() {
	// VirtualBookshelf.UI.menu.createBook.model.onchange = VirtualBookshelf.UI.changeModel;
	// VirtualBookshelf.UI.menu.createBook.texture.onchange = VirtualBookshelf.UI.changeBookTexture;
	// VirtualBookshelf.UI.menu.createBook.cover.onchange = VirtualBookshelf.UI.changeBookCover;
	// VirtualBookshelf.UI.menu.createBook.author.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'text');
	// VirtualBookshelf.UI.menu.createBook.authorSize.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'size');
	// VirtualBookshelf.UI.menu.createBook.authorColor.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'color');
	// VirtualBookshelf.UI.menu.createBook.title.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'text');
	// VirtualBookshelf.UI.menu.createBook.titleSize.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'size');
	// VirtualBookshelf.UI.menu.createBook.titleColor.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'color');
	// VirtualBookshelf.UI.menu.createBook.editCover.onclick = VirtualBookshelf.UI.switchEdited;
	// VirtualBookshelf.UI.menu.createBook.editAuthor.onclick = VirtualBookshelf.UI.switchEdited;
	// VirtualBookshelf.UI.menu.createBook.editTitle.onclick = VirtualBookshelf.UI.switchEdited;
	// VirtualBookshelf.UI.menu.createBook.ok.onclick = VirtualBookshelf.UI.saveBook;
	// VirtualBookshelf.UI.menu.createBook.cancel.onclick = VirtualBookshelf.UI.cancelBookEdit;
// };

// create book

// VirtualBookshelf.UI.showCreateBook = function() {
// 	var menuNode = VirtualBookshelf.UI.menu.createBook;

// 	if(VirtualBookshelf.selected.isBook()) {
// 		menuNode.show();
// 		menuNode.setValues();
// 	} else if(VirtualBookshelf.selected.isSection()) {
// 		var section = VirtualBookshelf.selected.object;
// 		var shelf = section.getShelfByPoint(VirtualBookshelf.selected.point);
// 		var freePosition = section.getGetFreeShelfPosition(shelf, {x: 0.05, y: 0.12, z: 0.1}); 
// 		if(freePosition) {
// 			menuNode.show();

// 			var dataObject = {
// 				model: menuNode.model.value, 
// 				texture: menuNode.texture.value, 
// 				cover: menuNode.cover.value,
// 				pos_x: freePosition.x,
// 				pos_y: freePosition.y,
// 				pos_z: freePosition.z,
// 				sectionId: section.dataObject.id,
// 				shelfId: shelf.id,
// 				userId: VirtualBookshelf.user.id
// 			};

// 			VirtualBookshelf.Data.createBook(dataObject, function (book, dataObject) {
// 				book.parent = shelf;
// 				VirtualBookshelf.selected.object = book;
// 				VirtualBookshelf.selected.get();
// 			});
// 		} else {
// 			alert('There is no free space on selected shelf.');
// 		}
// 	}
// }

// VirtualBookshelf.UI.changeModel = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var oldBook = VirtualBookshelf.selected.object;
// 		var dataObject = {
// 			model: this.value,
// 			texture: oldBook.texture.toString(),
// 			cover: oldBook.cover.toString()
// 		};

// 		VirtualBookshelf.Data.createBook(dataObject, function (book, dataObject) {
// 			book.copyState(oldBook);
// 		});
// 	}
// }

// VirtualBookshelf.UI.changeBookTexture = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;
// 		book.texture.load(this.value, false, function () {
// 			book.updateTexture();
// 		});
// 	}
// }

// VirtualBookshelf.UI.changeBookCover = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;
// 		book.cover.load(this.value, true, function() {
// 			book.updateTexture();
// 		});
// 	}
// }

// VirtualBookshelf.UI.changeSpecificValue = function(field, property) {
// 	return function () {
// 		if(VirtualBookshelf.selected.isBook()) {
// 			VirtualBookshelf.selected.object[field][property] = this.value;
// 			VirtualBookshelf.selected.object.updateTexture();
// 		}
// 	};
// };

// VirtualBookshelf.UI.switchEdited = function() {
// 	var activeElemets = document.querySelectorAll('a.activeEdit');

// 	for(var i = activeElemets.length - 1; i >= 0; i--) {
// 		activeElemets[i].className = 'inactiveEdit';
// 	};

// 	var previousEdited = VirtualBookshelf.UI.menu.createBook.edited;
// 	var currentEdited = this.getAttribute('edit');

// 	if(previousEdited != currentEdited) {
// 		this.className = 'activeEdit';
// 		VirtualBookshelf.UI.menu.createBook.edited = currentEdited;
// 	} else {
// 		VirtualBookshelf.UI.menu.createBook.edited = null;
// 	}
// }

// VirtualBookshelf.UI.saveBook = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;

// 		VirtualBookshelf.selected.put();
// 		book.save();
// 	}
// }

// VirtualBookshelf.UI.cancelBookEdit = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;
		
// 		VirtualBookshelf.selected.put();
// 		book.refresh();
// 	}
// }