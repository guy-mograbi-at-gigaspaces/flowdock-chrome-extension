'use strict';

angular.module('background', ['flowdock', 'chrome']);

angular.module('background').controller('BackgroundCtrl', ['chrome', 'Flowdock', '$scope', '$interval', '$log', function BackgroundController(chrome, Flowdock, $scope, $interval, $log) {
    console.log('I am background');

    chrome.setDefaultConfig({'version': 1, 'apiToken': chrome.getParameterByName('api_token')});

    $scope.config = {};

    chrome.readConfig().then(function (config) {
        console.log('read config', config);
        if (config.version !== $scope.config.version) {
            $scope.config = config;
            $scope.getData();
        }
    });

    function sendData() {
        if ( $scope.data ) {
            chrome.setBadgeText({text: $scope.data.length});
            chrome.sendMessage({type: 'data', data: $scope.data});
        }
    }

    $scope.$watch('data', sendData, true);

    chrome.onMessage(function (request) {
        if (request.type === 'update-please') {
            sendData();
        }
    });


    $scope.getData = function () {
        $log.info('fetching data...');
        var flowdock = new Flowdock($scope.config);
        flowdock.getNotifications().then(function( result ){
            $scope.data = result.data;
        });
    };

    $interval($scope.getData, 1000 * 60 * 2); // poll every 10 minutes.. there's a very low rate limit


}])
;
