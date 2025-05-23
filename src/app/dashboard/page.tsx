"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Contact,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Mail,
  MessageSquare,
  PieChart,
  Plus,
  Settings,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/10">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-3">
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6" />
              <span className="font-semibold">MailMaster</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href="#">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <BarChart3 className="h-4 w-4" />
                        <span>Analytics</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <PieChart className="h-4 w-4" />
                        <span>Reports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Email Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <FileText className="h-4 w-4" />
                        <span>Templates</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Mail className="h-4 w-4" />
                        <span>Campaigns</span>
                        <Badge className="ml-auto">3</Badge>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <MessageSquare className="h-4 w-4" />
                        <span>Automations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Audience</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Users className="h-4 w-4" />
                        <span>Contacts</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Contact className="h-4 w-4" />
                        <span>Segments</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Calendar className="h-4 w-4" />
                        <span>Events</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Settings className="h-4 w-4" />
                        <span>Account</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <HelpCircle className="h-4 w-4" />
                        <span>Help & Support</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <div className="flex items-center gap-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,548</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-emerald-500">+2.5%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24.8%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-emerald-500">+1.2%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8.2%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-rose-500">-0.4%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Campaigns Sent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-emerald-500">+4</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="col-span-2">
                      <CardHeader>
                        <CardTitle>Campaign Performance</CardTitle>
                        <CardDescription>Overview of your recent campaign metrics</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Campaign performance chart</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Audience Growth</CardTitle>
                        <CardDescription>Subscriber growth over time</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Growth chart</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Campaigns</CardTitle>
                      <CardDescription>Your most recent email campaigns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground">
                          <div>Name</div>
                          <div>Status</div>
                          <div>Sent</div>
                          <div>Open Rate</div>
                          <div>Click Rate</div>
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4 text-sm">
                          <div className="font-medium">May Newsletter</div>
                          <div>
                            <Badge
                              variant="outline"
                              className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                            >
                              Sent
                            </Badge>
                          </div>
                          <div>5,234</div>
                          <div>26.8%</div>
                          <div>9.2%</div>
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4 text-sm">
                          <div className="font-medium">Product Update</div>
                          <div>
                            <Badge
                              variant="outline"
                              className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                            >
                              Sent
                            </Badge>
                          </div>
                          <div>4,829</div>
                          <div>24.3%</div>
                          <div>7.8%</div>
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4 text-sm">
                          <div className="font-medium">Summer Sale</div>
                          <div>
                            <Badge
                              variant="outline"
                              className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500"
                            >
                              Scheduled
                            </Badge>
                          </div>
                          <div>--</div>
                          <div>--</div>
                          <div>--</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="ml-auto">
                        View All Campaigns
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="campaigns" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Campaigns</CardTitle>
                      <CardDescription>Manage your ongoing email campaigns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-6 text-sm font-medium text-muted-foreground">
                          <div>Name</div>
                          <div>Type</div>
                          <div>Status</div>
                          <div>Progress</div>
                          <div>Sent/Total</div>
                          <div></div>
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4 text-sm">
                          <div className="font-medium">Summer Sale</div>
                          <div>Marketing</div>
                          <div>
                            <Badge
                              variant="outline"
                              className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500"
                            >
                              Scheduled
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={0} className="h-2 w-full" />
                            <span className="text-xs">0%</span>
                          </div>
                          <div>0/12,548</div>
                          <div className="flex justify-end">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4 text-sm">
                          <div className="font-medium">Welcome Series</div>
                          <div>Automated</div>
                          <div>
                            <Badge
                              variant="outline"
                              className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                            >
                              Active
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={100} className="h-2 w-full" />
                            <span className="text-xs">100%</span>
                          </div>
                          <div>Ongoing</div>
                          <div className="flex justify-end">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4 text-sm">
                          <div className="font-medium">Abandoned Cart</div>
                          <div>Automated</div>
                          <div>
                            <Badge
                              variant="outline"
                              className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                            >
                              Active
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={100} className="h-2 w-full" />
                            <span className="text-xs">100%</span>
                          </div>
                          <div>Ongoing</div>
                          <div className="flex justify-end">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="ml-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        New Campaign
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="templates" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Newsletter</CardTitle>
                        <CardDescription>Basic newsletter template</CardDescription>
                      </CardHeader>
                      <CardContent className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost" size="sm">
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          Use
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Promotional</CardTitle>
                        <CardDescription>Sales and offers template</CardDescription>
                      </CardHeader>
                      <CardContent className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost" size="sm">
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          Use
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Welcome</CardTitle>
                        <CardDescription>New subscriber welcome</CardDescription>
                      </CardHeader>
                      <CardContent className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost" size="sm">
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          Use
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card className="border-dashed flex flex-col items-center justify-center p-6">
                      <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Create New Template</p>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
