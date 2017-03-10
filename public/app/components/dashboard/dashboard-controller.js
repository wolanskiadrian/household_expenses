angular.module('hhsApp').controller('DashboardController', DashboardController);

DashboardController.$inject = ['$window', '$location', '$q', 'AuthFactory', 'DashboardService'];

function DashboardController($window, $location, $q, AuthFactory, DashboardService) {
    var vm = this;
    vm.user = JSON.parse($window.sessionStorage.getItem('userData'));
    vm.expenses = [];

    function setCategoryForExpense(expenses, categories) {
        angular.forEach(expenses, function (item) {
            var category = _.find(categories, {_id: item.categoryId});

            if(category){
                item.categoryName = category.name;
            } else {
                item.categoryName = 'No category included';
            }
        })
    }

    function init() {
        $q.all([
            DashboardService.getAll(vm.user.id),
            DashboardService.getCategories(vm.user.id)
        ]).then(function (res) {
            vm.expenses = res[0].data;
            vm.categories = res[1].data;

            setCategoryForExpense(vm.expenses, vm.categories);
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
    };

    vm.userProfile = function () {
        $location.path('/user/profile');
    };
};