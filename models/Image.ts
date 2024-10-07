import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
    url: string; 
    title?: string; 
    description?: string; 
}

const ImageSchema: Schema = new Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Image = mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);

export default Image;
