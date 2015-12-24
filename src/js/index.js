require('font-awesome/css/font-awesome.min.css');
require('../css/style.css');

import './services/main';

import './controllers/AuthCtrl';
import './controllers/BookEditCtrl';
import './controllers/CreateLibraryCtrl';
import './controllers/CreateSectionCtrl';
import './controllers/FeedbackCtrl';
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
  angular.bootstrap(document, [appModule.name], {
    //strictDi: true
  });
});