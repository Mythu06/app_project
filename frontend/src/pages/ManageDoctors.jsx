import React, { useState, useEffect } from 'react'
import { doctorService } from '../services/authService'

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    clinicName: '',
    location: ''
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
      // Create doctor via registration endpoint (creates both user and doctor)
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          passwordHash: formData.password,
          role: 'DOCTOR',
          specialization: formData.specialization,
          clinicName: formData.clinicName,
          location: formData.location
        })
      })
      
      if (response.ok) {
        setShowAddForm(false)
        setFormData({ name: '', email: '', password: '', specialization: '', clinicName: '', location: '' })
        fetchDoctors()
      } else {
        const error = await response.text()
        alert('Error creating doctor: ' + error)
      }
    } catch (error) {
      console.error('Error creating doctor:', error)
      alert('Error creating doctor: ' + error.message)
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
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter doctor's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="doctor@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  >
                    <option value="">Select Specialization</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Psychiatry">Psychiatry</option>
                  </select>
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  >
                    <option value="">Select Location</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Tiruchirappalli">Tiruchirappalli (Trichy)</option>
                    <option value="Salem">Salem</option>
                    <option value="Tirunelveli">Tirunelveli</option>
                    <option value="Vellore">Vellore</option>
                    <option value="Erode">Erode</option>
                    <option value="Thanjavur">Thanjavur</option>
                    <option value="Dindigul">Dindigul</option>
                    <option value="Cuddalore">Cuddalore</option>
                    <option value="Kanchipuram">Kanchipuram</option>
                    <option value="Tiruvannamalai">Tiruvannamalai</option>
                    <option value="Villupuram">Villupuram</option>
                    <option value="Thoothukudi">Thoothukudi (Tuticorin)</option>
                    <option value="Nagercoil">Nagercoil</option>
                    <option value="Karur">Karur</option>
                    <option value="Kumbakonam">Kumbakonam</option>
                    <option value="Tirupur">Tirupur</option>
                    <option value="Ambur">Ambur</option>
                    <option value="Hosur">Hosur</option>
                    <option value="Krishnagiri">Krishnagiri</option>
                    <option value="Namakkal">Namakkal</option>
                    <option value="Pudukkottai">Pudukkottai</option>
                    <option value="Ramanathapuram">Ramanathapuram</option>
                    <option value="Sivakasi">Sivakasi</option>
                    <option value="Virudhunagar">Virudhunagar</option>
                    <option value="Pollachi">Pollachi</option>
                    <option value="Ooty">Ooty (Udhagamandalam)</option>
                  </select>
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
    </div>
  )
}

export default ManageDoctors