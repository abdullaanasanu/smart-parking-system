var express = require('express');
var cors = require('cors'); // Use cors module for enable Cross-origin resource sharing
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/smart-parking');
let db = mongoose.connection;

db.once('open', function() {
    console.log('DB Connected!');
});

db.on('error', function(err){
    console.log(err);
})

var app = express();
app.use(cors()); // for all routes

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

let Users = require('./models/users');
let Cars = require('./models/cars');
let Tokens = require('./models/tokens');
let Slots = require('./models/slots');
let Parkings = require('./models/parkings');
let History = require('./models/history');

var port = process.env.PORT || 3000;
app.get('/', function(req, res) {
    var info = {
        'name': 'Smart Parking','number_value': 8476
    }
    //res.json(info);
    // or
    /* res.send(JSON.stringify({
    string_value: 'StackOverflow',
    number_value: 8476
    })) */
    //you can add a status code to the json response
    res.status(200).json(info);
});

app.post('/api/sp/signup', function(req, res) {
    const fullName = req.body.newUserFullName;
    const email = req.body.newUserEmail;
    const password = req.body.newUserPassword;
    const mobile = req.body.newUserMobileNumber; 

    let newUser = new Users({
        fullName, email, password, mobile, wallet: 0
    });

    bcrypt.genSalt(12, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if(err) {
                console.log(err);
            }else{
                newUser.password = hash;
                newUser.save(function(err){
                    if(err) {
                        console.log(err);
                    }else{
                        res.status(200).send(JSON.stringify({message: 'Account Created!',resCode: 0}));
                    }
                })
            }
        });
    });
})
 
app.post('/api/sp/login', function(req, res) {
    const email = req.body.userEmail;
    const password = req.body.userPassword;
    Users.findOne({email}, function(err, usr) { 
        if(err) throw err;
        if(usr){
            bcrypt.compare(password, usr.password, function(err, result) {
                if(result){
                    console.log('LoggedIn');
                    var token = jwt.sign({id: usr._id, email: usr.email}, 'cars');
                    res.status(200).send(JSON.stringify({message: 'LoggedIn',token ,resCode: 0}));
                }else{
                    console.log('Nope');
                    res.status(200).send(JSON.stringify({message: 'Password incorrect!',resCode: 2}));
                }
            });
        }else{
            res.status(200).send(JSON.stringify({message: 'Email not found',resCode: 1}));
        }
    })
})

app.get('/api/sp/auth/:token', function(req,res) {
    const token = req.params.token;
    var decoded = jwt.verify(token, 'cars');
    Users.findOne({_id: decoded.id}, function(err, usr) { 
        if(err) throw err;
        if(usr){
            usr.password ='';
            res.status(200).send(JSON.stringify({message: 'LoggedIn', authData: usr ,resCode: 0}));
        }else{
            res.status(200).send(JSON.stringify({message: 'Not LoggedIn!',resCode: 1}));
        }
    })
})

app.get('/api/sp/my-cars/:token', function(req,res) {
    const token = req.params.token;
    var decoded = jwt.verify(token, 'cars');
    Users.findOne({_id: decoded.id}, function(err, usr) { 
        if(err) throw err;
        if(usr){
            Cars.find({UserId: usr._id}, function(err, cars) {
                if(err) throw err;
                if(cars){
                    res.status(200).send(JSON.stringify({message: 'Cars selected', data: cars ,resCode: 0}));
                }else{
                    res.status(200).send(JSON.stringify({message: 'No Cars Available',resCode: 2}));
                }
            })
        }else{
            res.status(200).send(JSON.stringify({message: 'Not LoggedIn!',resCode: 1}));
        }
    })
})

app.post('/api/sp/add-car/:token', function(req,res){
    const token = req.params.token;
    var decoded = jwt.verify(token, 'cars');
    const carNumber = req.body.newCarNumber;
    Users.findOne({_id: decoded.id}, function(err, usr) { 
        if(err) throw err;
        if(usr){
            let newCars = new Cars({
                carNumber, UserId: usr._id
            });
            newCars.save(function(err){
                if(err) {
                    console.log(err);
                    res.status(400);
                }else{
                    res.status(200).send(JSON.stringify({message: 'Car Added!',resCode: 0}));
                }
            })
            
        }else{
            res.status(200).send(JSON.stringify({message: 'Not LoggedIn!',resCode: 1}));
        }
    })
})

app.post('/api/sp/recharge/:token', function(req,res) {
    const token = req.params.token;
    var decoded = jwt.verify(token, 'cars');
    const rechargeToken = req.body.rechargeToken;
    //console.log(rechargeToken);
    Users.findOne({_id: decoded.id}, function(err, usr) { 
        if(err) throw err;
        if(usr){
            Tokens.findOne({Token: rechargeToken}, function(err,tkn){
                if(err) throw err; 
                if(tkn) {
                    var wallet = tkn.Amount;
                    wallet = wallet + usr.wallet;
                    Tokens.remove({Token: rechargeToken}, function(err) { 
                        if(err) throw err;
                        Users.update({_id: decoded.id}, {wallet}, function(err) {
                            if(err){
                                console.log(err);
                                return;
                            }else{
                                res.status(200).send(JSON.stringify({message: 'Wallet Recharged!',resCode: 0}));
                            }

                        })
                    })
                }else{
                    res.status(200).send(JSON.stringify({message: 'Invalid Recharge Token!',resCode: 2}));
                }
            })
            
        }else{
            res.status(200).send(JSON.stringify({message: 'Not LoggedIn!',resCode: 1}));
        }
    })
})

app.get('/api/sp/slot-lock/:id', function(req,res) {
    const id = req.params.id;
    var slot;
    if(id == "1"){
        slot = "p1";
    }else if (id == "2"){
        slot = "p2";
    }else{
        slot = "ent"
    }
    console.log("Parking "+slot);
    Parkings.findOne({Slot: "ent"}, function(err, prk) {
        if(prk){
            Slots.findOne({SlotId: slot}, function(err, slt) {
                if(slt.Status == 1) {
                    Parkings.update({carNumber: prk.carNumber}, {carNumber: prk.carNumber, Slot: slot, UserId: prk.UserId}, function(err) {
                        if(err) {
                            console.log(err);
                        }else{
                            Slots.update({SlotId: slot}, {SlotId: slot, Status: 2}, function(err){
                                console.log(slot + ' Parking with number - ' + prk.carNumber);
                                if(err) throw err;
                                res.status(200).send(JSON.stringify({message: 'Slot Updated with parking status on!',resCode: 0}));
                            })
                        }
                    })
                }else{
                    res.status(200).send(JSON.stringify({message: 'Slot Already Updated!',resCode: 2}));
                }
            })
            
        }else{
            res.status(200).send(JSON.stringify({message: 'Slot Already Updated!',resCode: 2}));
        }
    })
    
})

app.get('/api/sp/slot-unlock/:id', function(req,res) {
    const id = req.params.id;
    var slot;
    if(id == "1"){
        slot = "p1";
    }else if (id == "2"){
        slot = "p2";
    }else{
        slot = "ent"
    } 
    console.log("Free "+slot);
    Parkings.findOne({Slot: slot}, function(err, prk) {
        if (prk) {
            var now = new Date();
            var diff = now - prk.Time;
            var hrs = diff/3600000;
            hrs = Math.ceil(hrs);
            var cost = hrs * 20;
            var record = new History({
                carNumber: prk.carNumber, Slot: slot, EntryTime: prk.Time, Hours: hrs, Cost: cost, UserId: prk.UserId
            });
            record.save(function(err) {
                if(err) {
                    console.log(err);
                }else{
                    Users.findOne({_id: prk.UserId}, function(err, usr) {
                        if(usr){
                            var wallet = usr.wallet - cost;
                            Users.update({_id: prk.UserId}, {$set : {wallet}}, function(err) {
                                if(err) {
                                    console.log(err)
                                }else{
                                    Parkings.remove({Slot: slot}, function(err) {
                                        if(err) throw err;
                                    })
                                    Slots.update({SlotId: slot}, {SlotId: slot, Status: 1}, function(err){
                                        console.log(slot + ' Free from car - '+ prk.carNumber);
                                        if(err) throw err;
                                        res.status(200).send(JSON.stringify({message: 'Slot Updated!',resCode: 0}));
                                    })
                                }
                            })
                        }else{
                            res.status(400);
                        }
                    })
                }
            })
        }else{
            res.status(200).send(JSON.stringify({message: 'Invalid Slot!',resCode: 1}));
        }
    })
    
})

