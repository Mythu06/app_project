import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doctorService } from '../services/authService'

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctors()
        setDoctors(data)
        setFilteredDoctors(data)
      } catch (error) {
        console.error('Error fetching doctors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  useEffect(() => {
    let filtered = doctors

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.clinicName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(doctor =>
        doctor.specialization === selectedSpecialization
      )
    }

    if (selectedLocation) {
      filtered = filtered.filter(doctor =>
        doctor.location === selectedLocation
      )
    }

    setFilteredDoctors(filtered)
  }, [searchTerm, selectedSpecialization, selectedLocation, doctors])

  const specializations = [...new Set(doctors.map(doctor => doctor.specialization))].filter(Boolean)
  const locations = [...new Set(doctors.map(doctor => doctor.location))].filter(Boolean)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Doctors</h1>
        <p className="mt-2 text-gray-600">Search for doctors by name, specialization, or clinic</p>
      </div>

      {/* Search and Filter */}
      <div className="search-container fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Doctors
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name, specialization, or clinic..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Specialization
            </label>
            <select
              id="specialization"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Location
            </label>
            <select
              id="location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Doctor Cards */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="card card-hover card-medical slide-in">
              <div>
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
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🏥</span>
                    <span>{doctor.clinicName || 'Clinic not specified'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    <span>{doctor.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📧</span>
                    <span>{doctor.user?.email || 'Email not available'}</span>
                  </div>
                </div>
                
                <Link
                  to={`/book-appointment/${doctor.id}`}
                  className="btn-primary w-full text-center block"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorSearch