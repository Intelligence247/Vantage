"use client"

import { motion } from "framer-motion"
import { Users, TrendingUp, TrendingDown, DollarSign, Building2, Flag, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

// --- Mock Data ---

const userGrowthData = [
  { month: "Jul", buyers: 120, vendors: 20 },
  { month: "Aug", buyers: 150, vendors: 25 },
  { month: "Sep", buyers: 200, vendors: 35 },
  { month: "Oct", buyers: 350, vendors: 45 },
  { month: "Nov", buyers: 480, vendors: 60 },
  { month: "Dec", buyers: 600, vendors: 85 },
]

const revenueData = [
  { month: "Jul", revenue: 450000 },
  { month: "Aug", revenue: 520000 },
  { month: "Sep", revenue: 480000 },
  { month: "Oct", revenue: 750000 },
  { month: "Nov", revenue: 920000 },
  { month: "Dec", revenue: 1250000 },
]

const regionData = [
  { name: "Lagos", value: 45, color: "#0f2c36" }, // Midnight Teal
  { name: "Abuja", value: 30, color: "#f59e0b" }, // Luminous Amber
  { name: "Rivers", value: 15, color: "#64748b" }, // Slate Grey
  { name: "Oyo", value: 10, color: "#1a4552" },
]

const topRegions = [
  { name: "Lekki, Lagos", listings: 1245, growth: "+12%", trend: "up" },
  { name: "Maitama, Abuja", listings: 856, growth: "+8%", trend: "up" },
  { name: "Ikeja GRA, Lagos", listings: 645, growth: "+15%", trend: "up" },
  { name: "Port Harcourt GRA", listings: 420, growth: "-2%", trend: "down" },
]

const stats = [
  {
    title: "Total Revenue",
    value: "₦4.8M",
    change: "+24%",
    trend: "up",
    icon: DollarSign,
    description: "this month",
  },
  {
    title: "New Users",
    value: "1,240",
    change: "+18%",
    trend: "up",
    icon: Users,
    description: "this month",
  },
  {
    title: "Active Listings",
    value: "3,254",
    change: "+8%",
    trend: "up",
    icon: Building2,
    description: "total live",
  },
  {
    title: "Reports & Flags",
    value: "12",
    change: "-5%",
    trend: "down",
    icon: Flag,
    description: "needing review",
  },
]

// --- Components ---

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
       {/* Header */}
       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">System Analytics</h1>
          <p className="text-muted-foreground mt-1">Global performance metrics and growth trends.</p>
        </div>
        <Select defaultValue="6months">
          <SelectTrigger className="w-[180px]">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          const isUp = stat.trend === "up"
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                    <p className="font-heading text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span
                        className={`text-sm font-medium flex items-center gap-1 ${
                          isUp ? "text-emerald-500" : "text-red-500"
                        }`}
                      >
                        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground text-xs">{stat.description}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-foreground/70" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="colorBuyers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f2c36" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#0f2c36" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorVendors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                    />
                    <Area
                      type="monotone"
                      dataKey="buyers"
                      stroke="#0f2c36"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorBuyers)"
                      name="Buyers"
                    />
                    <Area
                      type="monotone"
                      dataKey="vendors"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorVendors)"
                      name="Vendors"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
             <CardHeader>
              <CardTitle className="font-heading text-lg">Platform Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₦${value / 1000}k`}
                    />
                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" fill="#0f2c36" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

       {/* Bottom Row */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listings by Region */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="font-heading text-lg">Listings by State</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={regionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {regionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {regionData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-muted-foreground">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* Top Performing Regions Table */}
        <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="lg:col-span-2"
        >
             <Card className="h-full">
                <CardHeader>
                    <CardTitle className="font-heading text-lg">Top Performing Districts</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="table-responsive">
                         <table className="w-full text-sm text-left">
                            <thead className="text-muted-foreground font-medium bg-muted/40 border-b">
                                <tr>
                                    <th className="px-6 py-3">District</th>
                                    <th className="px-6 py-3">Active Listings</th>
                                    <th className="px-6 py-3">Growth</th>
                                    <th className="px-6 py-3">Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topRegions.map((region, i) => (
                                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                                        <td className="px-6 py-4 font-medium text-foreground">{region.name}</td>
                                        <td className="px-6 py-4">{region.listings}</td>
                                        <td className="px-6 py-4 text-emerald-600 font-medium">{region.growth}</td>
                                        <td className="px-6 py-4">
                                            {region.trend === 'up' ? (
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-red-500" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                         </table>
                    </div>
                </CardContent>
             </Card>
        </motion.div>
       </div>
    </div>
  )
}
