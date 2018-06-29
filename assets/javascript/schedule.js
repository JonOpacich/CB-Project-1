//soooooooo we present a form where people fill out their availability by checking each box they're available each day of the week (travel times not included)
//for what kind of time period? Generic? Go week by week? Option for each
//does each person have true/false for each time slot??

//this availability is stored on firebase with their login 

//can integrate reminders through google calendar. 


//make it so need to answer address to un-hide the schedule form
//schedule needs to update for every 2 weeks?
let string = "";
let hourPosition = 7;

function createCheckboxes() {
    let scheduleLength = 14;
    let weekdayPosition = 0;
    for (let checkboxIndex = 0; checkboxIndex < scheduleLength; checkboxIndex++) {
        string = string + `<td><div class="form-check"><input class="form-check-input position-static" type="checkbox" start-time="${hourPosition}" day-value="${weekdayPosition}" value=false aria-label="..."></div></td>`

        weekdayPosition++;
    }
    return string;
}
console.log(createCheckboxes())

$(document).ready(function () {

    // *add disable class if todays date is after the date list on the top of the form somehow.....
    let tableDay = "";
    //starts at the top of this week
    for (let weekdayIndex = 7; weekdayIndex > 0; weekdayIndex--) {
        tableDay = moment().day(0 - weekdayIndex).format("ddd Do");
        $("#table-header").append(
            `<th scope="col">${tableDay}</th>`
        )
    }
    //goes into next week
    for (let weekdayIndex = 0; weekdayIndex < 7; weekdayIndex++) {
        tableDay = moment().day(0 + weekdayIndex).format("ddd Do");
        $("#table-header").append(
            `<th scope="col">${tableDay}</th>`
        )
    }

    //* need to convert from military time (if statement is attempt of that)
    for (let hourIndex = 7; hourIndex < 22; hourIndex++) {
        // if (hourIndex < 12) {
        let firstTimeSlotNum = hourIndex;
        let secondTimeSlotNum = hourIndex + 1;
        let timeSlot = `${firstTimeSlotNum}-${secondTimeSlotNum}`

        string = "";
        $("#table-body").append(
            `<tr> <th scope="row">${timeSlot}</th>` + createCheckboxes() + `</tr>`
        );
        hourPosition++;


        // } else {
        //     let firstTimeSlotNum = hourIndex - 12;
        //     let secondTimeSlotNum = hourIndex -12 + 1;
        //     let timeSlot = `${firstTimeSlotNum}-${secondTimeSlotNum}`
        //     console.log(timeSlot)
        // }
    }

    $(document).on("click", ".form-check", function (event) {
        event.preventDefault();
        console.log($(this).attr("start-time"));
        if ($(this).attr("value") == "false") {
            $(this).attr("value", "true")
        } else if ($(this).attr("value") == "true") {
            $(this).attr("value", "false")
        }

    })

})
