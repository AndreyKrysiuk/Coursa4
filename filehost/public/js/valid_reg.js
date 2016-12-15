$(document).ready(function(){

  var validName = false;
  var validPass = false;
  var validEmail = false;

  var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  $("form").submit(function(event){
    event.preventDefault();

    var name = $("#username").val();
    var password = $("#password").val();
    var password2 = $("#password2").val();

    var email = $("#email").val();


    if(name == "" || name.length < 6 || name.length > 18){
      $(".username").removeClass("has-success").addClass("has-error");
      $(".username").append("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span>");
      $(".username .glyphicon-ok").remove();
      validName = false;
    } else {
      $(".username").removeClass("has-error").addClass("has-success");
      $(".username").append("<span class='glyphicon glyphicon-ok form-control-feedback' aria-hidden='true'></span>");
      $(".username .glyphicon-remove").remove();
      validName = true;
    }

    if(email == "" || email.search(pattern) != 0){
      $(".email").removeClass("has-success").addClass("has-error");
      $(".email").append("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span>");
      $(".email .glyphicon-ok").remove();
      validEmail = false;
    } else {
      $(".email").removeClass("has-error").addClass("has-success");
      $(".email").append("<span class='glyphicon glyphicon-ok form-control-feedback' aria-hidden='true'></span>");
      $(".email .glyphicon-remove").remove();
      validEmail = true;
    }

    if(password !== password2 || (password.length == "" && password2.length == "") || (password.length < 6 || password.length > 32) ){
      $(".password").removeClass("has-success").addClass("has-error");
      $(".password").append("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span>");
      $(".password .glyphicon-ok").remove();
      validPass = false;
    } else {
      $(".password").removeClass("has-error").addClass("has-success");
      $(".password").append("<span class='glyphicon glyphicon-ok form-control-feedback' aria-hidden='true'></span>");
      $(".password .glyphicon-remove").remove();
      validPass = true;
    }

    if(validName == true && validPass == true && validEmail == true) {
      $("form").unbind('submit').submit();
    }

  });

});
