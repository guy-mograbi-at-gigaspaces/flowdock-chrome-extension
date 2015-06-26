angular.module('flowdock', ['base64']);
angular.module('flowdock').factory('Flowdock', ['$http', '$base64',function( $http, $base64 ){

    function Flowdock( opts ){
        this.opts = opts;
    }
    Flowdock.prototype.getNotifications = function(  ){
        var apiToken = $base64.encode(this.opts.apiToken);
        console.log('this is token', apiToken);
        return $http({
            method: 'GET',
            'url' : 'https://api.flowdock.com/notifications/unreads',
            headers: {
                'Authorization' : 'Basic ' + apiToken
            }
        });
    };
    return Flowdock;
}]);