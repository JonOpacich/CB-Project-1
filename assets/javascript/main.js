
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
    var chatDiv=$('#chat-div');

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


