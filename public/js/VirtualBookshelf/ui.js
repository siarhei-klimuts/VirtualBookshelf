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
	scope.libraryCreatePanelSelect = document.getElementById('UI_LIBRARY_CREATE_SELECT');
	scope.librarySelectPanel = document.getElementById('UI_LIBRARY_SELECT');
	scope.librarySelectPanelDropdown = document.getElementById('UI_LIBRARY_SELECT_DROPDOWN');
}

// library create
VirtualBookshelf.UI.showLibraryCreate = function() {
	VirtualBookshelf.UI.show(VirtualBookshelf.UI.libraryCreatePanel);
	VirtualBookshelf.UI.showLibraryCreateList();
}

VirtualBookshelf.UI.hideLibraryCreate = function() {
	VirtualBookshelf.UI.hide(VirtualBookshelf.UI.libraryCreatePanel);
}

VirtualBookshelf.UI.showLibraryCreateList = function() {
	VirtualBookshelf.Data.getLibraryObjects(function(err, result) {
		if(err) return;


		if(!VirtualBookshelf.UI.libraryCreatePanelSelect.options.length) {
			if(result && result.length > 0) {
				result.forEach(function(libraryObject) {
					var option = document.createElement('option');
					option.innerHTML = libraryObject.model;
					option.value = libraryObject.id;

					VirtualBookshelf.UI.libraryCreatePanelSelect.appendChild(option);
				});
			}
		}
	});
}

VirtualBookshelf.UI.createLibrary = function() {
	var select = VirtualBookshelf.UI.libraryCreatePanelSelect; 
	var libraryObjectId = select.options[select.selectedIndex].value;

	VirtualBookshelf.Data.putLibrary(libraryObjectId, function(err, result) {
		if(err) return;

		if(result) {
			VirtualBookshelf.loadLibrary(result.id);
			VirtualBookshelf.UI.hideLibraryCreate();
		}
	});
}

// library select
VirtualBookshelf.UI.showLibrarySelect = function(libraries) {
	VirtualBookshelf.UI.show(VirtualBookshelf.UI.librarySelectPanel);

	if(!VirtualBookshelf.UI.librarySelectPanelDropdown.options.length) {
		if(libraries && libraries.length > 0) {
			libraries.forEach(function(library) {
				var option = document.createElement('option');
				option.innerHTML = library.id;
				option.value = library.id;

				VirtualBookshelf.UI.librarySelectPanelDropdown.appendChild(option);
			});
		}
	}
}

VirtualBookshelf.UI.hideLibrarySelect = function() {
	VirtualBookshelf.UI.hide(VirtualBookshelf.UI.librarySelectPanel);
}

VirtualBookshelf.UI.selectLibrary = function() {
	var select = VirtualBookshelf.UI.librarySelectPanelDropdown; 
	var libraryId = select.options[select.selectedIndex].value;

	VirtualBookshelf.loadLibrary(libraryId);
	VirtualBookshelf.UI.hideLibrarySelect();
}

// utils
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