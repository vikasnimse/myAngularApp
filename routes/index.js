var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('./mongoose-conn');
var schema = require('./schema');
var UserModel = mongoose.model(schema.CollectionTypes.User, schema.User);
var HtlModel = mongoose.model(schema.CollectionTypes.Htl, schema.htl);
var OrderModel = mongoose.model(schema.CollectionTypes.Order, schema.Order);
var jwt = require('jsonwebtoken');
var config = require('../config');


router.get('/', function (req, res) {
    res.render('index');
});
router.get('/home',isAuthenticated, function (req, res) {
    res.render('index');
});
router.get('/login',isAuthenticated, function (req, res) {
    res.render('index');
});
router.get('/user', function (req, res) {
    var user = {
        Name: 'vikas',
        Email: 'v@gmail.com',
        Password: 'vikas',
        IsActive: true,
        IsDeleted: false
    };
    var user = new UserModel(user);
    user.save(function (err, doc) {
        console.log(err, doc);
        res.send(doc);
    });
});
router.get('/api/getdetail', function (req, res) {
    HtlModel.findOne({}, function (err, result) {
        if (err) return console.log(err);
        res.send(result);
    });
});
router.get('/api/orders', function (req, res) {
    OrderModel.find(
        {status: "open", tableNo: {$ne: null}},
        {EmpName: 1, tableNo: 1},
        function (err, result) {
            if (err) return console.log(err);
            res.send(result);
        });
});
router.get('/api/orders/:tableNo', function (req, res) {
    var tblNo = req.params.tableNo;
    OrderModel.findOne({tableNo: tblNo, status: "open"}, function (err, result) {
        if (err) return console.log(err);
        if (!result) {
            return res.send(new OrderModel());
        }
        res.send(result);
    });
});
router.post('/api/orders', function (req, res) {
    var postData = req.body;
    console.log(postData);
    OrderModel.update(
        {tableNo: postData.tableNo, EmpName: postData.EmpName, status: "open"},
        {$push: {"orderItems": postData.orderItem}},
        {upsert: true},
        function (err, result) {
            if (err) return console.log(err);
            res.send(result);
        });
});
router.post('/api/auth', function (req, res) {
    var userModel = req.body;
    var action = userModel.action;
    switch (action) {
        case "setpassw":
            UserModel.find({Email: userModel.username, IsDeleted: false}, function (err, result) {
                if (err)
                    return console.log(err);
                var user = result[0].toJSON();
                user.Password = userModel.password;
                user.IsActive = true;
                UserModel.findByIdAndUpdate(user._id, user, {upsert: true, new: true}, function (err, doc) {
                    if (err)
                        return console.log(err);
                    res.send({status: true});
                });
            });
            break;
        case "signin":
            UserModel.find({
                Name: userModel.username,
                Password: userModel.password
            }, function (err, result) {
                if (err)
                    return console.log(err);
                if (result.length) {
                    var usr = result[0];
                    var token = jwt.sign(usr, config.superSecret);
                    res.cookie('token', token, { maxAge: 1000*24*60*60, httpOnly: true });
                    res.send({status: true});
                }
                else
                    res.send({status: false});
            });
            break;
        case "signout":
            console.log("Log out done");
            res.send({status: false});
            break;
            
    }
});
router.post('/signout', isAuthenticated, function (req, res, next) {
    req.session.destroy();
    res.clearCookie('token');
    res.status(200).send({});

});
function isAuthenticated(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    if (token) {
        jwt.verify(token, config.superSecret, function (err, decoded) {
            if (err) {
                res.redirect("/");
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {
        res.redirect("/");
    }
}
module.exports = router;