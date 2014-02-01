VirtualBookshelf.UI = VirtualBookshelf.UI || {};

VirtualBookshelf.UI.init = function() {
	var scope = VirtualBookshelf.UI;

	scope.searchForUIs();
	scope.refresh();
}

VirtualBookshelf.UI.searchForUIs = function() {
	var scope = VirtualBookshelf.UI;

	scope.loginPanel = document.getElementById('UI_LOGIN');
	scope.libraryCreatePanel = document.getElementById('UI_LIBRARY_CREATE');
}

VirtualBookshelf.UI.show = function(element) {
	if(element instanceof HTMLDivElement) {
		element.style.display = 'block';
	}
}

VirtualBookshelf.UI.hide = function(element) {
	if(element instanceof HTMLDivElement) {
		element.style.display = 'none';
	}
}

VirtualBookshelf.UI.refresh = function() {
	var scope = VirtualBookshelf.UI;

	if(VirtualBookshelf.user.id) {
		scope.hide(scope.loginPanel);
	} else {
		scope.show(scope.loginPanel);
	}
}