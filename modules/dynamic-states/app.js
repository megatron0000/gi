'use strict';
var $stateProviderRef = null;
angular.module('dynamic-states', ['ui.router'])
    //
    .config(function($locationProvider, $urlRouterProvider, $stateProvider)
    {
        $urlRouterProvider.deferIntercept();
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(
        {
            enabled: false
        });
        $stateProviderRef = $stateProvider;
    })
    //
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams)
        {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])
    //
    .run(['$q', '$rootScope', '$http', '$urlRouter', 'dynamic_states_dbLocation', 'baseURL',
        function($q, $rootScope, $http, $urlRouter, dynamic_states_dbLocation, baseURL)
        {
            $http.get(baseURL + dynamic_states_dbLocation).success(function(data)
            {
                
                angular.forEach(data, function(value, key)
                {
                    /*
                    var state = {
                        "url": value.url,
                        "parent": value.parent,
                        "abstract": value.abstract,
                        "views":
                        {}
                    };
                    */
                    var state = value;
                    /*
                    angular.forEach(value.views, function(view)
                    {
                        if (view.template)
                        {
                            state.views[view.name] = {
                                template: view.template,
                            };
                        }
                        else if (view.templateUrl)
                        {
                            state.views[view.name] = {
                                templateUrl: view.templateUrl,
                            };   
                        }
                    });
                    */

                    $stateProviderRef.state(value.name, state);
                });
                

                // Configures $urlRouter's listener *after* your custom listener
                $urlRouter.sync();
                $urlRouter.listen();
            });
        }
    ]);