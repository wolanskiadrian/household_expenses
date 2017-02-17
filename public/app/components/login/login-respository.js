angular.module('hhsApp').service('LoginService', LoginService);

LoginService.$inject = ['$http'];

function LoginService($http) {

    this.login = function (email, password) {
        var model = {
            email: email,
            password: password
        };

        return $http.post('/api/users/login', model).then(function (res) {
            return res;
        }).catch(function (err) {
            return err;
        });
    }

}