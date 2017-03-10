angular.module('hhsApp').service('ProfileService', ProfileService);

ProfileService.$inject = ['$http'];

function ProfileService($http) {

    this.changePassword = function changePassword(password, userId) {
        var model = {
            password: password,
            userId: userId
        };

        return $http.post('/api/users/change-password', model).then(function (res) {
            return res;
        }).catch(function (err) {
            return err;
        });
    };

    this.getUserCategories = function getUserCategories(userId) {
        return $http.get('/api/categories/user/' + userId).then(function (res) {
            return res;
        }).catch(function (err) {
            return err;
        });
    };

    this.addCategory = function addCategory(name, icon, userId) {
        var model = {
            name: name,
            icon: icon
        };

        return $http.post('/api/category/' + userId, model).then(function (res) {
            return res;
        }).catch(function (err) {
            return err;
        });
    };
}