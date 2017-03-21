angular.module('hhsApp').controller('AddNewExpenseModalController', AddNewExpenseModalController);

AddNewExpenseModalController.$inject = ['close', 'title', 'categories', 'userId', 'ExpenseService', 'ValidatorService'];

function AddNewExpenseModalController(close, title, categories, userId, ExpenseService, ValidatorService) {
    var vm = this;
    vm.title = title;
    vm.categories = categories;
    vm.expenseData = {};
    vm.validationResult = {};
    vm.categoryWindow = false;
    vm.categoryName = null;

    vm.closeModal = function () {
        close();
    };

    vm.showCategories = function (param) {
        vm.categoryWindow = param;
    };

    vm.chooseCategory = function (category) {
        if(category) {
            vm.expenseData.categoryId = category._id;
            vm.categoryName = category.name;

            vm.showCategories(false);
        }
    };

    vm.addExpense = function () {
        vm.validationResult = ValidatorService.validateForm(['categoryId', 'expenseDate', 'amount'], vm.expenseData);

        if(angular.equals({}, vm.validationResult)) {
            vm.expenseData.userId = userId;

            ExpenseService.add(vm.expenseData).then(function (res) {
                if(res.status === 201) {
                    console.log('added');
                    close(true);
                }
            });
        }
    }
}