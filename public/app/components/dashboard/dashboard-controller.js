angular.module('hhsApp').controller('DashboardController', DashboardController);

DashboardController.$inject = ['$window', '$location', '$q', 'AuthFactory', 'DashboardService'];

function DashboardController($window, $location, $q, AuthFactory, DashboardService) {
    var vm = this;
    vm.user = JSON.parse($window.sessionStorage.getItem('userData'));
    vm.expenses = [];

    console.log(vm.user);

    function init() {
        $q.all([
            DashboardService.getAll(vm.user.id),
            DashboardService.getCategories()
        ]).then(function (res) {
            vm.expenses = res[0].data;
            vm.categories = res[1].data;
        });
    }

    init();
    
    vm.logout = function () {
        AuthFactory.isLoggedIn = false;
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.userData;

        $location.path('/login');
    };

    vm.addExpense = function () {
        $location.path('/expense/add');
    }
};