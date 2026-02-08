const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// database
const userData = require('./userModel');

// home page
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/home', (req, res) => {
    res.render('home');
});

// create user 
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
    res.redirect('/login?msg=' + encodeURIComponent('User created successfully'));
})

// login 
app.get('/login', (req, res) => {
    const msg = req.query.msg || '';
    res.render('userLogin', { msg });
});

// post login from
app.post('/login', async (req, res)=>{
    const { userid, password } = req.body;
    const user = await userData.findOne({ userid, password });
    if(user){
        res.redirect(`/profile/${userid}`);
    } 
    else{
        res.render('userLogin', { msg: 'Please enter correct id and password' });
    }
    
})

// show profile
app.get('/profile/:userid', async (req, res)=>{
    const userid = req.params.userid;
    const user = await userData.findOne({userid});
    if(user){
        res.render('userProfile', {userid: user.userid, name: user.name, email: user.email});
    }
    else{
        res.render('userLogin', { msg: 'Please enter correct id and password' })
    }
})

// delete profile
app.get('/delete/:userid', async(req, res)=>{
    const userid = req.params.userid;
    const user = await userData.findOneAndDelete({userid});
    if(user){
        res.render('home', {msg: 'Profile Deleted Successfully'});
    }
    else{
        res.render('home', { msg: 'Please enter correct id and password' });
    }
})

// edit profile
app.get('/edit/:userid', async (req, res)=>{
    const userid = req.params.userid;
    const user = await userData.findOne({userid});
    if(user){
        res.render('edit', {userid, name: user.name, email: user.email, password: user.password});
    }
    else{
        res.render('userLogin', { msg: `Cannot Edit user: ${userid}` });
    }
})

// edit profile post
app.post('/edit/:userid', async (req, res)=>{
    const userID = req.params.userid;
    const {userid, name, email, password} = req.body;
    await userData.findOneAndUpdate({userid: userID}, {userid, name, email, password});
    res.redirect(`/profile/${userid}`)
})

// List of all users

app.get('/list-user', async(req, res)=>{
    const user_list = await userData.find();
    res.render('list-user', {user_list});
})



app.listen(3000);
