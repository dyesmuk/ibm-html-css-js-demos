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
    console.log("-- login --");
    try {
        const params = new URLSearchParams();
        params.append('username', 'sonu');
        params.append('password', 'sonu');

        const response = await axios.post(`${BASE_URL}/login`, params);
        const token = response.data;
        console.log(token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
        console.error(error);
    }
};

const getEmployees = async () => {
    console.log("-- getEmployees --");
    try {
        const response = await api.get('/api/v1/employees');
        console.log(response.data[0]);
    } catch (error) {
        console.error(error);
    }
};

const getEmployeeById = async (id) => {
    console.log("-- getEmployeeById --");
    try {
        console.log(id);
        const response = await api.get(`/api/v1/employees/${id}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

const run = async () => {
    console.log("-- run --");
    await login();
    await getEmployees();
    // call the method with any id e.g. oid_03001
    await getEmployeeById('oid_03001');
};

run();