VirtualBookshelf.Data = VirtualBookshelf.Data || {};

VirtualBookshelf.Data.ajax = function(urlArray, type, done, data) {
	var url = urlArray.join('/');
	$.ajax({url: url, type: type, data: data,
    	success: function(data) {
			console.log('Data result: ', type, url, data);
    		done(null, data);
    	}
    });
}

VirtualBookshelf.Data.getLibrary = function(libraryId, done) {
	return VirtualBookshelf.Data.ajax(['/library', libraryId], 'GET', done);
}

VirtualBookshelf.Data.getLibraries = function(done) {
	return VirtualBookshelf.Data.ajax(['/libraries'], 'GET', done);
}

VirtualBookshelf.Data.getLibraryObjects = function(done) {
	return VirtualBookshelf.Data.ajax(['/libraryObjects'], 'GET', done);
}

VirtualBookshelf.Data.postLibrary = function(libraryObjectId, done) {
	return VirtualBookshelf.Data.ajax(['/library', libraryObjectId], 'POST', done);
}

VirtualBookshelf.Data.getSectionObjects = function(done) {
	return VirtualBookshelf.Data.ajax(['/sectionObjects'], 'GET', done);
}

VirtualBookshelf.Data.postSection = function(sectionObjectId, libraryId, done) {
	return VirtualBookshelf.Data.ajax(['/section', sectionObjectId, libraryId] , 'POST', done);
}

VirtualBookshelf.Data.getBookObjects = function(done) {
	return VirtualBookshelf.Data.ajax(['/bookObjects'], 'GET', done);
}

VirtualBookshelf.Data.postBook = function(book, done) {
	return VirtualBookshelf.Data.ajax(['/book'], 'POST', done, book);
}