angular.module('VirtualBookshelf')
.factory('bookEdit', function ($log, data, environment, block, dialog, archive, catalog, selector) {
	var bookEdit = {};

	var BOOK_IMAGE_URL = '/obj/books/{model}/img.jpg';
	var EMPTY_IMAGE_URL = '/img/empty_cover.jpg';
	
	bookEdit.list = [];
	bookEdit.book = {};
	bookEdit.coverInputURL = null;

	bookEdit.setBook = function(book) {
		this.book = {}; // create new object for unbind from scope
		if(book) {
			this.book.id = book.id;
			this.book.userId = book.userId;
			this.book.model = book.model;
			this.book.cover = book.cover;
			this.book.coverId = book.coverId;
			this.book.title = book.title;
			this.book.author = book.author;

			this.coverInputURL = null;
		}
	};

	bookEdit.getImg = function() {
		return this.book.model ? BOOK_IMAGE_URL.replace('{model}', this.book.model) : null;
	};

	bookEdit.getCoverImg = function() {
		return this.isCoverShow() ? this.book.cover : EMPTY_IMAGE_URL;
	};

	bookEdit.isCoverDisabled = function() {
		return this.coverInputURL && (this.form.title.$invalid || this.form.author.$invalid);
	};

	bookEdit.isCoverShow = function() {
		return Boolean(this.book.cover);
	};

	bookEdit.isShow = function() {
		return !!this.book.userId;
	};

	bookEdit.submit = function() {
		if(this.form.$valid) {
			this.save();
		} else {
			dialog.openError('Fill all required fields, please.');
		}
	};

	bookEdit.applyCover = function() {
		if(!this.isCoverDisabled()) {
			if(this.coverInputURL) {
				block.inventory.start();
				archive.sendExternalURL(this.coverInputURL, [this.book.title, this.book.author]).then(function (result) {
					bookEdit.book.cover = result.url;
					bookEdit.book.coverId = result.id;
				}).catch(function () {
					bookEdit.book.cover = null;
					dialog.openError('Can not apply this cover. Try another one, please.');
				}).finally(function () {
					bookEdit.coverInputURL = null;
					block.inventory.stop();
				});
			} else {
				bookEdit.book.cover = null;
			}
		} else {
			dialog.openError('Fill author and title fields, please.');
		}
	};

	bookEdit.save = function() {
		var scope = this;
		
		block.inventory.start();
		data.postBook(this.book).then(function (dto) {
			if(selector.isBookSelected(dto.id)) {
				selector.unselect();
			}

			environment.updateBook(dto);
			scope.cancel();
			return catalog.loadBooks();
		}).catch(function () {
			$log.error('Book save error');
			//TODO: show error
		}).finally(function () {
			block.inventory.stop();
		});
	};

	bookEdit.cancel = function() {
		this.setBook();
	};

	return bookEdit;
});