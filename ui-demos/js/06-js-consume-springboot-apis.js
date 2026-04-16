// console.log("Consume Springboot REST APIs using fetch:");
// console.log("-----------------------------------------");

console.log("get employee by id:");

const apiUrl = "http://localhost:8090/api/v1";
let jwtToken = "";
const employeeId = 2;

// step1 = login and get jwt token 

fetch(`${apiUrl}/login`)
    .then(resp => resp.json())
    .then(resp => jwtToken = resp)
    .catch(err => console.log(err));

// step2 = use the jwt token to get employee data 

fetch(`${apiUrl}/employees/${employeeId}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
    }
})
    .then(resp => resp.json())
    .then(resp => console.log(resp))
    .catch(err => console.log(err));


