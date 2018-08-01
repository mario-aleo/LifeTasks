/* global angular, firebase, importStyle */

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
				userId: behavior.session.id,
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
		this.$ngRedux.dispatch({type: 'REWARD_CRUD', data: {
			task: {title: null, description: null, value: null}
		}});
		this.$state.go('rewardCrud');
	}

	editReward(reward) {
		this.$ngRedux.dispatch({type: 'REWARD_CRUD', data: { reward }});
		this.$state.go('rewardCrud');
	}

	buyReward(reward) {
		const db = firebase.firestore();
		db.collection('users')
			.doc(this.userId)
			.collection('rewardList')
			.doc(reward.id)
			.delete()
			.then(() => 
				db.collection('users')
					.doc(this.userId)
					.update({
						coins: this.userCoins - reward.value
					})
			)
			.then(() => 
				db.collection('users')
					.doc(this.userId)
					.get()
			)
			.then(res => { 
				this.$ngRedux.dispatch({ type: 'UPDATE_COINS',
					data: {
						coins: res.data().coins
					}
				});
				this.$ngRedux.dispatch({ type: 'UPDATE_REWARD_LIST',
					data: {
						rewardList: res.data().rewardList
					}
				});
			})
			.catch(err =>
				console.error(err)
			);
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
