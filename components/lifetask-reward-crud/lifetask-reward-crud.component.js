/* global angular, firebase, importStyle */

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
				userId: behavior.session.id,
				id: behavior.reward.reward.id,
				title: behavior.reward.reward.title,
				description: behavior.reward.reward.description,
				value: behavior.reward.reward.value
			})
		)(this);
	}

	/* Lifecycle */
	$onDestroy() {
		this.__lifetaskBehavior();
	}
	/* */

	/* Public */
	save() {
		if (this.id)
			this.updateReward();
		else
			this.createReward();
	}

	createReward() {
		const db = firebase.firestore();
		db.collection('users')
			.doc(this.userId)
			.collection('rewardList')
			.add({
				title: this.title,
				description: this.description,
				value: this.value
			})
			.then(() =>
				db.collection('users')
					.doc(this.userId)
					.collection('rewardList')
					.get()
			)
			.then(res => {
				this.$ngRedux.dispatch({ type: 'UPDATE_REWARD_LIST',
					data: {
						rewardList: res.docs.map(doc => 
							Object.assign({}, doc.data(), {
								id: doc.id
							})
						)
					}
				});
				this.$state.go('rewardList');
			})
			.catch(err =>
				console.error(err)
			);
	}

	updateReward() {
		const db = firebase.firestore();
		db.collection('users')
			.doc(this.userId)
			.collection('rewardList')
			.doc(this.reward.id)
			.update({
				title: this.title,
				description: this.description,
				value: this.value
			})
			.then(() =>
				db.collection('users')
					.doc(this.userId)
					.collection('rewardList')
					.get()
			)
			.then(res => {
				this.$ngRedux.dispatch({ type: 'UPDATE_REWARD_LIST',
					data: {
						rewardList: res.docs.map(doc => 
							Object.assign({}, doc.data(), {
								id: doc.id
							})
						)
					}
				});
				this.$state.go('rewardList');
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

angular.module('lifeTask').component('lifetaskRewardCrud', new LifetaskRewardCrud());
