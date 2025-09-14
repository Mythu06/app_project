import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-medical-gradient">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/manage-doctors"
          className="dashboard-card dashboard-card-blue pulse-hover"
        >
          <div className="flex items-center">
            <div className="medical-icon-large mr-4">👨‍⚕️</div>
            <div>
              <h3 className="text-xl font-bold">Manage Doctors</h3>
              <p className="text-blue-100 mt-1">Add and manage doctor profiles</p>
            </div>
          </div>
        </Link>

        <Link
          to="/manage-users"
          className="dashboard-card dashboard-card-green pulse-hover"
        >
          <div className="flex items-center">
            <div className="medical-icon-large mr-4">👥</div>
            <div>
              <h3 className="text-xl font-bold">User Management</h3>
              <p className="text-green-100 mt-1">Manage system users</p>
            </div>
          </div>
        </Link>

        <Link
          to="/reports"
          className="dashboard-card dashboard-card-purple pulse-hover"
        >
          <div className="flex items-center">
            <div className="medical-icon-large mr-4">📊</div>
            <div>
              <h3 className="text-xl font-bold">Reports</h3>
              <p className="text-purple-100 mt-1">View system reports</p>
            </div>
          </div>
        </Link>
      </div>
      </div>
    </div>
  )
}

export default AdminDashboard