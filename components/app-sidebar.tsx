"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Bitcoin, ChevronDown, Coins, Home, LineChart, PieChart, TrendingUp } from "lucide-react"

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
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Logo } from "@/components/logo"

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()

  const isActive = (path: string) => pathname === path

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between px-4 py-2">
          <Logo />
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/")}
                tooltip="Dashboard"
                className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:font-medium"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Invest Section */}
        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center">
                <Coins className="h-4 w-4 mr-2" />
                Invest
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Portfolio Builder"
                      isActive={isActive("/portfolio")}
                      className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link href="/portfolio">
                        <PieChart className="h-4 w-4" />
                        <span>Portfolio Builder</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Auto-Adjust"
                      isActive={isActive("/auto-adjust")}
                      className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link href="/auto-adjust">
                        <LineChart className="h-4 w-4" />
                        <span>Auto-Adjust</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Risk Analysis"
                      isActive={isActive("/risk")}
                      className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link href="/risk">
                        <BarChart3 className="h-4 w-4" />
                        <span>Risk Analysis</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Market Trends Section */}
        <SidebarGroup>
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Market Trends
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Sentiment Analysis"
                      isActive={isActive("/sentiment")}
                      className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link href="/sentiment">
                        <LineChart className="h-4 w-4" />
                        <span>Sentiment Analysis</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="News Scraper"
                      isActive={isActive("/news")}
                      className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link href="/news">
                        <BarChart3 className="h-4 w-4" />
                        <span>News Scraper</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Blockchain Section */}
        <SidebarGroup>
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center">
                <Bitcoin className="h-4 w-4 mr-2" />
                Blockchain
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Smart Contracts"
                      isActive={isActive("/contracts")}
                      className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link href="/contracts">
                        <Bitcoin className="h-4 w-4" />
                        <span>Smart Contracts</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Transparent Tracking"
                      isActive={isActive("/tracking")}
                      className="data-[active=true]:bg-primary/20 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link href="/tracking">
                        <LineChart className="h-4 w-4" />
                        <span>Transparent Tracking</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-4">
          <Button variant="outline" className="w-full flex items-center justify-start gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-15%20at%2012.37.40%20AM-4cjnQVYCgj0e4DvilBlhgmmFEmxWdB.png"
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span>Account</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

