angular.module('VirtualBookshelf')
.controller('UiCtrl', function ($scope, UI, navigation, inventory) {
    $scope.menu = UI.menu;

    $scope.inventory = inventory;

	$scope.navigation = {
		stop: navigation.goStop,
		forward: navigation.goForward,
		backward: navigation.goBackward,
		left: navigation.goLeft,
		right: navigation.goRight
	};
});