'use strict';

angular.module('myapp', ['chrome']);

angular.module('myapp').controller('PopupCtrl', ['$http', '$scope', '$timeout', '$log', 'chrome', function PopupCtrl($http, $scope, $timeout, $log, chrome) {


    $scope.page = 'hello world';
    function onUpdate(request, sender, sendResponse) {
        console.log('got message', request.type);
        if (request.type === 'data') {
            $scope.page = request.data;
        }
    }


    chrome.onMessage(onUpdate);


    chrome.sendMessage({type: 'update-please'});
    $http.get('/dev/mockData.json').then(function success(result){
        onUpdate( { 'type' : 'data', data:result.data });
    });


    chrome.sendMessage({type: 'update-please'});
}]);