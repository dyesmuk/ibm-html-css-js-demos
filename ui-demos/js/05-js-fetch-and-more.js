console.log("JavaScript fetch API");
console.log("---------------------");

console.log("print user details from typicode API:");

const apiUrl = "https://jsonplaceholder.typicode.com/users";

console.log("display user data with id 2:");
const userId = 2;
console.log("option 1 - use fetch().then().then().catch()");

// fetch(apiUrl).then().then().catch();

// fetch(apiUrl).then(resp => resp.json()).then(resp => console.log(resp)).catch(err => console.log(err));
// console.log("display all users: ");
// fetch(apiUrl).then(resp => resp.json()).then(resp => console.log(resp)).catch(err => console.log(err));

// fetch(`${apiUrl}/${userId}`).then(resp => resp.json()).then(resp => console.log(resp)).catch(err => console.log(err));

// fetch(`${apiUrl}/${userId}`)
//     .then((resp) => {
//         console.log(resp);
//         return resp.json();
//     })
//     .then((resp) => {
//         console.log(resp);
//         // console.log(resp.username);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// console.log("option 2 - use async / await");

// const getUserData = async () => {
//     const response = await fetch(`${apiUrl}/${userId}`);
//     if (!response.ok) {
//         throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
//     }
//     const userData = await response.json();
//     console.log(userData);
// }

// getUserData();

