/** @format */

import { ClipboardList, Database } from "lucide-react";
import { useLocation } from "react-router-dom";

import Logo from "@/assets/logo/verilabs.png";
import { NavLink } from "@/components/NavLink";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

const ROUTE_URL = [
	//{ title: "Blacklist Management", url: "/blacklist", icon: ShieldCheck },
	{ title: "Verification Results", url: "/", icon: ClipboardList },
	{ title: "Data Dukcapil", url: "/dukcapil", icon: Database },
	//{ title: "Decision Engine", url: "/", icon: Activity },
	//{ title: "Audit Logs", url: "/audit", icon: FileText },
];

export function AppSidebar() {
	const { state } = useSidebar();
	const collapsed = state === "collapsed";
	const location = useLocation();
	const isActive = (path: string) => location.pathname === path;

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="p-4 border-b border-sidebar-border">
				<div className="flex items-center gap-2">
					<img src={Logo} alt="Verilabs Logo" className="h-16" />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{ROUTE_URL.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={isActive(item.url)}>
									<NavLink
										to={item.url}
										end
										activeClassName="bg-sidebar-accent text-sidebar-primary"
									>
										<item.icon className="h-4 w-4" />
										{!collapsed && <span>{item.title}</span>}
									</NavLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
