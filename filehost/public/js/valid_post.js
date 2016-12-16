$(document).ready(function(){

  var validTitle = false;
  var validDescr = false;
  var validSelector = false;
  var validFiles = false;

  $("#post_form").submit(function(event){
    event.preventDefault();

    var title = $("#title").val();
    var description = $("#description").val();


    if(title == "" || title.length < 6 || title.length > 64){
      $(".title").removeClass("has-success").addClass("has-error");
      $(".title").append("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span>");
      $(".title .glyphicon-ok").remove();
      validTitle = false;
    } else {
      $(".title").removeClass("has-error").addClass("has-success");
      $(".title").append("<span class='glyphicon glyphicon-ok form-control-feedback' aria-hidden='true'></span>");
      $(".title .glyphicon-remove").remove();
      validTitle = true;
    }

    if(description == "" || description.length < 30 ){
      $(".description").removeClass("has-success").addClass("has-error");
      $(".description").append("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span>");
      $(".description .glyphicon-ok").remove();
      validDescr = false;
    } else {
      $(".description").removeClass("has-error").addClass("has-success");
      $(".description").append("<span class='glyphicon glyphicon-ok form-control-feedback' aria-hidden='true'></span>");
      $(".description .glyphicon-remove").remove();
      validDescr = true;
    }

    if($("#cathegory").val() == null){
      validSelector = false;
    } else {
      console.log($("#cathegory").val());
      validSelector = true;
    }
    if($("#files").val().length == 0){
      validFiles = false;
    } else {
      validFiles = true;
    }
    console.log(validFiles);



    if(validTitle == true && validDescr == true && validSelector == true && validFiles) {
      $("#post_form").unbind('submit').submit();
    }

  });

});
