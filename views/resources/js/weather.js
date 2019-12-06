
$(document).ready(function() {
    $.ajax({
        url: "http://localhost:3000/",  // the local Node server
        method: 'GET, /data',
        success: function(data){
            console.log(data); //display data in cosole to see if I receive it
        }
    })
});