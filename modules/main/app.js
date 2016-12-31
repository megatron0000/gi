/**
 * @ngdoc overview
 * @name main
 * @description
 * 
 * Módulo principal do site, que só define variáveis a serem disponibilizadas globalmente
 */
angular.module("main", ["angular-treant", "ui.router", "dynamic-states", "angular-MathJax", "angular-event-dispatcher", "element-ready", "assessmentAnalysis", "highcharts-ng"])
    /**
     * @ngdoc constant
     * @name main.constant:baseURL
     * @type string
     * @description
     * 
     * String representativa do endereço http do servidor
     */
    .constant("baseURL", "http://localhost:8000/")
    /**
     * @ngdoc constant
     * @name main.constant:dynamic_states_dbLocation
     * @type string
     * @description
     * 
     * String representativa do endereço http onde estão definidos os "states" do site (usados no "config" do UI-router).
     *
     * Observe que este é uma URL relativa à baseURL
     * 
     */
    .constant("dynamic_states_dbLocation", "database/states.min.json");