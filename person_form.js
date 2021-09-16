
function Person (id, email, first_name, last_name, avatar)
{
    this.id = id;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.avatar = avatar;
}

var person = new Person("", "", "", "", "");
var oldData = new Person("", "", "", "", "");

var personTBody = document.getElementById('person-tablebody');    // TableBody
var personTHead = document.getElementById('person-tablehead-row');// Kopfzeile
var personTItems;                                                 // Einzelne Tabellenzeilen
var loadInfo = document.getElementById('load-info');              // Infotext "Daten werden geladen"
var personForm = document.forms.personform;                       // Personenformular
var formTitle = document.getElementById('form-title');            // H3 über Formular
var fields = document.getElementsByClassName('field');            // Formularfelder

var sendButton = document.getElementById('send-button');
var deleteButton = document.getElementById('delete-button');

// Durch Tabellenseiten blättern
var nextPage = document.getElementById('next-page');
var lastPage = document.getElementById('last-page');
var currentpage = 1;


// Bestätigungsdialog
var persDeleteText = document.getElementById('pers-delete-text');
var persDeleteYes = document.getElementById('pers-delete-yes');
var persDeleteNo = document.getElementById('pers-delete-no');

deleteButton.style.visibility = "hidden";
persDeleteText.style.display = "none";
persDeleteYes.style.display = "none";
persDeleteNo.style.display = "none";


// Bearbeiten oder Erstellen
var edit = false;


///// Personen in Tabelle anzeigen /////

var spaltenAnzahl = personTHead.childElementCount;
var zeile = "<tr data-person-id=''>";

for (var i = 0; i < spaltenAnzahl; i++)
{
    zeile += "<td data-fieldtype='" + personTHead.children[i].dataset.fieldtype + "'></td>";
}
zeile += "</tr>";


// Daten anfordern
fetch("https://reqres.in/api/users?page=" + currentpage, {method: "GET"})
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
            jsonResp.data.forEach((item, index) => {fillTable(item, index);});
            loadInfo.style.display = "none";
            dataSelection();
        });
    }
    else
    {
        loadInfo.style.display = "none";
        alert(response.status + "\nPersonen konnten nicht geladen werden");
    }
},
(reason) =>
{
    loadInfo.style.display = "none";
    alert("Personen konnten nicht geladen werden.\nGrund:\n" + reason);
});

function fillTable(item, i)
{
    personTBody.innerHTML += zeile;
    personTBody.children[i].dataset.personId = item.id;

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
}


///// Durch Seiten Blättern

nextPage.onclick = function()
{
    personTBody.innerHTML = "";
    loadInfo.style.display = "block";
    currentpage++;

    fetch("https://reqres.in/api/users?page=" + currentpage, {method: "GET"})
    .then
    ((response) =>
    {
        if (response.ok)
        {
            response.json()
            .then
            ((jsonResp) =>
            {
                console.log(jsonResp.data);
                if (jsonResp.data.length !== 0)
                {
                    // Infotext löschen, Daten einfügen:
                    jsonResp.data.forEach((item, index) => {fillTable(item, index);});
                    loadInfo.style.display = "none";
                    dataSelection();
                }
                else
                {
                    lastPage.click();
                    nextPage.style.display = "none";
                }

            });
        }
        else
        {
            loadInfo.style.display = "none";
            alert(response.status + "\nPersonen konnten nicht geladen werden");
        }
    },
    (reason) =>
    {
        loadInfo.style.display = "none";
        alert("Personen konnten nicht geladen werden.\nGrund:\n" + reason);
    });
}

lastPage.onclick = function()
{
    personTBody.innerHTML = "";
    loadInfo.style.display = "block";
    currentpage--;

    fetch("https://reqres.in/api/users?page=" + currentpage, {method: "GET"})
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
                jsonResp.data.forEach((item, index) => {fillTable(item, index);});
                loadInfo.style.display = "none";
                dataSelection();
            });
        }
        else
        {
            loadInfo.style.display = "none";
            alert(response.status + "\nPersonen konnten nicht geladen werden");
        }
    },
    (reason) =>
    {
        loadInfo.style.display = "none";
        alert("Personen konnten nicht geladen werden.\nGrund:\n" + reason);
    });
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
    persDeleteText.style.display = "none";
    persDeleteYes.style.display = "none";
    persDeleteNo.style.display = "none";

    if (this.className === "select")
    {
        ///// Auswahl aufheben /////
        edit = false;
        this.className = "";

        formTitle.innerHTML = "Neue Person hinzufügen";

        deleteButton.style.visibility = "hidden";
        sendButton.innerHTML = "Erstellen";

        personForm.id.disabled = false;
        personForm.avatar_img.src = "";
        for (var i = 0; i < fields.length; i++)
        {
            fields[i].value = "";
        }
        return;
    }

    // IDs zurücksetzen
    for (var i = 0; i < personTItems.length; i++)
    {
        personTItems[i].className = "";
    }

    // Daten auswählen
    edit = true;
    this.className = "select";
    var userId = this.dataset.personId;

    formTitle.innerHTML = "Markierte Person ändern";

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

            // Alte Werte in oldData schreiben
            oldData.email = json.data.email;
            oldData.first_name = json.data.first_name;
            oldData.last_name = json.data.last_name;
            oldData.avatar = json.data.avatar;
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
    if (edit)
    {
        // Bestehende Person bearbeiten
        var update = {};

        if (personForm.email.value != oldData.email && personForm.email.value != "")
        {
            update.email = personForm.email.value;
        }
        if (personForm.first_name.value != oldData.first_name && personForm.first_name.value != "")
        {
            update.first_name = personForm.first_name.value;
        }
        if (personForm.last_name.value != oldData.last_name && personForm.last_name.value != "")
        {
            update.last_name = personForm.last_name.value;
        }
        if (personForm.avatar.value != oldData.avatar && personForm.avatar.value != "")
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
                for (var i = 0; i < fields.length; i++)
                {
                    fields[i].value = "";
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
            for (var i = 0; i < fields.length; i++)
            {
                fields[i].value = "";
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
    persDeleteText.style.display = "block";
    persDeleteYes.style.display = "inline";
    persDeleteNo.style.display = "inline";
};

persDeleteYes.onclick = function()
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
            for (var i = 0; i < fields.length; i++)
            {
                fields[i].value = "";
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

persDeleteNo.onclick = function()
{
    persDeleteText.style.display = "none";
    persDeleteYes.style.display = "none";
    persDeleteNo.style.display = "none";
}
