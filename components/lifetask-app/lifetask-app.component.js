/* global angular, firebase, importStyle */

importStyle('components/lifetask-app/lifetask-app.css', { preload: true });

class LifetaskApp {
	constructor() {
		this.templateUrl = 'components/lifetask-app/lifetask-app.html';
		this.bindings = {};
		this.controller = LifetaskAppController;
	}
}

class LifetaskAppController {
	static get $inject() { return ['$element', '$ngRedux']; }

	constructor($element, $ngRedux) {
		Object.assign(this, { $: $element[0], $ngRedux });

		this.__lifetaskBehavior = $ngRedux.connect(behavior =>
			Object({
				session: behavior.session,
				task: behavior.task,
				reward: behavior.reward
			})
		)(this);

		this.provider = new firebase.auth.GoogleAuthProvider();
	}

	/* Lifecycle */
	$onInit() {
		this.$.removeAttribute('unresolved');
	}

	$onDestroy() {
		this.__lifetaskBehavior();
	}
	/* */

	/* Public */
	login() {
		firebase.auth().signInWithPopup(this.provider).then(result => {
			if (result.credential) {
				this.$ngRedux.dispatch({ type: 'LOGIN',
					data: {
						name: result.user.displayName,
						email: result.user.email,
						id: result.user.uid
					}
				});
				this.$.setAttribute('authorized', '');
			}
		}).catch(error =>
			console.warn(error));
	}
	/* */

	/* Private */
	/* */

	/* Observers */
	/* */
}

angular.module('lifeTask').component('lifetaskApp', new LifetaskApp());
