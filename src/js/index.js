import '../css/ngDialog-theme-default.min.css';
import '../css/style.css';
import '../css/spinner.css';

import './services/main';

import './directives/select';

import './controllers/AuthCtrl';
import './controllers/BookEditCtrl';
import './controllers/CreateLibraryCtrl';
import './controllers/CreateSectionCtrl';
import './controllers/InventoryCtrl';
import './controllers/LinkAccountCtrl';
import './controllers/MainMenuCtrl';
import './controllers/NavigationCtrl';
import './controllers/RegistrationCtrl';
import './controllers/SelectLibraryCtrl';
import './controllers/ToolsCtrl';
import './controllers/TooltipCtrl';
import './controllers/WelcomeCtrl';

import appModule from './app';

angular.element(document).ready(function () {
	angular.bootstrap(document, [appModule.name]);
});