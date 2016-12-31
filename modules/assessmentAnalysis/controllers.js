angular.module("assessmentAnalysis")
    /**
     * @ngdoc      controller
     * @name       assessmentAnalysis.controller:AssessmentListController
     * @requires   $scope
     * @requires   assessmentAnalysis.service:AssessmentFactory
     * @requires   $timeout
     * @property   {assessmentAnalysis.type:Array<RawAssessment>}  $scope.assessments  Contém
     *                                                                                 todas
     *                                                                                 as
     *                                                                                 provas
     */
    .controller("AssessmentListController", ["$scope", "AssessmentFactory", "$timeout",
        function ($scope, AssessmentFactory, $timeout) {
            AssessmentFactory.getAssessmentList().then(
                function (response) {
                    $scope.assessments = response;
                }
            );
        }
        ])
    /**
     * @ngdoc       controller
     * @name        assessmentAnalysis.controller:SendAnswersController
     * @requires    $scope
     * @requires    $stateParams
     * @requires    assessmentAnalysis.service:AssessmentFactory
     * @requires    assessmentAnalysis.service:AnswerRecordFactory
     * @description
     *
     * Controller exibido para o usuário no state correspondente ao envio de
     * gabarito para o servidor.
     */
    .controller("SendAnswersController", ["$scope", "$stateParams", "AssessmentFactory", "AnswerRecordFactory",
        function ($scope, $stateParams, AssessmentFactory, AnswerRecordFactory) {
            /**
             * @ngdoc       property
             * @propertyOf  assessmentAnalysis.controller:SendAnswersController
             * @type       boolean
             * @name        assessmentAnalysis.controller:SendAnswersController#$scope.submitButtonDisabled
             *
             * @description
             *
             * Controla se o botão de envio está clicável ou não. Torna-o
             * inclicável durante o envio das respostas (para que seja
             * impossível mandar várias vezes).
             */
            $scope.submitButtonDisabled = false;
            /**
             * @ngdoc       property
             * @propertyOf  assessmentAnalysis.controller:SendAnswersController
             * @type        string
             * @name        assessmentAnalysis.controller:SendAnswersController#$scope.submitButtonMessage
             *
             * @description
             *
             * Mensagem usada para ajudar usuário a saber como está o status do
             * envio das respostas, após clicar no botão de envio. Seus
             * possíveis valores são "Enviar gabarito" e "Enviando..."
             */
            $scope.submitButtonMessage = "Enviar gabarito";
            /**
             * @ngdoc       property
             * @propertyOf  assessmentAnalysis.controller:SendAnswersController
             * @type        assessmentAnalysis.type:RawAssessment
             * @name        assessmentAnalysis.controller:SendAnswersController#$scope.currentAssessment
             * @description
             *
             * Avaliação em relação à qual o usuário está enviando seu gabarito.
             *
             * Essa avaliação é inferida a partir de
             * ```$stateParams.assessmentId``` e baixada pelo {@link
             * assessmentAnalysis.service:AssessmentFactory AssessmentFactory}
             */
            $scope.currentAssessment = {};
            /**
             * @ngdoc      property
             * @propertyOf assessmentAnalysis.controller:SendAnswersController
             * @type       assessmentAnalysis.type:RawUserResponse
             * @name       assessmentAnalysis.controller:SendAnswersController#$scope.userAnswers
             */
            /**
             * @ngdoc       type
             * @name        assessmentAnalysis.type:RawUserResponse
             * @property    {string}   username      Quem enviou estas respostas
             *                                       (informado pela própria
             *                                       pessoa)
             * @property    {integer}  assessmentId  id da prova (é único)
             * @description
             *
             * É o formato usado para gravar respostas dos usuários no servidor
             */
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
                            /**
                             * @ngdoc       property
                             * @propertyOf  assessmentAnalysis.type:RawUserResponse
                             * @name        assessmentAnalysis.type:RawUserResponse#answerList
                             * @type        Array
                             * @description
                             *
                             * <ul><li>``integer`` questionNumber</li><li>``string``
                             * answer</li></ul>
                             */
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
            /**
             * @ngdoc       method
             * @methodOf    assessmentAnalysis.controller:SendAnswersController
             * @name        assessmentAnalysis.controller:SendAnswersController#$scope.submitUserAnswers
             * @requires    assessmentAnalysis.service:AnswerRecordFactory
             * @returns     {void}  Não retorna nada
             * @description
             *
             * Primeiro, verifica se há algo errado com ``$scope.userAnswers``
             * usando ``AnswerRecordFactory.checkforError`` (alguma questão
             * não-respondida, nome faltando, estrutura incorreta do objeto).
             * Se houver erro, dá alerta textual.
             *
             * Segundo, envia as respostas ao servidor, usando {@link
             * assessmentAnalysis.service:AnswerRecordFactory
             * AnswerRecordFactory}. Ao final, exibe alerta textual caso haja
             * erro de envio, ou sucesso dele.
             *
             * Ao mesmo tempo da execução dos dois processos anteriores,
             * manipula ``$scope.submitButtonMessage`` e
             * ``$scope.submitButtonDisabled`` como for conveniente a cada
             * momento.
             */
            $scope.submitUserAnswers = function () {
                $scope.submitButtonDisabled = true;
                $scope.submitButtonMessage = "Enviando...";
                /**
                 * Verificar se há algum erro com o objeto $scope.userAnswers, antes de enviar
                 */
                var thereIsError = false;
                (function () {
                    var errorMessage = "";
                    var errorObj = AnswerRecordFactory.checkForError($scope.userAnswers);
                    thereIsError = errorObj.errorExists();
                    if (errorObj.templateError) {
                        alert("O site corrompeu algum dado.\nRecarregue a página");
                        return;
                    }
                    if (errorObj.usernameError)
                        errorMessage += "Não pode enviar sem seu nome !\n";
                    if (errorObj.answerError)
                        errorMessage += "As questões " + errorObj.missingQuestions.join(", ") + " ficaram sem resposta!\n";
                    if (errorMessage)
                        alert(errorMessage);
                })();

                if (!thereIsError) {
                    AnswerRecordFactory.uploadAnswers($scope.userAnswers).then(function () {
                        alert("Respostas enviadas muito bem!");
                        $scope.submitButtonDisabled = false;
                        $scope.submitButtonMessage = "Enviar gabarito";
                    }, function (response) {
                        alert("Houve erro no envio.\nContate um admin.");
                        $scope.submitButtonDisabled = false;
                        $scope.submitButtonMessage = "Enviar gabarito";
                    });
                } else {
                    $scope.submitButtonDisabled = false;
                    $scope.submitButtonMessage = "Enviar gabarito";
                }
            };
        }
        ])
    /**
     * @ngdoc       controller
     * @name        assessmentAnalysis.controller:UserListController
     * @requires    $scope
     * @requires    $stateParams
     * @requires    assessmentAnalysis.service:UserStatisticsFactory
     * @property    {Array<string>}  $scope.userList  Lista de nomes dos
     *                                                usuários que fizeram uma
     *                                                prova específica (referida
     *                                                por
     *                                                ``$stateParams.assessmentId``)
     *
     * @description
     *
     * Só serve para listar quais são os nomes dos usuários que fizeram uma
     * prova específica.
     */
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
    /**
     * @ngdoc       controller
     * @name        assessmentAnalysis.controller:EvaluatedAnswersController
     * @requires    $scope
     * @requires    assessmentAnalysis.service:UserStatisticsFactory
     * @requires    $stateParams
     * @description
     *
     * Existe para apresentar a resolução da prova a um usuário (com questões
     * corrigidas). Também organiza questões por disciplina.
     */
    .controller("EvaluatedAnswersController", ["$scope", "UserStatisticsFactory", "$stateParams",
        function ($scope, UserStatisticsFactory, $stateParams) {
            /**
             * @ngdoc       property
             * @propertyOf  assessmentAnalysis.controller:EvaluatedAnswersController
             * @name        assessmentAnalysis.controller:EvaluatedAnswersController#$scope.evaluatedQuestionList
             * @type        assessmentAnalysis.type:Array<EvaluatedUserResponse>
             * @description
             *
             * Lista com as questões de determinada prova, da maneira como o
             * usuário as respondeu.
             */
            $scope.evaluatedQuestionList = [];
            UserStatisticsFactory.getEvaluatedQuestions($stateParams.assessmentId, $stateParams.username).then(
                function (response) {
                    $scope.evaluatedQuestionList = response;
                    /**
                     * @ngdoc       property
                     * @name        assessmentAnalysis.controller:EvaluatedAnswersController#$scope.correctCount
                     * @propertyOf  assessmentAnalysis.controller:EvaluatedAnswersController
                     * @type        integer
                     * @description
                     *
                     * Contador da quantidade de questões acertadas pelo usuário
                     * identificado por ``$stateParams.username`` na prova especificada
                     * por ``$stateParams.assessmentId``
                     */
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
             * @ngdoc       property
             * @propertyOf  assessmentAnalysis.controller:EvaluatedAnswersController
             * @name        assessmentAnalysis.controller:EvaluatedAnswersController#$scope.analysisBySubject
             * @type        integer
             * @description
             *
             * Faz referência a duas formas de apresentação dos acertos do
             * usuário por disciplina dentro da página de análise individual:
             * Análise por questão e Percentual de acerto.
             *
             * Valor **1** corresponde a **Análise por questão**;
             *
             * Valor **2** corresponde a **Percentual de acerto**
             */
            $scope.analysisBySubject = 1;

            /**
             * @ngdoc       property
             * @propertyOf  assessmentAnalysis.controller:EvaluatedAnswersController
             * @name        assessmentAnalysis.controller:EvaluatedAnswersController#$scope.sortedQuestionList
             * @type        assessmentAnalysis.type:Array<SortedUserResponse>
             *
             * @description Informações usadas para exibir ao usuário seu
             *              resultado na prova, analisando disciplinas
             *              separadamente.
             */
            $scope.sortedQuestionList = [];
            UserStatisticsFactory.getSortedQuestions($stateParams.assessmentId, $stateParams.username).then(
                function (sortedQuestionList) {
                    $scope.sortedQuestionList = sortedQuestionList;
                    console.debug(sortedQuestionList);
                }
            );


         }
         ])
    /**
     * @ngdoc      controller
     * @name       assessmentAnalysis.controller:GroupStatisticsController
     * @requires   $scope
     * @requires   assessmentAnalysis.service:GroupStatisticsFactory
     * @requires   assessmentAnalysis.service:AssessmentFactory
     * @requires   assessmentAnalysis.service:HighchartsDataLogicFactory
     * 
     * @description
     * 
     * Serve gráficos: 
     *  - Usuários que fizeram certa prova, ordenados por algum critério
     *  - Questões de certa prova, analisadas por dificuldade (dificuldade é definida arbitrariamente)
     */
    .controller("GroupStatisticsController", ["$scope", "GroupStatisticsFactory", "AssessmentFactory", "HighchartsDataLogicFactory",
        function ($scope, GroupStatisticsFactory, AssessmentFactory, HighchartsDataLogicFactory) {

            /**
             * @ngdoc      property
             * @propertyOf assessmentAnalysis.controller:GroupStatisticsController
             * @name       assessmentAnalysis.controller:GroupStatisticsController#$scope.assessments
             * @type       assessmentAnalysis.type:Array<RawAssessment>
             */
            $scope.assessments = [];
            AssessmentFactory.getAssessmentList().then(
                function (response) {
                    $scope.assessments = response;
                }
            );

            /**
             * @ngdoc      property
             * @propertyOf assessmentAnalysis.controller:GroupStatisticsController
             * @name       assessmentAnalysis.controller:GroupStatisticsController#$scope.performanceChart
             * @type       assessmentAnalysis.type:PerformanceChart
             * 
             * @description
             * 
             * É assistido por ``$watch``
             */
            /**
             * @ngdoc      type
             * @name       assessmentAnalysis.type:PerformanceChart
             * 
             * @property   {integer}  selectedAssessment  
             * Corresponde a um "id" de prova, entre aqueles descritos por {@link assessmentAnalysis.type:RawAssessment RawAssessment}
             * 
             * @property   {Object}   config 
             * Configuração de um highchart (segue padrão definido na documentação desse API)
             * 
             * 
             */
            $scope.performanceChart = {
                /**
                 * Documentado acima (assessmentAnalysis.type:performanceChart#selectedAssessment)
                 */
                selectedAssessment: 0,
                /**
                 * @ngdoc       method
                 * @methodOf    assessmentAnalysis.type:PerformanceChart
                 * @name        setConfiguration
                 * @returns     {Array}  Cada elemento está no formato exigido por
                 *                       highcharts: membro "name" e membro "data".
                 * @requires    assessmentAnalysis.service:GroupStatisticsFactory
                 * @description
                 *
                 * Usa {@link assessmentAnalysis.service:GroupStatisticsFactory
                 * GroupStatisticsFactory} para recuperar performance de todos os
                 * usuários na prova designada por {@link
                 * assessmentAnalysis.type:PerformanceChart#selectedAssessment
                 * selectedAssessment} e construir o Array "series" usado pelo
                 * highcharts
                 */
                setConfiguration: function () {
                    /**
                     * Array de 'series' do highchart. A primeira série é do desempenho
                     * geral; as outras são de disciplinas individuais
                     *
                     * @type       {Array}
                     */
                    var series = [];
                    return GroupStatisticsFactory.getAssessmentOverallPerformance($scope.performanceChart.selectedAssessment).then(
                        HighchartsDataLogicFactory.buildUserSeries,
                        function () {
                            //$scope.performanceChart.config.series = [];
                            return [];
                        }
                    );
                },
                /**
                 * Documentado acima (assessmentAnalysis.type:PerformanceChart#config)
                 */
                config: {
                    /**
                     * Em 'options' devem entrar algumas configurações, como as que aqui
                     * estão. Isso pela maneira como o módulo highcharts-ng funciona
                     */
                    options: {
                        chart: {
                            type: 'column',
                            spacingBottom: 10,
                            spacingTop: 20
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size: 20px">{point.key}</span>',
                            pointFormat: '<table><tr><td style="padding:0;color:{series.color}"><b>{point.correctCount:.0f} acerto(s)</b> ({point.y:.1f}%)</td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        }
                    },
                    title: {
                        text: null
                    },
                    subtitle: {
                        text: null
                    },
                    xAxis: {
                        categories: {},
                        crosshair: true,
                        title: {
                            text: "Alunos",
                            margin: 10
                        },
                        labels: {
                            enabled: false
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Percentual de acerto'
                        }
                    },
                    // Inicializar com uma série vazia, só para ter algo aparecendo no
                    // gráfico
                    series: [{
                        name: 'Alunos',
                        data: []
                    }]
                }
            };

            /**
             * @ngdoc      property
             * @propertyOf assessmentAnalysis.controller:GroupStatisticsController
             * @name       assessmentAnalysis.controller:GroupStatisticsController#$scope.questionListChart
             * @type       assessmentAnalysis.type:PerformanceChart
             * 
             * @description
             * 
             * É assistido por ``$watch``
             */
            $scope.questionListChart = {
                selectedAssessment: 0,
                setConfiguration: function () {
                    var series = [];
                    return GroupStatisticsFactory.getAssessmentQuestionPerformance($scope.questionListChart.selectedAssessment).then(
                        function (questionListBySubject) {
                            //  Iterar por cada disciplina, criando uma série para cada
                            questionListBySubject.forEach(
                                function (currentSubject) {
                                    series.push({
                                        name: currentSubject.subject,
                                        data: []
                                    });
                                    //  Iterar por todas as questões de uma disciplina
                                    currentSubject.questionList.forEach(
                                        function (currentQuestion) {
                                            //  Colocar um ponto na série desta disciplina
                                            series[series.length - 1].data.push({
                                                x: currentQuestion.questionNumber,
                                                //  Percentual de acertos
                                                y: 100 * currentQuestion.numberOfCorrectAnswers / (currentQuestion.numberOfCorrectAnswers + currentQuestion.numberOfWrongAnswers),
                                                numberOfCorrectAnswers: currentQuestion.numberOfCorrectAnswers,
                                            });
                                        }
                                    );
                                    //  Highcharts exige que "data" esteja ordenado por X crescente. Tenho que fazer isso
                                    series[series.length - 1].data.sort(function (a, b) {
                                        if (a.x < b.x)
                                            return -1;
                                        else if (a.x > b.x)
                                            return +1;
                                        return 0;
                                    })
                                }
                            );
                            console.debug(series);
                            // $scope.questionListChart.config.series = series;
                            return series;
                        },
                        function () {
                            // $scope.questionListChart.config.series = [];
                            return [];
                        }
                    );
                },
                config: {
                    /**
                     * Em 'options' devem entrar algumas configurações, como as que aqui
                     * estão. Isso pela maneira como o módulo highcharts-ng funciona
                     */
                    options: {
                        chart: {
                            type: 'column',
                            spacingBottom: 10,
                            spacingTop: 20
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size: 20px">{point.key}</span>',
                            pointFormat: '<table><tr><td style="padding:0;color:{series.color}"><b>{point.numberOfCorrectAnswers:.0f} acerto(s)</b> ({point.y:.1f}%)</td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        }
                    },
                    title: {
                        text: null
                    },
                    subtitle: {
                        text: null
                    },
                    xAxis: {
                        categories: {},
                        crosshair: true,
                        title: {
                            text: "Questões",
                            margin: 10
                        },
                        labels: {
                            enabled: true
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Percentual de acerto'
                        }
                    },
                    series: [{
                        name: 'Questões',
                        data: []
                    }]
                }
            };

            $scope.$watch('performanceChart.selectedAssessment', () => {
                $scope.performanceChart.setConfiguration().then((readySeries)=>{
                    $scope.performanceChart.config.series = readySeries;
                });
            }, true);
            $scope.$watch('questionListChart.selectedAssessment', () => {
                $scope.questionListChart.setConfiguration().then((readySeries) => {
                    $scope.questionListChart.config.series = readySeries;
                });
            }, true);

        }
        ])
    //
    .controller("MachineLearningController", ["$scope", "GroupStatisticsFactory", "UserStatisticsFactory", "AssessmentFactory", "baseURL", "$q", "$http",
        function ($scope, GroupStatisticsFactory, UserStatisticsFactory, AssessmentFactory, baseURL, $q, $http) {

            $scope.assessments = [];
            AssessmentFactory.getAssessmentList().then(function (list) {
                $scope.assessments = list;
            });
            $scope.selectedAssessment = 0;


            //  Código para collaborative filtering
            $scope.assessmentOverallPerformance = {};
            $scope.assessmentOverallMatrix = "";
            $scope.userOrderList = "";

            //  O "0" pode ser trocado pelo ID de outra prova
            function setupData() {
                $scope.assessmentOverallPerformance = {};
                $scope.assessmentOverallMatrix = "";
                $scope.userOrderList = "";

                GroupStatisticsFactory.getAssessmentOverallPerformance($scope.selectedAssessment).then(
                    function (performanceBySubject) {
                        //  Este forEach() preenche completamente o $scope.assessmentOverallPerformance
                        performanceBySubject.forEach(
                            function (user, userIndex, userArray) {
                                var listBySubject = user.listBySubject;
                                $scope.assessmentOverallPerformance[user.username] = [];
                                for (var i = 0; i < listBySubject.length; i++) {
                                    if (listBySubject[i].subject !== "Espanhol") {
                                        questionList = listBySubject[i].questionList;
                                        for (var j = 0; j < questionList.length; j++)
                                            questionList[j] = {
                                                questionNumber: questionList[j].questionNumber,
                                                isUserRight: questionList[j].userAnswer === questionList[j].correctAnswer ? 1 : 0
                                            };
                                        $scope.assessmentOverallPerformance[user.username] = $scope.assessmentOverallPerformance[user.username].concat(questionList);
                                    }
                                }
                                $scope.assessmentOverallPerformance[user.username].sort(function (a, b) {
                                    if (a.questionNumber < b.questionNumber)
                                        return -1;
                                    return +1;
                                });
                            }
                        );
                        //  Agora preenchemos a matriz numérica, para o Octave, e a lista da ordem de usuários (para saber o que é cada linha da matriz)
                        for (username in $scope.assessmentOverallPerformance) {
                            $scope.userOrderList += username + "\n";
                            for (var i = 0; i < $scope.assessmentOverallPerformance[username].length; i++)
                                $scope.assessmentOverallMatrix += $scope.assessmentOverallPerformance[username][i].isUserRight + " ";
                            $scope.assessmentOverallMatrix += ";\n";
                        }
                    }
                );
            }

            // Código para visualização das dificuldades das perguntas
            $scope.questionListChart = {
                selectedAssessment: 0,
                setConfiguration: function () {
                    var series = [];

                    $q.all(
                        [GroupStatisticsFactory.getAssessmentQuestionPerformance($scope.questionListChart.selectedAssessment),
                        $http.get(baseURL + "ml/questoesProva1.json")]
                        ) // /$q.all
                        .then(
                            function (difficultyAndSubjectList) {
                                questionListBySubject = difficultyAndSubjectList[0];
                                questionDifficultyList = difficultyAndSubjectList[1].data;
                                //  Corrigir a redundância de níveis
                                for (var i = 0; i < questionDifficultyList.length; i++)
                                    questionDifficultyList[i] = questionDifficultyList[i][0];

                                //  Eliminar Espanhol
                                questionListBySubject.splice(questionListBySubject.findIndex(function (element, index, array) {
                                    if (element.subject === "Espanhol")
                                        return true;
                                }), 1);

                                //  Iterar por cada disciplina, criando uma série para cada
                                questionListBySubject.forEach(
                                    function (currentSubject) {
                                        series.push({
                                            name: currentSubject.subject,
                                            data: []
                                        });
                                        //  Iterar por todas as questões de uma disciplina
                                        currentSubject.questionList.forEach(
                                            function (currentQuestion) {
                                                //  Colocar um ponto na série desta disciplina
                                                series[series.length - 1].data.push({
                                                    x: currentQuestion.questionNumber,
                                                    //  Nível de dificuldade
                                                    y: 100 * (1 - questionDifficultyList[currentQuestion.questionNumber - 1]),
                                                    numberOfCorrectAnswers: currentQuestion.numberOfCorrectAnswers,
                                                });
                                            }
                                        );
                                        //  Highcharts exige que "data" esteja ordenado por X crescente. Tenho que fazer isso
                                        series[series.length - 1].data.sort(function (a, b) {
                                            if (a.x < b.x)
                                                return -1;
                                            else if (a.x > b.x)
                                                return +1;
                                            return 0;
                                        })
                                    }
                                );
                                console.debug(series);
                                $scope.questionListChart.config.series = series;
                            },
                            function (response) {
                                console.log(response);
                            }
                        ); //  $q.all().then()
                },
                config: {
                    /**
                     * Em 'options' devem entrar algumas configurações, como as que aqui
                     * estão. Isso pela maneira como o módulo highcharts-ng funciona
                     */
                    options: {
                        chart: {
                            type: 'column',
                            spacingBottom: 10,
                            spacingTop: 20
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size: 20px">{point.key}</span>',
                            pointFormat: '<table><tr><td style="padding:0;color:{series.color}"><b>{point.numberOfCorrectAnswers:.0f} acerto(s)</b> ({point.y:.1f}%)</td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        }
                    },
                    title: {
                        text: null
                    },
                    subtitle: {
                        text: null
                    },
                    xAxis: {
                        categories: {},
                        crosshair: true,
                        title: {
                            text: "Questões",
                            margin: 10
                        },
                        labels: {
                            enabled: true
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Percentual de acerto'
                        }
                    },
                    series: [{
                        name: 'Questões',
                        data: []
                    }]
                }
            }; //  /$scope.questionListChart

            // $scope.$watch('questionListChart.selectedAssessment', $scope.questionListChart.setConfiguration, true);
            $scope.$watch('selectedAssessment', setupData);

        } //  /MachineLearningController function
        ]); //  /MachineLearningController