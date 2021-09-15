
function Person (id, email, first_name, last_name, avatar)
{
    this.id = id;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.avatar = avatar;
}

var person = new Person("", "", "", "", "");
var altdaten = new Person("", "", "", "", "");

var personTBody = document.getElementById('persontabelle_body');// TableBody
var personTHead = document.getElementById('persontabelle_headrow');  // Kopfzeile
var personTItems;                                                // Einzelne Tabellenzeilen
var ladeInfo = document.getElementById('info');                 // Infotext "Daten werden geladen"
var personForm = document.forms.personform;                     // Personenformular
var formTitel = document.getElementById('formTitel');           // H3 über Formular
var felder = document.getElementsByClassName('field');          // Formularfelder

var sendButton = document.getElementById('send_button');
var deleteButton = document.getElementById('delete_button');

// Bestätigungsdialog
var deleteConfirmText = document.getElementById('delete_confirm_text');
var deleteConfirmYes = document.getElementById('confirm_yes');
var deleteConfirmNo = document.getElementById('confirm_no');

deleteButton.style.visibility = "hidden";
deleteConfirmText.style.display = "none";
deleteConfirmYes.style.display = "none";
deleteConfirmNo.style.display = "none";


// Bearbeiten oder Erstellen
var bearbeiten = false;


///// Personen in Tabelle anzeigen /////

var spaltenAnzahl = personTHead.childElementCount;
var zeile = "<tr data-personID=''>";

for (var i = 0; i < spaltenAnzahl; i++)
{
    zeile += "<td data-fieldtype='" + personTHead.children[i].dataset.fieldtype + "'></td>";
}
zeile += "</tr>";


// Daten anfordern
fetch("https://reqres.in/api/users?page=1", {method: "GET"})
.then
((response) =>
{
    if (response.ok)
    {
        response.json()
        .then
        ((jsonResp) =>
        {
            // Infotext löschen, Daten einfügen:
            jsonResp.data.forEach(fillTable);
            ladeInfo.remove();
            dataSelection();
        });
    }
    else
    {
        alert(response.status + "\nPersonen konnten nicht geladen werden");
    }
},
(reason) =>
{
    alert("Personen konnten nicht geladen werden.\nGrund:\n" + reason);
});

function fillTable(item, i)
{
    personTBody.innerHTML += zeile;
    personTBody.children[i].dataset.personID = item.id;

    if (personTBody.children[i].querySelector("td[data-fieldtype = 'id']") != null)
    {
        personTBody.children[i].querySelector("td[data-fieldtype = 'id']").innerHTML = item.id;
    }

    if (personTBody.children[i].querySelector("td[data-fieldtype = 'email']") != null)
    {
        personTBody.children[i].querySelector("td[data-fieldtype = 'email']").innerHTML = item.email;
    }

    if (personTBody.children[i].querySelector("td[data-fieldtype = 'first_name']") != null)
    {
        personTBody.children[i].querySelector("td[data-fieldtype = 'first_name']").innerHTML = item.first_name;
    }

    if (personTBody.children[i].querySelector("td[data-fieldtype = 'last_name']") != null)
    {
        personTBody.children[i].querySelector("td[data-fieldtype = 'last_name']").innerHTML = item.last_name;
    }

    if (personTBody.children[i].querySelector("td[data-fieldtype = 'avatar']") != null)
    {
        personTBody.children[i].querySelector("td[data-fieldtype = 'avatar']").innerHTML = "<img src='" + item.avatar + "' />";
    }

    /*personTBody.innerHTML += "<tr data-personID='" + item.id + "'><td>" + item.id + "</td><td>"
                                      + item.email + "</td><td>" + item.first_name + "</td><td>"
                                      + item.last_name + "</td><td><img src='" + item.avatar + "'></td></tr>";*/
}


///// Daten zum Ändern auswählen /////

function dataSelection()
{
    personTItems = personTBody.children; // Einzelne Tabellenzeilen

    for (var i = 0; i < personTItems.length; i++)
    {
        personTItems[i].onclick = clickTabellenItem;
    }
};

