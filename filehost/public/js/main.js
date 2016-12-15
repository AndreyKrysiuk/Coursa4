$(function(){
 $('#search').on('keyup', function(e){
   if(e.keyCode === 13) {
     var parameters = { search: $(this).val() };
     var result = '';
       $.getJSON( '/searching', parameters, function(data) {
         console.log(data);
         $.each(data, function() {
           result += "<div class='panel panel-default'>";
           result +=  "<div class='panel-heading'><a href='/post/" + this._id + "'>" + this.title + "</a></div>";
           result +=  "<div class='panel-body'>" + this.description + "</div>";
           result += "</div>";
           console.log(result);
         });

       $('#searching_results').html(result);
     });
    };
 });
});
