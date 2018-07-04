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
	static get $inject() { return ['$element', '$ngRedux', '$state']; }

	constructor($element, $ngRedux, $state) {
		Object.assign(this, { $: $element[0], $ngRedux, $state });

		this.__lifetaskBehavior = $ngRedux.connect(behavior =>
			Object({
				id: behavior.reward.reward.id,
				title: behavior.reward.reward.title,
				description: behavior.reward.reward.description,
				value: behavior.reward.reward.value
			})
		)(this);
	}

	/* Lifecycle */
	$onInit() {
		if (this.id === null)
			this.$state.go('rewardList');
	}

	$onDestroy() {
		this.__lifetaskBehavior();
	}
	/* */

	/* Public */
	save() {
		this.$ngRedux.dispatch({type: 'SAVE_REWARD_CRUD', data: {
			id: this.id,
			title: this.title,
			description: this.description,
			value: this.value
		}});
		this.$state.go('rewardList');
	}
	/* */

	/* Private */
	/* */

	/* Protected */
	/* */

	/* Observers */
	/* */
}

angular.module('lifeTask').component('lifetaskRewardCrud', new LifetaskRewardCrud());
