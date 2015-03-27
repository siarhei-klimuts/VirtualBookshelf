angular.module('VirtualBookshelf')
.factory('authorization', function ($log, $q, $window, $interval, user, selectLibrary, catalog, environment, ngDialog) {
	var authorization = {};

	authorization.show = function() {
		ngDialog.openConfirm({
			template: '/ui/loginDialog'
		});
	};

	authorization.isShow = function() {
		return !user.isAuthorized() && user.isLoaded();
	};

	authorization.google = function() {
		var win = $window.open('/auth/google', '', 'width=800,height=600,modal=yes,alwaysRaised=yes');
	    var checkAuthWindow = $interval(function () {
	        if (win && win.closed) {
	        	$interval.cancel(checkAuthWindow);

	        	environment.setLoaded(false);
	        	user.load().then(function () {
	        		return authorization.loadUserData();
	        	}).finally(function () {
	        		environment.setLoaded(true);
	        	}).catch(function () {
	        		$log.log('User loadind error');
					//TODO: show error message  
	        	});
	        }
	    }, 100);
	};

	authorization.logout = function() {
    	environment.setLoaded(false);
		user.logout().finally(function () {
    		return authorization.loadUserData();
		}).finally(function () {
        	environment.setLoaded(true);
		}).catch(function () {
			$log.error('Logout error');
			//TODO: show an error
		});
	};

	authorization.loadUserData = function() {
		return $q.all([
			selectLibrary.updateList(), 
			catalog.loadBooks()
		]);
	};
	
	return authorization;
});