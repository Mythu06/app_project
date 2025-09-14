import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { appointmentService, prescriptionService } from '../services/authService'

const PatientDashboard = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsData, prescriptionsData] = await Promise.all([
          appointmentService.getMyAppointments(),
          prescriptionService.getMyPrescriptions()
        ])
        setAppointments(appointmentsData.slice(0, 3)) // Show only recent 3
        setPrescriptions(prescriptionsData.slice(0, 3)) // Show only recent 3
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600 bg-green-100'
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'REJECTED': return 'text-red-600 bg-red-100'
      case 'CANCELED': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-medical-gradient">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-gray-600">Manage your appointments and prescriptions</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/search-doctors"
          className="dashboard-card dashboard-card-blue pulse-hover"
        >
          <div className="flex items-center">
            <div className="medical-icon-large mr-4">🔍</div>
            <div>
              <h3 className="text-xl font-bold">Find Doctors</h3>
              <p className="text-blue-100 mt-1">Search and book appointments</p>
            </div>
          </div>
        </Link>

        <Link
          to="/my-appointments"
          className="dashboard-card dashboard-card-green pulse-hover"
        >
          <div className="flex items-center">
            <div className="medical-icon-large mr-4">📅</div>
            <div>
              <h3 className="text-xl font-bold">My Appointments</h3>
              <p className="text-green-100 mt-1">View and manage appointments</p>
            </div>
          </div>
        </Link>

        <Link
          to="/my-prescriptions"
          className="dashboard-card dashboard-card-purple pulse-hover"
        >
          <div className="flex items-center">
            <div className="medical-icon-large mr-4">💊</div>
            <div>
              <h3 className="text-xl font-bold">My Prescriptions</h3>
              <p className="text-purple-100 mt-1">View prescription history</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card card-hover">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gradient">Recent Appointments</h2>
            <Link to="/my-appointments" className="text-blue-600 hover:text-blue-800 text-sm">
              View all
            </Link>
          </div>
          
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No appointments yet</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        Dr. {appointment.doctor?.user?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.appointmentDate} at {appointment.appointmentTime}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.reason}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className="card card-hover">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gradient">Recent Prescriptions</h2>
            <Link to="/my-prescriptions" className="text-blue-600 hover:text-blue-800 text-sm">
              View all
            </Link>
          </div>
          
          {prescriptions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No prescriptions yet</p>
          ) : (
            <div className="space-y-3">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="border-l-4 border-purple-500 pl-4 py-2">
                  <div>
                    <p className="font-medium text-gray-900">{prescription.medicationName}</p>
                    <p className="text-sm text-gray-600">
                      {prescription.dosage} - {prescription.frequency}
                    </p>
                    <p className="text-sm text-gray-500">
                      Prescribed by Dr. {prescription.doctor?.user?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default PatientDashboard