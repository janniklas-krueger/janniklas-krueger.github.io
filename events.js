// Überschrift
var headline = document.getElementsByTagName("h1")[0];
headline.onclick = function()
{
    if(headline.style.color == "green")
    {
        headline.style.color = "black";
    }
    else
    {
        headline.style.color = "green";
    }
}

// Zitat-Quelle
var doctor = document.getElementById("doctor");
var quote = document.getElementById("quote");
doctor.onmouseenter = function()
{
    doctor.style.color = "red";
    var who = document.createElement("p");
    who.id = "who";
    who.innerHTML = "Doctor who?";
    quote.append(who);
}
doctor.onmouseleave = function()
{
    doctor.style.color = "black";
    var who = document.getElementById("who");
    who.remove();
}