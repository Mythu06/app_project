import React, { useState, useEffect } from 'react'

const Reports = () => {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  // Mock statistics data
  const mockStats = {
    totalUsers: 156,
    totalDoctors: 23,
    totalPatients: 128,
    totalAppointments: 342,
    pendingAppointments: 15,
    approvedAppointments: 298,
    totalPrescriptions: 189,
    activeUsers: 145
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStats(mockStats)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner h-16 w-16"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Reports</h1>
        <p className="mt-2 text-gray-600">Overview of system statistics and analytics</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card card-medical">
          <div className="flex items-center">
            <div className="medical-icon-large mr-4">👥</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="card card-success">
          <div className="flex items-center">
            <div className="medical-icon-large mr-4">👨‍⚕️</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Doctors</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalDoctors}</p>
            </div>
          </div>
        </div>

        <div className="card card-warning">
          <div className="flex items-center">
            <div className="medical-icon-large mr-4">🤒</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="card card-danger">
          <div className="flex items-center">
            <div className="medical-icon-large mr-4">📅</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-3xl font-bold text-red-600">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments Report */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Appointment Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Appointments</span>
              <span className="font-semibold text-yellow-600">{stats.pendingAppointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved Appointments</span>
              <span className="font-semibold text-green-600">{stats.approvedAppointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Appointments</span>
              <span className="font-semibold text-blue-600">{stats.totalAppointments}</span>
            </div>
          </div>
        </div>

        {/* Prescriptions Report */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Prescription Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Prescriptions</span>
              <span className="font-semibold text-purple-600">{stats.totalPrescriptions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Users</span>
              <span className="font-semibold text-green-600">{stats.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Inactive Users</span>
              <span className="font-semibold text-red-600">{stats.totalUsers - stats.activeUsers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent System Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <span className="medical-icon mr-3">👤</span>
              <span className="text-gray-700">New patient registered: Sarah Wilson</span>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <span className="medical-icon mr-3">📅</span>
              <span className="text-gray-700">Appointment approved by Dr. Smith</span>
            </div>
            <span className="text-sm text-gray-500">4 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center">
              <span className="medical-icon mr-3">💊</span>
              <span className="text-gray-700">Prescription issued to John Patient</span>
            </div>
            <span className="text-sm text-gray-500">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports