// Initialize team Firebase
var config = {
    apiKey: "AIzaSyAGrun6JkFUDgSTJRFqDyPxzT0ymkDdPwI",
    authDomain: "session-a4950.firebaseapp.com",
    databaseURL: "https://session-a4950.firebaseio.com",
    projectId: "session-a4950",
    storageBucket: "session-a4950.appspot.com",
    messagingSenderId: "298286458371"
};
firebase.initializeApp(config);
let database = firebase.database();


function initMap() {

//setting the coords for centering the map latitude then longitude
    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            // User is signed in.
            let userId = firebase.auth().currentUser.uid;
            let lng = 0,
                lat = 0;
            console.log(userId)
            database.ref().on("value", function (snapshot) {
                lat = snapshot.child(`/users/${userId}/lat`).val()
                lng = snapshot.child(`/users/${userId}/lng`).val()
           
            let options = {
                zoom: 14,
                center: { lat: parseFloat(lat), lng: parseFloat(lng) },
                // center: { lat: 45, lng: -93.26 },
            };

            //new map
            let map = new
                google.maps.Map(document.getElementById('map'), options);
            })

        } else {
            // User is signed out
        }
    }, function (error) {
        console.log(error);
    });


}


$(document).ready(function () {

    // console.log(homeMapLng, homeMapLng())

    //onclick handler for 'add-session' form
    var eventButton = $('#add-event');
    var closeForm = () => {
        eventButton.removeClass('event-animate');
        //code used as a 'hack' to allow animation to run multiple times
        eventButton.offsetWidth = eventButton.offsetWidth;
        $('#map').css('grid-column', '2/5')
        $('#add-button').css('right', '4.5%');
        eventButton.addClass("event-hide");
    }

    $('#add-button').on('click', () => {
        if (eventButton.hasClass('event-animate')) {
            closeForm();
        }
        else {
            eventButton.removeClass('event-hide');
            $('#map').css('grid-column', '2/4');
            $('#add-button').css('right', '32%');
            eventButton.offsetWidth = eventButton.offsetWidth;
            eventButton.addClass('event-animate');
        }
    });

    $('.close').on('click', function () {
        closeForm();
    })
    //onclick handler for chat
    var chatButton = $('#chat-icon');
    var chatDiv = $('#chat-div');

    chatButton.on('click', function () {
        if (chatDiv.hasClass('chat-animate')) {
            chatDiv.removeClass('chat-animate');
            chatDiv.offsetWidth = chatDiv.offsetWidth;
            chatDiv.addClass("chat-hide");
        }
        else {
            chatDiv.removeClass('chat-hide');
            chatDiv.offsetWidth = chatDiv.offsetWidth;
            chatDiv.addClass('chat-animate');
        }
    })


})


