import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const userSchema = new Schema({
    userId: String
});
mongoose.model('users', userSchema);
