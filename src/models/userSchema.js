import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const userSchema = new Schema({
    userId: String,
    orderNo: {type: Number, default: 0}
});
mongoose.model('users', userSchema);
