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
	static get $inject() { return ['$element', '$ngRedux', '$state', '$scope']; }

	constructor($element, $ngRedux, $state, $scope) {
		Object.assign(this, { $: $element[0], $ngRedux, $state, $scope });

		this.__lifetaskBehavior = $ngRedux.connect(behavior =>
			Object({
				userId: behavior.session.id,
				userCoins: behavior.session.coins
			})
		)(this);

		this.provider = new firebase.auth.GoogleAuthProvider();
	}

	/* Lifecycle */
	$onInit() {
		if (this.userId)
			this.$.setAttribute('authorized', '');
		this.$.removeAttribute('unresolved');

		this.$scope.$watch(() =>
			this.$state.$current, 
		this.__stateChanged.bind(this));
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

	changeView(evt) {
		this.$state.go(evt.target.dataset.view);
	}
	/* */

	/* Private */
	/* */

	/* Observers */
	__stateChanged(newValue) {
		if (newValue) {
			const currentState = newValue.name;
			this.$.querySelectorAll('#appFooter div')
				.forEach(node => {
					if (currentState.includes('task') && node.dataset.view.includes('task'))
						node.setAttribute('active', '');
					else if (currentState.includes('reward') && node.dataset.view.includes('reward'))
						node.setAttribute('active', '');
					else
						node.removeAttribute('active');
				});
		}
	}
	/* */
}

angular.module('lifeTask').component('lifetaskApp', new LifetaskApp());
