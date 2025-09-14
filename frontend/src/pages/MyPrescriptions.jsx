import React, { useState, useEffect } from 'react'
import { prescriptionService } from '../services/authService'

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPrescription, setSelectedPrescription] = useState(null)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await prescriptionService.getMyPrescriptions()
        setPrescriptions(data)
      } catch (error) {
        console.error('Error fetching prescriptions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrescriptions()
  }, [])

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
        <p className="mt-2 text-gray-600">View your prescription history</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
          <p className="text-gray-600">You have no prescriptions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPrescription(prescription)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {prescription.medicationName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Prescribed by Dr. {prescription.doctor?.user?.name || 'Unknown'}
                    </p>
                  </div>
                  <div className="text-2xl">💊</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Dosage:</span>
                    <span className="ml-2 text-gray-600">{prescription.dosage}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Frequency:</span>
                    <span className="ml-2 text-gray-600">{prescription.frequency}</span>
                  </div>
                </div>
                
                {prescription.notes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Notes:</span> {prescription.notes}
                    </p>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Click to view full details
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Prescription Details</h2>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {selectedPrescription.medicationName}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="font-medium text-gray-700">Prescribed by:</span>
                    <p className="text-gray-600">Dr. {selectedPrescription.doctor?.user?.name || 'Unknown'}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Specialization:</span>
                    <p className="text-gray-600">{selectedPrescription.doctor?.specialization || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Clinic:</span>
                    <p className="text-gray-600">{selectedPrescription.doctor?.clinicName || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Dosage:</span>
                    <p className="text-gray-600">{selectedPrescription.dosage}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Frequency:</span>
                    <p className="text-gray-600">{selectedPrescription.frequency}</p>
                  </div>
                  
                  {selectedPrescription.notes && (
                    <div>
                      <span className="font-medium text-gray-700">Instructions:</span>
                      <p className="text-gray-600 mt-1 p-3 bg-blue-50 rounded-md">
                        {selectedPrescription.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default MyPrescriptions