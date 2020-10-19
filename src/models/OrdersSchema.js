import { Schema } from 'mongoose';

const OrdersSchema = new Schema({
        orderedAt: Date,
        name: String,
        size: String,
        quantity:  {type: Number, default: 0},
        ItemName: String,
        Address: String,
        _orderId: String, 
});

module.exports = OrdersSchema;