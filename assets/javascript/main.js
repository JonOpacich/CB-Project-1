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

    //setting the coords for centering the map around user address lat & lng
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
                    zoom: 12,
                    center: { lat: parseFloat(lat), lng: parseFloat(lng) },
                };

                //new map
                let map = new
                    google.maps.Map(document.getElementById('map'), options);


                //Array of markers taken from firebase
                let markers = [];

                //setting up markers for home addresses
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
                        //adding pins to markers array
                        markers.push({
                            coords: { lat: lat, lng: lng },
                            iconImage: "assets/images/location.png",
                            content: `<h4>${item.val().name}</h4>
                                        ${content}`

                        })
                    });
                });

                //setting up markers from create a session button
                database.ref("sessionData").on("value", function (snapshot) {
                    snapshot.forEach(function (item) {

                        //taking data from Firebase sessionData
                        let lat = parseFloat(item.val().lat);
                        let lng = parseFloat(item.val().lng);
                        let locationName = item.val().location;
                        let locationAddress = item.val().address + ", " + item.val().city + " " + item.val().state + " " + item.val().zip;
                        let sessionTime = item.val().start + " - " + item.val().end;
                        let topic = "Topic: " + item.val().topic;
                        content =
                            `<h4>${locationName}</h4>
                            <p>${locationAddress}</p>
                            <br>
                            <h6>${sessionTime}</h6>
                            <h6>${topic}</h6>
                            `;
                        //adding session pins to markers array
                        markers.push({
                            coords: { lat: lat, lng: lng },
                            iconImage: "assets/images/meeting-point.png",
                            content: content

                        })
                    });
                });

                //loop through markers array & add to map (function below)
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
            console.log("no user")
        };
    }, function (error) {
        console.log(error);
    });
}
//waiting for user data to get pulled from Firebase
firebase.auth().onAuthStateChanged(function (user) {
    $(document).ready(function () {

        if (user) {
            //if signed in
            let userId = firebase.auth().currentUser.uid;

            database.ref(`/userCommitments/${userId}`).on("value", function (snapshot) {

                //empty out commitmentList
                $("#commitmentList").html("");
                //taking user commitments out of Firebase
                if (snapshot.exists()) {

                    snapshot.forEach(function (item) {
                        //saving them as variables
                        let location = item.val().fblocation,
                            topic = item.val().fbtopic,
                            start = item.val().fbstart,
                            end = item.val().fbend;

                        //using variables to add commitments to sidebar
                        $("#commitmentList").append(
                            `<li class="list-group-item list-group-item-action com-li"><b>${topic}:</b> ${location}
                            ${start} - ${end}</li>`)
                    });
                } else {
                    $("#commitmentList").html('<li id="default-commitment" class="list-group-item list-group-item-action com-li"><b>Nothing to report:</b> Time to sign up!</li>')
                }
            })
        } else {
            // User is signed out
            console.log("no user")
        };


        //clicking generate btn adds quote to page w/ API, changes daily (couldn't find advice)
        $("#generate-quote-btn").on("click", function () {
            //can change to =students for different quotes
            let settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://quotes.rest/qod?category=inspire",
                "method": "GET",
            }

            $.ajax(settings).done(function (response) {
                // console.log(response);
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

        // click handler for submitting new session
        $("#sessionSubmit").on("click", function (event) {
            event.preventDefault()

            var Topic = $("#sessionTopic").val().trim();
            var Place = $("#sessionLocation").val().trim();
            var Address = $("#sessionAddress").val().trim();
            var City = $("#sessionCity").val().trim();
            var State = $("#sessionState").val().trim();
            var Zipcode = $("#sessionZipcode").val().trim();
            var Start = $("#sessionTimeStart").val().trim();
            var End = $("#sessionTimeEnd").val().trim();
            let lat = "";
            let lng = "";

            //geocoding submitted session addresses
            let queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + Address + ", " + City + ", " + State + Zipcode + "&key=AIzaSyCk5A3HKmPbJQoTtpMg_RbAsy6NBEJS-Gk";

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": queryURL,
                "method": "GET",
            }

            //sending ajax request for lat/lng
            $.ajax(settings).done(function (response) {
                lat = response.results[0].geometry.location.lat;
                lng = response.results[0].geometry.location.lng;

                var sessionInfo = {
                    topic: Topic,
                    location: Place,
                    address: Address,
                    city: City,
                    state: State,
                    zip: Zipcode,
                    start: Start,
                    end: End,
                    lat: lat,
                    lng: lng
                };

                console.log(sessionInfo)
                database.ref("sessionData").push(sessionInfo);
            });

            return false;
        });


        //onclick for closing form X
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

        //below fills in available sessions under map
        database.ref("sessionData").on("child_added", function (childSnapshot, prevChildKey) {

            var fbaseTopic = childSnapshot.val().topic;
            var fbaseLocation = childSnapshot.val().location;
            var fbaseStart = childSnapshot.val().start;
            var fbaseEnd = childSnapshot.val().end;


            $("#sessionBody").append(
                `
            <tr class='sessionThread'>
                <th scope='row'>${fbaseTopic}</th>
                <td>${fbaseLocation}</td>
                <td>${fbaseStart} - ${fbaseEnd}</td>
                <td> <button data-fbstart="${fbaseStart}" data-fbend="${fbaseEnd}" data-fbtopic="${fbaseTopic}" data-fblocation="${fbaseLocation}" name='sessionDetails' type='submit' class='sessionCommit'>+To My List</button></td></tr>
            `)
            $("#sessionCommit").addClass(function (n) {
                return "td_" + n;
            });
            $(".sessionThread").addClass(function (n) {
                return "td_" + n;
            });
        });

        //*need to save these to database as well so persistent

        $(document).on("click", ".sessionCommit", function (event) {
            event.preventDefault();

            let fbstart = $(this).attr("data-fbstart")
            let fbend = $(this).attr("data-fbend")
            let fbtopic = $(this).attr("data-fbtopic")
            let fblocation = $(this).attr("data-fblocation")
            // console.log(fbstart, fbend, fbtopic, fblocation)

            database.ref(`userCommitments/${firebase.auth().currentUser.uid}`).push({
                fbstart: fbstart,
                fbend: fbend,
                fbtopic: fbtopic,
                fblocation: fblocation
            });

        })
    });
}, function (error) {
    console.log(error);
});