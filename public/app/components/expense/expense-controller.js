angular.module('hhsApp').controller('ExpenseController', ExpenseController);

ExpenseController.$inject = ['$window', '$location', 'ExpenseService'];

function ExpenseController($window, $location, ExpenseService) {
    var vm = this;
    vm.user = JSON.parse($window.sessionStorage.getItem('userData'));
    vm.expenseData = null;

    function init() {
        ExpenseService.getCategories().then(function (res) {
            vm.categories = res.data;
        });
    }

    init();

    vm.add = function () {
        vm.expenseData.userId = vm.user.id;

        ExpenseService.add(vm.expenseData).then(function (res) {
            if(res.status === 201) {
                $location.path('/dashboard');
            }
        });
    }
};