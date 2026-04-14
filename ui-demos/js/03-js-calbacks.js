
console.log("Callback functions in JavaScript");
console.log("--------------------------------");

// What type of argument to the function to provide? 
// How do you decide that?

// // number
// const fun = (arg) => {
//     console.log(arg * 10);
// };

// fun(10); // function call - 1 // 10 is an anonymous argument 

// const num = 11;
// fun(num); // function call - 2 // 11 is a named argument 

// // string 
// const fun = (arg) => {
//     console.log(`Hi ${arg}!`);
// };
// fun("Sonu");

// // object 
// const fun = (arg) => {
//     console.log(arg.city);
// };
// fun({city: 'Hyderabad', pin: 500001});

// // function as arg  
const fun = (arg) => {
    console.log("fun function called.");
    arg(); // function call 
};

const callbackFun = () => {
    console.log("named callback function called.");
};

fun(callbackFun);

// fun(() => {});
fun(() => { console.log("anonymous callback function called"); });
