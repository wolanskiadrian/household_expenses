angular.module('hhsApp').controller('ConfirmController', ConfirmController);

ConfirmController.$inject = ['close', 'title', 'message'];

function ConfirmController(close, title, message) {
    var vm = this;
    vm.title = title;
    vm.message = message;

    vm.closeModal = function () {
        close();
    };

    vm.confirm = function () {
        close(true);
    }
}