$(document).ready(function () {
    console.log("hello");
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBG5zoVaU3yU8-bB9L-uDCTgZrvsgOBc3Y",
        authDomain: "chatapper-62bd2.firebaseapp.com",
        databaseURL: "https://chatapper-62bd2.firebaseio.com",
        projectId: "chatapper-62bd2",
        storageBucket: "chatapper-62bd2.appspot.com",
        messagingSenderId: "346477478931"
    };
    firebase.initializeApp(config);


    var dataBase = firebase.database()



    $("#submit").on("click", function (event) {
        event.preventDefault();

        var text = $(".msgInput").val().trim();

        var NewMessage = {
            text: text

        };

        dataBase.ref().push(NewMessage);

        $(".msgInput").val("")
        console.log("click");


    });

    dataBase.ref().on("child_added", function (childSnapShot) {

        var message = childSnapShot.val().text;

        $("#message-board").append(message)
    })

    dataBase.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());


        var textChat = childSnapshot.val().text;


        var pTag = $('<p>')

        $(".panel-body").append(pTag)
        $(pTag).append(textChat)

    });

})