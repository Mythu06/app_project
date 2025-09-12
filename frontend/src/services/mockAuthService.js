// Mock authentication service for frontend-only demo
const mockUsers = [
  { email: 'admin@example.com', password: 'admin123', role: 'ADMIN', name: 'Admin User' },
  { email: 'doctor@example.com', password: 'doctor123', role: 'DOCTOR', name: 'Dr. Smith' },
  { email: 'patient@example.com', password: 'patient123', role: 'PATIENT', name: 'John Patient' }
]

const mockDoctors = [
  { id: 1, user: { id: 2, name: 'Dr. Smith', email: 'doctor@example.com' }, specialization: 'Cardiology', clinicName: 'Heart Care Center', location: 'Downtown', availableSlots: ['09:00', '10:30', '14:00', '15:30'] },
  { id: 2, user: { id: 3, name: 'Dr. Wilson', email: 'dr.wilson@hospital.com' }, specialization: 'General Medicine', clinicName: 'City Hospital', location: 'Uptown', availableSlots: ['08:30', '11:00', '13:30', '16:00'] },
  { id: 3, user: { id: 4, name: 'Dr. Johnson', email: 'dr.johnson@clinic.com' }, specialization: 'Pediatrics', clinicName: 'Children\'s Clinic', location: 'Suburbs', availableSlots: ['09:30', '11:30', '14:30', '16:30'] },
  { id: 4, user: { id: 5, name: 'Dr. Brown', email: 'dr.brown@medical.com' }, specialization: 'Orthopedics', clinicName: 'Bone Clinic', location: 'Downtown', availableSlots: ['10:00', '12:00', '15:00', '17:00'] },
  { id: 5, user: { id: 6, name: 'Dr. Davis', email: 'dr.davis@health.com' }, specialization: 'Dermatology', clinicName: 'Skin Care Center', location: 'Midtown', availableSlots: ['08:00', '10:00', '13:00', '15:00'] }
]

const mockAppointments = [
  { id: 1, patient: { id: 1, name: 'John Patient' }, doctor: mockDoctors[0], appointmentDate: '2024-01-20', appointmentTime: '10:00:00', reason: 'Regular checkup', status: 'APPROVED' },
  { id: 2, patient: { id: 2, name: 'Sarah Wilson' }, doctor: mockDoctors[1], appointmentDate: '2024-01-25', appointmentTime: '14:30:00', reason: 'Follow-up', status: 'APPROVED' },
  { id: 3, patient: { id: 3, name: 'Mike Johnson' }, doctor: mockDoctors[0], appointmentDate: '2024-01-22', appointmentTime: '09:15:00', reason: 'Consultation', status: 'APPROVED' },
  { id: 4, patient: { id: 4, name: 'Emily Davis' }, doctor: mockDoctors[2], appointmentDate: '2024-01-28', appointmentTime: '11:00:00', reason: 'Check-up', status: 'PENDING' }
]

const mockPrescriptions = [
  { id: 1, patient: { id: 1, name: 'John Patient' }, doctor: mockDoctors[0], medicationName: 'Aspirin', dosage: '100mg', frequency: 'Once daily', notes: 'Take after meals' },
  { id: 2, patient: { id: 1, name: 'John Patient' }, doctor: mockDoctors[1], medicationName: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', notes: 'Monitor blood pressure' }
]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const mockAuthService = {
  async login(email, password) {
    await delay(500) // Simulate network delay
    
    const user = mockUsers.find(u => u.email === email && u.password === password)
    if (user) {
      return {
        token: `mock-jwt-token-${user.role.toLowerCase()}`,
        role: user.role
      }
    }
    throw new Error('Invalid credentials')
  },

  async register(name, email, password) {
    await delay(500)
    
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      throw new Error('User already exists')
    }
    
    mockUsers.push({ email, password, role: 'PATIENT', name })
    return { message: 'User registered successfully', userId: mockUsers.length }
  }
}

export const mockDoctorService = {
  async getAllDoctors() {
    await delay(300)
    return mockDoctors
  },

  async createDoctor(doctorData) {
    await delay(300)
    const newDoctor = {
      id: mockDoctors.length + 1,
      ...doctorData
    }
    mockDoctors.push(newDoctor)
    return newDoctor
  }
}

export const mockAppointmentService = {
  async createAppointment(appointmentData) {
    await delay(300)
    const newAppointment = {
      id: mockAppointments.length + 1,
      ...appointmentData
    }
    mockAppointments.push(newAppointment)
    return newAppointment
  },

  async getMyAppointments() {
    await delay(300)
    return mockAppointments
  },

  async updateAppointmentStatus(id, status) {
    await delay(300)
    const appointment = mockAppointments.find(a => a.id === id)
    if (appointment) {
      appointment.status = status
    }
    return appointment
  }
}

export const mockPrescriptionService = {
  async createPrescription(prescriptionData) {
    await delay(300)
    const newPrescription = {
      id: mockPrescriptions.length + 1,
      ...prescriptionData
    }
    mockPrescriptions.push(newPrescription)
    return newPrescription
  },

  async getMyPrescriptions() {
    await delay(300)
    return mockPrescriptions
  }
}