import { NotificationContext } from '../context';
import { useContext } from 'react';

export default function useNotification() {
    const notificationContext = useContext(NotificationContext);

    if (!notificationContext) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }

    return notificationContext;
}
