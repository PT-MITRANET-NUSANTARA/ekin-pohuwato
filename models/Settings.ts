import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISettings extends Document {
    istirahat_start: string;
    istirahat_end: string;
    harian_start: string;
    harian_end: string;
    total_time: number;
    total_feedback: number;
    admin_id: string;
}

const SettingsSchema = new Schema<ISettings>(
    {
        istirahat_start: {
            type: String,
            required: true
        },
        istirahat_end: {
            type: String,
            required: true
        },

        harian_start: {
            type: String,
            required: true
        },

        harian_end: {
            type: String,
            required: true
        },

        total_time: {
            type: Number,
            required: true
        },
        total_feedback: {
            type: Number,
            required: true
        },
        admin_id: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

// Create and export the model
const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
