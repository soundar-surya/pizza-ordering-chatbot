import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const ordersSchema = new Schema({
        orderedAt: Date,
        name: String,
        quantity:  {type: Number, default: 0},
        Address: String,
        orderId: String,
        userId: String 
});

mongoose.model('orders', ordersSchema);