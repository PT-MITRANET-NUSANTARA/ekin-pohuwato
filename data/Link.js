import { AuditOutlined, SnippetsOutlined, CalendarOutlined, FieldTimeOutlined, DashboardOutlined, SettingOutlined, RocketOutlined, BlockOutlined, UserSwitchOutlined, VerifiedOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import path from 'path';

export const DashboardLink = [
    {
        icon: DashboardOutlined,
        label: 'Dashboard',
        path: '/dashboard'
    },

    {
        icon: RocketOutlined,
        label: 'Visi Misi Periode',
        children: [
            {
                label: 'Periode',
                path: '/dashboard/periode'
            },
            {
                label: 'Visi',
                path: '/dashboard/visi'
            },
            {
                label: 'Misi',
                path: '/dashboard/misi'
            }
        ]
    },
    {
        icon: SnippetsOutlined,
        label: 'Renstra',
        children: [
            {
                label: 'Renstra',
                path: '/dashboard/renstra'
            },
            {
                label: 'Tujuan',
                path: '/dashboard/tujuan'
            },
            {
                label: 'Program',
                path: '/dashboard/programs'
            },
            {
                label: 'Kegiatan',
                path: '/dashboard/kegiatans'
            },
            {
                label: 'Sub Kegiatan',
                path: '/dashboard/subkegiatans'
            }
        ]
    },

    {
        icon: CalendarOutlined,
        label: 'RKT',
        children: [
            {
                label: 'Periode RKT',
                path: '/dashboard/periode_rkt'
            },
            {
                label: 'RKT',
                path: '/dashboard/rkt'
            }
        ]
    },

    // {
    //   icon: FieldTimeOutlined,
    //   label: 'Feedback Harian',
    //   path: "/dashboard/harians",
    // },
    {
        icon: AuditOutlined,
        label: 'SKP',
        path: '/dashboard/skp'
    },
    {
        icon: FieldTimeOutlined,
        label: 'Harian',
        path: '/dashboard/harians'
    },
    {
        icon: BlockOutlined,
        label: 'TPP',
        path: '/dashboard/tpp'
    },
   

  
    {
        icon: UserSwitchOutlined,
        label: 'UMPEG',
        children: [
            {
                label: 'Monitoring Kinerja',
                path: '/dashboard/monitoring_kinerja'
            }
        ]
    },
    {
        icon: UsergroupAddOutlined,
        label: 'Verifikator',
        children: [
            {
                label: 'Verifikasi SKP',
                path: '/dashboard/verifikasi_skp'
            },
            {
                label: 'JPT',
                path: '/dashboard/jpt'
            }
        ]
    },
    {
        icon: SettingOutlined,
        label: 'Settings',
        children: [
            {
                label: 'Verifikator Setting',
                path: '/dashboard/verifikator_settings'
            },
            {
                label: 'UMPEG Settings',
                path: '/dashboard/umpeg_settings'
            },
            {
                label: 'Web Settings',
                path: '/dashboard/web_settings'
            }
        ]
    },
];
