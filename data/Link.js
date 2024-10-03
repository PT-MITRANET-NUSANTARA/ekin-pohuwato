import { DatabaseOutlined, SnippetsOutlined } from '@ant-design/icons';
import path from 'path';


export const DashboardLink = [
    {
      icon: DatabaseOutlined,
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
        }
      ]
    },
];