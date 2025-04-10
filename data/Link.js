import { AuditOutlined, SnippetsOutlined, CalendarOutlined, FieldTimeOutlined, DashboardOutlined, SettingOutlined, RocketOutlined, BlockOutlined, UserSwitchOutlined, VerifiedOutlined, UsergroupAddOutlined, IdcardOutlined } from '@ant-design/icons';
import path from 'path';

export const DashboardLink = [
    {
        icon: DashboardOutlined,
        label: 'Dashboard',
        path: '/dashboard',
        permission: ['admin', 'user']
    },

    {
        icon: RocketOutlined,
        label: 'Visi Misi Periode',
        permission: ['admin'],
        children: [
            // {
            //     label: 'Periode',
            //     path: '/dashboard/periode'
            // },
            {
                label: 'Visi',
                path: '/dashboard/visi',
                permission: ['admin']
            },
            {
                label: 'Misi',
                path: '/dashboard/misi',
                permission: ['admin']
            }
        ]
    },
    {
        icon: SnippetsOutlined,
        label: 'Renstra',
        permission: ['admin'],

        children: [
            {
                label: 'Renstra',
                path: '/dashboard/renstra',
                permission: ['admin']
            },
            {
                label: 'Tujuan',
                path: '/dashboard/tujuan',
                permission: ['admin']
            },
            {
                label: 'Program',
                path: '/dashboard/programs',
                permission: ['admin']
            },
            {
                label: 'Kegiatan',
                path: '/dashboard/kegiatans',
                permission: ['admin']
            },
            {
                label: 'Sub Kegiatan',
                path: '/dashboard/subkegiatans',
                permission: ['admin']
            }
        ]
    },

    {
        icon: CalendarOutlined,
        label: 'RKT',
        permission: ['admin'],

        children: [
            {
                label: 'Periode RKT',
                path: '/dashboard/periode_rkt',
                permission: ['admin']
            },
            {
                label: 'RKT',
                path: '/dashboard/rkt',
                permission: ['admin']
            },
            {
                label: 'Perjanjian Kinerja',
                path: '/dashboard/perjanjian_kinerja',
                permission: ['admin']
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
        permission: ['admin', 'umpeg'],
        children: [
            {
                label: 'Monitoring Kinerja',
                path: '/dashboard/monitoring_kinerja',
                permission: ['admin', 'umpeg']
            },
            {
                label: 'Absen',
                path: '/dashboard/absen',
                permission: ['admin', 'umpeg']
            },
            {
                label: 'TPP',
                path: '/dashboard/tpp',
                permission: ['admin', 'umpeg']
            },
            {
                label: 'JPT',
                path: '/dashboard/jpt',
                permission: ['admin', 'umpeg']
            }
        ]
    },

    {
        icon: UsergroupAddOutlined,
        label: 'Verifikator',
        permission: ['admin', 'verificator'],
        children: [
            {
                label: 'Verifikasi SKP',
                path: '/dashboard/verifikasi_skp',
                permission: ['admin', 'verificator']
            }
            // {
            //     label: 'JPT',
            //     path: '/dashboard/jpt'
            // }
        ]
    },
    {
        icon: SettingOutlined,
        label: 'Settings',
        permission: ['admin'],
        children: [
            {
                label: 'Verifikator Setting',
                path: '/dashboard/verifikator_settings',
                permission: ['admin']
            },
            {
                label: 'UMPEG Settings',
                path: '/dashboard/umpeg_settings',
                permission: ['admin']
            },
            {
                label: 'Web Settings',
                path: '/dashboard/web_settings',
                permission: ['admin']
            }
        ]
    }
];
