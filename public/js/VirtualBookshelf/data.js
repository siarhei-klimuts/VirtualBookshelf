VirtualBookshelf.Data = VirtualBookshelf.Data || {};

VirtualBookshelf.Data.ajax = function(urlArray, type, done) {
	var url = urlArray.join('/');
	$.ajax({url: url, type: type,
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

VirtualBookshelf.Data.putLibrary = function(libraryObjectId, done) {
	return VirtualBookshelf.Data.ajax(['/library', libraryObjectId], 'PUT', done);
}

VirtualBookshelf.Data.getSectionObjects = function(done) {
	return VirtualBookshelf.Data.ajax(['/sectionObjects'], 'GET', done);
}

VirtualBookshelf.Data.putSection = function(sectionObjectId, libraryId, done) {
	return VirtualBookshelf.Data.ajax(['/section', sectionObjectId, libraryId] , 'PUT', done);
}