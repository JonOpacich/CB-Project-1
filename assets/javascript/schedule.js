//soooooooo we present a form where people fill out their availability by checking each box they're available each day of the week (travel times not included)
//for what kind of time period? Generic? Go week by week? Option for each
//does each person have true/false for each time slot??

//this availability is stored on firebase with their login 


//can integrate reminders through google calendar. 

//more helpful to practice building myself or using google's features? I think build.


//make it so need to answer address to un-hide the schedule form


$(document).ready(function () {

    //an array with this weeks dates

    let tableDay = "";
    for (let weekdayIndex = 7; weekdayIndex > 0; weekdayIndex--) {
        tableDay = moment().day(0 - weekdayIndex).format("ddd Do");
        $("#table-header").append(
            `<th scope="col">${tableDay}</th>`
        )
    }

    //need to convert from military time (if statement is attempt of that)
    for (let hourIndex = 7; hourIndex < 22; hourIndex++) {
        // if (hourIndex < 12) {
        let firstTimeSlotNum = hourIndex;
        let secondTimeSlotNum = hourIndex + 1;
        let timeSlot = `${firstTimeSlotNum}-${secondTimeSlotNum}`
        //could do a loop here instead so not so repetitive
        $("#table-body").append(
            `<tr>
                <th scope="row">${timeSlot}</th>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input position-static" type="checkbox" id="" value="false" aria-label="...">
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input position-static" type="checkbox" id="" value="false" aria-label="...">
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input position-static" type="checkbox" id="" value="false" aria-label="...">
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input position-static" type="checkbox" id="" value="false" aria-label="...">
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input position-static" type="checkbox" id="" value="false" aria-label="...">
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input position-static" type="checkbox" id="" value="false" aria-label="...">
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input position-static" type="checkbox" id="" value="false" aria-label="...">
                        </div>
                    </td>
                </tr>`
                
        )
        // } else {
        //     let firstTimeSlotNum = hourIndex - 12;
        //     let secondTimeSlotNum = hourIndex -12 + 1;
        //     let timeSlot = `${firstTimeSlotNum}-${secondTimeSlotNum}`
        //     console.log(timeSlot)
        // }
    }

})
