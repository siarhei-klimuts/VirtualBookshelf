VirtualBookshelf.Data = VirtualBookshelf.Data || {};

VirtualBookshelf.Data.ajax = function(url, type, done) {
	$.ajax({url: url, type: type,
    	success: function(data) {
    		done(null, data);
    	}
    });
}

VirtualBookshelf.Data.getLibrary = function(libraryId, done) {
	return VirtualBookshelf.Data.ajax('/library/' + libraryId, 'GET', done);
}

VirtualBookshelf.Data.getLibraries = function(done) {
	return VirtualBookshelf.Data.ajax('/libraries', 'GET', done);
}

VirtualBookshelf.Data.getLibraryObjects = function(done) {
	return VirtualBookshelf.Data.ajax('/libraryObjects', 'GET', done);
}

VirtualBookshelf.Data.putLibrary = function(libraryObjectId, done) {
	return VirtualBookshelf.Data.ajax('/library/' + libraryObjectId, 'PUT', done);
}

