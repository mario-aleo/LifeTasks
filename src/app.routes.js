/* global angular */

angular.module('lifeTask').config([
	'$stateProvider', '$urlRouterProvider',
	($stateProvider, $urlRouterProvider) => {
		$urlRouterProvider
			.otherwise(() => '/taskList');

		$stateProvider
			.state('taskList', {
				url: '/taskList',
				template: '<lifetask-task-list></lifetask-task-list>',
				lazyLoad: $transition$ =>
					$transition$.injector()
						.get('$ocLazyLoad')
						.load('components/lifetask-task-list/lifetask-task-list.component.js')
			})
			.state('taskCrud', {
				url: '/taskCrud',
				template: '<lifetask-task-crud></lifetask-task-crud>',
				lazyLoad: $transition$ =>
					$transition$.injector()
						.get('$ocLazyLoad')
						.load('components/lifetask-task-crud/lifetask-task-crud.component.js')
			})
			.state('rewardList', {
				url: '/rewardList',
				template: '<lifetask-reward-list></lifetask-reward-list>',
				lazyLoad: $transition$ =>
					$transition$.injector()
						.get('$ocLazyLoad')
						.load('components/lifetask-reward-list/lifetask-reward-list.component.js')
			})
			.state('rewardCrud', {
				url: '/rewardCrud',
				template: '<lifetask-reward-crud></lifetask-reward-crud>',
				lazyLoad: $transition$ =>
					$transition$.injector()
						.get('$ocLazyLoad')
						.load('components/lifetask-reward-crud/lifetask-reward-crud.component.js')
			});
	}
]);