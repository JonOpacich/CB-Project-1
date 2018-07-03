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

//setting the coords for centering the map
let homeMapLat = function () {
    database.ref().on("value", function (snapshot) {
        snapshot.child("addressList").forEach(function (item) {
            if (item.key === firebase.auth().currentUser.uid) {
                let latVal = item.val().lat;
                console.log(latVal)
                return parseInt(latVal)
            }
        })
    })
};
let homeMapLng = function () {
    database.ref().on("value", function (snapshot) {
        snapshot.child("addressList").forEach(function (item) {
            if (item.key === firebase.auth().currentUser.uid) {
                let lngVal = item.val().lng;
                console.log(lngVal)
                return parseInt(lngVal)
            }
        })
    })
};

//ended here, creating map faster than can pull the variables
function initMap() {

    let options = {
        zoom: 11,
        center: { lat: homeMapLat(), lng: homeMapLng() },
        // center: { lat: 45, lng: -93.26 },
    };

    //new map
    let map = new
        google.maps.Map(document.getElementById('map'), options);
}

$(document).ready(function () {

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


