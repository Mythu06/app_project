import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { prescriptionService, appointmentService } from '../services/authService'

const IssuePrescription = () => {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    patientId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    notes: ''
  })
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingPatients, setLoadingPatients] = useState(true)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const appointments = await appointmentService.getMyAppointments()
        // Extract unique patients from appointments
        const uniquePatients = appointments.reduce((acc, appointment) => {
          const patient = appointment.patient
          if (patient && !acc.find(p => p.id === patient.id)) {
            acc.push(patient)
          }
          return acc
        }, [])
        setPatients(uniquePatients)
      } catch (error) {
        console.error('Error fetching patients:', error)
      } finally {
        setLoadingPatients(false)
      }
    }

    fetchPatients()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.patientId) {
      setError('Please select a patient')
      setLoading(false)
      return
    }

    try {
      const prescriptionData = {
        patient: { id: parseInt(formData.patientId) },
        doctor: { id: 1 }, // Current doctor ID
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        notes: formData.notes
      }

      await prescriptionService.createPrescription(prescriptionData)
      navigate('/manage-appointments')
    } catch (error) {
      setError('Failed to issue prescription. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Issue Prescription</h1>
        <p className="mt-2 text-gray-600">Create a digital prescription for the patient</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient *
            </label>
            {loadingPatients ? (
              <div className="form-input flex items-center justify-center py-4">
                <div className="loading-spinner w-5 h-5 mr-2"></div>
                Loading patients...
              </div>
            ) : (
              <select
                id="patientId"
                name="patientId"
                required
                className="form-input"
                value={formData.patientId}
                onChange={handleChange}
              >
                <option value="">Choose a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} (ID: {patient.id})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="medicationName" className="block text-sm font-medium text-gray-700 mb-2">
              Medication Name *
            </label>
            <input
              type="text"
              id="medicationName"
              name="medicationName"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.medicationName}
              onChange={handleChange}
              placeholder="Enter medication name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g., 100mg"
              />
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequency *
              </label>
              <select
                id="frequency"
                name="frequency"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Four times daily">Four times daily</option>
                <option value="As needed">As needed</option>
                <option value="Before meals">Before meals</option>
                <option value="After meals">After meals</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Instructions & Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional instructions for the patient..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/manage-appointments')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
            >
              {loading ? 'Issuing...' : 'Issue Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IssuePrescription