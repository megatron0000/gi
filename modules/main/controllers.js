angular.module("main")
    //
    .controller("LoadWaitController", ["$scope",
        function ($scope) {
            $scope.isApplied = true;
            $scope.unApply = function () {
                $scope.isApplied = false;
            };
        }
    ]);