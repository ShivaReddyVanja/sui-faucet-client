"use client"

import { LayoutDashboard, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image" // Import Image component


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail, // For the rail to toggle sidebar [^1]
} from "@/components/ui/sidebar"

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

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {" "}
      {/* Using 'icon' collapsible variant [^1] */}
      <SidebarHeader className="flex items-center justify-center p-4 bg-sui-ocean text-sui-cloud">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          {/* Replaced Package2 icon with SUI logo */}
          <Image
            src="/sui.svg"
            alt="SUI Logo"
            width={32} // Adjust size as needed
            height={32} // Adjust size as needed
            className="h-8 w-8"
          />
          <span className="group-data-[collapsible=icon]:hidden">SUI Faucet Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-sui-ocean text-sui-cloud">
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
        

      </SidebarContent>
      <SidebarRail /> {/* Add the rail for resizing/toggling [^1] */}
    </Sidebar>
  )
}
