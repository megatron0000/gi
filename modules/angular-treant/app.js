'use strict'
angular.module('angular-treant', ['angular-event-dispatcher'])
    //
    .factory("Treant", ["$window", function($window)
    {
        return $window.Treant;
    }])
    //
    .directive('treantConfig', ["TreantWrapperFactory", function(TreantWrapperFactory)
    {
        return {
            restrict: 'A',
            scope:
            {
                treantConfig: "@",
            },
            link: function(scope, elem)
            {
                var wrapper = TreantWrapperFactory();
                scope.$watch(function(scope)
                {
                    return scope.treantConfig;
                }, function(config)
                {
                    wrapper.init(config, elem);
                });
                scope.$on("$destroy", function()
                {
                    wrapper.destroy();
                });
            }
        }
    }])
    //
    .factory("TreantWrapperFactory", ["$injector", "Treant", "EventDispatcher", function($injector, Treant, EventDispatcher)
    {
        var TreantWrapper = {
            /**
             * Atribui ID ao jqNode (DOM) e cria instância de Treant
             *
             * @param      {string}  config  referência à factory que disponibiliza
             *                               a config.
             * @param      {Object}  jqNode  node DOM onde inserir o Treant instance
             */
            init: function(config, jqNode)
            {
                this.destroy();
                if (config)
                {
                    var name = config;
                    jqNode.attr("id", name);
                    if ($injector.has(config)) config = $injector.get(config);
                    var config_array = config;
                    /**
                     * São aceitos dois tipo de config (em ambos os casos, sem
                     * especificar container) :
                     * - object com método config.get() , que retorna array de
                     *   configuração
                     * - array que já é a configuração
                     */
                    if (!Array.isArray(config_array)) config_array = config_array.get();
                    /**
                     * Especifica container e cria novo Treant em this.instance
                     */
                    config_array.unshift(
                    {
                        container: "#" + name
                    });
                    this.instance = new Treant(config_array, function()
                    {
                        EventDispatcher.trigger("treeContentLoaded");
                    });
                }
            },
            destroy: function()
            {
                if (this.instance)
                {
                    this.instance.destroy();
                    this.instance = null;
                }
            }
        };
        return function()
        {
            return Object.create(TreantWrapper);
        };
    }]);