import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { TOOLS } from "@/lib/tools";
import { useAuth } from "@/hooks/use-auth";

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user } = useAuth();

  const itemClass =
    "h-9 text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:font-semibold";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpenMobile(false)}>
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary font-display text-sm font-bold text-sidebar-primary-foreground">
            W
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-display text-sm font-bold">Workplace AI</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-sidebar-muted">
                Productivity Assistant
              </p>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-wider text-sidebar-muted">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={path === "/"} tooltip="Dashboard" className={itemClass}>
                  <Link to="/" onClick={() => setOpenMobile(false)}>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-wider text-sidebar-muted">
            AI Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TOOLS.map((t) => (
                <SidebarMenuItem key={t.key}>
                  <SidebarMenuButton asChild isActive={path === t.to} tooltip={t.title} className={itemClass}>
                    <Link to={t.to} onClick={() => setOpenMobile(false)}>
                      <t.icon />
                      <span>{t.title.replace("AI ", "").replace("Smart ", "")}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!collapsed && (
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <p className="truncate font-mono text-[10px] text-sidebar-muted">
            {user ? user.email : "Not signed in"}
          </p>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
