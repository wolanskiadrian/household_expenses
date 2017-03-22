angular.module('hhsApp')
    .directive('leftNavigation', leftNavigation)
    function leftNavigation () {

    leftNavigationController.$inject = ['$window', '$location', 'AuthFactory'];

        function leftNavigationController ($window, $location, AuthFactory){
            var vm = this;

            vm.logout = function () {
                AuthFactory.isLoggedIn = false;
                delete $window.sessionStorage.token;
                delete $window.sessionStorage.userData;

                $location.path('/login');
            };
        }

        return {
            scope:{
                section: '='
            },
            templateUrl: '/app/directives/left-navigation/left-navigation.html',
            controller: leftNavigationController,
            controllerAs: 'vm'
        };


};