angular.module('hhsApp').controller('AddNewExpenseModalController', AddNewExpenseModalController);

AddNewExpenseModalController.$inject = ['close', 'title', 'categories', 'userId', 'ExpenseService'];

function AddNewExpenseModalController(close, title, categories, userId, ExpenseService) {
    var vm = this;
    vm.title = title;
    vm.categories = categories;
    vm.expenseData = {};

    vm.closeModal = function () {
        close();
    };

    vm.addExpense = function () {
        //TODO: form validation

        vm.expenseData.userId = userId;

        ExpenseService.add(vm.expenseData).then(function (res) {
            if(res.status === 201) {
                console.log('added');
                close(true);
            }
        });
    }
}