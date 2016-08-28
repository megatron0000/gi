'use strict'
angular.module("exerciseList")
    //
    .factory("QuestionCommentsFactory", ["$http", "baseURL", "commentsLocation", "EventDispatcher", "postPHPlocation",
        function ($http, baseURL, commentsLocation, EventDispatcher, postPHPlocation)
        {
            var allQuestionsComments = [];
            var exportObj = {};
            /**
             * Recarrega allQuestionsComments com novo dado do servidor. Em caso
             * de sucesso, chama callback do usuário
             *
             * @param      {function}  callback  Callback do usuário
             */
            var getData = function (callback) {
                var nocache = new Date().toString();
                $http.get(baseURL + commentsLocation + '?cache=' + nocache).success(function (data) {
                    allQuestionsComments = data;
                    if (callback) callback();
                });
            };
            getData();
            /**
             * Pega os comentários da questão
             *
             * @param      {int}    number  Identificador numérico da questão
             * @return     {Array}  Comentários da questão
             */
            exportObj.getQuestion = function (number) {
                for (var i = 0; i < allQuestionsComments.length; i++)
                    if (allQuestionsComments[i].questionNumber === number) return allQuestionsComments[i].comments;
                return {};
            };
            //  Reseta allQuestionsComments, com dados frescos da database
            exportObj.reload = getData;
            // requestObject
            //     .questionNumber (int)
            //         Número da questão
            //     .parent         (undefined | int)
            //         Caso o comentário seja resposta a outro, .parent será o índice deste outro.
            //         Caso contrário, requestObject não terá .parent (undefined)
            //     .comment        (Object)
            //         .author     (string)
            //             Nome de quem escreveu
            //         .message    (string)
            //             Mensagem propriamente dita
            /**
             * Recebe pedido (contendo novo comentário) a ser enviado para db, e o
             * envia
             *
             * @param      {Object}  requestObject  Pedido de envio
             */
            exportObj.upload = function (requestObject) {
                if (!requestObject.hasOwnProperty("questionNumber") || !requestObject.hasOwnProperty("comment")) return;
                //  Nova cópia dos comentários em var allQuestionsComments
                //  reload(success callback);
                requestObject.comment.children = [];
                this.reload(function () {
                    var currentIndex = undefined;
                    for (var i = 0; i < allQuestionsComments.length && !currentIndex; i++)
                        if (allQuestionsComments[i].questionNumber === requestObject.questionNumber) currentIndex = i;
                    if (requestObject.parent === null) allQuestionsComments[currentIndex].comments.push(requestObject.comment);
                    else allQuestionsComments[currentIndex].comments[requestObject.parent].children.push(requestObject.comment);
                    //  $http.post(url, data, [configuration]); SUBSTITUÍDO POR JQUERY
                    jQuery.post(baseURL + postPHPlocation, {
                        stringParaGuardar: JSON.stringify(allQuestionsComments)
                    });
                    EventDispatcher.trigger("newCommentAdded");
                });
            };
            return exportObj;
        }
    ]);