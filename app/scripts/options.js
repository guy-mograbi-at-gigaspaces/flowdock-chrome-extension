'use strict';

console.log('\'Allo \'Allo! Option');


angular.module('myoptions',['chrome']);

angular.module('myoptions').controller('MyOptionsCtrl',['chrome','$log', '$scope', '$timeout','$http',function(chrome,$log, $scope, $timeout, $http){

    var controller = this;
    $log.info('loading my options ctrl');
    $log.info('chrome storage is', chrome.storage);

    controller.details = { repositories : []};
    // Saves options to chrome.storage
    function save_options() {
        controller.details.version = new Date().getTime();
        controller.statusThinking = true;
        try {
            $log.info('saving', controller.details);
            chrome.saveConfig(controller.details).then(function () {
                // Update status to let user know options were saved.
                controller.statusMessage = 'Options saved';
                $timeout(function () {
                    controller.statusMessage = null;
                    controller.statusThinking = false;
                }, 1000);
            });
        }catch(e){
            $log.error('unable to save',e);
        }
    }

    this.removeToken = function(repo){
        if ( repo.token ){
            delete repo.token;
        }
        repo.hasToken=false;
    };

    $scope.page = {};
    this.addRepository = function(){
        if ( !controller.details.repositories ){ // lazy upgrade model
            controller.details.repositories = [];
        }
        controller.details.repositories.push({});
    };

    this.generateToken = function(){
        console.log('generating token', $scope.page );
        $http.post('https://api.travis-ci.com/auth/github', { 'github_token' : $scope.page.githubToken }).then(function( result ){
            $scope.page.travisToken = result.data.access_token;
        }, function( result ){
            console.log('unable to create token', result);
        });
    };


    this.reset = function () {
        $log.info('restting');
        var defaults = ['cloudify-cosmo/cloudify-manager',
            'cloudify-cosmo/cloudify-cli',
            'cloudify-cosmo/cloudify-dsl-parser',
            'cloudify-cosmo/cloudify-rest-client',
            'cloudify-cosmo/cloudify-diamond-plugin',
            'cloudify-cosmo/cloudify-docker-plugin',
            'cloudify-cosmo/cloudify-cloudstack-plugin',
            'cloudify-cosmo/cloudify-script-plugin',
            'cloudify-cosmo/cloudify-chef-plugin',
            'cloudify-cosmo/cloudify-puppet-plugin',
            'cloudify-cosmo/cloudify-openstack-plugin',
            'cloudify-cosmo/cloudify-plugins-common',
            'cloudify-cosmo/cloudify-fabric-plugin',
            'cloudify-cosmo/cloudify-amqp-influxdb',
            'cloudify-cosmo/cloudify-system-tests',
            'cloudify-cosmo/cloudify-plugin-template',
            'cloudify-cosmo/cloudify-agent-packager',
            'cloudify-cosmo/version-tool',
            'cloudify-cosmo/cloudify-nodecellar-example',
            'cloudify-cosmo/cloudify-manager-blueprints',
            'cloudify-cosmo/packman',
            'cloudify-cosmo/repex',
            'cloudify-cosmo/flask-securest'];

        controller.details ={ 'repositories' :  _.map(defaults, function (item) {
            return {'slug': item};
        })};
    };

    this.showStatus = function(){
        return controller.statusMessage || controller.statusThinking;
    };

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
    function restore_options() {
        try {
            // Use default value color = 'red' and likesColor = true.
            chrome.readConfig(null, function (items) {
                $log.info('items is', items);
                controller.details = items;
                $scope.$apply();
            });
        }catch(e){
            $log.error('unable to restore',e);
        }
    }

    controller.save = function( $event ){
        $log.info('saving!');
        try{
            $event.preventDefault();
        }catch(e){}
        save_options();

    };

    controller.export = function () {
        var newScope = $scope.$new();
        newScope.details = controller.details;
        ngDialog.open({ template: 'views/dialogs/export.html' , scope:  newScope });
    };

    controller.import = function(){

        var newScope = $scope.$new();
        newScope.import = function( data ){
            newScope.errorMessage = null;
            try {
                controller.details = JSON.parse(data);
                console.log('closing');
                this.closeThisDialog('foo');
            }catch(e){
                console.log('unable to import',e);
                newScope.errorMessage = 'invalid json';
            }

        };
        ngDialog.open({template: 'views/dialogs/import.html', scope: newScope});
    };



    restore_options();
}]);