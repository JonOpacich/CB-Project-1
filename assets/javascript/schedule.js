//make this giant if statment so may just skip the whole thing if already entered info
//this availability is stored on firebase with their login 
//schedule needs to update for every 2 weeks?

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


let string = "";
let hourPosition = 7;
let userScheduleArray = [];

//creates horizontal checkbox based on how many days of the week displayed, set specific id for each one
function createCheckboxes() {
    let scheduleLength = 7;
    let weekdayPosition = 0;
    for (let checkboxIndex = 0; checkboxIndex < scheduleLength; checkboxIndex++) {
        string = string + `<td><div class="form-check"><input class="form-check-input position-static" type="checkbox" id="day-${weekdayPosition}-hr-${hourPosition}" value=false aria-label="..."></div></td>`
        weekdayPosition++;
    }
    return string;
}

$(document).ready(function () {

    // displays days of week starting with Sunday
    let tableDay = "";
    for (let weekdayIndex = 7; weekdayIndex > 0; weekdayIndex--) {
        tableDay = moment().day(0 - weekdayIndex).format("dddd");
        $("#table-header").append(
            `<th scope="col">${tableDay}</th>`
        );
    }


    //displays study times 7am-10pm
    for (let hourIndex = 7; hourIndex < 22; hourIndex++) {
        let firstTimeSlotNum = moment(hourIndex, "k").format("h");
        let secondTimeSlotNum = moment(hourIndex + 1, "k").format("h a");
        let timeSlot = `${firstTimeSlotNum}-${secondTimeSlotNum}`

        string = "";
        $("#table-body").append(
            `<tr> <th scope="row">${timeSlot}</th>` + createCheckboxes() + `</tr>`
        );
        hourPosition++;
    }


    //change the value of each check box from true/false when checked/unchecked
    $(document).on("click", ".form-check-input", function () {
        if ($(this).attr("value") == "false") {
            $(this).attr("value", "true")
        } else if ($(this).attr("value") == "true") {
            $(this).attr("value", "false")
        }
    });


    //Once click address submit, converts to geocode, round specifics off address, send to Firebase, switch view to schedule form
    $("#address-submit-btn").on("click", function (event) {
        event.preventDefault();
        let address = $("#street-address").val().trim();
        let name = $("#name").val().trim();
        let city = $("#city").val().trim();
        let state = $("#state").val().trim();
        let zip = $("#zip").val().trim();
        let lat = "";
        let lng = "";

        let queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + ", " + city + ", " + state + zip + "&key=AIzaSyCk5A3HKmPbJQoTtpMg_RbAsy6NBEJS-Gk";

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": queryURL,
            "method": "GET",
        }

        //geocoding the address, rounding to 3 digits
        $.ajax(settings).done(function (response) {
            lat = response.results[0].geometry.location.lat.toFixed(3);
            lng = response.results[0].geometry.location.lng.toFixed(3);

            // adding info to firebase user data
            // firebase.auth().onAuthStateChanged(function (user) {
            let user = firebase.auth().currentUser;

            if (user) {
                // User is signed in.
                console.log("working");
                database.ref(`/users/${firebase.auth().currentUser.uid}`).set(
                    {
                        name: name,
                        lat: lat,
                        lng: lng
                    });
                    database.ref(`/addressList/${firebase.auth().currentUser.uid}`).set(
                        {
                            name: name,
                            lat: lat,
                            lng: lng
                        });
            } else {
                // No user is signed in.
                console.log("no user");
            }

        });


        $("#addressForm").addClass("d-none");
        $("#schedule-form").removeClass("d-none");
    })

    //submit schedule to Firebase
    $("#schedule-submit-btn").on("click", function (event) {
        event.preventDefault();
        $(".form-check-input").each(function () {
            if ($(this).attr("value") == "true") {
                userScheduleArray.push($(this).attr("id"));
            }
        })
        console.log(userScheduleArray)
        let user = firebase.auth().currentUser;

        if (user) {
            // User is signed in.
            database.ref(`/users/${firebase.auth().currentUser.uid}/availability`).set(
                {
                    userScheduleArray
                })
        } else {
            // No user is signed in.
            console.log("no user")

        }

        //this will redirect to main page, need to insert link
        location.href = "main.html";
    })


})


