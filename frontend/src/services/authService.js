// Using mock services for frontend-only demo
import { 
  mockAuthService, 
  mockDoctorService, 
  mockAppointmentService, 
  mockPrescriptionService 
} from './mockAuthService'

export const authService = mockAuthService

export const doctorService = mockDoctorService
export const appointmentService = mockAppointmentService
export const prescriptionService = mockPrescriptionService