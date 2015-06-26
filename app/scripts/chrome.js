'use strict';

console.log('loading chrome module');
angular.module('chrome', []);

angular.module('chrome').service('chrome',['$timeout','$q',function ChromeService($timeout, $q ){

    // use callback because multiple times
    this.onMessage = function (callback) {
        try {
            chrome.runtime.onMessage.addListener(
                function (request, sender, sendResponse) {
                    $timeout(function () {
                        callback(request, sender, sendResponse);
                    }, 0);
                }
            );
        }catch(e){ console.log('added listener');}
    };

    this.setBadgeText = function(opts){
        try{
            if ( opts.text !== null && typeof(opts.text) !== 'undefined'){
                opts.text = '' + opts.text; // convert to string
            }
            chrome.browserAction.setBadgeText(opts);

        }catch(e){ console.log('setting badge', opts, e); }
    };

    this.sendMessage = function( opts ){
        try {
            chrome.runtime.sendMessage(opts);
        }catch(e){
            console.log('sending message',opts);
        }
    };

    var me = this;

    this.getParameterByName = function(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };



    this.setDefaultConfig = function(defaults){
        me.defaults = defaults;
    };

    this.saveConfig = function(config){
        var deferred = $q.defer();
        try {
            chrome.storage.sync.set(config, deferred.resolve);
        }catch(e){
            console.log('saving config', config);
            deferred.resolve();
        }
        return deferred.promise;
    };

    this.readConfig = function(){
        var deferred = $q.defer();
        try {
            // Use default value color = 'red' and likesColor = true.
            chrome.storage.sync.get(null, function(data){
                deferred.resolve(data);
            });
        }catch(e){
            deferred.resolve(me.defaults);
        }
        return deferred.promise;
    };

}]);




