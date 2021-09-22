x = new Vue({
  el: "#person",

  data:
  {
    oldData: {id: '', email: '', firstName: '', lastName: '', avatar: ''},
    formData: {id: '', email: '', firstName: '', lastName: '', avatar: ''},

    persons: [],

    formTitle: 'Neue Person hinzufuegen',
    formSubmit: 'Erstellen',

    loadInfo: true,
    edit: false,
    disableId: false,

    deleteDlg: false,

    currentPage: 1,
    firstPage: 1,
    lastPage: '',

  },

  methods:
  {
    deleteData: function() // DELETE-Request
    {
      fetch("https://reqres.in/api/users/" + this.formData.id, {method: "DELETE"})
      .then
      ((response) =>
      {
        if (response.ok)
        {
          alert(response.status + "\nPerson gelöscht");
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
    },

    sendData: function() // PATCH- / POST-Request
    {
      // Check if editing is enabled
      if (this.edit)
      {
        // If TRUE -> Insert edits into update
        var update = {};

        if (this.formData.email != "" && this.formData.email != this.oldData.email)
        {
          update.email = this.formData.email;
        }
        if (this.formData.firstName != "" && this.formData.firstName != this.oldData.firstName)
        {
          update.firstName = this.formData.firstName;
        }
        if (this.formData.lastName != "" && this.formData.lastName != this.oldData.lastName)
        {
          update.lastName = this.formData.lastName;
        }
        if (this.formData.avatar != "" && this.formData.avatar != this.oldData.avatar)
        {
          update.avatar = this.formData.avatar;
        }

        // Send updated properties to API
        fetch("https://reqres.in/api/users/" + this.formData.id, {body: JSON.stringify(update), method: "PATCH"})
        .then
        ((response) =>
        {
          if (response.ok)
          {
            alert("Person bearbeitet");
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

      // Check if form is filled
      if (this.filledForm)
      {
        // If TRUE -> Send data to API
        fetch("https://reqres.in/api/users", {body: JSON.stringify(this.formData), method: "POST"} )
        .then
        ((response) =>
        {
          if (response.ok)
          {
            alert("Person erstellt!");
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
      else
      {
        alert("Bitte alle Pflichtfelder ausfüllen");
      }
    },

    getTableData: function()  // GET-Request
    {
      fetch("https://reqres.in/api/users?page=" + this.currentPage, {method: "GET"})
      .then
      ((response) =>
      {
        if (response.ok)
        {
          response.json()
          .then
          ((json) =>
          {
            for (var i = 0; i < json.data.length; i++)
            {
              this.persons[i] = {
                id: json.data[i].id,
                email: json.data[i].email,
                firstName: json.data[i].first_name,
                lastName: json.data[i].last_name,
                avatar: json.data[i].avatar,
                select: '' };

              if (this.persons[i].id === this.formData.id)
              {
                this.persons[i].select = "select";
              }
            }
            this.loadInfo = false;
            this.lastPage = json.total_pages;
          });
        }
        else
        {
          alert(response.status + "\nPersonen konnten nicht geladen werden");
          this.loadInfo = false;
        }
      },
      (reason) =>
      {
        alert("Personen konnten nicht geladen werden.\nGrund:\n" + reason);
        this.loadInfo = false;
      });
    },

    clickPerson: function(event)  // onclick person
    {
      var index = event.target.parentElement.sectionRowIndex;

      // Check if allready selected
      if (this.persons[index].select === "select")
      {
        // If Selected -> Remove selection

        this.persons[index].select = "";
        this.edit = false;
        this.formTitle = "Neue Person hinzufuegen";
        this.formSubmit = "Erstellen";
        this.disableId = false;
        this.formData = {id: '', email: '', firstName: '', lastName: '', avatar: ''};
        return;
      }

      // Else -> Remove selection from other persons
      for (var i = 0; i < this.persons.length; i++)
      {
        this.persons[i].select = "";
      }

      // Select clicked person
      this.persons[index].select = "select";
      var userId = this.persons[index].id;
      this.edit = true;
      this.formTitle = "Markierte Person bearbeiten";
      this.formSubmit = "Bearbeiten";
      this.disableId = true;

      // Insert person data into form
      fetch("https://reqres.in/api/users/" + userId, {method: "GET"})
      .then
      ((response) =>
      {
        if (response.ok)
        {
          response.json()
          .then
          ((json) =>
          {
            this.formData.id = json.data.id;
            this.formData.email = json.data.email;
            this.formData.firstName = json.data.first_name;
            this.formData.lastName = json.data.last_name;
            this.formData.avatar = json.data.avatar;

            this.oldData.id = json.data.id;
            this.oldData.email = json.data.email;
            this.oldData.firstName = json.data.first_name;
            this.oldData.lastName = json.data.last_name;
            this.oldData.avatar = json.data.avatar;
          });
        }
        else
        {
          alert(response.status + "\nDaten der Person konnten nicht geladen werden");
        }
      },
      (reason) =>
      {
        alert("Daten der Person konnten nicht geladen werden.\nGrund:\n" + reason);
      });
    },

    nextPage: function()
    {
      this.loadInfo = true;
      this.currentPage++;
      this.getTableData();
      /*fetch("https://reqres.in/api/users?page=" + this.currentPage, {method: "GET"})
      .then
      ((response) =>
      {
        if (response.ok)
        {
          response.json()
          .then
          ((json) =>
          {
            for (var i = 0; i < json.data.length; i++)
            {
              this.persons[i] = { id: json.data[i].id,
                                email: json.data[i].email,
                                firstName: json.data[i].first_name,
                                lastName: json.data[i].last_name,
                                avatar: json.data[i].avatar,
                                select: '' };
            }
            this.loadInfo = false;

            this.lastPage = json.total_pages;
          });
        }
        else
        {
          alert(response.status + "\nPersonen konnten nicht geladen werden");
          this.loadInfo = false;
        }
      },
      (reason) =>
      {
        alert("Personen konnten nicht geladen werden.\nGrund:\n" + reason);
        this.loadInfo = false;
      });*/
    },

    priorPage: function()
    {
      this.loadInfo = true;
      this.currentPage--;
      this.getTableData();
      /*fetch("https://reqres.in/api/users?page=" + this.currentPage, {method: "GET"})
      .then
      ((response) =>
      {
        if (response.ok)
        {
          response.json()
          .then
          ((json) =>
          {
            for (var i = 0; i < json.data.length; i++)
            {
              this.persons[i] = { id: json.data[i].id,
                                email: json.data[i].email,
                                firstName: json.data[i].first_name,
                                lastName: json.data[i].last_name,
                                avatar: json.data[i].avatar,
                                select: '' };
            }
            this.loadInfo = false;

            this.lastPage = json.total_pages;
          });
        }
        else
        {
          alert(response.status + "\nPersonen konnten nicht geladen werden");
          this.loadInfo = false;
        }
      },
      (reason) =>
      {
        alert("Personen konnten nicht geladen werden.\nGrund:\n" + reason);
        this.loadInfo = false;
      });*/
    },
  },

  computed:
  {
    filledForm: function()  // Check if all needed inputs are filled
    {
      if (this.formData.id != "" && this.formData.email != "" && this.formData.firstName != "" && this.formData.lastName != "")
      {
        return true;
      }
      return false;
    },

    cLastPage: function()
    {
      if (this.currentPage >= this.lastPage)
      {
        return true;
      }
      return false;
    },

    cFirstPage: function()
    {
      if (this.currentPage <= this.firstPage)
      {
        return true;
      }
      return false;
    },
  },


  mounted: function()
  {
    this.getTableData();
  }

});
