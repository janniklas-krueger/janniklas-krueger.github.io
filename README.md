# Konflikt-Feature
[Webseite](https://janniklas-krueger.github.io)

Ein C#-Beispiel:
``` csharp
// Eingabe Nummer 1
Console.Write("Enter a number:");
num1 = Convert.ToDouble(Console.ReadLine());
Console.Clear();

// Eingabe der Rechenoperation mit Schleife zum Fehlerabfang
do
{
    Console.Write("Your first number is: " + num1 + "\n\nWhat do you want to do?\nadd\t\t(a)\nsubstract\t(s)\nmultiply\t(m)\ndivide\t\t(d)");
    choice = Convert.ToChar(Console.ReadLine());

    if (choice != 'a' && choice != 's' && choice != 'm' && choice != 'd')
    {
        Console.Clear();
        Console.WriteLine("Invalid Input!");
    }
} while (choice != 'a' && choice != 's' && choice != 'm' && choice != 'd');

// Eingabe Nummer 2
Console.Clear();

do
{
    Console.Write("Your first number is: " + num1 + "\nEnter a second number:");
    num2 = Convert.ToDouble(Console.ReadLine());
    if (choice == 'd' && num2 == 0)
    {
        Console.Clear();
        Console.Write("Dividing by 0 is invalid!\n");
    }
} while (choice == 'd' && num2 == 0);

// Summe
if (choice == 'a')
{
    Console.Clear();
    result = num1 + num2;
    Console.WriteLine(num1 + " + " + num2 + " = " + result);
}

// Differenz
if (choice == 's')
{
    Console.Clear();
    result = num1 - num2;
    Console.WriteLine(num1 + " - " + num2 + " = " + result);
}

// Produkt
if (choice == 'm')
{
    Console.Clear();
    result = num1 * num2;
    Console.WriteLine(num1 + " * " + num2 + " = " + result);
}

// Quotient
if (choice == 'd')
{
    Console.Clear();
    result = num1 / num2;
    Console.WriteLine(num1 + " / " + num2 + " = " + result);
}
```

### *And now for something completely different:*
> People assume that time is a straight progression of cause to effect, while actually from a non-linear, non-subjective viewpoint it's more like a big ball of wibbly-wobbly, timey-wimey stuff.
>
>  __Der__ Doktor
