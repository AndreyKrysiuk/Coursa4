$(function(){
 $('#search').on('keyup', function(e){
   if(e.keyCode === 13) {
     var parameters = { search: $(this).val() };
     var result = '';
     if(parameters.search.length != ""){
       $.getJSON( '/searching', parameters, function(data) {

         if(data != ""){
         $.each(data, function() {
           result += "<div class='panel panel-default'>";
           result +=  "<div class='panel-heading'><a href='/post/" + this._id + "'>" + this.title + "</a></div>";
           result +=  "<div class='panel-body'>" + this.description + "</div>";
           result += "</div>";
         });
       } else {
         result +=   "<div class='panel panel-warning'><div class='panel-body'>No matches were found for your query.</div></div>";
       }
       $('#searching_results').html(result);
     });
     }

    };
 });
});
