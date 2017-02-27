angular.module('hhsApp').service('DashboardService', DashboardService);

DashboardService.$inject = ['$http'];

function DashboardService($http) {

    this.getAll = function (userId) {
        return $http.get('/api/expenses/' + userId).then(function (res) {
            return res;
        }).catch(function (err) {
            return err;
        });
    }
}