$(document).ready(function(){

  var validName = false;
  var validPass = false;

  $("form").submit(function(event){
    event.preventDefault();

    var name = $("#username").val();
    var password = $("#password").val();

    if(name == "" || (name.length <= 6 && name.length >= 24)) {
      $("#username").parent().removeClass("has-success").addClass("has-error");
      $(".nameBlock").append("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span>");
      $(".nameBlock .glyphicon-ok").remove();
      validName = false;
    } else {
      $("#username").parent().removeClass("has-error").addClass("has-success");
      $(".nameBlock").append("<span class='glyphicon glyphicon-ok form-control-feedback' aria-hidden='true'></span>");
      $(".nameBlock .glyphicon-remove").remove();
      validName = true;
    }

    if(password == "") {
      $("#password").parent().removeClass("has-success").addClass("has-error");
      $(".passwordBlock").append("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span>");
      $(".passwordBlock .glyphicon-ok").remove();
      validPass = false;
    } else {
      $("#password").parent().removeClass("has-error").addClass("has-success");
      $(".passwordBlock").append("<span class='glyphicon glyphicon-ok form-control-feedback' aria-hidden='true'></span>");
      $(".passwordBlock .glyphicon-remove").remove();
      validPass = true;
    }

    if(validName == true && validPass == true) {
      $("form").unbind('submit').submit();
    }

  });

});
