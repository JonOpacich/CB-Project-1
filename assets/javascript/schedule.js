//this availability is stored on firebase with their login 

//schedule needs to update for every 2 weeks?

// Initialize Firebase
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

    
    let tableDay = "";
    for (let weekdayIndex = 7; weekdayIndex > 0; weekdayIndex--) {
        tableDay = moment().day(0 - weekdayIndex).format("dddd");
        $("#table-header").append(
            `<th scope="col">${tableDay}</th>`
        );
    }

    //The section enters days of the week based on today, focusing on generic schedule above for now.
    //starts at the top of this week
    /* for (let weekdayIndex = 7; weekdayIndex > 0; weekdayIndex--) {
        tableDay = moment().day(0 - weekdayIndex).format("ddd Do");
        $("#table-header").append(
            `<th scope="col">${tableDay}</th>`
        );
    }
    //goes into next week
    for (let weekdayIndex = 0; weekdayIndex < 7; weekdayIndex++) {
        tableDay = moment().day(0 + weekdayIndex).format("ddd Do");
        $("#table-header").append(
            `<th scope="col">${tableDay}</th>`
        )
    } 
    // *add disable class if todays date is after the date list on the top of the form somehow.....
    */

    //* need to convert from military time
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


    //change the value from true/false when checkbox checked/unchecked
    $(document).on("click", ".form-check-input", function () {
        if ($(this).attr("value") == "false") {
            $(this).attr("value", "true")
        } else if ($(this).attr("value") == "true") {
            $(this).attr("value", "false")
        }
    });


    //submit address to Firebase/hide from view
    $("#address-submit-btn").on("click", function (event) {
        event.preventDefault();
        let address = $("#street-address").val().trim();
        let city = $("#city").val().trim();
        let state = $("#state").val().trim();
        let zip = $("#zip").val().trim();

        database.ref("User Address").push({
            address: address,
            city: city,
            state: state,
            zip: zip
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
        database.ref("User Schedule").push({
            availability: userScheduleArray
        })
    })


})


