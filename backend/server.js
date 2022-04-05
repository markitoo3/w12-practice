const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 9000;

const fFolder = `${__dirname}/../frontend`;

app.use(express.json());

app.use('/pub', express.static(`${fFolder}/public`));

app.get("/", (request, response, next) => {
    response.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get("/admin/order-view", (request, response, next) => {
    response.sendFile(path.join(`${fFolder}/index.html`));
});

app.get("/kismacska", (request, response, next) => {
    response.sendFile(path.join(`${__dirname}/../frontend/somefile.json`));
});

app.get("/something", (request, response, next) => {
    console.log("Request received for something endpoint.")
    response.send("Thank you for your request! This is our response for something endpoint.")
});

app.get("/api/v1/users", (request, response, next) => {
    console.log("Request received for users endpoint.")

    response.sendFile(path.join(`${__dirname}/../frontend/users.json`));
});

app.get("/api/v1/users-query", (request, response, next) => {
    /* console.dir(request.query)
    console.log(request.query.apiKey) */
    if (request.query.apiKey === "apple") {
        response.sendFile(path.join(`${__dirname}/../frontend/users.json`))
    } else {
        response.send("unauthorized request")
    }
    
});

/* app.get("/api/v1/users-params/:key", (request, response) => {
    console.dir(request.params);
    console.log(request.params.key);
    if (request.params.key === "apple") {
        response.send("Alma")
    } else {
        response.send("Nem alma")
    }
    
}); */

//az alatta lévő active, passive-al megegyező, 1 get requesttel letudva

app.get('/api/v1/users-params/:key',(req, res, next) => {
    fs.readFile('../frontend/users.json', (error, data) => {
        const users = JSON.parse(data);
        if (req.params.key === 'active') {
            res.send(users.filter(user => user.status === "active"));
        } else if (req.params.key === 'passive'){
            res.send(users.filter(user => user.status === "passive"));
        } else {
            res.send(`Parameter does not exist `);
        };
    });
});

/* app.get("/api/v1/users/active", (request, response, next) => {
    fs.readFile("../frontend/users.json", (error, data) => {
        if (error) {
            response.send("Error just happened")
        } else {
            const users = JSON.parse(data)
            // const activeUsers = users.filter(user => user.status === "active")
            response.send(users.filter(user => user.status === "active"))
        }
    })
});


app.get("/api/v1/users/passive", (request, response, next) => {
    fs.readFile("../frontend/users.json", (error, data) => {
        if (error) {
            response.send("Error just happened")
        } else {
            const users = JSON.parse(data)
            // const activeUsers = users.filter(user => user.status === "active")
            response.send(users.filter(user => user.status === "passive"))
        }
    })
}); */

app.post("/users/new", (req, res) => {
    fs.readFile(`${fFolder}/users.json`, (error, data) => {
        if (error) {
            console.log(error);
            res.send("Error reading users file")
        } else {
            const users = JSON.parse(data);
            console.log(req.body);
            users.push(req.body)

            fs.writeFile(`${fFolder}/users.json`, JSON.stringify(users), error => {
                if(error) {
                    console.log(error);
                    res.send("Error writing users file");
                }
            })
            res.send(req.body)
        }
    })
})

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
})