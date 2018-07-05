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
                lat = 0,
                content = "";

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
                        let itemKey = item.key;

                        //if key matches the item in availability, then go through its availability array and create a p for each one....

                        database.ref(`availability`).on("value", function (snapshot) {
                            //going through each user id from availability in firebase
                            content = "";
                            snapshot.forEach(function (item2) {

                                // next looking for the id that matches the current marker id
                                if (itemKey === item2.key) {
                                    //pulling the schedule array for that id
                                    let scheduleArray = item2.val().userScheduleArray;
                                    //for each item in that array, add <p> tag to content
                                    scheduleArray.forEach(function (item3) {
                                        content += `<p>${item3.day}: ${item3.time}</p>`;

                                    })
                                }
                            })
                        })

                        markers.push({
                            coords: { lat: lat, lng: lng },
                            iconImage: "assets/images/location.png",
                            content: `<h4>${item.val().name}</h4>
                                        ${content}`

                        })
                    });
                });

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

//clicking generate btn adds quote to page w/ API, changes daily (couldn't find advice)
//Can only get 10 requests per hour so stuck it in a btn so it doesn't run every time page is refreshed
    $("#generate-quote-btn").on("click", function () {
        //can change to =students for different quotes
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://quotes.rest/qod?category=inspire",
            "method": "GET",
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
            let quote = response.contents.quotes[0].quote;
            $("#quote").html(quote);
        });

        //hide generate btn
        $("#generate-quote-btn").addClass("d-none")
    })


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

    //when click on log-out link
    $("#log-out").on("click", () => {
        //sign user out
        firebase.auth().signOut().then(function () {
            // Sign-out successful.Redirects to sign-in page
            location.href = "index.html";
        }).catch(function (error) {
            // An error happened.
            console.log("Uh-oh, looks like we couldn't sign you out at this time. Try again later.", error)
        });


    })

})

