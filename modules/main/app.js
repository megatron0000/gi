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
    .constant("baseURL", "http://old.baudelaplace.xyz/gi/")
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


/**
 * @ngdoc function
 * @name main.function:examples
 * @description
 * 
 * <example module="assessmentAnalysis"  deps="styles/backgrounds.css">
 * <file name="appfile.js">
 *      angular.module("assessmentAnalysis", []);
 * </file>
 *  <file name="controller.js">
 *      angular.module("assessmentAnalysis").controller("dummyController", function($scope) {
 *          $scope.message="Oi, eu sou Goku!";
 *      });
 *  </file>
 *  <file name="custom.css">
 *  h4 {
 *      text-decoration-line: line-through;
 *  }
 *  </file>
 *  <file name="index.html">
 *     <h1 ng-controller="dummyController">{{message}}</h1>
 *  </file>
 * </example>
 * 
 * <file src="modules/main/doc.js"></file>
 * 
 * <example module="ngAppDemo">
 *    <file name="index.html">
 *    <div ng-controller="ngAppDemoController">
 *      I can add: {{a}} + {{b}} =  {{ a+b }}
 *    </div>
 *    </file>
 *    <file name="script.js">
 *    angular.module('ngAppDemo', []).controller('ngAppDemoController', function($scope) {
 *      $scope.a = 1;
 *      $scope.b = 2;
 *    });
 *    </file>
 *  </example>
 */