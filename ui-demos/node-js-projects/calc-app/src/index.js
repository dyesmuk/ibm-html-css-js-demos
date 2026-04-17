// index.js 

// https://github.com/dyesmuk/ibm-html-css-js-demos/blob/main/courseware/03-js/09_Modules_ES6.md#exercises 
// Create a math.js module that exports add, subtract, multiply, divide as named exports and a Calculator class as the default export. 

console.log("-- welcome to calc app --");

// // 1. Named Export 
// import { addNums, subNums, divNums, multiNums } from "./math.js";

// addNums(10, 20);
// subNums(10, 5);
// divNums(10, 5);
// multiNums(10, 20);

// // 2. Default Export 
import math from "./math.js";
math.addNums(10, 20);
math.subNums(10, 5);
math.divNums(10, 5);
math.multiNums(10, 20);

