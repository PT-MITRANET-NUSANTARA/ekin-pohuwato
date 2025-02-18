import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DashboardLink } from '@/data';
import { getPermisionMiddleware } from '@/controller/MiddlewareController';

export async function permissionMiddleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    try {
        const res: any = await getPermisionMiddleware(req);
        const data = await res.json()
        let permissions = new Set(data.data);
        console.log('permision', permissions);

        const allowedRoutes: any = [];
        DashboardLink.forEach((item) => {
            if (Array.isArray(item.children) && item.children.length > 0) {
                item.children.forEach((child) => {
                    allowedRoutes.push({
                        path: child.path,
                        requiredPermissions: child.permission || item.permission
                    });
                });
            } else if (item.path) {
                allowedRoutes.push({
                    path: item.path,
                    requiredPermissions: item.permission
                });
            }
        });

        const matchedRoute = allowedRoutes.find((route: any) => pathname === route.path);
        if (matchedRoute && matchedRoute.requiredPermissions) {
            const hasPermission = matchedRoute.requiredPermissions.some((perm: any) => permissions.has(perm));
            if (!hasPermission) {
                return null;
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }

    return NextResponse.next();
}
