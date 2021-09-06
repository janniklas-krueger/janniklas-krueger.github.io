var Person = function(lastName, firstName, height, hair, eyes)
{
    this.lastName = lastName;
    this.firstName = firstName;
    this.height = height;
    this.hair = hair;
    this.eyes = eyes;
    this.print = function(doc){
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
}

var person = new Person("Mustermann", "Max", 170, "brown", "blue");


var person2 =
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
};


function printName(fN, lN, doc)
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
}