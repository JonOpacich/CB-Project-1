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
            
            database.ref().on("value", function (snapshot) {
                lat = snapshot.child(`/users/${userId}/lat`).val()
                lng = snapshot.child(`/users/${userId}/lng`).val()
                //map options
                let options = {
                    zoom: 11,
                    center: { lat: parseFloat(lat), lng: parseFloat(lng) },
                };

                //new map
                let map = new
                    google.maps.Map(document.getElementById('map'), options);


                //Array of markers taken from firebase
                let markers = [];
                database.ref("addressList").on("value", function (snapshot) {
                    snapshot.forEach(function (item) {

                        let lat = parseFloat(item.val().lat);
                        let lng = parseFloat(item.val().lng);
                        // let itemKey = item.key;

                        //left off here..this does not work yet
                        // //Array of content from firebase, needed for markers
                        // database.ref(`availability/${itemKey}/userScheduleArray`).on("value", function (snapshot) {
                        //     //going through each user id from firebase
                        //     console.log(snapshot.val())
                        //     snapshot.val().forEach(function (item, index) {
                        //         // going through each array item for each user id
                        //         console.log(item)
                        //         let scheduleArray = item.userScheduleArray;
                        //         scheduleArray.forEach(function (item) {
                        //             content = `${item.day}: ${item.time}`
                        //             console.log(content)
                        //         })
                        //     })
                        // })


                        markers.push({
                            coords: { lat: lat, lng: lng },
                            iconImage: "assets/images/location.png",
                            content: `${item.val().name}`
                            //change content to include availability

                        })
                    });
                });
                console.log(markers)

                //loop through markers & add to map
                for (let i = 0; i < markers.length; i++) {
                    addMarker(markers[i]);
                }

                //Add Marker Function
                function addMarker(props) {
                    let marker = new google.maps.Marker({
                        position: props.coords,
                        map: map,
                        icon: props.iconImage,
                    });
                    if (props.content) {
                        let infoWindow = new google.maps.InfoWindow({
                            content: props.content
                        });

                        marker.addListener("click", function () {
                            infoWindow.open(map, marker)
                        });
                    }
                }
            });

        } else {
            // User is signed out
        };
    }, function (error) {
        console.log(error);
    });


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

    //when click on update schedule
    $("#update-schedule").on("click", () => {
        //get their user id
        let userId = firebase.auth().currentUser.uid;

        //remove their availability object from firebase
        database.ref().child(`availability/${userId}`).remove()

        //switch to schedule page
        location.href = "schedule.html";

    })


})

