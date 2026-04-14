// // console.log("JavaScript fundamentals");
// // console.log("=======================");

// // console.log("Variable declaration in JS");

// // // Java 
// // // int num = 10;

// // // JavaScript
// // // num1 = 10; // do not use this 
// // // var num2 = 20; // do not use this too 

// // const num3 = 30; // default choice to declare variable 
// // let num4 = 40; // to declare "variable" variables

// // console.log(num1);
// // console.log(num2);
// // console.log(num3);
// // console.log(num4);
// // // num3 = 35; // error 
// // num4 = 45;
// // console.log(num3);
// // console.log(num4);

// // console.log("JavaScript - dynamically typed language");
// // console.log("---------------------------------------");
// // console.log("datatypes in JS - number, string, boolean, undefined, NaN ...");  

// // let myVariable;
// // console.log(myVariable);
// // console.log(typeof myVariable);
// // myVariable = 10;
// // console.log(myVariable);
// // console.log(typeof myVariable);
// // myVariable = 20;
// // console.log(myVariable);
// // console.log(typeof myVariable);
// // myVariable = -15;
// // console.log(myVariable);
// // console.log(typeof myVariable);
// // myVariable = 10.50;
// // console.log(myVariable);
// // console.log(typeof myVariable);
// // myVariable = "abc";
// // console.log(myVariable);
// // console.log(typeof myVariable);
// // myVariable = false;
// // console.log(myVariable);
// // console.log(typeof myVariable);


// // let field1 = 10;
// // // let field2 = 20;
// // // let field2 = "20";
// // let field2 = "a";
// // console.log(field1 + field2);
// // console.log(field1 - field2);
// // console.log(field1 * field2);
// // console.log(field1 / field2);
// // console.log(field1 % field2);

// let x = 10;
// let y;
// console.log(x + y); // NaN 
// console.log(x - y); // NaN 

// console.log("Truthy and falsy values in JS");
// console.log('Falsy values - undefined, NaN, null, 0, "", false');
// console.log('Truthy values - everything else');

// let input = 1;

// // if input is given, print 'yes' else print 'no'

// if (input) {
//     console.log("Yes");
// }
// else {
//     console.log("No");
// }

// console.log("special comparison operators === and !==");

// let x = 10;
// let y = "10";

// console.log(x == y); // true 
// console.log(x === y); // false 
// console.log(x != y); // false 
// console.log(x !== y); // true 

// console.log("String literals in JS");
// console.log("---------------------");

// const firstName = "Sonu"; // double quotes 
// const lastName = 'Reddy'; // single quotes 
// const city = `Hyderabad`; // backticks 
// // const fullName = firstName + " " + lastName + " " + city; // valid string concatenation 
// const fullName = `${firstName} ${lastName} ${city}`;
// console.log(fullName);

// console.log("Arrays and Objects in JS");
// console.log("------------------------");

const myFrinds = ["Sonu", "Monu", "Tonu", "Ponu"];
console.log(myFrinds);

console.log("Iterate array using for loop: ");
for (let i = 0; i < myFrinds.length; i++)
    console.log(myFrinds[i]);

console.log("Iterate array using for in loop: ");
for (let i in myFrinds) 
    console.log(myFrinds[i]);

console.log("Iterate array using for of loop: ");
for (let friend of myFrinds) 
    console.log(friend);

console.log("Iterate array using forEach function: ");
myFrinds.forEach(f => console.log(f));