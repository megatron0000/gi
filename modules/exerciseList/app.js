angular.module("exerciseList", 
    ["angular-treant", "ui.router", "dynamic-states", "angular-MathJax", "angular-event-dispatcher", "element-ready"])
    //
    .constant("commentsLocation", "modules/main/database/questionComments.json")
    //
    .constant("postPHPlocation", "modules/main/database/post.php");