//make this giant if statment so may just skip the whole thing if already entered info
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


let userScheduleArray = [];


$(document).ready(function () {

    // displays days of week starting with Sunday
    let tableDay = "";
    let dayIndex = 0;
    let boxIndex = 0;
    for (let weekdayIndex = 7; weekdayIndex > 0; weekdayIndex--) {

        tableDay = moment().day(0 - weekdayIndex).format("dddd");
        $("#table-header").append(
            `<th scope="col">${tableDay}</th>`
        );

        $("#table-body").append(
            `<td>
                <div class="form-group">
                    <select class="form-control dropdownStart index-${dayIndex}" id="start-${boxIndex}">
                        <option value=0>Start Time</option>
                        <option value=1>7:00 AM</option>
                        <option value=2>8:00 AM</option>
                        <option value=3>9:00 AM</option>
                        <option value=4>10:00 AM</option>
                        <option value=5>11:00 AM</option>
                        <option value=6>12:00 PM</option>
                        <option value=7>1:00 PM</option>
                        <option value=8>2:00 PM</option>
                        <option value=9>3:00 PM</option>
                        <option value=10>4:00 PM</option>
                        <option value=11>5:00 PM</option>
                        <option value=12>6:00 PM</option>
                        <option value=13>7:00 PM</option>
                        <option value=14>8:00 PM</option>
                        <option value=15>9:00 PM</option>
                        <option value=16>10:00 PM</option>
                    </select>
                <p class="text-center"> until </p>
                <div class="form-group">
                    <select class="form-control dropdownEnd index-${dayIndex}" id="end-${boxIndex}">
                    <option value=0>End Time</option>
                    <option value=1>7:00 AM</option>
                    <option value=2>8:00 AM</option>
                    <option value=3>9:00 AM</option>
                    <option value=4>10:00 AM</option>
                    <option value=5>11:00 AM</option>
                    <option value=6>12:00 PM</option>
                    <option value=7>1:00 PM</option>
                    <option value=8>2:00 PM</option>
                    <option value=9>3:00 PM</option>
                    <option value=10>4:00 PM</option>
                    <option value=11>5:00 PM</option>
                    <option value=12>6:00 PM</option>
                    <option value=13>7:00 PM</option>
                    <option value=14>8:00 PM</option>
                    <option value=15>9:00 PM</option>
                    <option value=16>10:00 PM</option>
                    </select>
                </div>
        </td>`
        );
        dayIndex++;
        boxIndex++;
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

    //capturing schedule from form
    //taking a break from this part....

    //for each index of select, when each one is changed


    //submit schedule to Firebase
    $("#schedule-submit-btn").on("click", function (event) {
        event.preventDefault();
        for (let i = 0; i < 7; i++) {
            let selectStartId = "#start-" + i;
            // console.log(selectStartId)
            selectStartIdText = $(`${selectStartId} option:selected`).text();
            let selectEndId = "#end-" + i;
            // console.log(selectEndId)
            selectEndIdText = $(`${selectEndId} option:selected`).text();

            if (selectStartIdText !== "Start Time" || selectEndIdText !== "End Time") {
                let dayOfWeekArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                let dayOfWeek = "";

                dayOfWeekArray.forEach(function (item, i) {
                    if (("#start-" + i) === selectStartId) {
                        dayOfWeek = item;
                    }
                })
                userScheduleArray.push({
                    day: dayOfWeek,
                    time: selectStartIdText + " - " + selectEndIdText
                })
            }
        }

        console.log(userScheduleArray)
        let user = firebase.auth().currentUser;

        if (user) {
            // User is signed in.
            database.ref(`/availability/${firebase.auth().currentUser.uid}`).set(
                {
                    userScheduleArray
                })
        } else {
            // No user is signed in.
            console.log("no user")
        }

        //this will redirect to main page, need to insert link
        // location.href = "main.html";
    })


})


