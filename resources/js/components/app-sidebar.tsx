import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useSlug } from '@/hooks/useSlug';
import {
    Activity,
    BarChart3,
    Bell,
    Building2,
    FileText,
    LayoutGrid,
    Settings,
    UserPlus,
    Users,
    Workflow,
} from 'lucide-react';
import AppLogo from './app-logo';

const getMainNavItems = (slug?: string, userRole?: string): NavItem[] => {
    const baseItems: NavItem[] = [
        {
            title: '儀表板',
            href: slug ? dashboard(slug).url : '#',
            icon: LayoutGrid,
        },
    ];

    // 根據用戶角色添加不同的選單項目
    if (userRole === 'admin' || userRole === 'manager') {
        baseItems.push(
            {
                title: '用戶管理',
                href: '/users',
                icon: Users,
            },
            {
                title: '部門管理',
                href: '/departments',
                icon: Building2,
            },
            {
                title: '組織設定',
                href: '/organization/settings',
                icon: Settings,
            }
        );
    }

    // 所有用戶都可以看到的選單
    baseItems.push(
        {
            title: '表單管理',
            href: '/forms',
            icon: FileText,
        },
        {
            title: '工作流程',
            href: '/workflows',
            icon: Workflow,
        }
    );

    // 管理員/主管可看到流程監控
    if (userRole === 'admin' || userRole === 'manager') {
        baseItems.push({
            title: '流程監控',
            href: '/workflows/monitor',
            icon: Activity,
        });
    }

    // 管理員專用選單
    if (userRole === 'admin') {
        baseItems.push(
            {
                title: '統計報表',
                href: '/reports',
                icon: BarChart3,
            },
            {
                title: '邀請管理',
                href: '/invitations',
                icon: UserPlus,
            },
            {
                title: '通知設定',
                href: '/notifications',
                icon: Bell,
            }
        );
    }

    return baseItems;
};

const getFooterNavItems = (_userRole?: string): NavItem[] => [];

export function AppSidebar() {
    const slug = useSlug();
    const page = usePage();
    const userRole = (page.props as any).auth?.user?.role;
    const mainNavItems = getMainNavItems(slug || undefined, userRole);
    const footerNavItems = getFooterNavItems(userRole);
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={slug ? dashboard(slug).url : '#'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
