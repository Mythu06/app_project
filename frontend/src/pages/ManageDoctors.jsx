import React, { useState, useEffect } from 'react'
import { doctorService } from '../services/authService'

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    userId: '',
    specialization: '',
    clinicName: ''
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors()
      setDoctors(data)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const doctorData = {
        user: { id: parseInt(formData.userId) },
        specialization: formData.specialization,
        clinicName: formData.clinicName
      }
      
      await doctorService.createDoctor(doctorData)
      setShowAddForm(false)
      setFormData({ userId: '', specialization: '', clinicName: '' })
      fetchDoctors()
    } catch (error) {
      console.error('Error creating doctor:', error)
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Doctors</h1>
          <p className="mt-2 text-gray-600">Add and manage doctor profiles</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add New Doctor
        </button>
      </div>

      {/* Add Doctor Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Doctor</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                    placeholder="Enter user ID with DOCTOR role"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    placeholder="e.g., Cardiology"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                    placeholder="e.g., City Hospital"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Doctors List */}
      {doctors.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👨⚕️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-600">Add your first doctor to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mr-4">
                  {doctor.user?.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dr. {doctor.user?.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Email:</span> {doctor.user?.email || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Clinic:</span> {doctor.clinicName || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {doctor.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageDoctors