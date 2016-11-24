$(document).ready(function(){

  var $file = $("input[type=file]");
  $('input[type=submit]').click(function( event ){
    event.stopPropagation();
    event.preventDefault();

    var data = new FormData();
    data.append( key, value );

    $.ajax({
        url: './files',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function( respond, textStatus, jqXHR ){

            // Если все ОК

            if( typeof respond.error === 'undefined' ){
                // Файлы успешно загружены, делаем что нибудь здесь

                // выведем пути к загруженным файлам в блок '.ajax-respond'

                var file_path = respond.$file;
                var html = '';
                $.each( files_path, function( key, val ){ html += val +'<br>'; } );
                $('.ajax-respond').html( html );
            }
            else{
                console.log('Error responding server' + respond.error );
            }
        },
        error: function( jqXHR, textStatus, errorThrown ){
            console.log('Error ajax request: ' + textStatus );
        }
    });

});

});
