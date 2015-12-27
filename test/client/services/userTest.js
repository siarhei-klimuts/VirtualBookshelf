require('angular-mocks');

describe('user.js', function() {
	var $httpBackend;
	var $q;
	var $rootScope;
	var user;
	var data;

	var userDto = {
		id: 1,
		temporary: false,
		name: 'Test User name',
		email: 'Test User email',
		googleId: 'Test User googleId',
		twitterId: 'Test User twitterId',
		facebookId: 'Test User facebookId',
		vkontakteId: 'Test User vkontakteId'
	};

	beforeEach(angular.mock.module('VirtualBookshelf'));
	
	beforeEach(function () {
		inject(function (_$httpBackend_, _$q_, _$rootScope_, _user_, _data_) {
			$httpBackend = _$httpBackend_;
			$q = _$q_;
			$rootScope = _$rootScope_;
			user = _user_;
			data = _data_;
		});

		$httpBackend.when('GET', '/obj/data.json').respond({});
		$httpBackend.when('GET', '/user').respond({});
	});

	it('user should be empty at the beginning', function () {
		checkEmptyUser(false);
	});

	it('should load user', function() {
		spyOn(data, 'getUser').and.returnValue($q.when(userDto));
    	
    	user.load();
    	$rootScope.$apply();

    	checkFullfilledUser(true);
  	});

	it('user should not change after load error' , function() {
		spyOn(data, 'getUser').and.returnValue($q.reject());

    	user.setDataObject(userDto);
    	user.load();
    	$rootScope.$apply();

		checkFullfilledUser(false);
  	});

	it('user should logout and empty user' , function() {
		spyOn(data, 'logout').and.returnValue($q.when({}));
		spyOn(data, 'getUser').and.returnValue($q.when(null));

    	user.setDataObject(userDto);
    	user.logout();
    	$rootScope.$apply();

		checkEmptyUser(true);
  	});

  	function checkFullfilledUser(loaded) {
    	expect(user.isAuthorized()).toBe(true);
    	expect(user.isTemporary()).toBeFalsy();
    	expect(user.getId()).toBe(userDto.id);
    	expect(user.getName()).toBe(userDto.name);
    	expect(user.getEmail()).toBe(userDto.email);
    	expect(user.isGoogle()).toBe(true);
    	expect(user.isTwitter()).toBe(true);
    	expect(user.isFacebook()).toBe(true);
    	expect(user.isVkontakte()).toBe(true);

    	expect(user.isLoaded()).toBe(loaded);

    	// TODO: karma opens context.html, and there is no library number 
    	// when loading user separately from application 
    	// expect(user.getLibrary()).toBe(1);
  	}

  	function checkEmptyUser(loaded) {
    	expect(user.isAuthorized()).toBeFalsy();
    	expect(user.isTemporary()).toBeFalsy();
    	expect(user.getId()).toBe(null);
    	expect(user.getName()).toBe(null);
    	expect(user.getEmail()).toBe(null);
    	expect(user.isLoaded()).toBe(loaded);
    	expect(user.isGoogle()).toBe(false);
    	expect(user.isTwitter()).toBe(false);
    	expect(user.isFacebook()).toBe(false);
    	
    	// TODO: karma opens context.html, and there is no library number 
    	// when loading user separately from application 
    	// expect(user.getLibrary()).toBeNull();
  	}
});