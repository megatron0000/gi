//  usa baseURL do módulo principal
angular.module("assessmentAnalysis")
    //
    .service("AssessmentFactory", ["$http", "baseURL",
        function ($http, baseURL) {

            this.getAssessments = function () {
                var no_cache = "?no_cache=" + new Date().toString();
                return $http.get(baseURL + "database/assessmentData/answerSheets.json" + no_cache).then(function (response) {
                    return response.data;
                }, function (response) {
                    alert("Erro no recebimento de dados... recarregue a página.");
                });
            };

            this.uploadAnswers = function (answerObj) {
                return $http.post(baseURL + "database/post.php", answerObj).then(function (response) {
                    console.debug(response.data);
                });
            };

        }
    ])
    //
    .service("AnswerRecordFactory", ["$http", "baseURL",
        function ($http, baseURL) {

            this.getRecord = function () {
                var no_cache = "?no_cache=" + new Date().toString();
                return $http.get(baseURL + "database/assessmentData/userAnswers.json" + no_cache).then(function (response) {
                    return response.data;
                }, function (response) {
                    alert("Erro no recebimento de dados... recarregue a página.");
                });
            };

        }
    ])
    //
    .service("StatisticsFactory", ["AnswerRecordFactory",
        function (AnswerRecordFactory) {

            this.getUserList = function () {
                var userList = [];
                AnswerRecordFactory.getRecord().then(function (response) {
                    if (!response) {
                        return [];
                    }
                    response.forEach(function (current, index, array) {
                        if (!userList.includes(current.username)) {
                            userList.push(current.username);
                        }
                    });
                });
                return userList;
            };

        }
    ]);