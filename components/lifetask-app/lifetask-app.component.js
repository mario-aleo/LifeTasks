/* global angular */

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
	/* */

	/* Private */
	/* */

	/* Protected */
	/* */

	/* Observers */
	/* */
}

angular.module('lifeTask').component('lifetaskApp', new LifetaskApp());
