const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// database
const userData = require('./userModel');

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('userLogin');
});

app.post('/login', async (req, res)=>{
    const { userid, password } = req.body;
    const user = await userData.findOne({ userid, password });
    if(user){
        res.redirect('/logged-in');
    }
    else{
        res.redirect('/');
    }
})

app.get('/logged-in', (req, res)=>{
    res.send('Logged in succesfully')
})

app.get('/create-user', (req, res) => {
    res.render('createUser');
});

app.post('/create-user', async (req, res)=>{
    const { name, email, id, password } = req.body;
    const user = await userData.create({
        userid: id,
        name,
        password,
        email
    });
    res.send(user);
})


app.listen(3000);
