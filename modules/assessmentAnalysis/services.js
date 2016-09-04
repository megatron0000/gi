/**
 * @fileOverview Serviços do módulo assessmentAnalysis
 */

//  usa baseURL do módulo principal
angular.module("assessmentAnalysis")
    //
    .service("AssessmentFactory", ["$http", "baseURL", "$q",
        function ($http, baseURL, $q) {

            this.getAssessmentList = function () {
                return $http.get(baseURL + "database/assessmentData/answerSheets.json").then(
                    function (response) {
                        return response.data;
                    },
                    function (response) {
                        alert("Erro no recebimento de dados... recarregue a página.");
                        return $q.reject();
                    });
            };

            this.getAssessment = function (assessmentId) {
                if (typeof assessmentId === "string") {
                    assessmentId = parseInt(assessmentId);
                }
                return this.getAssessmentList().then(
                    function (response) {
                        for (var i = 0; i < response.length; i++) {
                            if (response[i].assessmentId === assessmentId) {
                                return response[i];
                            }
                        }
                        //  Se não encontrar a prova procurada,
                        return $q.reject();
                    },
                    function (response) {
                        return $q.reject();
                    });
            };

            this.uploadAnswers = function (answerObj) {
                return $http.post(baseURL + "database/post.php", answerObj).then(
                    function (response) {
                        console.debug(response);
                    }
                );
            };

        }
    ])
    //
    .service("AnswerRecordFactory", ["$http", "baseURL", "$q",
        function ($http, baseURL, $q) {

            this.getRecord = function () {
                return $http.get(baseURL + "database/assessmentData/userAnswers.json").then(
                    function (response) {
                        return response.data;
                    },
                    function (response) {
                        alert("Erro no recebimento de dados... recarregue a página.");
                        return $q.reject();
                    }
                );
            };

            this.getUserAnswers = function (username, assessmentId) {
                if (typeof assessmentId === "string") {
                    assessmentId = parseInt(assessmentId);
                }
                return this.getRecord().then(
                    function (allUsersRecord) {
                        for (var i = 0; i < allUsersRecord.length; i++) {
                            if (allUsersRecord[i].username === username && allUsersRecord[i].assessmentId === assessmentId) {
                                return allUsersRecord[i];
                            }
                        }
                        return $q.reject();
                    },
                    function (response) {
                        return $q.reject();
                    }
                );
            };

        }
    ])
    //
    .service("UserStatisticsFactory", ["$q", "AssessmentFactory", "AnswerRecordFactory",
        function ($q, AssessmentFactory, AnswerRecordFactory) {

            this.getUserList = function (assessmentId) {
                if (typeof assessmentId === "string") {
                    assessmentId = parseInt(assessmentId);
                }
                var userList = [];
                return AnswerRecordFactory.getRecord().then(
                    function (response) {
                        if (!response) {
                            return [];
                        }
                        response.forEach(function (current, index, array) {
                            if (!userList.includes(current.username) && current.assessmentId === assessmentId) {
                                userList.push(current.username);
                            }
                        });
                        return userList;
                    },
                    function () {
                        alert("Não foi possível encontrar quem fez esta prova...\nRecarregue a página.");
                        return $q.reject();
                    }
                );
            };

            this.getEvaluatedQuestions = function (assessmentId, username) {
                var correctAnswers = [];
                var userAnswers = [];

                return $q.all([
                    AssessmentFactory.getAssessment(assessmentId).then(
                            function (desiredAssessment) {
                                correctAnswers = desiredAssessment.questions;
                            },
                            function () {
                                return $q.reject();
                            }
                    ),
                    AnswerRecordFactory.getUserAnswers(username, assessmentId).then(
                            function (_userAnswers_) {
                                userAnswers = _userAnswers_;
                            },
                            function () {
                                return $q.reject();
                            }
                    )
                ])
                    .then(
                        function () {
                            var evaluatedQuestionList = [];
                            correctAnswers.forEach(function (current, index, array) {
                                evaluatedQuestionList.push({
                                    questionNumber: current.questionNumber,
                                    correctAnswer: current.correctAnswer,
                                    userAnswer: userAnswers.answerList[index].answer,
                                    subject: current.subject
                                });
                            });
                            return evaluatedQuestionList;
                        },
                        function () {
                            return $q.reject();
                        }
                    );
            };

            this.getSortedQuestions = function (assessmentId, username) {
                return this.getEvaluatedQuestions(assessmentId, username).then(
                    function (evaluatedQuestionList) {
                        /**
                         * Lista de strings (cada uma é uma matéria)
                         *
                         * @type       {Array}
                         */
                        var subjectList = [];
                        evaluatedQuestionList.forEach(
                            function (current, index, array) {
                                if (!subjectList.includes(current.subject)) {
                                    subjectList.push(current.subject);
                                }
                            }
                        );

                        /**
                         * Array de objetos. Cada um tem uma string "matéria", um Array de
                         * questões dela e um Int que conta quantas questões estão
                         * corretamente respondidas
                         *
                         * @type       {Array}
                         */
                        var sortedQuestionList = [];
                        subjectList.forEach(function (current, index, array) {
                            sortedQuestionList.push({
                                subject: current,
                                questionList: [],
                                correctCount: 0
                            });
                        });
                        //  Preenche sortedQuestionList
                        sortedQuestionList.forEach(function (currentQuestionList, index, array) {
                            var currentSubject = currentQuestionList.subject;
                            for (var i = 0; i < evaluatedQuestionList.length; i++) {
                                if (evaluatedQuestionList[i].subject === currentSubject) {
                                    currentQuestionList.questionList.push(evaluatedQuestionList[i]);
                                }
                            }
                        });
                        //  Coloca questões certas na frente. Tudo em ordem alfabética
                        for (var i = 0; i < sortedQuestionList.length; i++) {
                            sortedQuestionList[i].questionList.sort(
                                function (a, b) {
                                    if (a.userAnswer === a.correctAnswer && b.userAnswer !== b.correctAnswer) {
                                        return -1;
                                    } else if (a.userAnswer !== a.correctAnswer && b.userAnswer === b.correctAnswer) {
                                        return 1;
                                    } else if (a.questionNumber < b.questionNumber) {
                                        return -1;
                                    }
                                    return +1;
                                }
                            );
                        }
                        //  Conta quantas questões estão certas, em cada matéria
                        for (var i = 0; i < sortedQuestionList.length; i++) {
                            for (var j = 0; j < sortedQuestionList[i].questionList.length && sortedQuestionList[i].questionList[j].userAnswer === sortedQuestionList[i].questionList[j].correctAnswer; j++) {
                                sortedQuestionList[i].correctCount++;
                            }
                        }

                        return sortedQuestionList;
                    },
                    function () {
                        return $q.reject();
                    }
                );
            };

        }
    ])
    //
    .service("GroupStatisticsFactory", ["UserStatisticsFactory", "$q",
        function (UserStatisticsFactory, $q) {
            
            //this.

        }
    ]);