/* global angular, importStyle */

importStyle('components/lifetask-reward-list/lifetask-reward-list.css', { preload: true });

class LifetaskRewardList {
	constructor() {
		this.templateUrl = 'components/lifetask-reward-list/lifetask-reward-list.html';
		this.bindings = {};
		this.controller = LifetaskRewardListController;
	}
}

class LifetaskRewardListController {
	static get $inject() { return ['$element', '$ngRedux']; }

	constructor($element, $ngRedux) {
		Object.assign(this, { $: $element[0], $ngRedux });

		this.__lifetaskBehavior = $ngRedux.connect(behavior =>
			Object({
				rewardList: behavior.reward.list
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

angular.module('lifeTask').component('lifetaskRewardList', new LifetaskRewardList());
