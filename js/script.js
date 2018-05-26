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

/* proverava podatke u formi i povecava broj rezervacija ako je sve okej*/
function checkData(id) {

    name = document.reservationForm.nameField.value;
    surname = document.reservationForm.surnameField.value;
    phone = document.reservationForm.phoneField.value;
    mail = document.reservationForm.mailField.value;

    phoneRegex = /\+[0-9]{3}\/[0-9]{2}-[0-9]{3}-[0-9]{3,4}/;
    emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (name == "") {
        alert("Name field is empty!");
        return;
    } else if (surname == "") {
        alert("Surname field is empty");
        return;
    } else if (phone == "") {
        alert("Phone field is empty");
        return;
    } else if (!phoneRegex.test(phone)) {
        alert("Phone number format is incorrect");
        return;
    } else if (mail == "") {
        alert("Email field is empty");
        return;
    } else if (!emailRegex.test(mail)) {
        alert("Email format is incorrect");
        return;
    } else {
        window.open('mailto:festival@mamamama.com');
    }

    /* povecavanje broja rezervacija */
    if (typeof (Storage) !== undefined) {
        var num = localStorage.getItem(id);
        if (num === null) {
            num = 1
        } else {
            num = parseInt(num) + 1;
        }
        localStorage.setItem(id, num);
    } else {
        alert("no local storage");
    }
}

class Showing {
    constructor(place, date, time, cost) {
        this.place = place;
        this.date = date;
        this.time = time;
        this.cost = cost;
    }
}

/* klasa koja predstavlja film */
class Film {
    constructor(name, director, time, actors, releaseDate, country, showings, img, link, id, gallery, youtube, desc, languageLink) {
        this.name = name;   /* naziv */
        this.director = director; /* reditelj */
        this.time = time; /* trajanje */
        this.actors = actors; /* niz glumaca */
        this.releaseDate = releaseDate; /* datum izlaska - string */
        this.country = country; /* zemlja */
        this.showings = showings; /* niz objekata klase Showing */
        this.img = img; /* link do slike */
        this.link = link; /* link do filma */
        this.id = id; /* redni broj u nizu films */
        this.gallery = gallery; /* niz naziva slika u galeriji */
        this.youtube = youtube; /* youtube link */
        this.desc = desc; /* opic u html formatu */
        this.languageLink = languageLink; /* link za film na suprotnom jeziku */
    }

    /* za film vraca popularnost - broj rezervacija iz local storage-a */
    getPopularity() {
        if (typeof (Storage) !== undefined) {
            var num = localStorage.getItem(this.id);
            if (num === null) {
                return 0;
            } else {
                return parseInt(num);
            }
        } else {
            alert("no local storage");
        }
    }

    /* prikazuje film na stranici sa ostalim filmovima 
        id je redni broj div-a na stranici(1-4)
    */
    showFilmm(id) {
        var i = 0;

        document.getElementById("img" + id).src = "images/films/" + this.img;
        document.getElementById("name" + id).innerHTML = this.name;
        document.getElementById("director" + id).innerHTML = this.director;
        document.getElementById("runningTime" + id).innerHTML = this.time;
        document.getElementById("actors" + id).innerHTML = this.actors;
        document.getElementById("releaseDate" + id).innerHTML = this.releaseDate;
        document.getElementById("country" + id).innerHTML = this.country;
        document.getElementById("popularity" + id).innerHTML = this.getPopularity();
        document.getElementById("link" + id).href = "html_films/" + this.link;

        for (i = 0; i < this.showings.length; i++) {
            document.getElementById("place" + id + (i + 1)).innerHTML = this.showings[i].place;
            document.getElementById("date" + id + (i + 1)).innerHTML = this.showings[i].date;
            document.getElementById("time" + id + (i + 1)).innerHTML = this.showings[i].time;
            document.getElementById("cost" + id + (i + 1)).innerHTML = this.showings[i].cost;
        }
        /* visak div-ova za showings uklanja */
        for (i = this.showings.length; i < 3; i++) {
            document.getElementById("showing" + id + (i + 1)).className += " d-none";
        }
    }
}
/* prikazuje film na posebnoj stranici */

