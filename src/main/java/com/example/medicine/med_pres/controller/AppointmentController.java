package com.example.medicine.med_pres.controller;
       
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import com.example.medicine.med_pres.model.Appointment;
import com.example.medicine.med_pres.model.Doctor;
import com.example.medicine.med_pres.model.User;
import com.example.medicine.med_pres.service.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment, Authentication authentication) {
        System.out.println("DEBUG: Creating appointment...");
        
        // Get current patient from JWT token
        String patientEmail = authentication.getName();
        System.out.println("DEBUG: Patient email from JWT: " + patientEmail);
        
        Appointment savedAppointment = appointmentService.createAppointmentForPatient(appointment, patientEmail);
        System.out.println("DEBUG: Appointment created with ID: " + savedAppointment.getId());
        System.out.println("DEBUG: Actual Patient ID used: " + savedAppointment.getPatient().getId());
        System.out.println("DEBUG: Patient Name: " + savedAppointment.getPatient().getName());
        
        return ResponseEntity.ok(savedAppointment);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        System.out.println("DEBUG: Found " + appointments.size() + " appointments");
        for (Appointment apt : appointments) {
            System.out.println("DEBUG: Appointment ID: " + apt.getId() + ", Patient: " + 
                (apt.getPatient() != null ? apt.getPatient().getName() : "null") + 
                ", Doctor: " + (apt.getDoctor() != null ? apt.getDoctor().getUser().getName() : "null") +
                ", Status: " + apt.getStatus());
        }
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/my-appointments")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        String userEmail = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        
        if ("ROLE_DOCTOR".equals(role)) {
            System.out.println("DEBUG: Getting appointments for doctor: " + userEmail);
            List<Appointment> doctorAppointments = appointmentService.getAppointmentsByDoctorEmail(userEmail);
            System.out.println("DEBUG: Found " + doctorAppointments.size() + " appointments for this doctor");
            return ResponseEntity.ok(doctorAppointments);
        } else {
            System.out.println("DEBUG: Getting appointments for patient: " + userEmail);
            List<Appointment> patientAppointments = appointmentService.getAppointmentsByPatientEmail(userEmail);
            System.out.println("DEBUG: Found " + patientAppointments.size() + " appointments for this patient");
            return ResponseEntity.ok(patientAppointments);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable User patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Doctor doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, appointment));
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        Appointment updatedAppointment = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(updatedAppointment);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}