const express = require('express');
const helmet = require('helmet')
const db = require('./data/db');
// const cors = require('cors');
// server.use(cors());
const server = express();

server.use(helmet());
server.use(express.json());

//http://foo.com?search=bar&sort=asc
//req.query === {search: 'bar', sort: 'asc'}

server.get('/', (req, res) => {
    res.send('Hello!');
});

server.get('/api/users', (req,res) => {
    console.log(req)
    db
    .find()
    .then(users => {
        res.json(users);
    })
    .catch(err => res.status(500).json({error: err}));
});

server.get('/api/users/:id', (req, res) => {
    
    const {id} = req.params;
    if(db.length === 0) {
        return (
            res.status(404).json({message: 'user not found'}, res)
        )
    }
    db
    .findById({id})
    .then(res => {
            res.json(res)
    })
    .catch(err => {
        res.json(err)
    });
});

server.post('/api/users', (req,res) => {
    const {name, bio} = req.body;
    if(!name || !bio) {
        return( 
            res.send({error: 400, message: 'Must provide name and bio'})
        )
    }
    db
    .insert({
        name,
        bio
    })
    .then(response => {
        res.status(201).json(response);
    })
    .catch(err => {
       res.status(500).json({error: err});
    });
});

server.delete('/api/users/:id', function(req, res){
    const {id} = req.params;
    let user;
    db
    .findById(id)
    .then(founduser => {
        user = {...founduser};
        db.remove({id})
        .then(response => {
            res.status(200).json(user);
        })
    })
    .catch(err =>{
        res.status(500).json({error:err});
    });
});

server.put('/api/users/:id', function(req, res) {
    const {id} = req.params;
    const update = req.body;
    db
    .update(id, update)
    .then(count => {
        if (count > 0) {
            db.findById(id).then(users => {
                res.status(200).json(users[0]);
            })
        } else {
            res.status(404).json({msg: 'user not found'});
        }
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

const port = 8000
server.listen(port, () => console.log(`\n=== API running on port ${port} ===\n`))