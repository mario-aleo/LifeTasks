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
	static get $inject() { return ['$element', '$ngRedux', '$state']; }

	constructor($element, $ngRedux, $state) {
		Object.assign(this, { $: $element[0], $ngRedux, $state });

		this.__lifetaskBehavior = $ngRedux.connect(behavior =>
			Object({
				userCoins: behavior.session.coins,
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
	addReward() {
		const rewardList = Object.assign([], this.rewardList);
		const newId = rewardList.sort((a, b) => a.id < b.id)[0].id + 1;
		this.$ngRedux.dispatch({type: 'REWARD_CRUD', data: {
			reward: {
				id: newId
			}
		}});
		this.$state.go('rewardCrud');
	}

	editReward(reward) {
		this.$ngRedux.dispatch({type: 'REWARD_CRUD', data: { reward }});
		this.$state.go('rewardCrud');
	}

	buyReward(reward) {
		this.$ngRedux.dispatch({type: 'BUY_REWARD', data: { reward }});
	}
	/* */

	/* Private */
	/* */

	/* Protected */
	/* */

	/* Observers */
	/* */
}

angular.module('lifeTask').component('lifetaskRewardList', new LifetaskRewardList());
