// math.js

// Types of exports and imports 
// ----------------------------

// 1. Named Export 
// Use {} while importing
// Names must match exactly
// Can export multiple things
// Use when you have multiple utilities/functions

// // // variation 1 
// const addNums = (a, b) => { console.log(a + b); };
// const subNums = (a, b) => { console.log(a - b); };
// const divNums = (a, b) => { console.log(a / b); };
// const multiNums = (a, b) => { console.log(a * b); };
// export { addNums, subNums, divNums, multiNums };

// // variation 2
// export const addNums = (a, b) => { console.log(a + b); };
// export const subNums = (a, b) => { console.log(a - b); };
// export const divNums = (a, b) => { console.log(a / b); };
// export const multiNums = (a, b) => { console.log(a * b); };

// 2. Default Export
// NO {} while importing
// You can give any name during import
// Only one default export per file
// Use when file represents one main thing

const math = {
    addNums: (a, b) => { console.log(a + b); },
    subNums: (a, b) => { console.log(a - b); },
    divNums: (a, b) => { console.log(a / b); },
    multiNums: (a, b) => { console.log(a * b); },
};

export default math;