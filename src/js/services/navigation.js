import camera from './scene/camera';

var navigation = {};

navigation.BUTTONS_ROTATE_SPEED = 100;
navigation.BUTTONS_GO_SPEED = 0.02;

var state = {
	forward: false,
	backward: false,
	left: false,
	right: false			
};

navigation.goStop = function() {
	state.forward = false;
	state.backward = false;
	state.left = false;
	state.right = false;
};

navigation.goForward = function() {
	state.forward = true;
};

navigation.goBackward = function() {
	state.backward = true;
};

navigation.goLeft = function() {
	state.left = true;
};

navigation.goRight = function() {
	state.right = true;
};

navigation.update = function() {
	if(state.forward) {
		camera.go(navigation.BUTTONS_GO_SPEED);
	} else if(state.backward) {
		camera.go(-navigation.BUTTONS_GO_SPEED);
	} else if(state.left) {
		camera.rotate(navigation.BUTTONS_ROTATE_SPEED, 0);
	} else if(state.right) {
		camera.rotate(-navigation.BUTTONS_ROTATE_SPEED, 0);
	}
};

export default navigation;