/* global angular, importStyle */

importStyle('components/lifetask-reward-crud/lifetask-reward-crud.css', { preload: true });

class LifetaskRewardCrud {
	constructor() {
		this.templateUrl = 'components/lifetask-reward-crud/lifetask-reward-crud.html';
		this.bindings = {};
		this.controller = LifetaskRewardCrudController;
	}
}

class LifetaskRewardCrudController {
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
	$onInit() { }

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

angular.module('lifeTask').component('lifetaskRewardCrud', new LifetaskRewardCrud());
