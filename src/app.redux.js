/* global angular */

angular.module('lifeTask').config([
	'$ngReduxProvider',
	$ngReduxProvider => {
		class SessionReducerState {
			constructor() {
				this.id = '';
				this.name = '';
				this.email = '';
				this.coins = 0;
			}
		}

		function syncWithStorage(state) {
			window.localStorage.setItem('sessionState', JSON.stringify(state));
		}

		function getSessionState() {
			const localStorageItem = window.localStorage.getItem('sessionState');
			return localStorageItem ? JSON.parse(localStorageItem) : new SessionReducerState();
		}

		function sessionReducer(state, action) {
			if (!state)
				return getSessionState();
			let newState = {};
			switch(action.type) {
			case 'LOGIN':
				newState = Object.assign({}, state, {
					id: action.data.id,
					name: action.data.name,
					email: action.data.email
				});
				syncWithStorage(newState);
				return newState;
			case 'UPDATE_COINS':
				newState = Object.assign({}, state, {
					coins: action.data.coins
				});
				syncWithStorage(newState);
				return newState;
			case 'FINISH_TASK':
				newState = Object.assign({}, state, {
					coins: state.coins + action.data.task.reward
				});
				syncWithStorage(newState);
				return newState;
			case 'BUY_REWARD':
				newState = Object.assign({}, state, {
					coins: state.coins - action.data.reward.value
				});
				syncWithStorage(newState);
				return newState;
			default:
				return state;
			}
		}

		class TaskReducerState {
			constructor() {
				this.task = {id: null, title: null, description: null, reward: null};
				this.list = [];
			}
		}

		function taskReducer(state, action) {
			if (!state)
				return new TaskReducerState();
			switch(action.type) {
			case 'TASK_CRUD': 
				return Object.assign({}, state, {
					task: Object.assign({}, state.task, action.data.task)
				});
			case 'UPDATE_TASK_LIST':
				return Object.assign({}, state, {
					list: action.data.taskList
				});
			case 'SAVE_TASK_CRUD':
				return Object.assign({}, state, {
					task: {id: null, title: null, description: null, reward: null},
					list: !state.list.filter(task => task.id == action.data.id)[0] ?
						state.list.concat(action.data) :
						state.list.map(task =>
							task.id == action.data.id ? action.data : task)
				});
			case 'FINISH_TASK':
				return Object.assign({}, state, {
					list: state.list.filter(task => task.id != action.data.task.id)
				});
			default:
				return state;
			}
		}

		class RewardReducerState {
			constructor() {
				this.reward = {id: null, title: null, description: null, value: null};
				this.list = [];
			}
		}

		function rewardReducer(state, action) {
			if (!state)
				return new RewardReducerState();
			switch(action.type) {
			case 'REWARD_CRUD': 
				return Object.assign({}, state, {
					reward: Object.assign({}, state.reward, action.data.reward)
				});
			case 'UPDATE_REWARD_LIST':
				return Object.assign({}, state, {
					list: action.data.rewardList
				});
			case 'SAVE_REWARD_CRUD':
				return Object.assign({}, state, {
					reward: {id: null, title: null, description: null, value: null},
					list: !state.list.filter(reward => reward.id == action.data.id)[0] ?
						state.list.concat(action.data) :
						state.list.map(reward =>
							reward.id == action.data.id ? action.data : reward)
				});
			case 'BUY_REWARD':
				return Object.assign({}, state, {
					list: state.list.filter(reward => reward.id != action.data.reward.id)
				});
			default:
				return state;
			}
		}

		$ngReduxProvider.createStoreWith({
			session: sessionReducer,
			task: taskReducer,
			reward: rewardReducer
		});
	}
]);