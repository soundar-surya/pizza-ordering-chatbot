import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import OrdersSchema from './OrdersSchema';

const userSchema = new Schema({
    userId: String,
    Orders: [OrdersSchema]
});
mongoose.model('users', userSchema);
