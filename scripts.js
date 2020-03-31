// passer på at serial input blir valgt etter siden laster inn
window.onload = () => {
    document.getElementById("serial").focus();

    loadData();
};

// sørger for at formet ikke blir submittet
document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();
});

// checker function
function checker() {
    // dagens dato
    var today = new Date();

    var serial = document.getElementById("serial").value;
    serial = serial.toUpperCase();

    if (serial.length != 20 && serial.length != 13) {
        alert("Dette ser ikke ut som et gyldig serienummer: " + serial);
        return false;
    }

    // Q22 serienummere er 20 symboler langt
    if (serial.length == 20) {
        // 'letters to years' for å konvertere del av serienummer til år
        const l2y = [];
        l2y["G"] = 2016;
        l2y["H"] = 2017;
        l2y["J"] = 2018;
        l2y["K"] = 2019;
        l2y["L"] = 2020;
        l2y["M"] = 2021;

        // 'number to month' for å konvertere del av serienummer til måned
        const n2m = [];
        n2m["A"] = 10;
        n2m["B"] = 11;
        n2m["C"] = 12;

        // Q22 serienummer konvertert til år og månded
        var q22Year = serial.substring(12, 13);
        q22Year = l2y[q22Year];

        var q22Month = serial.substring(13, 14);
        if (isNaN(q22Month)) {
            q22Month = n2m[q22Month];
        }

        // Q22 produksjonsdato minus en mnd for å ta høyde for at jan er 0
        q22 = new Date(q22Year, q22Month - 1, 01);

        // regner ut differansen og konverterer det til år
        var diff = today - q22;
        diff = diff / (1000 * 3600 * 24 * 365);

        // deklarer historie og status variabel
        var history, status;

        // avgjør om det er over et år eller ikke
        if (diff < 2) {
            status = "OK";
            document.getElementById("info").innerHTML =
                "Dekoderen er produsert: <b>" +
                q22Month +
                "/" +
                q22Year +
                "</b> og er innenfor garantien.";
        } else {
            status = "Ikke OK";
            document.getElementById("info").innerHTML =
                "Dekoderen er produsert: <b>" +
                q22Month +
                "/" +
                q22Year +
                "</b> og er <b>utenfor</b> garantien.";
        }
    }

    // Serienummeret for hjemmesentraler er 13 symboler langt
    if (serial.length == 13) {
        // henter ut år og måned. Må ikke konverteres på hjemmesentraler
        var hsYear = serial.substring(1, 2);
        var hsMonth = serial.substring(5, 6);

        // regner ut differansen mellom dagens dato og produksjonsdato
        hs = new Date(hsYear, hsMonth / 4, 01);
        var diff = today - hs;

        // resultat i milisekunder deles for å få år
        diff = diff / (1000 * 3600 * 24 * 365);

        // avgjør om det er over et år eller ikke
        if (diff < 2) {
            status = "OK";
            document.getElementById("info").innerHTML =
                "Hjemmesentralen er produsert: <b>" +
                hsMonth +
                "/20" +
                hsYear +
                "</b> og er innenfor garantien.";
        } else {
            status = "Ikke OK";
            document.getElementById("info").innerHTML =
                "Hjemmesentralen er produsert: <b>" +
                hsMonth +
                "/" +
                hsYear +
                "</b> og er <b>utenfor</b> garantien.";
        }
    }

    storeData(serial, status);
}

function storeData(input, status) {
    let history = localStorage.getItem("history");
    if (history === null) {
        history = input + " - " + status + "\n";
    } else {
        history = input + " - " + status + "\n" + history;
    }
    localStorage.setItem("history", history);
    document.getElementById("history").value = history;
}

function loadData() {
    var history = localStorage.getItem("history");
    document.getElementById("history").value = history;
}

function resetHistory() {
    localStorage.removeItem("history");
}
