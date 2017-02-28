angular.module('hhsApp').controller('DashboardController', DashboardController);

DashboardController.$inject = ['$window', '$location', 'AuthFactory', 'DashboardService'];

function DashboardController($window, $location, AuthFactory, DashboardService) {
    var vm = this;
    vm.user = JSON.parse($window.sessionStorage.getItem('userData'));
    vm.expenses = [];

    console.log(vm.user);

    function init() {
        DashboardService.getAll(vm.user.id).then(function (res) {
            vm.expenses = res.data;
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