import uiData from 'data.json';

angular.module('VirtualBookshelf')
.factory('data', function ($http, $log, $window) {
	var data = {};

	data.TEXTURE_RESOLUTION = 512;
	data.COVER_MAX_Y = 394;
	data.COVER_FACE_X = 296;
	data.LIBRARY_CANVAS_ID = 'LIBRARY';
    data.OBJECTS_PATH = 'objects';
    data.EMPTY_IMAGE_URL = '/img/empty_cover.jpg';

    data.postCover = function(externalURL, tags) {
    	var data = {
    		url: externalURL,
    		tags: tags
    	};

    	return $http.post('/cover', data).then(function (res) {
    		return res.data;
    	});
    };

    data.logout = function() {
    	return $http.post('/auth/logout');
    };

	data.getUser = function() {
		return $http.get('/user').then(function (res) {
			return res.data;
		}).catch(function () {
			return null;
		});
	};

	data.putUser = function(dto) {
		return $http.put('/user', dto);
	};

	data.deleteUser = function(id) {
		return $http.delete('/user/' + id);
	};

	data.getUserBooks = function(userId) {
		return $http.get('/freeBooks/' + userId).then(function (res) {
			return res.data;
		});
	};

	data.postBook = function(book) {
		return $http.post('/book', book).then(function (res) {
			return res.data;
		});
	};

	data.deleteBook = function(id) {
		return $http({
			method: 'DELETE',
			url: '/book/' + id
		});
	};

	data.getUIData = function() {
		return uiData;
	};

	data.getLibraries = function() {
		return $http.get('/libraries').then(function (res) {
			return res.data;
		});
	};

	data.getLibrary = function(libraryId) {
		return $http.get('/library/' + libraryId).then(function (res) {
			return res.data;
		});
	};

	data.postLibrary = function(libraryModel) {
        return $http.post('/library/' + libraryModel).then(function (res) {
            return res.data;
        });
	};

	data.getSections = function(libraryId) {
        return $http.get('/sections/' + libraryId).then(function (res) {
            return res.data;
        });
	};

	data.postSection = function(sectionData) {
        return $http.post('/section', sectionData).then(function (res) {
        	return res.data;
        });
	};

	data.deleteSection = function(id) {
		return $http({
			method: 'DELETE',
			url: '/sections/' + id
		});
	};

	//TODO: replace by SPA implementation
	data.goToLibrary = function(id) {
		if(id) $window.location = '/' + id;
	};

	data.getCanvas = function() {
		return document.getElementById(data.LIBRARY_CANVAS_ID);
	};

	return data;
});