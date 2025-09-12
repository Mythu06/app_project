import React, { useState, useEffect } from 'react'
import { appointmentService } from '../services/authService'

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getMyAppointments()
        setAppointments(data)
      } catch (error) {
        console.error('Error fetching appointments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus)
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ))
    } catch (error) {
      console.error('Error updating appointment:', error)
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
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Appointments</h1>
        <p className="mt-2 text-gray-600">Review and manage patient appointments</p>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments</h3>
          <p className="text-gray-600">No appointment requests at this time.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Patient: {appointment.patient?.name || 'Unknown'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Date:</span> {appointment.appointmentDate}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {appointment.appointmentTime}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="font-medium text-sm text-gray-600">Reason:</span>
                      <p className="text-gray-700 mt-1">{appointment.reason}</p>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
                
                {appointment.status === 'PENDING' && (
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleStatusUpdate(appointment.id, 'APPROVED')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(appointment.id, 'REJECTED')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageAppointments