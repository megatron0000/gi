angular.module("assessmentAnalysis")
    /**
     * @ngdoc       service
     * @name        assessmentAnalysis.service:AssessmentFactory
     * @requires    $http
     * @requires    main.constant:baseURL
     * @requires    $q
     * @description
     *
     * Conecta-se diretamente ao servidor para baixar provas inseridas
     */
    .service("AssessmentFactory", ["$http", "baseURL", "$q",
        function AssessmentFactory($http, baseURL, $q) {
            /**
             * @ngdoc      method
             * @name       assessmentAnalysis.service:AssessmentFactory#getAssessmentList
             * @methodOf   assessmentAnalysis.service:AssessmentFactory
             *
             * @returns    {assessmentAnalysis.type:Array<RawAssessment>}  <code>$Promise</code>
             *                                                             cujo
             *                                                             contexto
             *                                                             de
             *                                                             retorno
             *                                                             é a
             *                                                             lista
             *                                                             das
             *                                                             provas
             *                                                             registradas
             *                                                             no
             *                                                             sistema.<br>
             *                                                             Se
             *                                                             falhar,
             *                                                             retornará
             *                                                             <pre>$q.reject("Erro
             *                                                             no
             *                                                             recebimento
             *                                                             de
             *                                                             dados...
             *                                                             recarregue
             *                                                             a
             *                                                             página")</pre>
             *
             */
            this.getAssessmentList = function () {
                return $http.get(baseURL + "database/assessmentData/answerSheets.min.json").then(
                    function (response) {
                        /**
                         * @ngdoc       type
                         * @name        assessmentAnalysis.type:RawAssessment
                         * @property    {string}   name          O nome da prova
                         * @property    {integer}  assessmentId  O id da prova (é único
                         *                                       entre todas elas)
                         * @property    {Array}    questions     Composto pelas propriedades
                         *                                       <ul><li>``integer``
                         *                                       questionNumber</li><li>``Array<string>``
                         *                                       possibleAnswers</li><li>``string``
                         *                                       correctAnswer</li><li>``string``
                         *                                       subject</li>
                         * @description
                         *
                         * Dados sobre uma prova específica, da maneira como ela fica
                         * armazenada no servidor
                         */
                        return response.data;
                    },
                    function (response) {
                        alert("Erro no recebimento de dados... recarregue a página.");
                        return $q.reject();
                    });
            };

            /**
             * @ngdoc      method
             * @name       assessmentAnalysis.service:AssessmentFactory#getAssessment
             *
             *
             * @param      {integer}  assessmentId  O id da prova desejada
             * @methodOf   assessmentAnalysis.service:AssessmentFactory
             * @returns    {assessmentAnalysis.type:RawAssessment}  ``$Promise``
             *                                                      cujo
             *                                                      contexto é
             *                                                      um Object da
             *                                                      prova
             *                                                      pedida. Em
             *                                                      caso de
             *                                                      falha,
             *                                                      retorna
             *                                                      ``$q.reject()``
             */
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
                    }
                );
            };

        }
    ])
    /**
     * @ngdoc service
     * @name assessmentAnalysis.service:AnswerRecordFactory
     * @requires $http
     * @requires main.constant:baseURL
     * @requires $q
     * @description
     * 
     *  Conecta-se ao servidor para receber ou enviar gabaritos de um aluno.
     */
    .service("AnswerRecordFactory", ["$http", "baseURL", "$q",
        function ($http, baseURL, $q) {

            /**
             * @ngdoc method
             * @methodOf assessmentAnalysis.service:AnswerRecordFactory
             * @name assessmentAnalysis.service:AnswerRecordFactory#getRecord
             * @param      {boolean}  disableCache  ``true`` para fazer um pedido sem cache. O padrão é ``false``
             * @return     {assessmentAnalysis.type:Array<RawUserResponse>} ``$Promise`` cujo contexto é a lista de respostas de todos os usuários (essa lista inclui todas as provas misturadas). <br><br> Se houver erro, alerta "Erro no recebimento de dados... recarregue a página", e retorna ``$q.reject()``
             * 
             */
            this.getRecord = function (disableCache) {
                var no_cache = disableCache ? "?" + new Date().toISOString() : "";
                return $http.get(baseURL + "database/assessmentData/userAnswers.min.json" + no_cache).then(
                    function (response) {
                        return response.data;
                    },
                    function (response) {
                        alert("Erro no recebimento de dados... recarregue a página.");
                        return $q.reject();
                    }
                );
            };
            /**
             * @ngdoc method
             * @methodOf assessmentAnalysis.service:AnswerRecordFactory
             * @name assessmentAnalysis.service:AnswerRecordFactory#getUserAnswers
             * 
             * @param      {string}    username      Nome da pessoa cujas respostas são desejadas
             * @param      {integer}  assessmentId  O id único da prova desejada
             * @return     {assessmentAnalysis.type:RawUserResponse}    $Promise cujo contexto é o Object de respostas do usuário na prova pedida.<br><br>Caso haja erro de recebimento, retorna ``$q.reject()``
             */
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
            /**
             * @ngdoc method
             * @methodOf assessmentAnalysis.service:AnswerRecordFactory
             * @name assessmentAnalysis.service:AnswerRecordFactory#uploadAnswers
             * @param      {assessmentAnalysis.type:RawUserResponse}  answerObj  Respostas do usuário (como informado por ele próprio) a serem enviadas para gravação no servidor.
             * @return     {$Promise}  $Promise sem utilidade (não tem contexto)
             * @description
             * 
             * Envia respostas do usuário ao servidor e, em seguida, faz ``console.debug()`` no eco da resposta e chama {@link assessmentAnalysis.service:AnswerRecordFactory#getRecord getRecord} sem cache para sobrescrever a versão local agora antiquada
             */
            this.uploadAnswers = function (answerObj) {
                var getRecord = this.getRecord;
                return $http.post(baseURL + "database/post.php", answerObj).then(
                    function (response) {
                        console.debug(response);
                        // Fazer chamada para sobrescrever o cache
                        getRecord( /**true para sobrescrever o cache*/ true);
                    }
                );
            };
            /**
             * @ngdoc method
             * @methodOf assessmentAnalysis.service:AnswerRecordFactory
             * @name assessmentAnalysis.service:AnswerRecordFactory#checkForError
             * @param {assessmentAnalysis.type:RawUserResponse} answerObj Respostas preenchidas pelo usuário (que podem conter algum erro técnico)
             *
             * @return     {assessmentAnalysis.type:SubmissionErrorDetail} ``Object`` que descreve os tipos de erro que aconteceram com a entrada
             */
            this.checkForError = function (answerObj) {
                /**
                 * @ngdoc type
                 * @name assessmentAnalysis.type:SubmissionErrorDetail
                 * @property {boolean} templateError Se houve erro durante a montagem do objeto de respostas (por exemplo, algum campo está indefinido)
                 * @property {boolean} usernameError Se o usuário não escreveu seu nome
                 * @property {boolean} answerError Se o usuário deixou alguma resposta em branco
                 * @description
                 * 
                 * É um detalhamento de erro, relativo a um objeto do tipo {@link assessmentAnalysis.type:RawUserResponse RawUserResponse}.
                 */
                var errorObj = {
                    templateError: false,
                    usernameError: false,
                    answerError: false,
                    /**
                     * @ngdoc method
                     * @methodOf assessmentAnalysis.type:SubmissionErrorDetail
                     * @name assessmentAnalysis.type:SubmissionErrorDetail#errorExists
                     * @returns {boolean} Se algum erro foi encontrado (de qualquer tipo que seja)
                     *
                     */
                    errorExists: function () {
                        return this.templateError || this.usernameError || this.answerError;
                    },
                    missingQuestions: []
                };
                if (!answerObj || !answerObj.answerList) {
                    errorObj.templateError = true;
                    return errorObj;
                }
                if (!answerObj.username) {
                    errorObj.usernameError = true;
                }
                answerObj.answerList.forEach(function (current, index, array) {
                    if (!current.answer) {
                        errorObj.answerError = true;
                        errorObj.missingQuestions.push(current.questionNumber);
                    }
                });
                return errorObj;
            };
        }
    ])
    /**
     * @ngdoc service
     * @name assessmentAnalysis.service:UserStatisticsFactory
     * @requires $q
     * @requires assessmentAnalysis.service:AssessmentFactory
     * @requires assessmentAnalysis.service:AnswerRecordFactory
     * 
     * @description
     * 
     * Expõe os resultados de um usuário em qualquer prova desejada. O formato das respostas pode ser uma lista ordenada por número da questão ou uma lista organizada por matéria.
     */
    .service("UserStatisticsFactory", ["$q", "AssessmentFactory", "AnswerRecordFactory",
        function ($q, AssessmentFactory, AnswerRecordFactory) {
            /**
             * @ngdoc method
             * @methodOf assessmentAnalysis.service:UserStatisticsFactory
             * @name assessmentAnalysis.service:UserStatisticsFactory#getUserList
             * @param      {integer}  assessmentId  id único da prova desejada
             * @return     {Array<string>}   ``$Promise`` cujo contexto é a lista de nomes de usuários que fizeram esta prova
             * 
             * @description
             * 
             * Chama {@link assessmentAnalysis.service:AnswerRecordFactory AnswerRecordFactory} para processar os nomes dos usuários. Em caso de falha, executa:
             * <pre>alert("Não foi possível encontrar quem fez esta prova...\nRecarregue a página.");
             * return $q.reject();</pre>
             */
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
            /**
             * @ngdoc method
             * @methodOf assessmentAnalysis.service:UserStatisticsFactory
             * @name assessmentAnalysis.service:UserStatisticsFactory#getEvaluatedQuestions
             *
             * @param      {integer}  assessmentId  id único da prova
             * @param      {string}  username      Usuário cujo resultado se deseja
             * @return     {assessmentAnalysis.type:Array<EvaluatedUserResponse>}  ``$Promise`` cujo contexto é a lista de respostas do usuário a cada questão desta prova
             * @description
             * 
             * Chama {@link assessmentAnalysis.service:AssessmentFactory AssessmentFactory} e {@link assessmentAnalysis.service:AnswerRecordFactory AnswerRecordFactory} para depois processar dados recebidos e retornar respostas.<br><br>Em caso de erro no recebimento, executa
             * <pre>return $q.reject();</pre>
             */
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
                            /**
                             * @ngdoc type
                             * @name assessmentAnalysis.type:EvaluatedUserResponse
                             * @property {integer} questionNumber Número da questão dentro da prova (começa em 1)
                             * @property {string} correctAnswer Resposta correta à questão
                             * @property {string} userAnswer Resposta que usuário julgou correta quando fez a prova
                             * @property {string} subject Matéria à qual pertence a questão (matemática, português, etc.) 
                             */
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
            /**
             * @ngdoc method
             * @methodOf assessmentAnalysis.service:UserStatisticsFactory
             * @name assessmentAnalysis.service:UserStatisticsFactory#getSortedQuestions
             *
             * @param      {integer}  assessmentId  id único da prova
             * @param      {string}  username      Usuário cujo resultado se deseja
             * @return     {assessmentAnalysis.type:Array<SortedUserResponse>}  ``$Promise`` cujo contexto é a lista de matérias desta prova, cada uma com as questões corrigidas
             * @description
             * 
             * Chama ``getEvaluatedQuestions`` (método deste próprio service). Ao processar os dados, separa as questões por matéria, colocando as corretamente respondidas na frente dos ``Array`` usados, e todas em ordem crescente de ``questionNumber``
             * 
             * Em caso de erro, executa:
             * <pre>return $q.reject();</pre>
             */
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
                         * @ngdoc type
                         * @name assessmentAnalysis.type:SortedUserResponse
                         * @property {string} subject A matéria à qual pertencem as respostas guardadas por este ``Object``
                         * @property {integer} correctCount Contador de quantas respostas estão corretas, dentre as questões armazenadas por este ``Object``
                         * @property {assessmentAnalysis.type:Array<EvaluatedUserResponse>} questionList Questões armazenadas por este ``Object`` (são questões de uma única matéria: aquela armazenada por ``this.subject``)
                         * 
                         * @description 
                         * 
                         * Note que há redundância: a matéria à qual pertencem as questões está definida tanto em ``SortedUserResponse.subject`` quanto em cada questão pertencente a ``SortedUserResponse.questionList``                         
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
    /**
     * @ngdoc       service
     * @name        assessmentAnalysis.service:GroupStatisticsFactory
     * @requires    assessmentAnalysis.service:UserStatisticsFactory
     * @requires    $q
     *
     * @description
     *
     * Analisa o conjunto dos usuários ou das respostas para uma prova
     * específica. No primeiro caso, expõe respostas corretas e incorretas. No
     * segundo, expõe nível de dificuldade das questões.
     */
    .service("GroupStatisticsFactory", ["UserStatisticsFactory", "$q",
        function (UserStatisticsFactory, $q) {


            var recursiveGetSortedQuestions = function (remainingIterationsCount, assessmentId, username, userCollectionArray, whereToStore) {
                // Se não houver nenhum usuário ainda,
                if (userCollectionArray.length === 0)
                    return $q.reject();
                // Se já tivermos passado por todos os usuários que fizeram a prova, terminar o ciclo recursivo
                if (remainingIterationsCount < 0)
                    return;
                return UserStatisticsFactory.getSortedQuestions(assessmentId, username).then(
                    function (sortedQuestionList) {
                        whereToStore.push({
                            username: username,
                            listBySubject: sortedQuestionList,
                            overallCorrectCount: 0,
                            assessmentLength: 0
                        });
                        return recursiveGetSortedQuestions(remainingIterationsCount - 1, assessmentId, userCollectionArray[remainingIterationsCount - 1], userCollectionArray, whereToStore);
                    },
                    function () {
                        return $q.reject();
                    }
                );
            };

            var getOverallCorrectCount = function (listBySubject) {
                var count = 0;
                listBySubject.forEach(
                    function (current, index, array) {
                        count += current.correctCount;
                    }
                );
                return count;
            };

            var getAssessmentLength = function (userAnswers) {
                var count = 0;
                userAnswers.listBySubject.forEach(function (current, index, array) {
                    count += current.questionList.length;
                });
                return count;
            };
            /**
             * @ngdoc method
             * @methodOf assessmentAnalysis.service:GroupStatisticsFactory
             * @name assessmentAnalysis.service:GroupStatisticsFactory#getAssessmentOverallPerformance
             * 
             * 
             * @param      {integer}  assessmentId  id único da prova
             * @return     {assessmentAnalysis.type:Array<IdentifiedSortedUserResponse>}  ``$Promise`` cujo contexto é a lista com usuários e suas respostas, organizadas por matéria
             * @description
             * 
             * Chama ``UserStatisticsFactory`` para recuperar respostas de usuários, e as coloca num ``Array`` separado por nomes de usuário. Em caso de falha, executa:
             * <pre>return $q.reject();</pre>
             * 
             */
            this.getAssessmentOverallPerformance = function (assessmentId) {
                return UserStatisticsFactory.getUserList(assessmentId).then(
                    function (response) {
                        /**
                         * @ngdoc type
                         * @name assessmentAnalysis.type:IdentifiedSortedUserResponse
                         * @description
                         * 
                         * > # Estende {@link assessmentAnalysis.type:SortedUserResponse SortedUserResponse}
                         * 
                         * Parecido com ``SortedUserResponse``, mas desenhado para ser colocado num ``Array`` de usuários, motivo pelo qual exibe ``username`` junto com as questões.
                         * 
                         * @property {string} username Nome do usuário
                         * @property {assessmentAnalysis.type:Array<SortedUserResponse>} listBySubject Respostas de um usuário, organizadas por matéria
                         * @property {integer} overallCorrectCount Contador de questões acertadas pelo usuário neste prova
                         * @property {integer} assessmentLength Quantidade de questões desta prova
                         */
                        var overallSortedQuestions = [];
                        return recursiveGetSortedQuestions(response.length - 1, assessmentId, response[response.length - 1], response, overallSortedQuestions).then(
                            function () {
                                //  Contar qual a quantidade de questões da prova
                                var assessmentLength = getAssessmentLength(overallSortedQuestions[0]); //  Claro que poderia ser em outro índice, fora o 0
                                //  Contar quantos acertos no total, para cada usuário
                                overallSortedQuestions.forEach(
                                    function (current, index, array) {
                                        current.overallCorrectCount = getOverallCorrectCount(current.listBySubject);
                                        current.assessmentLength = assessmentLength;
                                    }
                                );
                                //  Colocar usuários em ordem crescente de acertos totais
                                overallSortedQuestions.sort(
                                    function (a, b) {
                                        if (a.overallCorrectCount < b.overallCorrectCount)
                                            return -1;
                                        else if (a.overallCorrectCount > b.overallCorrectCount)
                                            return +1;
                                        return 0;
                                    }
                                );
                                return overallSortedQuestions;
                            },
                            function () {
                                return $q.reject();
                            }
                        );
                    }
                );
            };
            /**
             * @ngdoc method
             * @methodOf assessmentAnalysis.service:GroupStatisticsFactory
             * @name assessmentAnalysis.service:GroupStatisticsFactory#getAssessmentQuestionPerformance
             *
             * @param      {integer}  assessmentId  id único à prova
             * @return     {assessmentAnalysis.type:Array<SortedQuestionPerformance>}  ``$Promise`` cujo contexto é a lista do desempenho da questões desta prova
             * 
             * @description
             * 
             * Chama ``this.getAssessmentOverallPerformance``, processando as questões da prova para retornar uma lista com a performance de cada questão (nível de dificuldade).
             * 
             * Em caso de erro, executa:
             * <pre>return $q.reject();</pre>
             */
            this.getAssessmentQuestionPerformance = function (assessmentId) {
                return this.getAssessmentOverallPerformance(assessmentId).then(
                    function (overallSortedQuestions) {
                        /**
                         * @ngdoc type
                         * @name assessmentAnalysis.type:SortedQuestionPerformance
                         * @property {string} subject Matéria à qual pertencem as questões armazenadas por este ``Object``
                         * @property {Array} questionList Estrutura de um elemento: <ul><li>``string`` questionNumber</li><li>``integer`` numberOfCorrectAnswers</li><li>``integer`` numberOfWrongAnswers</li></ul>
                         *
                         * @description
                         * 
                         * Armazena todas as questões de determinada prova que sejam da matéria especificada por ``this.subject``. Contém informações unicamente sobre quantos acertaram e erraram cada questão
                         */
                        var questionListBySubject = [];

                        //  Se não houver usuários, não tentar nenhum tipo de processamento
                        if (overallSortedQuestions.length === 0)
                            return;
                        //  Descobrir quais são as matérias desta prova, e inserir todas as questões em sua devida posição no Array
                        overallSortedQuestions[0].listBySubject.forEach(function (current, index, array) {
                            questionListBySubject.push({
                                subject: current.subject,
                                questionList: []
                            });
                            current.questionList.forEach(function (currentQuestion, currentQuestionIndex, questionListArray) {
                                questionListBySubject[questionListBySubject.length - 1].questionList.push({
                                    questionNumber: currentQuestion.questionNumber,
                                    numberOfCorrectAnswers: 0,
                                    numberOfWrongAnswers: 0
                                });
                            });
                        });
                        //  Decidir quantos acertos houve para cada questão
                        questionListBySubject.forEach(function (currentSubject) {
                            currentSubject.questionList.forEach(function (currentQuestion) {
                                overallSortedQuestions.forEach(function (currentUser) {
                                    var userQuestion = currentUser.listBySubject
                                        //  
                                        .find(function (element) {
                                            if (element.subject === currentSubject.subject)
                                                return element;
                                            return undefined;
                                        }).questionList
                                        //
                                        .find(function (element) {
                                            if (element.questionNumber === currentQuestion.questionNumber)
                                                return element;
                                            return undefined;
                                        });
                                    if (userQuestion.correctAnswer === userQuestion.userAnswer)
                                        currentQuestion.numberOfCorrectAnswers++;
                                    else
                                        currentQuestion.numberOfWrongAnswers++;
                                });
                            });
                        });
                        console.debug(questionListBySubject);
                        // Colocar questões em ordem crescente de número
                        questionListBySubject.forEach(
                            function (subject) {
                                subject.questionList.sort(
                                    function (a, b) {
                                        if (parseInt(a.questionNumber) < parseInt(b.questionNumber))
                                            return -1;
                                        return 1;
                                    }
                                );
                            }
                        );
                        return questionListBySubject;
                    },
                    function () {
                        return $q.reject();
                    }
                );
            };


        }
    ])
    /**
     * @ngdoc       service
     * @name        assessmentAnalysis.service:HighchartsDataLogicFactory
     * @description
     *
     * Implementa funções que processam dados de usuários para retornar Arrays
     * no formato usado pelas configurações de um "highchart"
     */
    .service("HighchartsDataLogicFactory", [
        function () {
            /**
             * @ngdoc      method
             * @methodOf   assessmentAnalysis.service:HighchartsDataLogicFactory
             * @name       assessmentAnalysis.service:HighchartsDataLogicFactory#buildUserSeries
             *
             *
             * @param      {assessmentAnalysis.type:Array<IdentifiedSortedUserResponse>}  arrayIdentifiedSortedUserResponse  Ver
             *                                                                                   documentação
             * @returns    {Array}                            Séries dos desempenhos dos usuários
             * 
             */
            this.buildUserSeries = function (arrayIdentifiedSortedUserResponse) {
                let series = [];
                if (arrayIdentifiedSortedUserResponse[0].listBySubject) {
                    series.push({
                        data: [],
                        name: "Desempenho geral"
                    });
                    arrayIdentifiedSortedUserResponse[0].listBySubject.forEach(function (current, index, array) {
                        series.push({
                            data: [],
                            name: current.subject
                        })
                    });
                }
                arrayIdentifiedSortedUserResponse.forEach(
                    function (currentUser, userIndex, userArray) {
                        series.forEach(function (currentSeries) {
                            //  Se estivermos no desempenho geral, empurrar dados para essa posição
                            if (currentSeries.name === "Desempenho geral") {
                                currentSeries.data.push({
                                    x: userIndex,
                                    /**
                                     * y em percentual
                                     */
                                    y: 100 * currentUser.overallCorrectCount / currentUser.assessmentLength,
                                    name: currentUser.username,
                                    correctCount: currentUser.overallCorrectCount
                                });
                            }
                            //  Caso estejamos na série de alguma disciplina, agir de acordo
                            else {
                                //  Colocar esta série como invisível por padrão
                                currentSeries.visible = false;
                                //  Achar qual matéria, entre todas do usuário, corresponde à série atual
                                var correspondingSubject = currentUser.listBySubject.find(function (element, index, array) {
                                    if (element.subject === currentSeries.name)
                                        return element;
                                    return undefined;
                                });
                                //  Colocar dados deste usuário na série desta disciplina
                                currentSeries.data.push({
                                    x: userIndex,
                                    /**
                                     * y em percentual
                                     */
                                    y: 100 * correspondingSubject.correctCount / correspondingSubject.questionList.length,
                                    name: currentUser.username,
                                    correctCount: correspondingSubject.correctCount
                                });
                            }
                        });
                    }
                );
                //$scope.performanceChart.config.series = series;
                return series;
            };

            /**
             * @ngdoc      method
             * @methodOf   assessmentAnalysis.service:HighchartsDataLogicFactory
             * @name       assessmentAnalysis.service:HighchartsDataLogicFactory#buildQuestionSeries
             *
             *
             * @param      {Array} difficultyAndSubjectList    Na primeira posição, lista de dificuldades. Na segunda, lista de questões por matéria
             * 
             * @returns    {Array}  Série das dificuldades das questões
             */
            this.buildQuestionSeries = function (difficultyAndSubjectList) {
                let series = [];
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
                        });
                    }
                );
                console.debug(series);
                // $scope.questionListChart.config.series = series;
                return series;
            }
        }
     ]);