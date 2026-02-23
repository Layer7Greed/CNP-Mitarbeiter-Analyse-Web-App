let persoane = [];

// ➜ Calculează vârsta din CNP
function calculeazaVarsta(cnp) {
    if (cnp.length < 7) return 0;

    let an = parseInt(cnp.substring(1, 3));
    let luna = parseInt(cnp.substring(3, 5));
    let zi = parseInt(cnp.substring(5, 7));

    let prefix = parseInt(cnp[0]);
    if (prefix === 1 || prefix === 2) an += 1900;
    else if (prefix === 5 || prefix === 6) an += 2000;
    else an += 1900;

    let nastere = new Date(an, luna - 1, zi);
    let azi = new Date();

    let varsta = azi.getFullYear() - nastere.getFullYear();
    let m = azi.getMonth() - nastere.getMonth();
    if (m < 0 || (m === 0 && azi.getDate() < nastere.getDate())) {
        varsta--;
    }
    return varsta;
}
// ➜ Starte 3 Jahre Timer für alle Personen
function startZinsTimer() {
    let zinsInput = document.getElementById("zins").value;
    let zins = parseFloat(zinsInput);

    if (isNaN(zins) || zins <= 0) {
        alert("Introduceți un procent valid!");
        return;
    }

    if (persoane.length === 0) {
        alert("Adăugați cel puțin o persoană!");
        return;
    }

    document.getElementById("output").innerText =
        `Rata de ${zins}% a fost aplicată. Așteptați 3 ani...`;

    // Für Test: 3 Sekunden statt 3 Jahre → später auf 3*365*24*60*60*1000
    let dreiJahre = 3000; // 3 Sekunden Test

    setTimeout(() => {
        document.getElementById("output").innerText =
            `🎉 Timpul de 3 ani pentru rata de ${zins}% a expirat pentru toate persoanele!`;
        alert(`🎉 3 ani au trecut! Rata de ${zins}% este gata.`);
    }, dreiJahre);
}

// ➜ Adaugă angajat
function addPerson() {
    let prenume = document.getElementById("vorname").value;
    let nume = document.getElementById("nachname").value;
    let cnp = document.getElementById("cnp").value;

    if (!prenume || !nume || !cnp) {
        alert("Completați toate câmpurile!");
        return;
    }

    persoane.push({ prenume, nume, cnp });
    renderListe();
}

// ➜ Șterge angajat
function deletePerson(index) {
    persoane.splice(index, 1);
    renderListe();
}

// ➜ Afișează lista
function renderListe() {
    let lista = document.getElementById("liste");
    lista.innerHTML = "";

    persoane.forEach((p, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${p.prenume} ${p.nume} (CNP: ${p.cnp})
            <button onclick="deletePerson(${index})">Șterge</button>
            <button onclick="showVarsta(${index})">Vârstă</button>
        `;
        lista.appendChild(li);
    });
}

// ➜ Afișează vârsta unui angajat
function showVarsta(index) {
    let p = persoane[index];
    let varsta = calculeazaVarsta(p.cnp);
    document.getElementById("output").innerText =
        `${p.prenume} are ${varsta} ani`;
}

// ➜ Afișează vârsta tuturor
function zeigeAlterAlle() {
    let text = "";

    persoane.forEach(p => {
        let varsta = calculeazaVarsta(p.cnp);
        text += `${p.prenume} ${p.nume}: ${varsta} ani\n`;
    });

    document.getElementById("output").innerText = text;
}

// ➜ Vârsta mediană
function zeigeMedian() {
    if (persoane.length === 0) return;

    let varste = persoane
        .map(p => calculeazaVarsta(p.cnp))
        .sort((a, b) => a - b);

    let median;
    let mid = Math.floor(varste.length / 2);

    if (varste.length % 2 === 0) {
        median = (varste[mid - 1] + varste[mid]) / 2;
    } else {
        median = varste[mid];
    }

    document.getElementById("output").innerText =
        `Vârsta mediană: ${median}`;
}

// ➜ Export Excel
function exportExcel() {
    if (persoane.length === 0) {
        alert("Nu există date pentru export!");
        return;
    }

    let date = persoane.map(p => ({
        Prenume: p.prenume,
        Nume: p.nume,
        CNP: p.cnp,
        Varsta: calculeazaVarsta(p.cnp)
    }));

    let ws = XLSX.utils.json_to_sheet(date);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Angajati");
    XLSX.writeFile(wb, "angajati.xlsx");
}
