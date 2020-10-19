import monggose from 'mongoose';
import { Schema } from 'mongoose';

const ordersSchema = new Schema({
        orderedAt: Date,
        name: String,
        size: String,
        quantity:  {type: Number, default: 0},
        ItemName: String,
        Address: String,
        orderId: String, 
});

module.exports = ordersSchema;