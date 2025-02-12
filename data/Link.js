import { AuditOutlined, SnippetsOutlined, CalendarOutlined, FieldTimeOutlined, DashboardOutlined, SettingOutlined, RocketOutlined, BlockOutlined, UserSwitchOutlined, VerifiedOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import path from 'path';

export const DashboardLink = [
    {
        icon: DashboardOutlined,
        label: 'Dashboard',
        path: '/dashboard',
        permission: ['admin'],
    },

    {
        icon: RocketOutlined,
        label: 'Visi Misi Periode',
        children: [
            // {
            //     label: 'Periode',
            //     path: '/dashboard/periode'
            // },
            {
                label: 'Visi',
                path: '/dashboard/visi',
                permission: ['admin', 'user']
            },
            {
                label: 'Misi',
                path: '/dashboard/misi',
                permission: ['admin', 'user']
            },
        ]
    },
    {
        icon: SnippetsOutlined,
        label: 'Renstra',
        children: [
            {
                label: 'Renstra',
                path: '/dashboard/renstra',
                permission: ['admin', 'user']
            },
            {
                label: 'Tujuan',
                path: '/dashboard/tujuan',
                permission: ['admin', 'user']
            },
            {
                label: 'Program',
                path: '/dashboard/programs',
                permission: ['admin', 'user']
            },
            {
                label: 'Kegiatan',
                path: '/dashboard/kegiatans',
                permission: ['admin', 'user']
            },
            {
                label: 'Sub Kegiatan',
                path: '/dashboard/subkegiatans',
                permission: ['admin', 'user']
            }
        ]
    },

    {
        icon: CalendarOutlined,
        label: 'RKT',
        children: [
            {
                label: 'Periode RKT',
                path: '/dashboard/periode_rkt',
                permission: ['admin', 'user']
            },
            {
                label: 'RKT',
                path: '/dashboard/rkt',
                permission: ['admin', 'user']
            }
        ]
    },

    {
        icon: AuditOutlined,
        label: 'SKP',
        path: '/dashboard/skp',
        permission: ['admin', 'user']
    },
    {
        icon: FieldTimeOutlined,
        label: 'Harian',
        path: '/dashboard/harians',
        permission: ['admin', 'user']
    },


    {
        icon: UserSwitchOutlined,
        label: 'UMPEG',
        children: [
            {
                label: 'Monitoring Kinerja',
                path: '/dashboard/monitoring_kinerja',
                permission: ['admin', 'user']
            },
            {
                label: 'Absen',
                path: '/dashboard/absen',
                permission: ['admin', 'user']
            },
            {
                label: 'TPP',
                path: '/dashboard/tpp',
                permission: ['admin', 'user']
            },
        ]
    },
    {
        icon: UsergroupAddOutlined,
        label: 'Verifikator',
        children: [
            {
                label: 'Verifikasi SKP',
                path: '/dashboard/verifikasi_skp',
                permission: ['admin', 'user']
            },
            // {
            //     label: 'JPT',
            //     path: '/dashboard/jpt'
            // }
        ]
    },
    {
        icon: SettingOutlined,
        label: 'Settings',
        children: [
            {
                label: 'Verifikator Setting',
                path: '/dashboard/verifikator_settings',
                permission: ['admin', 'user']
            },
            {
                label: 'UMPEG Settings',
                path: '/dashboard/umpeg_settings',
                permission: ['admin', 'user']
            },
            {
                label: 'Web Settings',
                path: '/dashboard/web_settings',
                permission: ['admin', 'user']
            }
        ]
    },
];