function showFilm(id) {
    var film = films[id];
    var i = 0;
    var names = null;

    document.getElementById("img").src = "../images/films/" + film.img;
    document.getElementById("language").href = film.languageLink;
    document.getElementById("name").innerHTML = film.name;
    document.getElementById("name1").innerHTML = film.name;
    document.getElementById("director").innerHTML = film.director;
    document.getElementById("runningTime").innerHTML = film.time;
    document.getElementById("actors").innerHTML = film.actors;
    document.getElementById("releaseDate").innerHTML = film.releaseDate;
    document.getElementById("country").innerHTML = film.country;
    document.getElementById("popularity").innerHTML = film.getPopularity();
    document.getElementById("about").innerHTML = film.desc;
    document.getElementById("favourite").innerHTML = "<button type=\"button\" class=\"btn btn-outline-blue mt-3 ml-3\"  onclick=\"addToFavourites(" + film.id + ")\"><i class=\"far fa-heart\"></i></button>";
    document.getElementById("yt").src = film.youtube;

    for (i = 0; i < film.showings.length; i++) {
        document.getElementById("place" + (i + 1)).innerHTML = film.showings[i].place;
        document.getElementById("date" + (i + 1)).innerHTML = film.showings[i].date;
        document.getElementById("time" + (i + 1)).innerHTML = film.showings[i].time;
        document.getElementById("cost" + (i + 1)).innerHTML = film.showings[i].cost;

        document.getElementById("o" + (i + 1)).innerHTML = film.showings[i].place + " - " +
            film.showings[i].date + " - " +
            film.showings[i].time + " - " +
            film.showings[i].cost;
    }
    for (i = film.showings.length; i < 3; i++) {
        document.getElementById("showing" + (i + 1)).className += " d-none";
        document.getElementById("o" + (i + 1)).className += " d-none";
    }

    var galHtml = "<h3 class=\"text-blue\"> Gallery </h3>"
    film.gallery.forEach(pic => {
        galHtml += "<a href=\"../images/films/" + pic + "\" data-lightbox=\"trailer\" data-title=\" "
            + film.name + "\" data-alt=\" " + film.name + "\"><img class=\"img-fluid ml-1\"src=\"../images/films/" + pic + " \" alt=\" " + film.name + "\"></a>"
    });
    document.getElementById("gallery").innerHTML = galHtml;
}

/* films sa id-em id dodaje u omiljene 
    to je niz favourites u lovalStorage-u
*/

function addToFavourites(id) {
    if (typeof (Storage) !== undefined) {
        var fav = localStorage.getItem("favourites");
        if (fav === null) {
            fav = id;
        } else {
            var niz;
            niz = fav.split(",");
            if (fav.indexOf(id) == -1) {
                fav += ("," + id);
            }
        }
        localStorage.setItem("favourites", fav);
    } else {
        alert("no local storage");
    }
}

/* niz filmova odakle se kupe sve informacije 
    treba dopuniti
*/
films = [
    new Film(
        "Aftermath",
        "Elliot Lester",
        "92 minutes",
        [
            "Arnold Schwarzenegger",
            "Scoot McNairy",
            "Maggie Grace",
            "Martin Donovan"
        ],
        "April 7, 2017",
        "United States",
        [
            new Showing("Kinoteka", "27 May", "16:30", "350RSD"),
            new Showing("Cultural Centre of Belgrade", "1 June", "14:00", "300RSD")
        ],
        "Aftermath.png",
        "aftermath.html",
        0,
        ["Aftermath.png", "aftermath1.jpg"],
        "https://www.youtube.com/embed/ZN8toxhSn9Y",
        "<p> Roman Melnyk, a construction worker, is allowed to leave work early, for the arrival of his wife and pregnant daughter, Olena and Nadiya, from New York City aboard AX 112. At the airport to welcome his family, Roman receives the news that AX 112, with his wife and daughter onboard, had been in an accident. From this point, Roman is devastated and blames the air traffic controller for the deaths of his family.</p> <p>Meanwhile, in another angle of the story, Jacob \"Jake\" Bonanos, an air traffic controller, is happily married to a woman named Christina with whom he has a young son named Samuel. Jake is now also devastated, after seeing AX 112 and the other flight, DH 616, disappear from the radar, showing that the two planes collided and were destroyed. Although the investigators cannot hold Jake responsible for the deaths of the passengers, he blames himself. However, as time passes, he slowly unravels, straining the relationship with his family, and is unwilling to talk about what happened. </p> <p> It is reported that all 271 passengers and crew were killed in the mid-air collision. Roman goes to the crash site and, posing as a normal volunteer, he recovers his daughter's necklace and the bodies of his wife and daughter. At his home, Roman stays hidden inside, when Tessa Gorbett, a journalist, approaches, expressing interest in writing a book on the incident. She ends up leaving behind some prior articles of plane disasters she had written about (to show her credentials as a serious journalist) through the mail slot of the door.</p> <p> Because of the seriousness of the incident, the lawyer advises Jake to move to another state and adopt a new name for the safety of himself and of his family. Roman meets lawyers John and James Gullick to sign an agreement stating that the airport companies will pay for the expenses and damages to his family. Roman refuses to sign it as neither the company nor the lawyers express apologies for the loss of his family.</p> <p>One year later, Roman and the families of the crash victims attend an inauguration of the newly completed memorial at the crash site. Jake, having moved to another site, now works at a travel agency, under the name \"Pat Dealbert\" and lives alone. Roman has also moved on to another town and now works as a carpenter. Roman meets Tessa and asks her, as a favor, to find Jake. Tessa later reveals Jake's cover name and occupation but she initially refuses to give his address. Roman tracks down the building where Jake is working and follows him to his apartment. There, after waiting a day, on a day when Christina and Samuel happen to be visiting Jake for the weekend, Roman confronts him at his door. Jake refuses to offer an apology, so Roman stabs Jake in the neck. Jake falls to the floor and bleeds to death while Christina and Samuel sob uncontrollably.</p> <p> Roman is convicted of murder and serves a 10-year prison term, then is released on four months' parole. He visits his family's grave where he meets a stranger. The stranger turns out to be a now-grown Samuel, who has tracked Roman down with the intention of killing him to avenge his father's murder. However, Samuel cannot bring himself to kill Roman since it's not what he was taught. Samuel accepts Roman's apology and allows him to leave.</p>",
        "aftermath-sr.html"
    ),
    new Film(
        "Blade Runner 2049",
        "Denis Villeneuve",
        "163 minutes",
        [
            "Ryan Gosling",
            "Harrison Ford",
            "Ana de Armas",
            "Sylvia Hoeks",
            "Lennie James",
            "Dave Bautista",
            "Jared Leto"
        ],
        "October 3, 2017",
        "United States",
        [
            new Showing("Fontana", "24 May", "19:30", "300RSD"),
            new Showing("Cineplexx TC Usce", "25 May", "22:00", "350RSD"),
            new Showing("Cultural Centre of Belgrade", "26 May", "18:00", "400RSD")
        ],
        "BladeRunner2049.png",
        "bladerunner2049.html",
        1,
    ),
    new Film(
        "Creed",
        "Ryan Coogler",
        "133 minutes",
        [
            "Michael B. Jordan",
            "Sylvester Stallone",
            "Tessa Thompson",
            "Phylicia Rashad",
            "Anthony Bellew"
        ],
        "November 19, 2015",
        "United States",
        [
            new Showing("Kinoteka", "28 May", "22:00", "400RSD"),
            new Showing("Cineplexx TC Usce", "30 May", "13:30", "300RSD"),
            new Showing("Academy 28", "2 June", "18:00", "300RSD")
        ],
        "Creed.jpg",
        "creed.html",
        2
    ),
    new Film(
        "Titanic",
        "James Cameron",
        "195 minutes",
        [
            "Leonardo DiCaprio",
            "Kate Winslet",
            "Billy Zane",
            "Billy Zane",
        ],
        "December 19, 1997",
        "United States",
        [
            new Showing("Fontana", "27 May", "16:30", "400RSD"),
            new Showing("Sava Center", "1 June", "19:00", "500RSD")
        ],
        "titanic.jpg",
        "titanic.html",
        3

    ),
    new Film(
        "Killer Elite",
        "Gary McKendry",
        "114 minutes",
        [
            "Jason Statham",
            "Yvonne Strahovski",
            "Clive Owen",
            "Robert De Niro",
            "Dominic Purcell"
        ],
        "September 10, 2011",
        "United States",
        [
            new Showing("Fontana", "24 May", "17:00", "350RSD"),
            new Showing("Academy 28", "26 May", "22:00", "300RSD")
        ],
        "KillerElite.jpg",
        "killerElite.html",
        4

    ),
    new Film(
        "Rocky",
        "John G. Avildsen",
        "119 minutes",
        [
            "Sylvester Stallone",
            "Talia Shire",
            "Burt Young",
            "Carl Weathers",
            "Burgess Meredith"
        ],
        "November 21, 1976",
        "United States",
        [
            new Showing("Fontana", "27 May", "16:30", "400RSD"),
            new Showing("Sava Center", "1 June", "19:00", "500RSD")
        ],
        "rocky.jpg",
        "rocky.html",
        5,
        ["rocky.jpg"],
        "https://www.youtube.com/embed/3VUblDwa648",
        "opis",
        "rocky-sr.html"

    ),
    new Film(
        "Terminator",
        "James Cameron",
        "107 minutes",
        [
            "Arnold Schwarzenegger",
            "Michael Biehn",
            "Linda Hamilton",
            "Paul Winfield",
        ],
        "October 26, 1984",
        "United States",
        [
            new Showing("Fontana", "27 May", "16:30", "400RSD"),
            new Showing("Sava Center", "1 June", "19:00", "500RSD")
        ],
        "terminator.jpg",
        "terminator.html",
        6
    )

]

/* prikazuje filmove na stranici page(0-prva ili 1-druga)
    prema rasporedu order
*/
function showFilms(page) {
    if (typeof (Storage) !== "undefined") {
        if (sessionStorage.getItem("order") === null) {
            // pocetni raspored
            sessionStorage.setItem("order", [0, 1, 2, 3, 4, 5, 6].toString());
        }
        order = sessionStorage.getItem("order").split(",");
    } else {
        alert("No session strage");
        return;
    }
    for (j = page * 4; j < page * 4 + 4; j++) {
        if (order[j] < films.length) {
            films[order[j]].showFilmm(j % 4 + 1);
        } else {
            // uklanja visak div-ova
            document.getElementById("film" + (j % 4 + 1)).className += " d-none";
        }
    }
}

/* sortiranje filmova, novi raspored se cuva u nizu order koji se cuva u session storage */
function sort(type, page) {
    order = sessionStorage.getItem("order").split(",");
    console.log("pre:" + order);
    switch (type) {
        case 0:
            order.sort(SortByName);
            break;
        case 1:
            break;
        case 2:
            order.sort(SortByPopularity);
            break;
        default:
            break;
    }
    console.log("posle: " + order);
    sessionStorage.setItem("order", order.toString());
    showFilms(page)
}

function SortByName(f1, f2) {
    // console.log(f1 + " " + f2 + "\n");
    order = sessionStorage.getItem("storage").split(",");
    return films[order[parseInt(f1)]].name.localeCompare(films[order[parseInt(f2)]].name);
}

function SortByShowing(film1, film2) {

}

function SortByPopularity(film1, film2) {
    return films[order[parseInt(f1)]].getPopularity - films[order[parseInt(f2)]].getPopularity();
}

/* prikazuje oomiljene filmove, spisak filmova cita iz niza favourites iz lovalStorage-a */
function showFavourites() {
    var favourites;
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem("favourites") === null) {
            return
        }
        favourites = localStorage.getItem("favourites").split(",");
    } else {
        alert("No session strage");
        return;
    }
    var html = "<div class=\"row\"><div class=\"col\"><h2 class=\"text-blue\">Favourites</h2></div></div>";
    for (j = 0; j < favourites.length; j++) {
        if (j % 4 == 0) {
            html += "<div class=\"row\">"
        }
        if (parseInt(favourites[j]) < films.length) {
            var film = films[parseInt(favourites[j])];
            html += "<div class=\"col-6 col-md-3 mb-3\"><a href=html_films/";
            html += film.link;
            html += "><img class=\"img-fluid\" src=\"images/films/" + film.img + "\" alt=\" " + film.name + "\" >";
            html += "</a></div>";
        }
        if (j % 4 == 0) {
            html += "</div>"
        }
    }
    document.getElementById("films").innerHTML = html;
}