import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DoctorDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, Dr. {user?.email}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/manage-appointments"
          className="dashboard-card dashboard-card-blue pulse-hover"
        >
          <div className="flex items-center">
            <div className="medical-icon-large mr-4">📅</div>
            <div>
              <h3 className="text-xl font-bold">Manage Appointments</h3>
              <p className="text-blue-100 mt-1">Review and approve patient appointments</p>
            </div>
          </div>
        </Link>

        <Link
          to="/issue-prescription/1"
          className="dashboard-card dashboard-card-green pulse-hover"
        >
          <div className="flex items-center">
            <div className="medical-icon-large mr-4">💊</div>
            <div>
              <h3 className="text-xl font-bold">Issue Prescriptions</h3>
              <p className="text-green-100 mt-1">Create digital prescriptions for patients</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default DoctorDashboard