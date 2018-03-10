var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

exports.User = new Schema({
    Name: String,    
    Email: String,
    Password: String,
    IsActive: Boolean,
    IsDeleted: Boolean
});
exports.htl = new Schema({
    
});

var OrderItem = new Schema({
    itemCode: String,
    itemName: String,
    quantity: Number,
    rate: Number,
    customisation: String
},{ _id : false });

exports.Order = new Schema({
    tableNo: String,
    EmpName:{ type: String, default: "" },
    status: { type: String, default: "open" },
    orderItems: [OrderItem]
},
{ versionKey: false });


exports.CollectionTypes = {
    User: "user",
    Htl:"htl",
    Order:"order",
};










