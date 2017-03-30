var NAVIGATION =
    [
        {'Id' : 0, 'Name' : 'Dashboard', 'Url' : '/dashboard'},
        {'Id' : 1, 'Name' : 'Wasted money', 'Url' : '/overview'},
        {'Id' : 2, 'Name' : 'Money I can spend', 'Url' : '/budget'},
        {'Id' : 3, 'Name' : 'Settings', 'Url' : '/user/profile'},
    ]

angular.module('hhsApp')
    .directive('leftNavigation', leftNavigation)
    function leftNavigation () {

    leftNavigationController.$inject = ['$window', '$location', 'AuthFactory'];

        function leftNavigationController ($window, $location, AuthFactory){
            var vm = this;
            vm.navigationItems = NAVIGATION;

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