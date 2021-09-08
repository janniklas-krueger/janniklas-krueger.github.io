function Pet(id, category, name, status)
{
    this.id = id;
    this.category = category;
    this.name = name;
    this.status = status;
}

function Category(id, name)
{
    this.id = id;
    this.name = name;
}

var form = document.forms.form;

form.onsubmit = function(event)
{
    console.log(event);

    const cat = new Category(form.cat_id.value, form.category.value);
    const pet = new Pet(form.id.value, cat, form.name.value, form.status.value);

    const url = 'https://petstore.swagger.io/v2/pet';
    fetch(url,
          {
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(pet),
              method: "POST"
          })
          .then
          (
              function (value)
              {
                  alert("Daten gesendet!");
                  console.log(JSON.stringify(pet));
                  console.log(value);
              },
              function (reason)
              {
                  alert("Daten konnten nicht gesendet werden");
              }
          );
    /*.then(stuff => stuff.json())
    .then((json) => {alert(JSON.stringify(json))})*/
    event.preventDefault();
}



/*var person2 =
{
    lastName: "Smith",
    firstName: "John",
    height: 180,
    hair: "black",
    eyes: "grey",
    print: function(doc){
        if(doc)
        {
            printName(this.firstName, this.lastName, true);
            printAppearance(this.height, this.hair, this.eyes, true);
        }
        else
        {
            printName(this.firstName, this.lastName, false);
            printAppearance(this.height, this.hair, this.eyes, false);
        }
    }
};*/


/*function printName(fN, lN, doc)
{
    if(doc === true)
    {
        document.write(fN + " " + lN);
    }
    else
    {
        console.log(fN + " " + lN);
    }
}

function printAppearance(height, hair, eyes, doc)
{
    if(doc === true)
    {
        document.write(height + " cm, " + hair + " hair, " + eyes + " eyes");
    }
    else
    {
        console.log(height + " cm, " + hair + " hair, " + eyes + " eyes");
    }
}*/
