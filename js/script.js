$(function () {

    function initMap() {

        var location = new google.maps.LatLng(50.0875726, 14.4189987);

        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: location,
            zoom: 16,
            panControl: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(mapCanvas, mapOptions);

        var markerImage = '../images/marker.png';

        var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: markerImage
        });

        var contentString = '<div class="info-window">' +
                '<h3>Come visit us!</h3>' +
                '<div class="info-content">' +
                '<p>It\'s a great day for watching a film.</p>' +
                '</div>' +
                '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 400
        });

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });

    }

    google.maps.event.addDomListener(window, 'load', initMap);
});


function checkData() {

    name = document.reservationForm.nameField.value;
    surname = document.reservationForm.surnameField.value;
    phone = document.reservationForm.phoneField.value;
    mail = document.reservationForm.mailField.value;

    msg = "";

    phoneRegex = /\+[0-9]{3}\/[0-9]{2}-[0-9]{3}-[0-9]{3,4}/;
    emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (name == "") {
        alert("Name field is empty!");
    } else if (surname == "") {
        alert("Surname field is empty");
    } else if (phone == "") {
        alert("Phone field is empty")
    } else if (!phoneRegex.test(phone)) {
        alert("Phone number format is incorrect");
    } else if (mail == "") {
        alert("Email field is empty");
    } else if (!emailRegex.test(mail)) {
        alert("Email format is incorrect");
    } else {
        window.open('mailto:festival@mamamama.com');
    }
    
}