function clickTabellenItem()
{
    if (this.id === "select")
    {
        // Auswahl aufheben
        bearbeiten = false;
        this.id = "";

        formTitel.innerHTML = "Neue Person hinzufügen";

        deleteButton.style.visibility = "hidden";
        sendButton.innerHTML = "Erstellen";

        personForm.id.disabled = false;
        personForm.avatar_img.src = "";
        for (var i = 0; i < felder.length; i++)
        {
            felder[i].value = "";
        }
        return;
    }

    // IDs zurücksetzen
    for (var i = 0; i < personTItems.length; i++)
    {
        personTItems[i].id = "";
    }

    // Daten auswählen
    bearbeiten = true;
    this.id = "select";
    var userId = this.dataset.personID;

    formTitel.innerHTML = "Markierte Person ändern";

    deleteButton.style.visibility = "visible";
    sendButton.innerHTML = "Ändern";

    personForm.id.disabled = true;


    // Values in Formular einfügen
    fetch("https://reqres.in/api/users/" + userId, {method: "GET"})
    .then
    ((response) =>
    {
        response.json()
        .then
        ((json) =>
        {
            personForm.id.value = json.data.id;
            personForm.email.value = json.data.email;
            personForm.first_name.value = json.data.first_name;
            personForm.last_name.value = json.data.last_name;
            personForm.avatar.value = json.data.avatar;
            personForm.avatar_img.src = json.data.avatar;

            // Alte Werte in altdaten schreiben
            altdaten.email = json.data.email;
            altdaten.first_name = json.data.first_name;
            altdaten.last_name = json.data.last_name;
            altdaten.avatar = json.data.avatar;
        });
    });
}


////////// Formular //////////

// Bild im Formular aktualisieren
personForm.avatar.onchange = function()
{
    personForm.avatar_img.src = this.value;
}

///// Button "Erstellen / Ändern" /////
sendButton.onclick = function ()
{
    // Person ausgewählt?
    if (bearbeiten)
    {
        // Bestehende Person bearbeiten
        var update = {};

        if (personForm.email.value != altdaten.email && personForm.email.value != "")
        {
            update.email = personForm.email.value;
        }
        if (personForm.first_name.value != altdaten.first_name && personForm.first_name.value != "")
        {
            update.first_name = personForm.first_name.value;
        }
        if (personForm.last_name.value != altdaten.last_name && personForm.last_name.value != "")
        {
            update.last_name = personForm.last_name.value;
        }
        if (personForm.avatar.value != altdaten.avatar && personForm.avatar.value != "")
        {
            update.avatar = personForm.avatar.value;
        }

        // Änderungen übernehmen
        fetch("https://reqres.in/api/users/" + personForm.id.value,
        {
            body: JSON.stringify(update),
            method: "PATCH"
        })
        .then
        ((response) =>
        {
            if (response.ok)
            {
                console.log(JSON.stringify(update));
                alert("Person bearbeitet");
                for (var i = 0; i < felder.length; i++)
                {
                    felder[i].value = "";
                }
                location.reload();
            }
            else
            {
                alert(response.status + "\nPerson konnte nicht bearbeitet werden.");
            }
        },
        (reason) =>
        {
            alert("Person konnte nicht bearbeitet werden.\nGrund:\n" + reason);
        });
        return;
    }

    ///// Neue Person anlegen /////

    // Pflichtfelder überprüfen
    if (personForm.id.value == "" || personForm.email.value == "" || personForm.first_name.value == "" || personForm.last_name.value == "")
    {
        alert("Bitte alle Pflichtfelder ausfüllen!");
        return false;
    }

    // Daten in Person-Objekt übertragen:
    person.id = personForm.id.value;
    person.email = personForm.email.value;
    person.first_name = personForm.first_name.value;
    person.last_name = personForm.last_name.value;
    person.avatar = personForm.avatar.value;

    // Persondaten senden
    fetch("https://reqres.in/api/users",
    {
        body: JSON.stringify(person),
        method: "POST"
    })
    .then
    ((response) =>
    {
        if (response.ok)
        {
            console.log(JSON.stringify(person));
            alert("Person erstellt!");
            for (var i = 0; i < felder.length; i++)
            {
                felder[i].value = "";
            }
            location.reload();
        }
        else
        {
            alert(response.status + "\nPerson konnte nicht erstellt werden.");
        }
    },
    (reason) =>
    {
        alert("Person konnte nicht erstellt werden.\nGrund:\n" + reason);
    });
}


///// Button "Löschen" /////
deleteButton.onclick = function ()
{
    // "Wirklich löschen" anzeigen:
    deleteConfirmText.style.display = "block";
    deleteConfirmYes.style.display = "inline";
    deleteConfirmNo.style.display = "inline";
};

deleteConfirmYes.onclick = function()
{
    fetch("https://reqres.in/api/users/" + personForm.id.value,
    {
        method: "DELETE"
    })
    .then
    ((response) =>
    {
        if (response.ok)
        {
            alert(response.status + "\nPerson gelöscht");
            for (var i = 0; i < felder.length; i++)
            {
                felder[i].value = "";
            }
            location.reload();
        }
        else
        {
            alert(response.status + "\nPerson konnte nicht gelöscht werden.");
        }
    },
    (reason) =>
    {
        alert("Person konnte nicht gelöscht werden.\nGrund:\n" + reason);
    });
}

deleteConfirmNo.onclick = function()
{
    deleteConfirmText.style.display = "none";
    deleteConfirmYes.style.display = "none";
    deleteConfirmNo.style.display = "none";
}