app.get('/api/sp/detected-car/:number', function(req,res) {
    const number = req.params.number;
    Cars.findOne({carNumber: number}, function(err, cars) {
        if(err) throw err;
        if(cars){
            Parkings.findOne({carNumber: number}, function(err, prk) {
                if(err) throw err;
                if(prk){
                    res.status(200).send(JSON.stringify({message: 'Car Already Detected!',resCode: 1}));
                }else{
                    let ParkingCar = new Parkings({
                        carNumber: number, Slot: "ent", UserId: cars.UserId
                    });
                    ParkingCar.save(function(err){
                        if(err) { 
                            console.log(err);
                            res.status(400);
                        }else{
                            res.status(200).send(JSON.stringify({message: 'Car Detected!',resCode: 0}));
                        }
                    });
                }
            })
            
        }else{
            res.status(200).send(JSON.stringify({message: 'Not Registered User',resCode: 2}));
        }
    })
})

app.get('/api/sp/car-at-parking/:token', function(req,res) {
    const token = req.params.token;
    var decoded = jwt.verify(token, 'cars');
    Users.findOne({_id: decoded.id}, function(err, usr) { 
        if(err) throw err;
        if(usr){
            Parkings.find({UserId: usr._id}, function(err, prk) {
                if(err) throw err;
                if(prk){
                    res.status(200).send(JSON.stringify({message: 'Cars selected', data: prk ,resCode: 0}));
                }else{
                    res.status(200).send(JSON.stringify({message: 'No Cars Available',resCode: 2}));
                }
            })
        }else{
            res.status(200).send(JSON.stringify({message: 'Not LoggedIn!',resCode: 1}));
        }
    })
})

app.get('/api/sp/parking-slots/:token', function(req,res) {
    const token = req.params.token;
    var decoded = jwt.verify(token, 'cars');
    Users.findOne({_id: decoded.id}, function(err, usr) { 
        if(err) throw err;
        if(usr){
            Slots.find({}, function(err, slt) {
                if(err) throw err;
                if(slt){
                    res.status(200).send(JSON.stringify({message: 'Slots fetched!', data: slt ,resCode: 0}));
                }else{
                    res.status(400).send(JSON.stringify({message: 'Slot data unavailable!',resCode: 2}));
                }
            })
        }else{
            res.status(200).send(JSON.stringify({message: 'Not LoggedIn!',resCode: 1}));
        }
    })
})


app.get('/api/sp/my-history/:token', function(req,res) {
    const token = req.params.token;
    var decoded = jwt.verify(token, 'cars');
    Users.findOne({_id: decoded.id}, function(err, usr) { 
        if(err) throw err;
        if(usr){
            History.find({UserId: usr._id}, function(err, hst) {
                if(err) throw err;
                if(hst){
                    res.status(200).send(JSON.stringify({message: 'History fetched!', data: hst ,resCode: 0}));
                }else{
                    res.status(200).send(JSON.stringify({message: 'No History Available',resCode: 2}));
                }
            })
        }else{
            res.status(200).send(JSON.stringify({message: 'Not LoggedIn!',resCode: 1}));
        }
    })
})

app.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})
