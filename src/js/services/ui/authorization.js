import '../user';
import './registration';
import './userData';
import './block';

angular.module('VirtualBookshelf')
.factory('authorization', function ($log, $q, $window, $interval, user, registration, userData, block, ngDialog) {
	var authorization = {};

	var TEMPLATE = 'loginDialog';

	authorization.show = function() {
		ngDialog.open({template: TEMPLATE});
	};

	authorization.isShow = function() {
		return !user.isAuthorized() && user.isLoaded();
	};

	var login = function(link) {
		block.global.start();
		var win = $window.open(link, '', 'width=800,height=600,modal=yes,alwaysRaised=yes');
	    var checkAuthWindow = $interval(function () {
	        if (win && win.closed) {
	        	$interval.cancel(checkAuthWindow);

	        	user.setLibraryLoaded(false);
	        	user.load().then(function () {
	        		return user.isTemporary() ? registration.show() : userData.load();
	        	}).finally(function () {
	        		user.setLibraryLoaded(true);
	        		block.global.stop();
	        	}).catch(function () {
	        		$log.log('User loadind error');
					//TODO: show error message  
	        	});
	        }
	    }, 100);
	};

	authorization.google = function() {
		login('/auth/google');
	};

	authorization.twitter = function() {
		login('/auth/twitter');
	};

	authorization.facebook = function() {
		login('/auth/facebook');
	};

	authorization.vkontakte = function() {
		login('/auth/vkontakte');
	};

	authorization.logout = function() {
    	user.setLibraryLoaded(false);
		user.logout().finally(function () {
    		return userData.load();
		}).finally(function () {
        	user.setLibraryLoaded(true);
		}).catch(function () {
			$log.error('Logout error');
			//TODO: show an error
		});
	};
	
	return authorization;
});