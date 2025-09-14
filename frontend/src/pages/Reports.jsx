import React, { useState, useEffect } from 'react'

const Reports = () => {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      // Fetch data from multiple endpoints
      const [usersRes, doctorsRes, appointmentsRes, prescriptionsRes] = await Promise.all([
        fetch('http://localhost:8080/api/users', { headers }),
        fetch('http://localhost:8080/api/doctors', { headers }),
        fetch('http://localhost:8080/api/appointments', { headers }),
        fetch('http://localhost:8080/api/prescriptions', { headers })
      ])

      const users = usersRes.ok ? await usersRes.json() : []
      const doctors = doctorsRes.ok ? await doctorsRes.json() : []
      const appointments = appointmentsRes.ok ? await appointmentsRes.json() : []
      const prescriptions = prescriptionsRes.ok ? await prescriptionsRes.json() : []

      // Calculate statistics
      const totalPatients = users.filter(user => user.role === 'PATIENT').length
      const pendingAppointments = appointments.filter(apt => apt.status === 'PENDING').length
      const approvedAppointments = appointments.filter(apt => apt.status === 'APPROVED').length

      // Generate recent activity from real data
      const recentActivity = []
      
      // Recent users (last 3)
      const recentUsers = users.slice(-3).reverse()
      recentUsers.forEach(user => {
        if (user.role === 'PATIENT') {
          recentActivity.push({
            icon: '👤',
            message: `New patient registered: ${user.name}`,
            time: 'Recently'
          })
        } else if (user.role === 'DOCTOR') {
          recentActivity.push({
            icon: '👨⚕️',
            message: `New doctor joined: Dr. ${user.name}`,
            time: 'Recently'
          })
        }
      })
      
      // Recent appointments (last 3)
      const recentAppointments = appointments.slice(-3).reverse()
      recentAppointments.forEach(apt => {
        if (apt.status === 'APPROVED') {
          recentActivity.push({
            icon: '📅',
            message: `Appointment approved for ${apt.patient?.name || 'Patient'}`,
            time: 'Recently'
          })
        } else if (apt.status === 'PENDING') {
          recentActivity.push({
            icon: '⏳',
            message: `New appointment request from ${apt.patient?.name || 'Patient'}`,
            time: 'Recently'
          })
        }
      })
      
      // Recent prescriptions (last 2)
      const recentPrescriptions = prescriptions.slice(-2).reverse()
      recentPrescriptions.forEach(prescription => {
        recentActivity.push({
          icon: '💊',
          message: `Prescription issued: ${prescription.medicationName} to ${prescription.patient?.name || 'Patient'}`,
          time: 'Recently'
        })
      })

      setStats({
        totalUsers: users.length,
        totalDoctors: doctors.length,
        totalPatients,
        totalAppointments: appointments.length,
        pendingAppointments,
        approvedAppointments,
        totalPrescriptions: prescriptions.length,
        activeUsers: users.length,
        recentActivity: recentActivity.slice(0, 5) // Show only top 5 activities
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to empty stats
      setStats({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        approvedAppointments: 0,
        totalPrescriptions: 0,
        activeUsers: 0
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner h-16 w-16"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-medical-gradient">
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
          {stats.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <span className="medical-icon mr-3">{activity.icon}</span>
                  <span className="text-gray-700">{activity.message}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Reports