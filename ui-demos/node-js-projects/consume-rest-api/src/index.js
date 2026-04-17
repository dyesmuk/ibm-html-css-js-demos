// index.js 
// 

// import axios from 'axios';
// console.log("using axios");

// axios.get('https://jsonplaceholder.typicode.com/users/2')
//     .then(r => console.log(r.data))
//     .catch(e => console.log(e));



console.log("Consume REST APIs");

import axios from 'axios';

const BASE_URL = 'http://localhost:8090';

const api = axios.create({
    baseURL: BASE_URL
});

const login = async () => {
    try {
        const params = new URLSearchParams();
        params.append('username', 'sonu');
        params.append('password', 'sonu');

        const response = await axios.post(`${BASE_URL}/login`, params);
        console.log(response.data);
        const token = response.data.token || response.data.jwtToken || response.data;
        console.log(token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
        console.error(error);
    }
};

const getEmployees = async () => {
    try {
        const response = await api.get('/api/v1/employees');
        console.log('All Employees:', response.data[0]);
    } catch (error) {
        console.error(error);
    }
};

// get employee by id 

const getEmployeeById = (id) => {};

const run = async () => {
    await login();
    await getEmployees();
    await getEmployeeById('oid_03001');
};

run();