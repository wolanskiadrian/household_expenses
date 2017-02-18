angular.module('hhsApp').controller('DashboardController', DashboardController);

DashboardController.$inject = ['$window', '$location', 'AuthFactory'];

function DashboardController($window, $location, AuthFactory) {
    var vm = this;
    vm.user = JSON.parse($window.sessionStorage.getItem('userData'));

    console.log(vm.user);
    
    vm.logout = function () {
        AuthFactory.isLoggedIn = false;
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.userData;

        $location.path('/login');
    }
};