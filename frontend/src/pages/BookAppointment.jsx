import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { doctorService, appointmentService } from '../services/authService'

const BookAppointment = () => {
  const { doctorId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  })
  const [availableSlots, setAvailableSlots] = useState([])

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const doctors = await doctorService.getAllDoctors()
        const selectedDoctor = doctors.find(d => d.id === parseInt(doctorId))
        setDoctor(selectedDoctor)
        if (selectedDoctor?.availableSlots) {
          setAvailableSlots(selectedDoctor.availableSlots)
        }
      } catch (error) {
        console.error('Error fetching doctor:', error)
        setError('Failed to load doctor information')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [doctorId])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // Get patient ID from user data (you might need to fetch this from backend)
      const appointmentData = {
        patient: { id: 1 }, // This should be the actual patient ID
        doctor: { id: parseInt(doctorId) },
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason,
        status: 'PENDING'
      }

      await appointmentService.createAppointment(appointmentData)
      setSuccess(true)
      
      setTimeout(() => {
        navigate('/my-appointments')
      }, 2000)
    } catch (error) {
      setError('Failed to book appointment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Get available time slots for selected date
  const getAvailableSlotsForDate = () => {
    if (!formData.appointmentDate || !availableSlots.length) {
      return []
    }
    // In a real app, this would check existing appointments for the date
    // For demo, we'll show all doctor's available slots
    return availableSlots
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h1>
          <button
            onClick={() => navigate('/search-doctors')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Search
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
          <p className="text-gray-600 mb-4">
            Your appointment request has been submitted successfully. 
            Dr. {doctor.user?.name} will review and respond soon.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/search-doctors')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Search
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
      </div>

      {/* Doctor Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-6">
            {doctor.user?.name?.charAt(0) || 'D'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Dr. {doctor.user?.name || 'Unknown'}
            </h2>
            <p className="text-gray-600">{doctor.specialization}</p>
            <p className="text-sm text-gray-500">{doctor.clinicName}</p>
            <p className="text-sm text-blue-600">📍 {doctor.location}</p>
          </div>
        </div>
      </div>
      
      {/* Available Time Slots Info */}
      {availableSlots.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Available Time Slots:</h3>
          <div className="flex flex-wrap gap-2">
            {availableSlots.map((slot) => (
              <span key={slot} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                {slot}
              </span>
            ))}
          </div>
          <p className="text-xs text-blue-600 mt-2">Select a date below to choose from these available times</p>
        </div>
      )}

      {/* Booking Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Date & Time</h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date
              </label>
              <input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                required
                min={getMinDate()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.appointmentDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Time
              </label>
              <select
                id="appointmentTime"
                name="appointmentTime"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.appointmentTime}
                onChange={handleChange}
              >
                <option value="">Select time</option>
                {getAvailableSlotsForDate().map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Visit
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              required
              placeholder="Please describe the reason for your visit..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.reason}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/search-doctors')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
            >
              {submitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookAppointment