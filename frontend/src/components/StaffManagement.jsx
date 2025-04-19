"use client"

import { useState, useEffect } from "react"
import { FiUsers, FiBarChart2, FiAlertTriangle, FiSearch, FiChevronDown, FiInfo, FiArrowRight } from "react-icons/fi"

const StaffManager = () => {
  // Staff state
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedDay, setSelectedDay] = useState(null)

  const categories = ["Cooking", "Janitor", "Management"]

  // Fetch staff data
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true)
        // Mock data
        const mockStaff = [
          {
            id: 1,
            name: "Alex Chen",
            role: "Head Chef",
            category: "Cooking",
            efficiency: 92,
            schedule: {
              Monday: true,
              Tuesday: true,
              Wednesday: true,
              Thursday: false,
              Friday: true,
              Saturday: true,
              Sunday: false,
            },
          },
          {
            id: 2,
            name: "Maria Lopez",
            role: "Sous Chef",
            category: "Cooking",
            efficiency: 88,
            schedule: {
              Monday: true,
              Tuesday: true,
              Wednesday: true,
              Thursday: true,
              Friday: false,
              Saturday: false,
              Sunday: true,
            },
          },
          {
            id: 3,
            name: "David Kim",
            role: "Line Cook",
            category: "Cooking",
            efficiency: 35,
            schedule: {
              Monday: true,
              Tuesday: true,
              Wednesday: false,
              Thursday: true,
              Friday: true,
              Saturday: true,
              Sunday: false,
            },
          },
          {
            id: 4,
            name: "Sarah Johnson",
            role: "Pastry Chef",
            category: "Cooking",
            efficiency: 91,
            schedule: {
              Monday: true,
              Tuesday: false,
              Wednesday: true,
              Thursday: true,
              Friday: true,
              Saturday: true,
              Sunday: false,
            },
          },
          {
            id: 5,
            name: "James Wilson",
            role: "Line Cook",
            category: "Cooking",
            efficiency: 70,
            schedule: {
              Monday: false,
              Tuesday: true,
              Wednesday: true,
              Thursday: true,
              Friday: false,
              Saturday: true,
              Sunday: true,
            },
          },
          {
            id: 6,
            name: "Robert Garcia",
            role: "Janitor",
            category: "Janitor",
            efficiency: 85,
            schedule: {
              Monday: true,
              Tuesday: false,
              Wednesday: true,
              Thursday: true,
              Friday: true,
              Saturday: false,
              Sunday: true,
            },
          },
          {
            id: 7,
            name: "Michael Brown",
            role: "Janitor",
            category: "Janitor",
            efficiency: 78,
            schedule: {
              Monday: false,
              Tuesday: true,
              Wednesday: true,
              Thursday: false,
              Friday: true,
              Saturday: true,
              Sunday: false,
            },
          },
          {
            id: 8,
            name: "Emily Davis",
            role: "Manager",
            category: "Management",
            efficiency: 94,
            schedule: {
              Monday: true,
              Tuesday: true,
              Wednesday: true,
              Thursday: true,
              Friday: true,
              Saturday: false,
              Sunday: false,
            },
          },
          {
            id: 9,
            name: "Daniel Martinez",
            role: "Assistant Manager",
            category: "Management",
            efficiency: 86,
            schedule: {
              Monday: false,
              Tuesday: true,
              Wednesday: true,
              Thursday: true,
              Friday: true,
              Saturday: true,
              Sunday: false,
            },
          },
          {
            id: 10,
            name: "Lisa Thompson",
            role: "Shift Supervisor",
            category: "Management",
            efficiency: 82,
            schedule: {
              Monday: true,
              Tuesday: false,
              Wednesday: false,
              Thursday: true,
              Friday: true,
              Saturday: true,
              Sunday: true,
            },
          },
          {
            id: 11,
            name: "Kevin Anderson",
            role: "Dishwasher",
            category: "Cooking",
            efficiency: 79,
            schedule: {
              Monday: true,
              Tuesday: true,
              Wednesday: false,
              Thursday: true,
              Friday: false,
              Saturday: false,
              Sunday: true,
            },
          },
        ]
        setStaff(mockStaff)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchStaff()
  }, [])

  // Filter staff based on search and category
  const filteredStaff = staff.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || person.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Calculate staff summary
  const staffSummary = {
    totalStaff: staff.length,
    avgEfficiency:
      staff.length > 0 ? Math.round(staff.reduce((sum, person) => sum + person.efficiency, 0) / staff.length) : 0,
  }

  // Daily traffic and staffing data
  const dailyTraffic = {
    Monday: {
      traffic: "Expected Traffic",
      customers: 220,
      staffNeeded: 7,
      staffScheduled: getStaffCountForDay("Monday"),
      status: getStaffingStatus("Monday", 7),
    },
    Tuesday: {
      traffic: "Expected Traffic",
      customers: 200,
      staffNeeded: 6,
      staffScheduled: getStaffCountForDay("Tuesday"),
      status: getStaffingStatus("Tuesday", 6),
    },
    Wednesday: {
      traffic: "Expected Traffic",
      customers: 205,
      staffNeeded: 7,
      staffScheduled: getStaffCountForDay("Wednesday"),
      status: getStaffingStatus("Wednesday", 7),
    },
    Thursday: {
      traffic: "Expected Traffic",
      customers: 210,
      staffNeeded: 7,
      staffScheduled: getStaffCountForDay("Thursday"),
      status: getStaffingStatus("Thursday", 7),
    },
    Friday: {
      traffic: "Expected Traffic",
      customers: 400,
      staffNeeded: 10,
      staffScheduled: getStaffCountForDay("Friday"),
      status: getStaffingStatus("Friday", 10),
    },
    Saturday: {
      traffic: "Expected Traffic",
      customers: 520,
      staffNeeded: 12,
      staffScheduled: getStaffCountForDay("Saturday"),
      status: getStaffingStatus("Saturday", 12),
    },
    Sunday: {
      traffic: "Expected Traffic",
      customers: 280,
      staffNeeded: 8,
      staffScheduled: getStaffCountForDay("Sunday"),
      status: getStaffingStatus("Sunday", 8),
    },
  }

  // Get staff count for a specific day
  function getStaffCountForDay(day) {
    return staff.filter((person) => person.schedule[day]).length
  }

  // Get staffing status
  function getStaffingStatus(day, needed) {
    const scheduled = getStaffCountForDay(day)
    if (scheduled >= needed) return "adequate"
    if (scheduled >= needed - 1) return "slightly understaffed"
    return "understaffed"
  }

  // Get most understaffed day
  function getMostUnderstaffedDay() {
    const days = Object.keys(dailyTraffic)
    let worstDay = days[0]
    let worstDiff = 0

    days.forEach((day) => {
      const { staffNeeded, staffScheduled } = dailyTraffic[day]
      const diff = staffNeeded - staffScheduled
      if (diff > worstDiff) {
        worstDiff = diff
        worstDay = day
      }
    })

    return { day: worstDay, short: worstDiff }
  }

  const understaffedDay = getMostUnderstaffedDay()

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "adequate":
        return "text-green-600"
      case "slightly understaffed":
        return "text-yellow-600"
      case "understaffed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case "adequate":
        return "bg-green-100"
      case "slightly understaffed":
        return "bg-yellow-100"
      case "understaffed":
        return "bg-red-100"
      default:
        return "bg-gray-100"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "adequate":
        return "Adequate"
      case "slightly understaffed":
        return "Slightly understaffed"
      case "understaffed":
        return "Understaffed"
      default:
        return status
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-700">Loading staff data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-sm text-gray-500">AI-powered insights for staff efficiency and scheduling</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start">
              <div className="mr-3">
                <FiUsers className="text-gray-400" size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Staff</p>
                <p className="text-2xl font-medium">{staffSummary.totalStaff}</p>
                <p className="text-xs text-gray-500">Across all departments</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start">
              <div className="mr-3">
                <FiBarChart2 className="text-gray-400" size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Efficiency</p>
                <p className="text-2xl font-medium">{staffSummary.avgEfficiency}%</p>
                <p className="text-xs text-gray-500">Overall performance</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start">
              <div className="mr-3">
                <FiAlertTriangle className="text-red-500" size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Staffing Alert</p>
                <p className="text-lg font-medium text-red-500">{understaffedDay.day} Understaffed</p>
                <p className="text-xs text-gray-500">Need {understaffedDay.short} more staff members</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Staff Overview */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Staff Overview</h2>
              </div>

              <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-3 py-1 rounded-md text-sm ${
                      activeCategory === "all"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Roles
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        activeCategory === category
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Efficiency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Schedule
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStaff.map((person) => (
                      <tr key={person.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{person.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className={`h-2.5 rounded-full ${
                                  person.efficiency >= 90
                                    ? "bg-green-600"
                                    : person.efficiency >= 80
                                      ? "bg-green-500"
                                      : person.efficiency >= 70
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                                style={{ width: `${person.efficiency}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">{person.efficiency}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800 flex items-center">
                            View Schedule <FiChevronDown className="ml-1" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Daily Traffic & Staffing */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Daily Traffic & Staffing</h2>
              </div>

              <div className="p-4 space-y-4">
                {Object.entries(dailyTraffic).map(([day, data]) => (
                  <div key={day} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium">{day}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBg(data.status)}`}>
                        {getStatusText(data.status)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      {data.traffic}: {data.customers} customers
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Staff Ratio:{" "}
                        <span className={getStatusColor(data.status)}>
                          {data.staffScheduled}/{data.staffNeeded} needed
                        </span>
                      </div>
                      {data.status !== "adequate" && (
                        <button className="text-xs text-blue-600 hover:text-blue-800">+ Add staff</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Staff Recommendations */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200 flex items-center">
            <FiInfo className="text-blue-500 mr-2" />
            <h2 className="text-lg font-medium">AI Staff Recommendations</h2>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Staff Optimization Insights</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <FiAlertTriangle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                  <span className="text-sm">
                    Saturday is understaffed by 2 people based on expected traffic of 520 customers.
                  </span>
                </li>
                <li className="flex items-start">
                  <FiInfo className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                  <span className="text-sm">Consider promoting Sarah Johnson (91% efficiency) to a senior role.</span>
                </li>
                <li className="flex items-start">
                  <FiInfo className="text-yellow-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                  <span className="text-sm">
                    James Wilson and Robert Garcia need performance improvement (70% efficiency).
                  </span>
                </li>
                <li className="flex items-start">
                  <FiArrowRight className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                  <span className="text-sm">
                    Redistribute staff from Monday (overstaffed) to Saturday (understaffed).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffManager
