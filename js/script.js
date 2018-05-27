//$(function () {

    function initMap(a, b) {

        //var location = new google.maps.LatLng(50.0875726, 14.4189987);
        var location = new google.maps.LatLng(a, b);

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

    //google.maps.event.addDomListener(window, 'load', initMap);
//});

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
        document.getElementById("popularity").innerHTML = num;
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
    constructor(name, director, time, actors, releaseDate, country, showings, img, link, id, gallery, youtube, desc, languageLink, long, lat) {
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
        this.long = long; /* geografske sirina i duzina*/
        this.lat = lat;
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
        document.getElementById("favourite" + id).setAttribute("onClick", "addToFavourites(" + this.id + ", heart" + id + ")");
        document.getElementById("heart" + id).className = (this.isFavourite() ? "fas fa-heart" : "far fa-heart");

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

    minShowing() {
        var niz = this.showings;
        niz.sort(this.sortShowings);
        return niz[0].place;
    }
    sortShowings(s1, s2) {
        return s1.place.localeCompare(s2.place);
    }

    isFavourite() {
        if (typeof (Storage) !== undefined) {
            var fav = localStorage.getItem("favourites");
            if (fav === null) {
                return false;
            } else {
                fav = fav.split(",");
                if (parseInt(fav[this.id]) == 0) { // nije omiljeni
                    return false;
                } else { // jeste omiljeni
                    return true;
                }
            }
            localStorage.setItem("favourites", fav);
        } else {
            alert("no local storage");
        }
        return false;
    }
}
/* prikazuje film na posebnoj stranici */

function showFilm(id, sr) {
    var film = sr ? films_sr[id] : films[id];
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
    document.getElementById("favourite").innerHTML = "<button type=\"button\" class=\"btn btn-outline-blue mt-3 ml-3\"  onclick=\"addToFavourites(" +
        film.id + ", heart)\"><i class=\" " + (film.isFavourite() ? "fas" : "far") +
        " fa-heart\" id=\"heart\"></i></button>";
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

    initMap(film.long, film.lat);
}

/* films sa id-em id dodaje u omiljene 
    to je niz favourites u lovalStorage-u
*/
function addToFavourites(id, divId) {
    if (typeof (Storage) !== undefined) {
        var fav = localStorage.getItem("favourites");
        if (fav === null) {
            fav = [0, 0, 0, 0, 0, 0, 0];
        } else {
            fav = fav.split(",");
            if (parseInt(fav[id]) == 0) { // postaje omiljeni
                fav[id] = 1;
                divId.className = "fas fa-heart"
            } else { // bio je omiljeni, vise nije
                fav[id] = 0;
                divId.className = "far fa-heart"
            }
        }
        localStorage.setItem("favourites", fav);
    } else {
        alert("no local storage");
    }
}




/* prikazuje filmove na stranici page(0-prva ili 1-druga)
    prema rasporedu order
*/
function showFilms(page, sr) {
    var order = "";
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
    if (sr) {
        for (j = page * 4; j < page * 4 + 4; j++) {
            if (order[j] < films_sr.length) {
                films_sr[order[j]].showFilmm(j % 4 + 1);
            } else {
                // uklanja visak div-ova
                document.getElementById("film" + (j % 4 + 1)).className += " d-none";
            }
        }
    } else {
        for (j = page * 4; j < page * 4 + 4; j++) {
            if (order[j] < films.length) {
                films[order[j]].showFilmm(j % 4 + 1);
            } else {
                // uklanja visak div-ova
                document.getElementById("film" + (j % 4 + 1)).className += " d-none";
            }
        }
    }

}

/* sortiranje filmova, novi raspored se cuva u nizu order koji se cuva u session storage */
function sort(type, page, sr) {
    var order = sessionStorage.getItem("order").split(",");
    console.log("pre:" + order);
    switch (type) {
        case 0:
            order.sort(SortByName);
            break;
        case 1:
            order.sort(SortByShowing);
            break;
        case 2:
            order.sort(SortByPopularity);
            break;
        default:
            break;
    }
    console.log("posle: " + order);
    sessionStorage.setItem("order", order.toString());
    showFilms(page, sr);
}

function SortByName(f1, f2) {
    // console.log(f1 + " " + f2 + "\n");
    return films[parseInt(f1)].name.localeCompare(films[parseInt(f2)].name);
}

function SortByShowing(f1, f2) {
    return films[parseInt(f1)].minShowing().localeCompare(films[parseInt(f2)].minShowing());
}

function SortByPopularity(f1, f2) {
    return films[parseInt(f2)].getPopularity() - films[parseInt(f1)].getPopularity();
}

/* prikazuje oomiljene filmove, spisak filmova cita iz niza favourites iz lovalStorage-a */
function showFavourites(sr) {
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
    var html = (sr ? "<div class=\"row\"><div class=\"col\"><h2 class=\"text-blue\">Omiljeni filmovi</h2></div></div>" :
    "<div class=\"row\"><div class=\"col\"><h2 class=\"text-blue\">Favourites</h2></div></div>");
    var open = false;

    var cnt = 0;
    for (j = 0; j < favourites.length; j++) {

        if (favourites[j] == 0) {
            continue;
        }

        if (cnt % 4 == 0) {
            html += "<div class=\"row\">"
        }
        if (j < sr ? films_sr.length : films.length) {
            var film = sr ? films_sr[j] : films[j];
            html += "<div class=\"col-6 col-md-3 mb-3\"><a href=html_films/";
            html += film.link;
            html += "><h4 class=\"text-blue text-center\">" + film.name + "</h4><img class=\"img-fluid\" src=\"images/films/" + film.img + "\" alt=\" " + film.name + "\" >";
            html += "</a></div>";
        }
        if (cnt % 4 == 3) {
            html += "</div>"
        }
        cnt++;
    }

    if (cnt % 4 == 0) {
        html += "</div>"
    }
    document.getElementById("films").innerHTML = html;
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
        ["BladeRunner2049.png"],
        "https://www.youtube.com/embed/gCcx85zbxz4",
        "<p>In 2049, replicants (described as \"bioengineered humans\") are slaves. K, a replicant, works for the Los Angeles Police Department (LAPD) as a \"Blade Runner\", an officer who hunts and \"retires\" (kills) rogue replicants. At a protein farm, he retires Sapper Morton and finds a box buried under a tree. The box contains the remains of a female replicant who died during a caesarean section, demonstrating that replicants can reproduce sexually, previously thought impossible. K\'s superior, Lieutenant Joshi, is fearful that this could lead to a war between humans and replicants. She orders K to find and retire the replicant child to hide the truth.</p> <p>K visits the Wallace Corporation headquarters (the successor-in-interest in the manufacturing of replicants to the Tyrell Corporation, which went out of business) where the deceased female is identified from DNA archives as Rachael, an experimental replicant designed by Dr. Tyrell. K learns of Rachael\'s romantic ties with former blade runner Rick Deckard. Wallace CEO Niander Wallace wants to discover the secret to replicant reproduction to expand interstellar colonization. He sends his replicant enforcer Luv to steal Rachael\'s remains from LAPD headquarters and follow K to Rachael\'s child.</p><p>At Morton\'s farm, K sees the date 6-10-21 carved into the tree trunk and recognizes it from a childhood memory of a wooden toy horse. Because replicants\' memories are artificial, K\'s holographic AI girlfriend Joi believes this is evidence that K was born, not created. K burns down the farm and leaves. He searches the LAPD records and discovers twins born on that date with identical DNA aside from the sex chromosome but only the boy is listed as alive. K tracks the child to an orphanage in ruined San Diego, but discovers the records from that year to be missing. K recognizes the orphanage from his memories and finds the toy horse where he remembers hiding it.</p <p>Dr. Ana Stelline, a designer of replicant memories, confirms that his memory of the orphanage is real, leading K to conclude that he is Rachael\'s son. At LAPD headquarters, K fails a post-traumatic baseline test, marking him as a rogue replicant; he lies to Joshi by implying he killed the replicant child. Joshi gives K 48 hours to disappear. At Joi\'s request, K transfers her to a mobile emitter, an emanator. He has the toy horse analyzed, revealing traces of radiation that lead him to the ruins of Las Vegas. He finds Deckard, who reveals that he is the father of Rachael\'s child and that he scrambled the birth records to protect the child\'s identity; Deckard left the child in the custody of the replicant freedom movement.</p><p>After killing Joshi, Luv tracks K to Deckard\'s hiding place in Las Vegas. She kidnaps Deckard, destroys Joi and leaves K to die. The replicant freedom movement rescues K. Their leader Freysa informs him that Rachael\'s child is female and he is not Rachael\'s son. To prevent Deckard from leading Wallace to the child or the freedom movement, Freysa asks K to kill Deckard for the greater good of all replicants.</p <p> Luv brings Deckard to Wallace Co. headquarters to meet Niander Wallace. He offers Deckard a clone of Rachael for revealing what he knows. Deckard refuses and Luv kills the clone. As Luv is transporting Deckard to a ship to take him off-world to be interrogated, K intercepts and kills Luv but is severely injured in the fight. He stages Deckard\'s death to protect him from Wallace and the rogue replicants and leads Deckard to Stelline\'s office, having deduced that she is his daughter and that the memory of the toy horse is hers. As Deckard reunites with Stelline, K dies peacefully from his wounds. </p>",
        "bladerunner2049-sr.html"
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
        2,
        ["Creed.jpg"],
        "https://www.youtube.com/embed/Uv554B7YH",
        "<p>In 1998, Adonis \"Donnie\" Johnson, the son of an extramarital lover of former heavyweight champion Apollo Creed, is serving time in a Los Angeles youth detention center when Creed\'s widow, Mary Anne, visits and offers to take him in.</p> <p>Seventeen years later, Donnie walks away from his job at a securities firm to pursue his dream of becoming a professional boxer. Mary Anne vehemently opposes his aspiration, remembering how her husband was killed in the ring against Ivan Drago thirty years ago.</p> <p>[a] Donnie auditions at the Los Angeles\'s elite Delphi Boxing Academy, managed by family friend Tony \"Little Duke\" Burton, son of Apollo and Rocky\'s trainer Tony \"Duke\" Evers, but is turned down. Undaunted, Donnie travels to Philadelphia in hopes of getting in touch with his father\'s old friend and rival, former heavyweight champion, Rocky Balboa.</p> <p> Donnie meets Rocky at Rocky\'s Italian restaurant, Adrian\'s, named in honor of his deceased wife, and asks Rocky to become his trainer. Rocky is reluctant to return to boxing, having already made a one-off comeback[b] at a very advanced age despite having suffered brain trauma[c] during his career as a fighter. However, he eventually agrees. Donnie asks him about the \"secret third fight\" between him and Apollo just after Apollo helped Rocky regain the heavyweight title,[d] and Rocky reveals that Apollo won. Donnie trains at the Front Street Gym, with several of Rocky\'s longtime friends as cornermen. He also finds a love interest in Bianca, an up-and-coming singer and songwriter.Donnie, now known as \"Hollywood Donnie\", defeats a local fighter, and word gets out that he is Creed\'s illegitimate son. Rocky receives a call from the handlers of world light heavyweight champion \"Pretty\" Ricky Conlan, who is being forced into retirement by an impending prison term. He offers to make Donnie his final challenger—provided that he change his name to Adonis Creed. Donnie balks at first, wanting to forge his own legacy. However, he eventually agrees.While helping Donnie train, Rocky learns he has non-Hodgkin\'s lymphoma. He is unwilling to undergo chemotherapy, remembering that it was not enough to save Adrian when she had ovarian cancer. His diagnosis and the fact that his best friend and brother-in-law Paulie Pennino—Adrian\'s brother—has now died in addition to Adrian, Apollo, and his old trainer, Mickey Goldmill, further force him to confront his own mortality. Seeing Rocky shaken, Donnie urges him to seek treatment.Donnie fights Conlan at Goodison Park in Conlan\'s hometown of Liverpool, and many parallels emerge between the bout that ensues and Apollo and Rocky\'s first fight[e] forty years earlier. First, before entering the ring, Donnie receives a present from Mary Anne — new American flag trunks similar to the ones Apollo and later Rocky wore. Additionally, to the surprise of nearly everyone, Donnie gives Conlan all he can handle. Conlan knocks Donnie down, but Donnie recovers to knock Conlan down for the first time in his career. Donnie goes the distance, but Conlan wins on a split decision (just as Apollo retained his title by split decision against Rocky). However, Donnie has won the respect of Conlan and the crowd; as Max Kellerman puts it while calling the fight for HBO, \"Conlan won the fight, but Creed won the night.\" Conlan tells Donnie that he is the future of the light heavyweight division.The film ends with Donnie and a frail but improving Rocky climbing the 72 steps before the entrance of the Philadelphia Museum of Art.</p>",
        "creed-sr.html", 
        22233, 
        44432
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
        3,
        ["titanic.jpg"],
        "https://www.youtube.com/embed/2e-eXJ6HgkQ",
        "<p> In 1996, treasure hunter Brock Lovett and his team aboard the research vessel Akademik Mstislav Keldysh search the wreck of RMS Titanic for a necklace with a rare diamond, the Heart of the Ocean. They recover a safe containing a drawing of a young woman wearing only the necklace dated April 14, 1912, the day the ship struck the iceberg.[Note 1] Rose Dawson Calvert, the woman in the drawing, is brought aboard Keldysh and tells Lovett of her experiences aboard Titanic.In 1912 Southampton, 17-year-old first-class passenger Rose DeWitt Bukater, her fiancé Cal Hockley, and her mother Ruth board the luxurious Titanic. Ruth emphasizes that Rose\'s marriage will resolve their family\'s financial problems and retain their high-class persona. Distraught over the engagement, Rose considers suicide by jumping from the stern; Jack Dawson, a penniless artist, intervenes and discourages her. Discovered with Jack, Rose tells a concerned Cal that she was peering over the edge and Jack saved her from falling. When Cal becomes indifferent, she suggests to him that Jack deserves a reward. He invites Jack to dine with them in first class the following night. Jack and Rose develop a tentative friendship, despite Cal and Ruth being wary of him. Following dinner, Rose secretly joins Jack at a party in third class.Aware of Cal and Ruth\'s disapproval, Rose rebuffs Jack\'s advances, but realizes she prefers him over Cal. After rendezvousing on the bow at sunset, Rose takes Jack to her state room; at her request, Jack sketches Rose posing nude wearing Cal\'s engagement present, the Heart of the Ocean necklace. They evade Cal\'s bodyguard, Mr. Lovejoy, and have sex in an automobile inside the cargo hold. On the forward deck, they witness a collision with an iceberg and overhear the officers and designer discussing its seriousness.Cal discovers Jack\'s sketch of Rose and an insulting note from her in his safe along with the necklace. When Jack and Rose attempt to inform Cal of the collision, Lovejoy slips the necklace into Jack\'s pocket and he and Cal accuse him of theft. Jack is arrested, taken to the master-at-arms\' office, and handcuffed to a pipe. Cal puts the necklace in his own coat pocket.With the ship sinking, Rose flees Cal and her mother, who has boarded a lifeboat, and frees Jack. On the boat deck, Cal and Jack encourage her to board a lifeboat; Cal claims he can get himself and Jack off safely. After Rose boards one, Cal tells Jack the arrangement is only for himself. As her boat lowers, Rose decides that she cannot leave Jack and jumps back on board. Cal takes his bodyguard\'s pistol and chases Rose and Jack into the flooding first-class dining saloon. After using up his ammunition, Cal realizes he gave his coat and consequently the necklace to Rose. He later boards a collapsible lifeboat by carrying a lost child. </p>",
        "titanic-sr.html"
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
        4,
        ["KillerElite.jpg"],
        "https://www.youtube.com/embed/lft48yFsHGU",
        "<p>In 1980, mercenaries Danny Bryce (Jason Statham), Hunter (Robert De Niro), Davies (Dominic Purcell), and Meier (Aden Young) are in Mexico to assassinate a man. Danny is shot when he becomes distracted after realizing he has killed the man in front of the target\'s young daughter. Affected by this, Danny retires and returns to his native Australia.</p><p>The following year, Danny is summoned to Oman to meet The Agent (Adewale Akinnuoye-Agbaje). He learns that Hunter failed a $6 million job. If Danny does not complete Hunter\'s mission, Hunter will be executed. Sheikh Amr, a deposed king of a small region of Oman, wants Danny to kill three former SAS troopers—Steven Harris (Lachy Hulme), Steven Cregg (Grant Bowler), and Simon McCann (Daniel Roberts)—for killing his three eldest sons during the Dhofar Rebellion. Danny must videotape their confessions and make their deaths look like accidents, all before the terminally ill sheikh dies. This will allow the sheikh\'s fourth son, Bakhait (Firass Dirani), to regain control of his father\'s desert region. Davies and Meier agree to help Danny for a share of the money.</p><p>Danny and Meier sneak into Harris\'s house. After Harris confesses on videotape, they take him to the bathroom, intending to make it look like he slipped and hit his head. However, Harris\'s girlfriend knocks on the door. While Harris and Meier are distracted, Harris attempts to break free, causing Meier to kill him.</p><p>In England, Davies questions bar patrons about former SAS members. This is reported to the Feather Men, a secret society of former operatives protecting their own. Their head enforcer, Spike Logan (Clive Owen), is sent to investigate.</p><p>Davies discovers Cregg preparing for a long nighttime march in wintry weather at the Brecon Beacons mountain range. Danny infiltrates the base, disguised in uniform, and drugs Cregg\'s coffee. Danny follows Cregg on the march and makes him confess before the drug sends him into shock to die of hypothermia.</p><p>For their last target, their plan is to crash a remote-controlled truck into McCann\'s car. With the help of the inexperienced Jake (Michael Dorman), Meier kills McCann; however, Logan and his men were watching over McCann. A gunfight ensues, and Jake accidentally kills Meier. Danny and Davies part ways. Davies is tracked down by Logan\'s men, and is hit by a truck and killed while trying to escape.</p><p>Danny returns to Oman and gives the sheikh the last confession, which he has faked. Hunter is released, while Danny heads back to Australia and reunites with Anne (Yvonne Strahovski), a childhood acquaintance. Soon, he is informed by the Agent that there is one last man who participated in the sheikh\'s sons\' murders and that this man, Ranulph Fiennes, is about to release a book about his experiences in the SAS.</p><p>Danny sends Anne to France so Hunter can protect her. The sheikh’s son confirms that Harris was innocent. Logan, meanwhile, traces Danny through the Agent and sends a team to protect the author, but Jake distracts them, allowing Danny to shoot Fiennes. He only wounds the man, however, taking pictures that appear to show him dead. Logan captures Danny, taking him to an abandoned warehouse, but then a government agent arrives and reveals that the British government is behind the events because of the sheikh\'s valuable oil reserves. A three-way battle ensues, with Danny escaping and Logan shooting the government agent.</p><p>In Paris, the Agent tries to kidnap Anne for ransom, but Hunter beats the henchman and shoots the Agent in the leg. Hunter seems threatening at first, but spares his life.</p><p>Danny and Hunter head to Oman to give the sheikh the pictures. However, Logan arrives first, tells the sheikh the pictures are fake and then stabs him to death. The sheikh\'s son does not care; he gives Logan the money. Hunter spots Logan leaving, and they chase after him, along with the sheikh\'s men.</p><p>After stopping the sheikh\'s men, Danny and Hunter confront Logan on a desert road. Hunter takes some of the money for his expenses and his family. They leave the remainder, telling Logan that he will need it to start a new life after killing the government agent and acting against the wishes of the Feather Men and the British government. Danny says that it is over for him and that Logan must make up his own mind what to do. Danny reunites with Anne.</p>",
        "killerelite-sr.html"
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
        "<p>In late 1975, the heavyweight boxing world champion, Apollo Creed, announces plans to hold a title bout in Philadelphia during the upcoming United States Bicentennial. However, he is informed five weeks from the fight date that his scheduled opponent is unable to compete due to an injured hand. With all other potential replacements booked up or otherwise unavailable, Creed decides to spice things up by giving a local contender a chance to challenge him. He settles in on Rocky Balboa, an aspiring southpaw boxer from an Italian neighborhood of Philadelphia, known by the nickname \"The Italian Stallion\".</p><p>Rocky meets with promoter Miles Jergens, unexpectedly presuming Creed is seeking local sparring partners. Reluctant at first, Rocky eventually agrees to the fight which will pay him $150,000. After several weeks of training, using whatever he can find, including meat carcasses as punching bags, Rocky accepts an offer of assistance from former boxer Mickey \"Mighty Mick\" Goldmill, a respected trainer and former bantamweight fighter from the 1920s, who always criticized Rocky for wasting his potential.</p><p>Meanwhile, Rocky meets Adrian Pennino, who is working part-time at the J&M Tropical Fish pet store. He begins to build a romantic relationship with Adrian, culminating in a kiss. Adrian\'s brother, Paulie, becomes jealous of Rocky\'s success, but Rocky calms him by agreeing to advertise his meatpacking business before the upcoming fight. The night before the fight, Rocky begins to lose confidence after touring the arena. He confesses to Adrian that he does not expect to win, but is content to go the distance against Creed and prove himself to everyone.</p><p>On New Year\'s Day, the fight is held, with Creed making a dramatic entrance dressed as George Washington and then Uncle Sam. Taking advantage of his overconfidence, Rocky knocks him down in the first round—the first time that Creed has ever been knocked down. Humiliated, Creed takes Rocky more seriously for the rest of the fight, though his ego never fully fades. The fight goes on for the full fifteen rounds, with both combatants sustaining various injuries. As the fight progresses, Creed\'s superior skill is countered by Rocky\'s apparently unlimited ability to absorb punches, and his dogged refusal to go down. As the final round bell sounds, with both fighters locked in each other\'s arms, they promise to each other that there will be no rematch.</p><p>After the fight, the sportscasters and the audience go wild. Jergens announces over the loudspeaker that the fight was \"the greatest exhibition of guts and stamina in the history of the ring\", and Rocky calls out repeatedly for Adrian, who runs down and comes into the ring as Paulie distracts arena security. As Jergens declares Creed the winner by virtue of a split decision (8:7, 7:8, 9:6), Adrian and Rocky embrace and profess their love to each other, not caring about the result of the fight.</p>",
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
        6,
        ["terminator.jpg"],
        "https://www.youtube.com/embed/k64P4l2Wmeg",
        "<p>In 1984 Los Angeles, a cyborg assassin known as a Terminator arrives from 2029 and steals guns and clothes. Shortly afterward, Kyle Reese, a human soldier from 2029, arrives. He steals clothes and evades the police. The Terminator begins systematically killing women named Sarah Connor, whose addresses he finds in the telephone directory. He tracks the last Sarah Connor to a nightclub, but Kyle rescues her. The pair steal a car and escape with the Terminator pursuing them in a police car.</p><p>As they hide in a parking lot, Kyle explains to Sarah that an artificial intelligence defense network, known as Skynet, will become self-aware in the near future and initiate a nuclear holocaust. Sarah's future son John will rally the survivors and lead a resistance movement against Skynet and its army of machines. With the Resistance on the verge of victory, Skynet sent a Terminator back in time to kill Sarah before John is born, to prevent the formation of the Resistance. The Terminator is an efficient killing machine with a powerful metal endoskeleton and an external layer of living tissue that makes it appear human.</p><p>Kyle and Sarah are apprehended by police after another encounter with the Terminator. Criminal psychologist Dr. Silberman concludes that Kyle is paranoid and delusional. The Terminator repairs his body and attacks the police station, killing many police officers in his attempt to locate Sarah. Kyle and Sarah escape, steal another car and take refuge in a motel, where they assemble pipe bombs and plan their next move. Kyle admits that he has been in love with Sarah since John gave him a photograph of her, and they have sex.</p><p>The Terminator kills Sarah's mother and impersonates her when Sarah, unaware of the Terminator's ability to mimic victims, attempts to contact her via telephone. When they realize he has reacquired them, they escape in a pickup truck while he chases them on a motorcycle. In the ensuing chase, Kyle is wounded by gunfire while throwing pipe bombs at the Terminator. Enraged‚ Sarah knocks the Terminator off his motorcycle but loses control of the truck, which flips over. The Terminator hijacks a tank truck and attempts to run down Sarah, but Kyle slides a pipe bomb onto the tanker, causing an explosion that burns the flesh from the Terminator's endoskeleton. It pursues them to a factory, where Kyle activates machinery to confuse the Terminator. He jams his final pipe bomb into the Terminator's abdomen, blowing the Terminator apart, injuring Sarah, and killing himself. The Terminator's still functional torso reactivates and grabs Sarah. She breaks free and lures it into a hydraulic press, crushing it.</p><p>Months later, a pregnant Sarah is traveling through Mexico, recording audio tapes to pass on to her unborn son, John. She debates whether to tell him that Kyle is his father. At a gas station, a boy takes a Polaroid photograph of her which she purchases—the same photograph that John will eventually give to Kyle.</p>",
        "terminator-sr.html"
    )
]


films_sr = [
    new Film(
        "Aftermath",
        "Elliot Lester",
        "92 minuta",
        [
            "Arnold Schwarzenegger",
            "Scoot McNairy",
            "Maggie Grace",
            "Martin Donovan"
        ],
        "April 7, 2017",
        "SAD",
        [
            new Showing("Kinoteka", "27 Maj", "16:30", "350RSD"),
            new Showing("Centar Kulture Beograd", "1 Jun", "14:00", "300RSD")
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
        "163 minuta",
        [
            "Ryan Gosling",
            "Harrison Ford",
            "Ana de Armas",
            "Sylvia Hoeks",
            "Lennie James",
            "Dave Bautista",
            "Jared Leto"
        ],
        "Oktobar 3, 2017",
        "SAD",
        [
            new Showing("Fontana", "24 Maj", "19:30", "300RSD"),
            new Showing("Cineplexx TC Usce", "25 Maj", "22:00", "350RSD"),
            new Showing("Kultirni Centar Beograda", "26 Maj", "18:00", "400RSD")
        ],
        "BladeRunner2049.png",
        "bladerunner2049.html",
        1,
        ["BladeRunner2049.png"],
        "https://www.youtube.com/embed/gCcx85zbxz4",
        "<p>In 2049, replicants (described as \"bioengineered humans\") are slaves. K, a replicant, works for the Los Angeles Police Department (LAPD) as a \"Blade Runner\", an officer who hunts and \"retires\" (kills) rogue replicants. At a protein farm, he retires Sapper Morton and finds a box buried under a tree. The box contains the remains of a female replicant who died during a caesarean section, demonstrating that replicants can reproduce sexually, previously thought impossible. K\'s superior, Lieutenant Joshi, is fearful that this could lead to a war between humans and replicants. She orders K to find and retire the replicant child to hide the truth.</p> <p>K visits the Wallace Corporation headquarters (the successor-in-interest in the manufacturing of replicants to the Tyrell Corporation, which went out of business) where the deceased female is identified from DNA archives as Rachael, an experimental replicant designed by Dr. Tyrell. K learns of Rachael\'s romantic ties with former blade runner Rick Deckard. Wallace CEO Niander Wallace wants to discover the secret to replicant reproduction to expand interstellar colonization. He sends his replicant enforcer Luv to steal Rachael\'s remains from LAPD headquarters and follow K to Rachael\'s child.</p><p>At Morton\'s farm, K sees the date 6-10-21 carved into the tree trunk and recognizes it from a childhood memory of a wooden toy horse. Because replicants\' memories are artificial, K\'s holographic AI girlfriend Joi believes this is evidence that K was born, not created. K burns down the farm and leaves. He searches the LAPD records and discovers twins born on that date with identical DNA aside from the sex chromosome but only the boy is listed as alive. K tracks the child to an orphanage in ruined San Diego, but discovers the records from that year to be missing. K recognizes the orphanage from his memories and finds the toy horse where he remembers hiding it.</p <p>Dr. Ana Stelline, a designer of replicant memories, confirms that his memory of the orphanage is real, leading K to conclude that he is Rachael\'s son. At LAPD headquarters, K fails a post-traumatic baseline test, marking him as a rogue replicant; he lies to Joshi by implying he killed the replicant child. Joshi gives K 48 hours to disappear. At Joi\'s request, K transfers her to a mobile emitter, an emanator. He has the toy horse analyzed, revealing traces of radiation that lead him to the ruins of Las Vegas. He finds Deckard, who reveals that he is the father of Rachael\'s child and that he scrambled the birth records to protect the child\'s identity; Deckard left the child in the custody of the replicant freedom movement.</p><p>After killing Joshi, Luv tracks K to Deckard\'s hiding place in Las Vegas. She kidnaps Deckard, destroys Joi and leaves K to die. The replicant freedom movement rescues K. Their leader Freysa informs him that Rachael\'s child is female and he is not Rachael\'s son. To prevent Deckard from leading Wallace to the child or the freedom movement, Freysa asks K to kill Deckard for the greater good of all replicants.</p <p> Luv brings Deckard to Wallace Co. headquarters to meet Niander Wallace. He offers Deckard a clone of Rachael for revealing what he knows. Deckard refuses and Luv kills the clone. As Luv is transporting Deckard to a ship to take him off-world to be interrogated, K intercepts and kills Luv but is severely injured in the fight. He stages Deckard\'s death to protect him from Wallace and the rogue replicants and leads Deckard to Stelline\'s office, having deduced that she is his daughter and that the memory of the toy horse is hers. As Deckard reunites with Stelline, K dies peacefully from his wounds. </p>",
        "bladerunner2049-sr.html"
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
        2,
        ["Creed.jpg"],
        "https://www.youtube.com/embed/Uv554B7YH",
        "<p>In 1998, Adonis \"Donnie\" Johnson, the son of an extramarital lover of former heavyweight champion Apollo Creed, is serving time in a Los Angeles youth detention center when Creed\'s widow, Mary Anne, visits and offers to take him in.</p> <p>Seventeen years later, Donnie walks away from his job at a securities firm to pursue his dream of becoming a professional boxer. Mary Anne vehemently opposes his aspiration, remembering how her husband was killed in the ring against Ivan Drago thirty years ago.</p> <p>[a] Donnie auditions at the Los Angeles\'s elite Delphi Boxing Academy, managed by family friend Tony \"Little Duke\" Burton, son of Apollo and Rocky\'s trainer Tony \"Duke\" Evers, but is turned down. Undaunted, Donnie travels to Philadelphia in hopes of getting in touch with his father\'s old friend and rival, former heavyweight champion, Rocky Balboa.</p> <p> Donnie meets Rocky at Rocky\'s Italian restaurant, Adrian\'s, named in honor of his deceased wife, and asks Rocky to become his trainer. Rocky is reluctant to return to boxing, having already made a one-off comeback[b] at a very advanced age despite having suffered brain trauma[c] during his career as a fighter. However, he eventually agrees. Donnie asks him about the \"secret third fight\" between him and Apollo just after Apollo helped Rocky regain the heavyweight title,[d] and Rocky reveals that Apollo won. Donnie trains at the Front Street Gym, with several of Rocky\'s longtime friends as cornermen. He also finds a love interest in Bianca, an up-and-coming singer and songwriter.Donnie, now known as \"Hollywood Donnie\", defeats a local fighter, and word gets out that he is Creed\'s illegitimate son. Rocky receives a call from the handlers of world light heavyweight champion \"Pretty\" Ricky Conlan, who is being forced into retirement by an impending prison term. He offers to make Donnie his final challenger—provided that he change his name to Adonis Creed. Donnie balks at first, wanting to forge his own legacy. However, he eventually agrees.While helping Donnie train, Rocky learns he has non-Hodgkin\'s lymphoma. He is unwilling to undergo chemotherapy, remembering that it was not enough to save Adrian when she had ovarian cancer. His diagnosis and the fact that his best friend and brother-in-law Paulie Pennino—Adrian\'s brother—has now died in addition to Adrian, Apollo, and his old trainer, Mickey Goldmill, further force him to confront his own mortality. Seeing Rocky shaken, Donnie urges him to seek treatment.Donnie fights Conlan at Goodison Park in Conlan\'s hometown of Liverpool, and many parallels emerge between the bout that ensues and Apollo and Rocky\'s first fight[e] forty years earlier. First, before entering the ring, Donnie receives a present from Mary Anne — new American flag trunks similar to the ones Apollo and later Rocky wore. Additionally, to the surprise of nearly everyone, Donnie gives Conlan all he can handle. Conlan knocks Donnie down, but Donnie recovers to knock Conlan down for the first time in his career. Donnie goes the distance, but Conlan wins on a split decision (just as Apollo retained his title by split decision against Rocky). However, Donnie has won the respect of Conlan and the crowd; as Max Kellerman puts it while calling the fight for HBO, \"Conlan won the fight, but Creed won the night.\" Conlan tells Donnie that he is the future of the light heavyweight division.The film ends with Donnie and a frail but improving Rocky climbing the 72 steps before the entrance of the Philadelphia Museum of Art.</p>",
        "creed-sr.html"
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
        3,
        ["titanic.jpg"],
        "https://www.youtube.com/embed/2e-eXJ6HgkQ",
        "<p> In 1996, treasure hunter Brock Lovett and his team aboard the research vessel Akademik Mstislav Keldysh search the wreck of RMS Titanic for a necklace with a rare diamond, the Heart of the Ocean. They recover a safe containing a drawing of a young woman wearing only the necklace dated April 14, 1912, the day the ship struck the iceberg.[Note 1] Rose Dawson Calvert, the woman in the drawing, is brought aboard Keldysh and tells Lovett of her experiences aboard Titanic.In 1912 Southampton, 17-year-old first-class passenger Rose DeWitt Bukater, her fiancé Cal Hockley, and her mother Ruth board the luxurious Titanic. Ruth emphasizes that Rose\'s marriage will resolve their family\'s financial problems and retain their high-class persona. Distraught over the engagement, Rose considers suicide by jumping from the stern; Jack Dawson, a penniless artist, intervenes and discourages her. Discovered with Jack, Rose tells a concerned Cal that she was peering over the edge and Jack saved her from falling. When Cal becomes indifferent, she suggests to him that Jack deserves a reward. He invites Jack to dine with them in first class the following night. Jack and Rose develop a tentative friendship, despite Cal and Ruth being wary of him. Following dinner, Rose secretly joins Jack at a party in third class.Aware of Cal and Ruth\'s disapproval, Rose rebuffs Jack\'s advances, but realizes she prefers him over Cal. After rendezvousing on the bow at sunset, Rose takes Jack to her state room; at her request, Jack sketches Rose posing nude wearing Cal\'s engagement present, the Heart of the Ocean necklace. They evade Cal\'s bodyguard, Mr. Lovejoy, and have sex in an automobile inside the cargo hold. On the forward deck, they witness a collision with an iceberg and overhear the officers and designer discussing its seriousness.Cal discovers Jack\'s sketch of Rose and an insulting note from her in his safe along with the necklace. When Jack and Rose attempt to inform Cal of the collision, Lovejoy slips the necklace into Jack\'s pocket and he and Cal accuse him of theft. Jack is arrested, taken to the master-at-arms\' office, and handcuffed to a pipe. Cal puts the necklace in his own coat pocket.With the ship sinking, Rose flees Cal and her mother, who has boarded a lifeboat, and frees Jack. On the boat deck, Cal and Jack encourage her to board a lifeboat; Cal claims he can get himself and Jack off safely. After Rose boards one, Cal tells Jack the arrangement is only for himself. As her boat lowers, Rose decides that she cannot leave Jack and jumps back on board. Cal takes his bodyguard\'s pistol and chases Rose and Jack into the flooding first-class dining saloon. After using up his ammunition, Cal realizes he gave his coat and consequently the necklace to Rose. He later boards a collapsible lifeboat by carrying a lost child. </p>",
        "titanic-sr.html"
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
        4,
        ["KillerElite.jpg"],
        "https://www.youtube.com/embed/lft48yFsHGU",
        "<p>In 1980, mercenaries Danny Bryce (Jason Statham), Hunter (Robert De Niro), Davies (Dominic Purcell), and Meier (Aden Young) are in Mexico to assassinate a man. Danny is shot when he becomes distracted after realizing he has killed the man in front of the target\'s young daughter. Affected by this, Danny retires and returns to his native Australia.</p><p>The following year, Danny is summoned to Oman to meet The Agent (Adewale Akinnuoye-Agbaje). He learns that Hunter failed a $6 million job. If Danny does not complete Hunter\'s mission, Hunter will be executed. Sheikh Amr, a deposed king of a small region of Oman, wants Danny to kill three former SAS troopers—Steven Harris (Lachy Hulme), Steven Cregg (Grant Bowler), and Simon McCann (Daniel Roberts)—for killing his three eldest sons during the Dhofar Rebellion. Danny must videotape their confessions and make their deaths look like accidents, all before the terminally ill sheikh dies. This will allow the sheikh\'s fourth son, Bakhait (Firass Dirani), to regain control of his father\'s desert region. Davies and Meier agree to help Danny for a share of the money.</p><p>Danny and Meier sneak into Harris\'s house. After Harris confesses on videotape, they take him to the bathroom, intending to make it look like he slipped and hit his head. However, Harris\'s girlfriend knocks on the door. While Harris and Meier are distracted, Harris attempts to break free, causing Meier to kill him.</p><p>In England, Davies questions bar patrons about former SAS members. This is reported to the Feather Men, a secret society of former operatives protecting their own. Their head enforcer, Spike Logan (Clive Owen), is sent to investigate.</p><p>Davies discovers Cregg preparing for a long nighttime march in wintry weather at the Brecon Beacons mountain range. Danny infiltrates the base, disguised in uniform, and drugs Cregg\'s coffee. Danny follows Cregg on the march and makes him confess before the drug sends him into shock to die of hypothermia.</p><p>For their last target, their plan is to crash a remote-controlled truck into McCann\'s car. With the help of the inexperienced Jake (Michael Dorman), Meier kills McCann; however, Logan and his men were watching over McCann. A gunfight ensues, and Jake accidentally kills Meier. Danny and Davies part ways. Davies is tracked down by Logan\'s men, and is hit by a truck and killed while trying to escape.</p><p>Danny returns to Oman and gives the sheikh the last confession, which he has faked. Hunter is released, while Danny heads back to Australia and reunites with Anne (Yvonne Strahovski), a childhood acquaintance. Soon, he is informed by the Agent that there is one last man who participated in the sheikh\'s sons\' murders and that this man, Ranulph Fiennes, is about to release a book about his experiences in the SAS.</p><p>Danny sends Anne to France so Hunter can protect her. The sheikh’s son confirms that Harris was innocent. Logan, meanwhile, traces Danny through the Agent and sends a team to protect the author, but Jake distracts them, allowing Danny to shoot Fiennes. He only wounds the man, however, taking pictures that appear to show him dead. Logan captures Danny, taking him to an abandoned warehouse, but then a government agent arrives and reveals that the British government is behind the events because of the sheikh\'s valuable oil reserves. A three-way battle ensues, with Danny escaping and Logan shooting the government agent.</p><p>In Paris, the Agent tries to kidnap Anne for ransom, but Hunter beats the henchman and shoots the Agent in the leg. Hunter seems threatening at first, but spares his life.</p><p>Danny and Hunter head to Oman to give the sheikh the pictures. However, Logan arrives first, tells the sheikh the pictures are fake and then stabs him to death. The sheikh\'s son does not care; he gives Logan the money. Hunter spots Logan leaving, and they chase after him, along with the sheikh\'s men.</p><p>After stopping the sheikh\'s men, Danny and Hunter confront Logan on a desert road. Hunter takes some of the money for his expenses and his family. They leave the remainder, telling Logan that he will need it to start a new life after killing the government agent and acting against the wishes of the Feather Men and the British government. Danny says that it is over for him and that Logan must make up his own mind what to do. Danny reunites with Anne.</p>",
        "killerelite-sr.html"
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
        "<p>In late 1975, the heavyweight boxing world champion, Apollo Creed, announces plans to hold a title bout in Philadelphia during the upcoming United States Bicentennial. However, he is informed five weeks from the fight date that his scheduled opponent is unable to compete due to an injured hand. With all other potential replacements booked up or otherwise unavailable, Creed decides to spice things up by giving a local contender a chance to challenge him. He settles in on Rocky Balboa, an aspiring southpaw boxer from an Italian neighborhood of Philadelphia, known by the nickname \"The Italian Stallion\".</p><p>Rocky meets with promoter Miles Jergens, unexpectedly presuming Creed is seeking local sparring partners. Reluctant at first, Rocky eventually agrees to the fight which will pay him $150,000. After several weeks of training, using whatever he can find, including meat carcasses as punching bags, Rocky accepts an offer of assistance from former boxer Mickey \"Mighty Mick\" Goldmill, a respected trainer and former bantamweight fighter from the 1920s, who always criticized Rocky for wasting his potential.</p><p>Meanwhile, Rocky meets Adrian Pennino, who is working part-time at the J&M Tropical Fish pet store. He begins to build a romantic relationship with Adrian, culminating in a kiss. Adrian\'s brother, Paulie, becomes jealous of Rocky\'s success, but Rocky calms him by agreeing to advertise his meatpacking business before the upcoming fight. The night before the fight, Rocky begins to lose confidence after touring the arena. He confesses to Adrian that he does not expect to win, but is content to go the distance against Creed and prove himself to everyone.</p><p>On New Year\'s Day, the fight is held, with Creed making a dramatic entrance dressed as George Washington and then Uncle Sam. Taking advantage of his overconfidence, Rocky knocks him down in the first round—the first time that Creed has ever been knocked down. Humiliated, Creed takes Rocky more seriously for the rest of the fight, though his ego never fully fades. The fight goes on for the full fifteen rounds, with both combatants sustaining various injuries. As the fight progresses, Creed\'s superior skill is countered by Rocky\'s apparently unlimited ability to absorb punches, and his dogged refusal to go down. As the final round bell sounds, with both fighters locked in each other\'s arms, they promise to each other that there will be no rematch.</p><p>After the fight, the sportscasters and the audience go wild. Jergens announces over the loudspeaker that the fight was \"the greatest exhibition of guts and stamina in the history of the ring\", and Rocky calls out repeatedly for Adrian, who runs down and comes into the ring as Paulie distracts arena security. As Jergens declares Creed the winner by virtue of a split decision (8:7, 7:8, 9:6), Adrian and Rocky embrace and profess their love to each other, not caring about the result of the fight.</p>",
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
        6,
        ["terminator.jpg"],
        "https://www.youtube.com/embed/k64P4l2Wmeg",
        "<p>In 1984 Los Angeles, a cyborg assassin known as a Terminator arrives from 2029 and steals guns and clothes. Shortly afterward, Kyle Reese, a human soldier from 2029, arrives. He steals clothes and evades the police. The Terminator begins systematically killing women named Sarah Connor, whose addresses he finds in the telephone directory. He tracks the last Sarah Connor to a nightclub, but Kyle rescues her. The pair steal a car and escape with the Terminator pursuing them in a police car.</p><p>As they hide in a parking lot, Kyle explains to Sarah that an artificial intelligence defense network, known as Skynet, will become self-aware in the near future and initiate a nuclear holocaust. Sarah's future son John will rally the survivors and lead a resistance movement against Skynet and its army of machines. With the Resistance on the verge of victory, Skynet sent a Terminator back in time to kill Sarah before John is born, to prevent the formation of the Resistance. The Terminator is an efficient killing machine with a powerful metal endoskeleton and an external layer of living tissue that makes it appear human.</p><p>Kyle and Sarah are apprehended by police after another encounter with the Terminator. Criminal psychologist Dr. Silberman concludes that Kyle is paranoid and delusional. The Terminator repairs his body and attacks the police station, killing many police officers in his attempt to locate Sarah. Kyle and Sarah escape, steal another car and take refuge in a motel, where they assemble pipe bombs and plan their next move. Kyle admits that he has been in love with Sarah since John gave him a photograph of her, and they have sex.</p><p>The Terminator kills Sarah's mother and impersonates her when Sarah, unaware of the Terminator's ability to mimic victims, attempts to contact her via telephone. When they realize he has reacquired them, they escape in a pickup truck while he chases them on a motorcycle. In the ensuing chase, Kyle is wounded by gunfire while throwing pipe bombs at the Terminator. Enraged‚ Sarah knocks the Terminator off his motorcycle but loses control of the truck, which flips over. The Terminator hijacks a tank truck and attempts to run down Sarah, but Kyle slides a pipe bomb onto the tanker, causing an explosion that burns the flesh from the Terminator's endoskeleton. It pursues them to a factory, where Kyle activates machinery to confuse the Terminator. He jams his final pipe bomb into the Terminator's abdomen, blowing the Terminator apart, injuring Sarah, and killing himself. The Terminator's still functional torso reactivates and grabs Sarah. She breaks free and lures it into a hydraulic press, crushing it.</p><p>Months later, a pregnant Sarah is traveling through Mexico, recording audio tapes to pass on to her unborn son, John. She debates whether to tell him that Kyle is his father. At a gas station, a boy takes a Polaroid photograph of her which she purchases—the same photograph that John will eventually give to Kyle.</p>",
        "terminator-sr.html"
    )
]