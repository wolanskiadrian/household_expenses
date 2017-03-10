angular.module('hhsApp').controller('ProfileController', ProfileController);

ProfileController.$inject = ['$window', '$timeout', 'ProfileService'];

function ProfileController($window, $timeout, ProfileService) {
    var vm = this;
    vm.user = JSON.parse($window.sessionStorage.getItem('userData'));
    vm.message = null;
    vm.errorMessage = null;
    vm.userCategories = [];

    function init() {
        ProfileService.getUserCategories(vm.user.id)
            .then(function (res) {
                if(res.status === 200) {
                    vm.userCategories = res.data;
                }
            });
    };

    init();

    vm.passwordChange = function () {
        ProfileService.changePassword(vm.password, vm.user.id)
            .then(function (res) {
                if(res.status === 200) {
                    vm.message = res.data.message;
                    $timeout(function () {
                        vm.message = null;
                    }, 2000);
                } else {
                    vm.errorMessage = res.data;
                }
            });
    };

    vm.addCategory = function () {
        ProfileService.addCategory(vm.categoryName, vm.categoryIcon, vm.user.id)
            .then(function (res) {
                if(res.status === 200) {
                    vm.categoryName = '';
                    vm.categoryIcon = '';

                    //TODO: refresh categories
                    init(); //doesn't work ???
                }
            })
    };
};