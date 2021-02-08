$('button').on("click", function (){
    $.ajax({
        method: "GET",
        url: "https://official-joke-api.appspot.com/jokes/ten"
    }).done(function(data) {
        for (let i = 0; i < data.length; i++) {
            $('#content').append("Setup: " + data[i].setup + " Punchline: " + data[i].punchline  + '<br><br>')
        }
    });
});