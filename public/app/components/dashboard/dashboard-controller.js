var MOUNTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

angular.module('hhsApp').controller('DashboardController', DashboardController);

DashboardController.$inject = ['$window', '$location', '$q', 'AuthFactory', 'DashboardService'];

function DashboardController($window, $location, $q, AuthFactory, DashboardService) {
    var vm = this;
    vm.user = JSON.parse($window.sessionStorage.getItem('userData'));
    vm.expenses = [];
    vm.mountsList = MOUNTHS;
    vm.yearsList = [];

    function setCurrentDataFilters() {
        var todayDate = new Date();
        var currentMonth = todayDate.getMonth();
        var currentYear = todayDate.getFullYear();

        vm.selectedMonth = MOUNTHS[currentMonth];
        vm.selectedYear = currentYear;

        filterExpenses();
    }

    function getYearsFromExpenses(expenses) {
        var tYearList = [];

        _.forEach(expenses, function (expense) {
            var year = new Date(expense.expenseDate).getFullYear();
            tYearList.push(year);
        });

        return _.uniq(tYearList);
    }

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

    function filterExpenses() {

        console.log(vm.selectedMonth, vm.selectedYear);

        function checkYear(e) {
            var eYear = new Date(e.expenseDate).getFullYear();
            if(eYear === vm.selectedYear) {
                return true;
            }

            return false;
        }

        function checkMonth(e) {
            var eMonthIndex = new Date(e.expenseDate).getMonth();
            var eMonth = MOUNTHS[eMonthIndex];
            if(eMonth === vm.selectedMonth) {
                return true;
            }

            return false;
        }

        vm.filteredExpenses = [];

        _.forEach(vm.expenses, function (e) {
            if(checkYear(e) && checkMonth(e)) {
                vm.filteredExpenses.push(e);
            }
        });
    }

    function init() {
        $q.all([
            DashboardService.getAll(vm.user.id),
            DashboardService.getCategories(vm.user.id)
        ]).then(function (res) {
            vm.expenses = res[0].data;
            vm.categories = res[1].data;

            setCategoryForExpense(vm.expenses, vm.categories);
            vm.yearsList = getYearsFromExpenses(vm.expenses);
            setCurrentDataFilters();
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

    vm.filterExp = function () {
        filterExpenses()
    };
};