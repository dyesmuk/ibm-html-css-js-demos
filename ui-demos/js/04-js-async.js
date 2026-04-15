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

// // Solution 1 - use callback function  
// // ==================================

// const getData = (arg) => {
//     console.log("getData function called.");
//     setTimeout(() => {
//         arg({ city: "Hyderabad", country: "India" });
//     }, 1000);
// };

// const data = getData((data) => { console.log(`I live in ${data.city}.`); });


// // Solution 2 - use Promise  
// // ==================================

// const getData = () => {
//     console.log("getData function called.");
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve({ city: "Hyderabad", country: "India" });
//         }, 1000);
//     });
// };

// getData()
//     .then((data) => {
//         console.log(`I live in ${data.city}.`);
//     })
//     .catch((err) => {
//         console.error("Error:", err);
//     });

// Solution 3 - use async / await   
// ==================================

const getData = () => {
    console.log("getData function called.");
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ city: "Hyderabad", country: "India" });
        }, 1000);
    });
};

const fetchData = async () => {
    try {
        const data = await getData();
        console.log(`I live in ${data.city}.`);
    } catch (err) {
        console.error("Error:", err);
    }
};

fetchData();