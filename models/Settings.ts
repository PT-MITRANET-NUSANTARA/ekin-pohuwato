import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISettings extends Document {
    key: string;
    value: string;
    description?: string;
}

const SettingsSchema = new Schema<ISettings>(
    {
        key: {
            type: String,
            required: true,
            unique: true 
        },
        value: {
            type: String,
            required: true
        },
        description: {
            type: String
        }
    },
    { timestamps: true }
);

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
