angular.module('VirtualBookshelf')
.factory('archive', function (Data) {
	var archive = {};

	archive.sendExternalURL = function(externalURL, tags) {
		return Data.postArchiveImage(externalURL, tags);
	};

	return archive;
});