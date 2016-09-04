angular.module("assessmentAnalysis")
    //
    .controller("AssessmentListController", ["$scope", "AssessmentFactory", "$timeout",
        function ($scope, AssessmentFactory, $timeout) {
            $scope.assessments = [];
            AssessmentFactory.getAssessmentList().then(
                function (response) {
                    $scope.assessments = response;
                }
            );
        }
    ])
    //
    .controller("SendAnswersController", ["$scope", "$stateParams", "AssessmentFactory",
        function ($scope, $stateParams, AssessmentFactory) {

            $scope.currentAssessment = {};
            $scope.userAnswers = {
                username: "",
                assessmentId: "",
                answerList: []
            };
            /**
             * Fazer o download de $scope.currentAssessment e montar o $scope.userAnswers
             */
            AssessmentFactory.getAssessment($stateParams.assessmentId).then(
                function (response) {
                    /**
                     * Montar o objeto de respostas do usuário
                     */
                    $scope.currentAssessment = response;
                    $scope.userAnswers.assessmentId = $scope.currentAssessment.assessmentId;
                    $scope.currentAssessment.questions.forEach(
                        function (current, index, array) {
                            $scope.userAnswers.answerList[index] = {
                                questionNumber: current.questionNumber,
                                answer: ""
                            };
                        }
                    );
                }
            );
            /**
             * Enviar gabarito do usuário (ou pedir que ele corrija algo errado)
             */
            $scope.submitUserAnswers = function () {
                /**
                 * Verificar se há algum erro com o objeto $scope.userAnswers, antes de enviar
                 */
                var thereIsError = false;
                (function () {
                    var errorMessage = "";
                    if (!$scope.userAnswers || !$scope.userAnswers.answerList) {
                        alert("O site corrompeu algum dado.\nRecarregue a página");
                        thereIsError = true;
                        return;
                    }
                    if (!$scope.userAnswers.username) {
                        errorMessage += "Não pode enviar sem seu nome !\n";
                        thereIsError = true;
                    }
                    $scope.userAnswers.answerList.forEach(function (current, index, array) {
                        if (!current.answer) {
                            errorMessage += "A questão " + current.questionNumber + " ficou sem resposta" + "\n";
                            thereIsError = true;
                            return;
                        }
                    });
                    if (errorMessage) {
                        alert(errorMessage);
                    }
                }());

                if (!thereIsError) {
                    AssessmentFactory.uploadAnswers($scope.userAnswers).then(function () {
                        alert("Resposta enviadas muito bem!");
                    }, function (response) {
                        alert("Houve erro no envio.\nContate um admin.");
                    });
                }
            };
        }
    ])
    //
    .controller("UserListController", ["$scope", "$stateParams", "UserStatisticsFactory",
        function ($scope, $stateParams, UserStatisticsFactory) {
            $scope.userList = [];
            UserStatisticsFactory.getUserList($stateParams.assessmentId).then(
                function (response) {
                    $scope.userList = response;
                }
            );
        }
    ])
    //
    .controller("EvaluatedAnswersController", ["$scope", "UserStatisticsFactory", "$stateParams",
        function ($scope, UserStatisticsFactory, $stateParams) {

            $scope.evaluatedQuestionList = [];
            UserStatisticsFactory.getEvaluatedQuestions($stateParams.assessmentId, $stateParams.username).then(
                function (response) {
                    $scope.evaluatedQuestionList = response;
                    $scope.correctCount = (function () {
                        var count = 0;
                        $scope.evaluatedQuestionList.forEach(
                            function (current, index, array) {
                                current.correctAnswer === current.userAnswer ? count++ : null;
                            }
                        );
                        return count;
                    })();
                }
            );

            /**
             * No painel "Por disciplina", esta variável corresponde à forma de análise escolhida. Por default, é o primeiro tipo
             */
            $scope.analysisBySubject = 1;


            $scope.sortedQuestionList = [];
            UserStatisticsFactory.getSortedQuestions($stateParams.assessmentId, $stateParams.username).then(
                function (sortedQuestionList) {
                    $scope.sortedQuestionList = sortedQuestionList;
                    console.debug(sortedQuestionList);
                }
            );


        }
    ])
    //
    .controller("GroupStatisticsController", ["$scope", "GroupStatisticsFactory",
        function ($scope, GroupStatisticsFactory) {

            $scope.selectedAssessment = 0;


        }
    ]);