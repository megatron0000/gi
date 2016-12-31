NG_DOCS={
  "sections": {
    "api": "API Documentation"
  },
  "pages": [
    {
      "section": "api",
      "id": "assessmentAnalysis",
      "shortName": "assessmentAnalysis",
      "type": "overview",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Armazena provas, serve-as a usuários, recebe gabaritos e processa dados",
      "keywords": "api armazena assessmentanalysis dados gabaritos overview processa provas recebe router serve-as ui usu"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.controller:AssessmentListController",
      "shortName": "AssessmentListController",
      "type": "controller",
      "moduleName": "assessmentAnalysis",
      "keywords": "$scope $timeout api assessmentanalysis assessmentanalysis-controller-assessmentlistcontroller-page assessmentanalysis-controller-page assessments class cont controller provas service todas type"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.controller:EvaluatedAnswersController",
      "shortName": "EvaluatedAnswersController",
      "type": "controller",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Existe para apresentar a resolução da prova a um usuário (com questões",
      "keywords": "$scope $stateparams acertadas acerto acertos analisando analysisbysubject ao api apresenta apresentar assessmentanalysis assessmentid como contador controller correctcount corresponde corrigidas da de dentro determinada disciplina disciplinas dos duas especificada evaluatedquestionlist exibir existe faz formas identificado individual informa integer lista maneira organiza para pelo percentual por property prova quantidade quest refer resolu respondeu resultado separadamente service seu sortedquestionlist tamb type um usadas username usu valor"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.controller:GroupStatisticsController",
      "shortName": "GroupStatisticsController",
      "type": "controller",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Serve gráficos: ",
      "keywords": "$scope $watch algum analisadas api arbitrariamente assessmentanalysis assessments assistido certa controller crit de definida dificuldade fizeram gr ordenados performancechart por property prova quest questionlistchart serve service type usu"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.controller:SendAnswersController",
      "shortName": "SendAnswersController",
      "type": "controller",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Controller exibido para o usuário no state correspondente ao envio de",
      "keywords": "$scope $stateparams ajudar alerta algo answerrecordfactory anteriores ao ap api assessmentanalysis assessmentfactory assessmentid avalia baixada boolean bot cada caso checkforerror clic clicar como controla controller conveniente correspondente currentassessment da das de dele dois dos durante em envia enviando enviar envio errado erro essa est estrutura execu exibe exibido faltando final gabarito haja houver imposs inclic incorreta inferida mandar manipula mensagem mesmo method momento nada nome objeto ou para partir pelo poss primeiro processos property qual quest rela respostas retorna saber se segundo seja service servidor seu seus status string submitbuttondisabled submitbuttonmessage submituseranswers sucesso tempo textual torna-o type usada usando useranswers usu valores verifica vezes"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.controller:UserListController",
      "shortName": "UserListController",
      "type": "controller",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Só serve para listar quais são os nomes dos usuários que fizeram uma",
      "keywords": "$scope $stateparams api assessmentanalysis assessmentanalysis-controller-page assessmentanalysis-controller-userlistcontroller-page assessmentid class controller de dos espec fizeram lista listar nomes os para por prova quais serve service uma userlist usu"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.service:AnswerRecordFactory",
      "shortName": "AnswerRecordFactory",
      "type": "service",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Conecta-se ao servidor para receber ou enviar gabaritos de um aluno.",
      "keywords": "$http $promise $q aconteceram agora alerta algum aluno answerobj antiquada ao api assessmentanalysis assessmentid cache chama checkforerror conecta-se console constant conter contexto cujas cujo da dados de debug descreve desejada desejadas disablecache eco ele em entrada envia enviadas enviar erro false faz fazer gabaritos getrecord getuseranswers grava haja houver inclui informado lista local main method misturadas nome object os ou padr para pedida pedido pelo pessoa podem por pr preenchidas prova provas recarregue receber recebimento reject resposta respostas retorna se seguida sem serem service servidor sobrescrever tem tipos todas todos true type um uploadanswers username usu utilidade vers"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.service:AssessmentFactory",
      "shortName": "AssessmentFactory",
      "type": "service",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Conecta-se diretamente ao servidor para baixar provas inseridas",
      "keywords": "$http $promise $q ao api assessmentanalysis assessmentid baixar caso conecta-se constant contexto cujo da dados das de desejada diretamente em erro falha falhar getassessment getassessmentlist inseridas lista main method object para pedida prova provas recarregue recebimento registradas reject retorna retornar retorno se service servidor sistema type um"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.service:GroupStatisticsFactory",
      "shortName": "GroupStatisticsFactory",
      "type": "service",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Analisa o conjunto dos usuários ou das respostas para uma prova",
      "keywords": "$promise $q analisa api array assessmentanalysis assessmentid cada caso chama coloca conjunto contexto corretas cujo da das de desempenho desta dificuldade dos em erro espec executa exp falha getassessmentoverallperformance getassessmentquestionperformance incorretas lista mat method nomes num organizadas ou para performance por primeiro processando prova quest recuperar reject respostas retornar segundo separado service suas type uma userstatisticsfactory usu"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.service:HighchartsDataLogicFactory",
      "shortName": "HighchartsDataLogicFactory",
      "type": "service",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Implementa funções que processam dados de usuários para retornar Arrays",
      "keywords": "api arrayidentifiedsorteduserresponse arrays assessmentanalysis buildquestionseries builduserseries configura dados das de desempenhos difficultyandsubjectlist dificuldades documenta dos formato fun highchart implementa lista mat method para pelas por posi primeira processam quest retornar segunda service type um usado usu ver"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.service:UserStatisticsFactory",
      "shortName": "UserStatisticsFactory",
      "type": "service",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Expõe os resultados de um usuário em qualquer prova desejada. O formato das respostas pode ser uma lista ordenada por número da questão ou uma lista organizada por matéria.",
      "keywords": "$promise $q answerrecordfactory ao api array assessmentanalysis assessmentfactory assessmentid cada caso chama colocando contexto corretamente corrigidas crescente cujo da dados das de depois deseja desejada desta deste dos em encontrar erro esta executa exp falha fez fizeram foi formato frente getevaluatedquestions getsortedquestions getuserlist lista mat method nomes ordem ordenada organizada os ou para pode por poss pr processar prova qualquer quem quest questionnumber recebidos recebimento reject respondidas respostas resultado resultados retornar return se separa ser service todas type um uma usados username usu"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.type:EvaluatedUserResponse",
      "shortName": "EvaluatedUserResponse",
      "type": "type",
      "moduleName": "assessmentAnalysis",
      "keywords": "api assessmentanalysis assessmentanalysis-type-evaluateduserresponse-page assessmentanalysis-type-page class correctanswer correta da dentro em fez julgou mat pertence portugu prova qual quando quest questionnumber resposta subject type useranswer usu"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.type:IdentifiedSortedUserResponse",
      "shortName": "IdentifiedSortedUserResponse",
      "type": "type",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "",
      "keywords": "acertadas api array assessmentanalysis assessmentanalysis-type-identifiedsorteduserresponse-page assessmentanalysis-type-page assessmentlength class colocado contador de desenhado desta estende exibe junto listbysubject mas mat motivo neste nome num organizadas overallcorrectcount para parecido pelo por prova qual quantidade quest respostas ser sorteduserresponse type um username usu"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.type:PerformanceChart",
      "shortName": "PerformanceChart",
      "type": "type",
      "moduleName": "assessmentAnalysis",
      "keywords": "api aqueles array assessmentanalysis assessmentanalysis-type-page assessmentanalysis-type-performancechart-page cada class config configura construir corresponde data de definido descritos designada desse documenta elemento entre est exigido formato groupstatisticsfactory highchart highcharts href membro method os padr para pelo performance por prova rawassessment recuperar selectedassessment series service setconfiguration todos type um usa usado usu"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.type:RawAssessment",
      "shortName": "RawAssessment",
      "type": "type",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Dados sobre uma prova específica, da maneira como ela fica",
      "keywords": "api armazenada array assessmentanalysis assessmentanalysis-type-page assessmentanalysis-type-rawassessment-page assessmentid class como composto correctanswer da dados ela elas entre espec fica integer maneira nome pelas possibleanswers propriedades prova questionnumber questions servidor sobre string subject todas type uma"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.type:RawUserResponse",
      "shortName": "RawUserResponse",
      "type": "type",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "É o formato usado para gravar respostas dos usuários no servidor",
      "keywords": "answer answerlist api array assessmentanalysis assessmentanalysis-type-page assessmentanalysis-type-rawuserresponse-page assessmentid class da dos enviou estas formato gravar integer para pela pessoa pr property prova quem questionnumber respostas servidor string type usado username usu"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.type:SortedQuestionPerformance",
      "shortName": "SortedQuestionPerformance",
      "type": "type",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Armazena todas as questões de determinada prova que sejam da matéria especificada por this.subject. Contém informações unicamente sobre quantos acertaram e erraram cada questão",
      "keywords": "acertaram api armazena armazenadas assessmentanalysis assessmentanalysis-type-page assessmentanalysis-type-sortedquestionperformance-page cada class cont da de determinada elemento erraram especificada este estrutura informa integer mat numberofcorrectanswers numberofwronganswers object pertencem por prova qual quantos quest questionlist questionnumber sejam sobre string subject todas type um unicamente"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.type:SortedUserResponse",
      "shortName": "SortedUserResponse",
      "type": "type",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "Note que há redundância: a matéria à qual pertencem as questões está definida tanto em SortedUserResponse.subject quanto em cada questão pertencente a SortedUserResponse.questionList                         ",
      "keywords": "api aquela armazenada armazenadas assessmentanalysis assessmentanalysis-type-page assessmentanalysis-type-sorteduserresponse-page cada class contador correctcount corretas de definida dentre em est este guardadas mat note object pertencem pertencente por qual quantas quanto quest questionlist redund respostas sorteduserresponse subject tanto type uma"
    },
    {
      "section": "api",
      "id": "assessmentAnalysis.type:SubmissionErrorDetail",
      "shortName": "SubmissionErrorDetail",
      "type": "type",
      "moduleName": "assessmentAnalysis",
      "shortDescription": "É um detalhamento de erro, relativo a um objeto do tipo RawUserResponse.",
      "keywords": "algum alguma answererror api assessmentanalysis assessmentanalysis-type-page assessmentanalysis-type-submissionerrordetail-page branco campo class de deixou detalhamento durante em encontrado erro errorexists escreveu est exemplo foi houve indefinido method montagem nome objeto qualquer rawuserresponse relativo resposta respostas se seja seu templateerror tipo type um usernameerror usu"
    },
    {
      "section": "api",
      "id": "main",
      "shortName": "main",
      "type": "overview",
      "moduleName": "main",
      "shortDescription": "Módulo principal do site, que só define variáveis a serem disponibilizadas globalmente",
      "keywords": "api define disponibilizadas globalmente main overview principal serem site vari"
    },
    {
      "section": "api",
      "id": "main.constant:baseURL",
      "shortName": "baseURL",
      "type": "constant",
      "moduleName": "main",
      "shortDescription": "String representativa do endereço http do servidor",
      "keywords": "api constant endere http main representativa servidor string"
    },
    {
      "section": "api",
      "id": "main.constant:dynamic_states_dbLocation",
      "shortName": "dynamic_states_dbLocation",
      "type": "constant",
      "moduleName": "main",
      "shortDescription": "String representativa do endereço http onde estão definidos os &quot;states&quot; do site (usados no &quot;config&quot; do UI-router).",
      "keywords": "api baseurl config constant definidos endere est este http main observe onde os relativa representativa site string ui-router uma url"
    }
  ],
  "apis": {
    "api": true
  },
  "html5Mode": false,
  "editExample": true,
  "startPage": "/api",
  "scripts": [
    "angular.min.js"
  ]
};