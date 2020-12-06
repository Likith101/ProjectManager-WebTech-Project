const fetch = require('node-fetch')

const URL = 'http://localhost:8000'

async function loadT(teamNumber) {
    
    let token = localStorage.getItem('x-access-token')

    if(!token)
    {
        return 0
    }

    let res = await fetch(`${URL}/api/tasks/${teamNumber}/loadT`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    })

    if(res.status === 200)
    {
        var temp = await res.json()
        
        return temp
    }
    else
    {
        return 0
    }
}

async function loadST(taskId) {

    let token = localStorage.getItem('x-access-token')

    if(!token)
    {
        return 0
    }

    let res = await fetch(`${URL}/api/tasks/${taskId}/loadST`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    })

    if(res.status === 200)
    {
        var temp = await res.json()
        return temp
    }
    else
    {
        return 0
    }
}

async function createT(teamNumber) {
    
    let token = localStorage.getItem('x-access-token')

    if(!token)
    {
        return 0
    }

    let res = await fetch(`${URL}/api/tasks/${teamNumber}/createT`, {
        method: 'GET',
        headers: {
            'Content-Type': 'applications/json',
            'x-access-token': token
        }
    })

    if(res.status === 200)
    {
        var temp = res.json()
        return temp
    }
    else
    {
        return 0
    }
}

async function createST(taskId) {

    let token = localStorage.getItem('x-access-token')

    if(!token)
    {
        return 0
    }

    let res = await fetch(`${URL}/api/tasks/${taskId}/createST`, {
        method: 'GET',
        headers: {
            'Content-Type': 'applications/json',
            'x-access-token': token
        }
    })

    if(res.status === 200)
    {
        var temp = res.json()
        return temp
    }
    else
    {
        return 0
    }
}

async function deleteT(taskId) {

    let token = localStorage.getItem('x-access-token')

    if(!token)
    {
        return 0
    }

    let res = await fetch(`${URL}/api/tasks/${taskId}/deleteT`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'applications/json',
            'x-access-token': token
        }
    })

    if(res.status === 200)
    {
        return 1
    }
    else
    {
        return 0
    }
}

async function deleteST(taskId) {

    let token = localStorage.getItem('x-access-token')

    if(!token)
    {
        return 0
    }

    let res = await fetch(`${URL}/api/tasks/${taskId}/deleteST`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'applications/json',
            'x-access-token': token
        }
    })

    if(res.status === 200)
    {
        return 1
    }
    else
    {
        return 0
    }
}

async function renameT(taskId, taskName) {

    let token = localStorage.getItem('x-access-token')

    if(!token)
    {
        return 0
    }

    var body = {
        taskName: taskName
    }

    let res = await fetch(`${URL}/api/tasks/${taskId}/${taskName}/renameT`, {
        method: 'POST',
        headers: {
            'Content-Type': 'applications/json',
            'x-access-token': token
        },
        body: JSON.stringify(body)
    })

    if(res.status === 200)
    {
        return 1
    }
    else
    {
        return 0
    }
}

async function updateST(taskId, taskStatus) {

    let token = localStorage.getItem('x-access-token')

    if(!token)
    {
        return 0
    }

    var body = {
        taskStatus: taskStatus
    }

    let res = await fetch(`${URL}/api/tasks/${taskId}/${taskStatus}/updateST`, {
        method: 'POST',
        headers: {
            'Content-Type': 'applications/json',
            'x-access-token': token
        },
        body: JSON.stringify(body)
    })

    if(res.status === 200)
    {
        return 1
    }
    else
    {
        return 0
    }
}

exports.loadT = loadT
exports.loadST = loadST
exports.createT = createT
exports.createST = createST
exports.deleteT = deleteT
exports.deleteST = deleteST
exports.renameT = renameT
exports.updateST = updateST