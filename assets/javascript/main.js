
function initMap() {
    //map options
    var options = {
        zoom: 11,
        center: { lat: 45, lng: -93.26 },
    }

    //new map
    var map = new
        google.maps.Map(document.getElementById('map'), options);
}


$(document).ready(function () {

    var eventButton = $('#add-event');
    var closeForm=()=>{
        eventButton.removeClass('animate');
        eventButton.offsetWidth = eventButton.offsetWidth;
        $('#map').css('grid-column', '2/5')
        $('#add-button').css('right', '4.5%');
        eventButton.addClass("hide");
    }
    
    $('#add-button').on('click', () => {
        if (eventButton.hasClass('animate')) {
            closeForm();
        }
        else {
            eventButton.removeClass('hide');
            $('#map').css('grid-column', '2/4');
            $('#add-button').css('right', '32%');
            eventButton.offsetWidth = eventButton.offsetWidth;
            eventButton.addClass('animate');
        }
    });
    $('.close').on('click',function(){
        closeForm();
    })
})
 

