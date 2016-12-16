$(document).ready(function(){

  var validPass = false;
  var validEmail = false;

  var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  $("#update_form").submit(function(event){
    event.preventDefault();

    var password = $("#password").val();
    var password2 = $("#password2").val();

    var email = $("#email").val();

    if(email.search(pattern) != 0){
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

    if(password !== password2 || ((password.length < 6 && password.length > 0) || password.length > 32) ){
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

    if(validPass == true && validEmail == true) {
      $("#update_form").unbind('submit').submit();
    }

  });

});
