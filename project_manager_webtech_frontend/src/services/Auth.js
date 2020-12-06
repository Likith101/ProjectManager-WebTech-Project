const fetch = require('node-fetch');

const URL = 'http://localhost:8000';

async function login(data) {
    var body = {
        userName: data.user,
        password: data.password
    };
    let res = await fetch(`${URL}/api/auth/userLogin`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if(res.status == 200){
        var token = res.headers.get("x-auth-token");
        localStorage.setItem('x-access-token',token);
        return 1;
    }
    else return 0
}

async function register(data){

    var body = {
        userName: data.user,
        email: data.email,
        password: data.password
    };
    let res = fetch(`${URL}/api/auth/userCreate`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(res.status == 200){
        var token = res.headers.get("x-auth-token");
        localStorage.setItem('x-access-token', token);
        return 1;
    } else return 0;
}

async function auth(){
    let token = localStorage.getItem('x-access-token');
    //console.log(token);
    if(!token) return 0;
    let res = await fetch(`${URL}/api/auth/current`, {
        method: 'GET',
        headers: {
            'x-access-token': token
        }
    })
    test = await res.text();
    if(res.status == 200) return JSON.parse(test);
    else return 0;
}

exports.login = login;
exports.register = register;
exports.auth = auth;