import { AuditOutlined, SnippetsOutlined, CalendarOutlined, FieldTimeOutlined, DashboardOutlined, SettingOutlined, RocketOutlined, BlockOutlined } from '@ant-design/icons';
import path from 'path';


export const DashboardLink = [
    {
      icon: DashboardOutlined,
      label: 'Dashboard',
      path: "/dashboard",
    },
   
    {
      icon: RocketOutlined,
      label: 'Visi Misi Periode',
      children: [
      {
          label: "Periode",
          path: "/dashboard/periode"
        },
        {
          label: "Visi",
          path: "/dashboard/visi"
        },
        {
          label: "Misi",
          path: "/dashboard/misi"
        },
       
      ]
    },
    {
      icon: SnippetsOutlined,
      label: 'Renstra',
      children: [
        {
          label: "Renstra",
          path: "/dashboard/renstra",
        },
        {
          label: "Tujuan",
          path: "/dashboard/tujuan"
        },
        {
          label: "Programs",
          path: "/dashboard/programs"
        },
        {
          label: "Kegiatans",
          path: "/dashboard/kegiatans"
        },
        {
          label: "Sub Kegiatans",
          path: "/dashboard/subkegiatans"
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
        },
      ]
    },
    {
      icon: FieldTimeOutlined,
      label: 'Harians',
      path: "/dashboard/harians",
    },
    // {
    //   icon: FieldTimeOutlined,
    //   label: 'Feedback Harian',
    //   path: "/dashboard/harians",
    // },
    {
      icon: AuditOutlined,
      label: 'SKP',
      path: "/dashboard/skp",
    },
    {
      icon: BlockOutlined,
      label: 'TPP',
      path: "/dashboard/tpp",
    },
    {
      icon: SettingOutlined,
      label: 'Settings',
      children: [
        {
          label: "UMPEG Settings",
          path: "/dashboard/umpeg_settings"
        },
        {
          label: "Web Settings",
          path: "/dashboard/web_settings"
        },
        {
          label: "Monitoring Kinerja",
          path: "/dashboard/monitoring_kinerja"
        }
      ]
    },
];
