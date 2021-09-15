
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
    event.preventDefault();
}
