(function () {
    angular
        .module('vbUserInterface', ['blockUI', 'angularUtils.directives.dirPagination'])
        	.config(function (blockUIConfig, paginationTemplateProvider) {
        		blockUIConfig.delay = 0;
        		blockUIConfig.autoBlock = false;
				blockUIConfig.autoInjectBodyBlock = false;
				paginationTemplateProvider.setPath('/js/angular/dirPagination/dirPagination.tpl.html');
        	})
	        .run(VirtualBookshelf.run)
	        .controller('UIController', function ($scope, ui) {
	            $scope.menu = VirtualBookshelf.UI.menu;
	        })
	        .factory('ui', VirtualBookshelf.UI.init)
	        .factory('user', VirtualBookshelf.User)
	        .factory('data', VirtualBookshelf.Data.init)
	        .directive('vbSelect', VirtualBookshelf.Directives.Select);
})();