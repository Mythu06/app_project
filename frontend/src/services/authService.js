const API_BASE_URL = 'http://localhost:8080/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || 'Invalid credentials')
      }

      return response.json()
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8080')
      }
      throw error
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Registration failed')
      }

      return response.json()
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8080')
      }
      throw error
    }
  }
}

export const doctorService = {
  async getAllDoctors() {
    const response = await fetch(`${API_BASE_URL}/doctors`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) throw new Error('Failed to fetch doctors')
    return response.json()
  },

  async createDoctor(doctorData) {
    const response = await fetch(`${API_BASE_URL}/doctors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(doctorData)
    })
    
    if (!response.ok) throw new Error('Failed to create doctor')
    return response.json()
  }
}

export const appointmentService = {
  async createAppointment(appointmentData) {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData)
    })
    
    if (!response.ok) throw new Error('Failed to create appointment')
    return response.json()
  },

  async getMyAppointments() {
    const response = await fetch(`${API_BASE_URL}/appointments/my-appointments`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) throw new Error('Failed to fetch appointments')
    return response.json()
  },

  async updateAppointmentStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    })
    
    if (!response.ok) throw new Error('Failed to update appointment')
    return response.json()
  }
}

export const prescriptionService = {
  async createPrescription(prescriptionData) {
    const response = await fetch(`${API_BASE_URL}/prescriptions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(prescriptionData)
    })
    
    if (!response.ok) throw new Error('Failed to create prescription')
    return response.json()
  },

  async getMyPrescriptions() {
    const response = await fetch(`${API_BASE_URL}/prescriptions/my-prescriptions`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) throw new Error('Failed to fetch prescriptions')
    return response.json()
  }
}