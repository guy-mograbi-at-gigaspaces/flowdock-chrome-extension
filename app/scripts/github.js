'use strict';


angular.module('github',[]);


angular.module('github').factory('Github', ['$http',function GithubService( $http ){

    function Github(){}

    Github.prototype.rootApi = 'http://api.github.com';


    Github.prototype.getPullRequests = function( owner, repo, params ){
        var me = this;
        return $http(
            {
                url:  this.rootApi + '/repos/' + owner + '/' + repo + '/pulls',
                method: 'GET',
                params: params
            }
        ).then(function( result ){ // mergeability for each pull request

                _.each(result.data,function(pr){
                    $http({
                        method: 'GET',
                        url: me.rootApi + '/repos/' + owner + '/' + repo + '/pulls/' + pr.number,
                        params:params
                    }).then(function(result){
                        delete result.data.comments;
                        delete result.data.review_comments;
                        _.merge(pr, result.data );
                    })
                });




                return result;
            });
    };

    return Github;
}]);