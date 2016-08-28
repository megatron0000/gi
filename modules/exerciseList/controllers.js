angular.module("main")
    //
    .controller("LoadWaitController", ["$scope",
        function($scope)
        {
            $scope.isApplied = true;
            $scope.unApply = function()
            {
                $scope.isApplied = false;
            };
        }
    ])
    //
    .controller("QuestionController", ["$scope", "QuestionCommentsFactory", "MathJax", "EventDispatcher",
        function($scope, QuestionCommentsFactory, MathJax, EventDispatcher)
        {
            $scope.$on("$viewContentLoaded", function(event)
            {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            });
            /**
             * Responder ao evento emitido pela factory do módulo angular-treant
             */
            EventDispatcher.on("treeContentLoaded", function()
            {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            })
        }
    ])
    //
    .controller("CommentController", ["$scope", "$state", "QuestionCommentsFactory", "$rootScope", "EventDispatcher",
        function($scope, $state, QuestionCommentsFactory, $rootScope, EventDispatcher)
        {
            $scope.showComments = false;

            $scope.updateCommentsView = function()
            {
                if ($state.current.scope)
                {
                    $scope.showComments = true;
                    $scope.comments = QuestionCommentsFactory.getQuestion($state.current.scope.questionNumber);
                }
                else $scope.showComments = false;
            };

            //  Dois handlers, para dois eventos
            $rootScope.$on("$stateChangeSuccess", function()
            {
                $scope.updateCommentsView();
            });
            EventDispatcher.on("newCommentAdded", function()
            {
                $scope.updateCommentsView();
            });

            $scope.indexToRespondTo = null;
            $scope.updateIndexToRespondTo = function(newIndex)
            {
                $scope.indexToRespondTo = newIndex;
            };
        }
    ])
    //
    .controller("CommentResponseController", ["$scope", "$state", "QuestionCommentsFactory",
        function($scope, $state, QuestionCommentsFactory)
        {
            $scope.commentObj = {
                author: "Anônimo",
                message: ""
            };
            $scope.submitComment = function()
            {
                var requestObject = {
                    questionNumber: $state.current.scope.questionNumber,
                    parent: $scope.$parent.indexToRespondTo,
                    comment: $scope.commentObj
                };
                QuestionCommentsFactory.upload(requestObject);
                $scope.commentObj = {
                    author: "Anônimo",
                    message: ""
                };
            };
        }
    ]);