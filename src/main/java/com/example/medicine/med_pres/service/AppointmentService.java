package com.example.medicine.med_pres.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.medicine.med_pres.model.Appointment;
import com.example.medicine.med_pres.model.Doctor;
import com.example.medicine.med_pres.model.User;
import com.example.medicine.med_pres.repository.AppointmentRepository;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserService userService;

    public AppointmentService(AppointmentRepository appointmentRepository, UserService userService) {
        this.appointmentRepository = appointmentRepository;
        this.userService = userService;
    }

    // Create Appointment
    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }
    
    // Create Appointment with correct patient from JWT
    public Appointment createAppointmentForPatient(Appointment appointment, String patientEmail) {
        // Find the actual patient user by email
        User patient = userService.findByEmail(patientEmail);
        if (patient == null) {
            throw new RuntimeException("Patient not found with email: " + patientEmail);
        }
        
        System.out.println("DEBUG: Found patient - ID: " + patient.getId() + ", Name: " + patient.getName() + ", Email: " + patient.getEmail());
        
        // Set the correct patient (this will store patient.id in patient_id column)
        appointment.setPatient(patient);
        appointment.setStatus(Appointment.Status.PENDING);
        
        Appointment saved = appointmentRepository.save(appointment);
        System.out.println("DEBUG: Appointment saved - Patient ID in DB: " + saved.getPatient().getId());
        
        return saved;
    }

    // Get all Appointments
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Get Appointment by ID
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAppointmentsByPatient(User patientId) {
    return appointmentRepository.findByPatientId(patientId);
}

public List<Appointment> getAppointmentsByDoctor(Doctor doctorId) {
    return appointmentRepository.findByDoctorId(doctorId);
}

    // Update Appointment
    public Appointment updateAppointment(Long id, Appointment updatedAppointment) {
        return appointmentRepository.findById(id).map(existing -> {
            existing.setReason(updatedAppointment.getReason());
            existing.setAppointmentDate(updatedAppointment.getAppointmentDate());
            existing.setAppointmentTime(updatedAppointment.getAppointmentTime());
            existing.setStatus(updatedAppointment.getStatus());
            existing.setDoctor(updatedAppointment.getDoctor());
            existing.setPatient(updatedAppointment.getPatient());
            return appointmentRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Appointment not found with id " + id));
    }

    // Get appointments by doctor email
    public List<Appointment> getAppointmentsByDoctorEmail(String doctorEmail) {
        List<Appointment> allAppointments = appointmentRepository.findAll();
        System.out.println("DEBUG: Total appointments in database: " + allAppointments.size());
        
        List<Appointment> filtered = allAppointments.stream()
            .filter(appointment -> {
                if (appointment.getDoctor() == null) {
                    System.out.println("DEBUG: Appointment " + appointment.getId() + " has no doctor");
                    return false;
                }
                if (appointment.getDoctor().getUser() == null) {
                    System.out.println("DEBUG: Appointment " + appointment.getId() + " doctor has no user");
                    return false;
                }
                String appointmentDoctorEmail = appointment.getDoctor().getUser().getEmail();
                boolean matches = doctorEmail.equals(appointmentDoctorEmail);
                System.out.println("DEBUG: Appointment " + appointment.getId() + 
                    " - Doctor: " + appointmentDoctorEmail + 
                    " - Patient: " + (appointment.getPatient() != null ? appointment.getPatient().getName() : "null") +
                    " - Matches: " + matches);
                return matches;
            })
            .collect(java.util.stream.Collectors.toList());
            
        System.out.println("DEBUG: Filtered appointments for " + doctorEmail + ": " + filtered.size());
        return filtered;
    }
    
    // Get appointments by patient email
    public List<Appointment> getAppointmentsByPatientEmail(String patientEmail) {
        List<Appointment> allAppointments = appointmentRepository.findAll();
        System.out.println("DEBUG: Total appointments in database: " + allAppointments.size());
        
        List<Appointment> filtered = allAppointments.stream()
            .filter(appointment -> {
                if (appointment.getPatient() == null) {
                    System.out.println("DEBUG: Appointment " + appointment.getId() + " has no patient");
                    return false;
                }
                String appointmentPatientEmail = appointment.getPatient().getEmail();
                boolean matches = patientEmail.equals(appointmentPatientEmail);
                System.out.println("DEBUG: Appointment " + appointment.getId() + 
                    " - Patient: " + appointmentPatientEmail + 
                    " - Doctor: " + (appointment.getDoctor() != null ? appointment.getDoctor().getUser().getName() : "null") +
                    " - Matches: " + matches);
                return matches;
            })
            .collect(java.util.stream.Collectors.toList());
            
        System.out.println("DEBUG: Filtered appointments for patient " + patientEmail + ": " + filtered.size());
        return filtered;
    }

    // Update Appointment Status
    public Appointment updateAppointmentStatus(Long id, String status) {
        return appointmentRepository.findById(id).map(existing -> {
            existing.setStatus(Appointment.Status.valueOf(status));
            return appointmentRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Appointment not found with id " + id));
    }

    // Delete Appointment
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}