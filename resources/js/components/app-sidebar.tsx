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
    BookOpen, 
    Folder, 
    LayoutGrid, 
    Building2, 
    Users, 
    FileText, 
    Workflow, 
    BarChart3,
    Settings,
    UserPlus,
    Mail,
    Shield,
    Database,
    Bell
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
            },
            {
                title: '系統設定',
                href: '/system/settings',
                icon: Shield,
            }
        );
    }

    return baseItems;
};

const getFooterNavItems = (userRole?: string): NavItem[] => {
    const items: NavItem[] = [
        {
            title: '說明文件',
            href: '/help',
            icon: BookOpen,
        },
    ];

    // 管理員可以看到更多選項
    if (userRole === 'admin') {
        items.push(
            {
                title: '系統日誌',
                href: '/system/logs',
                icon: Database,
            }
        );
    }

    return items;
};

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
