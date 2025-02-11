import mongoose, { Document, Schema, Model } from 'mongoose';

enum NotificationType {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    SUCCESS = 'success'
}

interface INotification extends Document {
    user_id: string;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface NotificationModel extends Model<INotification> {
    markAsRead(notificationId: string): Promise<void>;
    getAll(userId: string, page?: number, limit?: number): Promise<{ data: INotification[]; pagination: object }>;
}

const NotificationSchema = new Schema<INotification, NotificationModel>(
    {
        user_id: {
            type: String,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            default: NotificationType.INFO
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

NotificationSchema.static('markAsRead', async function (notificationId: string) {
    await this.findByIdAndUpdate(notificationId, { read: true });
});

NotificationSchema.static('getAll', async function (userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const query = this.find({ user: userId }).sort({ createdAt: -1 });

    const [results, total] = await Promise.all([query.skip(skip).limit(limit), this.countDocuments({ user: userId })]);

    return {
        data: results,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            pageSize: limit
        }
    };
});

const Notification: NotificationModel = (mongoose.models.Notification as NotificationModel) || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
