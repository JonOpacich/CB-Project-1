$(document).ready(function () {


    $("#submit").on("click", function (event) {
        event.preventDefault();

        var text = $(".msgInput").val().trim();

        var NewMessage = {
            text: text

        };

        database.ref().push(NewMessage);

        $(".msgInput").val("")
        console.log("click");


    });

    database.ref().on("child_added", function (childSnapShot) {

        var message = childSnapShot.val().text;

        $("#message-board").append(message)
    })

    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());


        var textChat = childSnapshot.val().text;


        var pTag = $('<p>')

        $(".panel-body").append(pTag)
        $(pTag).append(textChat)

    });

})