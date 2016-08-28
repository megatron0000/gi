angular.module("angular-MathJax", [])
    //
    .factory("MathJax", ["$window", function($window)
    {
        if (!$window.MathJax) return undefined;
        return $window.MathJax;
    }]);