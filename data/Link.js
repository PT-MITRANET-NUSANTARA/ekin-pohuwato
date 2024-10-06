import { AuditOutlined, SnippetsOutlined, CalendarOutlined, FieldTimeOutlined, DashboardOutlined, SettingOutlined } from '@ant-design/icons';
import path from 'path';


export const DashboardLink = [
    {
      icon: DashboardOutlined,
      label: 'Dashboard',
      path: "/dashboard",
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
      path: "/dashboard/rkt",
    },
    {
      icon: FieldTimeOutlined,
      label: 'Harians',
      path: "/dashboard/harians",
    },
    {
      icon: AuditOutlined,
      label: 'SKP',
      path: "/dashboard/skp",
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
