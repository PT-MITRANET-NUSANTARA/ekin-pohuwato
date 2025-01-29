"use client"

import PropTypes from 'prop-types';

import { notification } from 'antd';
import { NotificationContext } from '../context';

/**
 * @type {React.Context<{
 *   success: (message: string, description?: string) => void;
 *   error: (message: string, description?: string) => void;
 *   info: (message: string, description?: string) => void;
 *   warning: (message: string, description?: string) => void;
 * }>}
 */

export default function NotificationProvider({ children }) {
    const [api, contextHolder] = notification.useNotification();

    const success = (message, description) => {
        api.success({ message, description });
    };

    const error = (message, description) => {
        api.error({ message, description });
    };

    const info = (message, description) => {
        api.info({ message, description });
    };

    const warning = (message, description) => {
        api.warning({ message, description });
    };

    return (
        <NotificationContext.Provider value={{ success, error, info, warning }}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
}

NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired
};
