console.log("JavaScript");

// Thread.sleep(1000);

// setTimeout(arg1, arg2);
// setTimeout(() => {}, timeout);
// setTimeout(() => {}, 500);

// console.log("One");
// setTimeout(() => {
//     console.log("Two");
// }, 2000);
// console.log("Three");

// demo function 
// =============

// const getData = () => {
//     console.log("getData function called.");
//     return { city: "Hyderabad", country: "India" };
// };

// const data = getData();
// console.log(`I live in ${data.city}.`);

// Problems of async JS 
// ====================

// const getData = () => {
//     console.log("getData function called.");
//     setTimeout(() => {
//         return { city: "Hyderabad", country: "India" };
//     }, 1000);
// };

// const data = getData();
// console.log(`I live in ${data.city}.`);

// Solution 1 - use callback function  
// ==================================

const getData = (arg) => {
    console.log("getData function called.");
    setTimeout(() => {
        arg({ city: "Hyderabad", country: "India" });
    }, 1000);
};

const data = getData((data) => { console.log(`I live in ${data.city}.`); });


// Solution 2 - use Promise  
// ==================================


// Solution 3 - use async / await   
// ==================================
