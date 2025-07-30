"use client"

import { LayoutDashboard, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar"
import { logout } from "@/services/logout"

const navItems = [
  {
    title: "Dashboard Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Faucet Config",
    href: "/admin/config",
    icon: Settings,
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
   await logout();
   router.push("/admin/login")
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar" >
      <SidebarHeader className="flex justify-center pt-4 bg-sui-ocean text-sui-cloud">
     
        <Link href="/admin" className="flex items-center justify-start gap-2 font-semibold">
          <Image src="/sui.svg" alt="SUI Logo" width={16} height={16} className="h-6 w-6 ml-1" />
          <span className="group-data-[collapsible=icon]:hidden ">Suicet.xyz</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-sui-ocean text-sui-cloud flex flex-col justify-between">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div className="mb-4 ml-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
