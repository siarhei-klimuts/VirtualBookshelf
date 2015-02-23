angular.module('VirtualBookshelf')
.controller('UiCtrl', function ($scope, UI, navigation, inventory, bookEdit, catalog) {
    $scope.menu = UI.menu;

    $scope.inventory = inventory;
    $scope.bookEdit = bookEdit;
    $scope.catalog = catalog;

	$scope.navigation = {
		stop: navigation.goStop,
		forward: navigation.goForward,
		backward: navigation.goBackward,
		left: navigation.goLeft,
		right: navigation.goRight
	};
});