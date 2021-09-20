x = new Vue({
  el: "#person",

  data:
  {
    /*person: function Person(id, email, first_name, last_name, avatar)
    {
      this.id = id;
      this.email = email;
      this.first_name = first_name;
      this.last_name = last_name;
      this.avatar = avatar;
    }*/


    person: {id: '', email: '', firstName: '', lastName: '', avatar: ''},
    formLable: 'Neue Person hinzufügen',
    formSubmit: 'Erstellen',

    ladeInfo: true,
    change: false,
  },

  methods:
  {
    sendData: function()
    {
      if (this.filledForm)
      {
        fetch("https://reqres.in/api/users", {body: JSON.stringify(this.person), method: "POST"} )
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
    },  // End of sendData


    getTableData: function()
    {
      fetch("https://reqres.in/api/users?page=1", {method: "GET"})
      .then
      ((response) =>
      {
        if (response.ok)
        {
          response.json()
          .then
          ((json) =>
          {
            ///// Insert table-rows /////
            for (var i = 0; i < json.data.length; i++)
            {
              this.$refs.person_tbody.innerHTML += this.newtableRow;
              this.fillTableRow(this.$refs.person_tbody.children[i], json.data[i]);
            }

            ///// Add onclick-event /////
            for (var i = 0; i < this.$refs.person_tbody.children.length; i++)
            {
              this.$refs.person_tbody.children[i].onclick = this.clickItem;
            }

            this.ladeInfo = false;
          });
        }
        else
        {
          alert(response.status + "\nPersonen konnten nicht geladen werden");
          this.ladeInfo = false;
        }
      },
      (reason) =>
      {
        alert("Personen konnten nicht geladen werden.\nGrund:\n" + reason);
        this.ladeInfo = false;
      });
    },


    fillTableRow: function(row, data)
    {
      row.dataset.personId = data.id; // Insert person-ID into tablerow

      ///// Insert person-data into table /////
      if (row.querySelector("td[data-fieldname = 'id']") != null)
      {
          row.querySelector("td[data-fieldname = 'id']").innerHTML = data.id;
      }

      if (row.querySelector("td[data-fieldname = 'email']") != null)
      {
          row.querySelector("td[data-fieldname = 'email']").innerHTML = data.email;
      }

      if (row.querySelector("td[data-fieldname = 'first_name']") != null)
      {
          row.querySelector("td[data-fieldname = 'first_name']").innerHTML = data.first_name;
      }

      if (row.querySelector("td[data-fieldname = 'last_name']") != null)
      {
          row.querySelector("td[data-fieldname = 'last_name']").innerHTML = data.last_name;
      }

      if (row.querySelector("td[data-fieldname = 'avatar']") != null)
      {
          row.querySelector("td[data-fieldname = 'avatar']").innerHTML = "<img src='" + data.avatar + "' />";
      }
    },


    clickItem: function(event)
    {
      var item = event.target.parentElement;
      console.log(event.target.parentElement);
      if (item.className === "select")
      {
        this.change = false;
        item.className = "";
        this.formLable = "Neue Person hinzufügen";
        this.formSubmit = "Erstellen";

      }
    },

  },

  computed:
  {
    newtableRow: function()
    {
      var columns = this.$refs.person_theadline.childElementCount;
      var row = "<tr data-person-id=''>";
      for (var i = 0; i < columns; i++)
      {
        row += "<td data-fieldname='" + this.$refs.person_theadline.children[i].dataset.fieldname + "'></td>";
      }
      row += "</tr>";

      return row;
    },



    /*filledForm: function() // Check if all needed inputs are filled, return true if yes
    {
      if (this.person.id != "" && this.person.email != "" && this.person.firstName != "" && this.person.lastName != "")
      {
        return true;
      }
        return false;
    }*/
  },

  mounted: function()
  {
    this.getTableData();
  }

});
