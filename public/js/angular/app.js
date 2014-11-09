(function () {
    angular
        .module('vbUserInterface', [])
        .controller('UIController', function ($scope) {
            $scope.menu = VirtualBookshelf.UI.menu;
        });
})();