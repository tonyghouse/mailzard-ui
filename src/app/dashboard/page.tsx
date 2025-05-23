"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowDown, ArrowUp, BarChart3, Clock, Mail, MailCheck, MailX, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const data = [
  { name: "Mon", marketing: 40, transactional: 24 },
  { name: "Tue", marketing: 30, transactional: 28 },
  { name: "Wed", marketing: 45, transactional: 26 },
  { name: "Thu", marketing: 50, transactional: 30 },
  { name: "Fri", marketing: 35, transactional: 27 },
  { name: "Sat", marketing: 25, transactional: 18 },
  { name: "Sun", marketing: 20, transactional: 15 },
]

const recentEmails = [
  {
    id: 1,
    subject: "June Newsletter",
    type: "marketing",
    recipients: 1245,
    openRate: 32.5,
    status: "delivered",
    time: "2 hours ago",
  },
  {
    id: 2,
    subject: "Password Reset",
    type: "transactional",
    recipients: 1,
    openRate: 100,
    status: "delivered",
    time: "3 hours ago",
  },
  {
    id: 3,
    subject: "Order Confirmation #1092",
    type: "transactional",
    recipients: 1,
    openRate: 100,
    status: "delivered",
    time: "5 hours ago",
  },
  {
    id: 4,
    subject: "Summer Sale Announcement",
    type: "marketing",
    recipients: 1893,
    openRate: 28.7,
    status: "delivered",
    time: "8 hours ago",
  },
  {
    id: 5,
    subject: "Account Verification",
    type: "transactional",
    recipients: 1,
    openRate: 0,
    status: "bounced",
    time: "10 hours ago",
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Mailzard</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              History
            </Button>
            <Button size="sm">
              <Send className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,546</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              <MailCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32.1%</div>
              <div className="flex items-center text-xs text-green-500">
                <ArrowUp className="mr-1 h-3 w-3" />
                +4.3% from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <MailX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.8%</div>
              <div className="flex items-center text-xs text-green-500">
                <ArrowDown className="mr-1 h-3 w-3" />
                -0.2% from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5%</div>
              <div className="flex items-center text-xs text-red-500">
                <ArrowDown className="mr-1 h-3 w-3" />
                -2.1% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="transactional">Transactional</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Performance</CardTitle>
                <CardDescription>
                  Compare marketing and transactional email performance over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="marketing" name="Marketing" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="transactional" name="Transactional" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Marketing Emails</CardTitle>
                  <CardDescription>Newsletters, promotions, and announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Sent this month</p>
                      <p className="text-2xl font-bold">8,942</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Average open rate</p>
                      <p className="text-2xl font-bold">29.8%</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Create Campaign</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transactional Emails</CardTitle>
                  <CardDescription>Order confirmations, password resets, and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Sent this month</p>
                      <p className="text-2xl font-bold">3,604</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Average open rate</p>
                      <p className="text-2xl font-bold">68.2%</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    Manage Templates
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Emails</CardTitle>
                <CardDescription>View your recently sent emails and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEmails.map((email) => (
                    <div
                      key={email.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 rounded-full p-1.5 ${email.type === "marketing" ? "bg-indigo-100" : "bg-green-100"}`}
                        >
                          {email.type === "marketing" ? (
                            <Mail className="h-4 w-4 text-indigo-600" />
                          ) : (
                            <MailCheck className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{email.subject}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{email.time}</span>
                            <span>•</span>
                            <span>
                              {email.recipients} recipient{email.recipients > 1 ? "s" : ""}
                            </span>
                            <Badge
                              variant={email.status === "delivered" ? "outline" : "destructive"}
                              className="text-xs"
                            >
                              {email.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{email.openRate}%</p>
                        <p className="text-xs text-muted-foreground">Open rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Emails
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="marketing" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Campaigns</CardTitle>
                <CardDescription>Manage your marketing email campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This tab would contain detailed marketing campaign information and analytics.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactional" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Transactional Emails</CardTitle>
                <CardDescription>Manage your transactional email templates and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This tab would contain transactional email templates, logs, and performance metrics.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
