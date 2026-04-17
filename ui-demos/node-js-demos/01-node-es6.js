console.log("ES6 Concepts");
// console.log("------------");

// // old js function 
// function fun1() { console.log("fun1 called."); }

// // modern js functions Arrow function 
// const fun2 = () => { console.log("fun2 called"); };
// const fun3 = () => console.log("fun2 called");
// const fun4 = (arg) => { return arg * 10 };
// const fun5 = (arg) => arg * 10;

// ES == EcmaScript 
// ES6 2015 -> Modern JavaScript 

// ES6 features - 
// let, const, arrow funtions etc 

// array destructring, object destructuring 
// rest and spread - 

// rest operator - ...
// const addNums = (a, b) => { console.log(a + b);};
// addNums(10, 20);
// addNums(10, 20, 30);
// addNums(10, 20, 30, 40);
// addNums(10, 20, 30, 40, 50);

// // option 1 = use array as arg 
// const addNums = (arr) => {
//     let sum = 0;
//     for (let a of arr) {
//         sum += a;
//     }
//     console.log(sum);
// };
// addNums([10, 20]);
// addNums([10, 20, 30]);
// addNums([10, 20, 30, 40]);

// option 2 = use rest operator  ...
// rest -> collect and pack 
// spread -> destructure or unpack 

// const addNums = (...arr) => {
//     let sum = 0;
//     for (let a of arr) {
//         sum += a;
//     }
//     console.log(sum);
// };
// addNums(10, 20);
// addNums(10, 20, 30);
// addNums(10, 20, 30, 40);
// addNums(10, 20, 30, 40, 50);

const friends = ["Sona", "Sonu", "Monu", "Tonu", "Ponu"];
console.log(friends);

[besty, ...closeFriends] = friends;

console.log(besty); // Sona 
console.log(closeFriends); // others 

// spread - 
const arr1 = [0, 1, 2];
const arr2 = [3, 4, 5];
const arr3 = [...arr1, ...arr2];
console.log(arr3);





