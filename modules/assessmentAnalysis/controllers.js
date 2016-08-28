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
            AssessmentFactory.getAssessmentList().then(
                function (response) {
                    var notFound = true;
                    for (var i = 0; i < response.length && notFound; i++) {
                        if (response[i].assessmentId === parseInt($stateParams.assessmentId)) {
                            $scope.currentAssessment = response[i];
                            notFound = false;
                        }
                    }
                    if (notFound) {
                        alert("Erro durante a procura desta prova no banco de dados. Recarregue a página");
                        return;
                    }
                    /**
                     * Montar o objeto de respostas do usuário
                     */
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
    .controller("userListController", ["$scope", "$stateParams", "StatisticsFactory",
        function ($scope, $stateParams, StatisticsFactory) {
            $scope.userList = StatisticsFactory.getUserList();
        }
    ]);