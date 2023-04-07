import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    full: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }}, {
        timestamps: true,
    });

export default mongoose.model('Link', LinkSchema);