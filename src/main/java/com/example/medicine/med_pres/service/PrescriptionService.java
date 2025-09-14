package com.example.medicine.med_pres.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.medicine.med_pres.model.Doctor;
import com.example.medicine.med_pres.model.Prescription;
import com.example.medicine.med_pres.model.User;
import com.example.medicine.med_pres.repository.PrescriptionRepository;
import com.example.medicine.med_pres.service.UserService;
import com.example.medicine.med_pres.service.DoctorService;

@Service
public class PrescriptionService {
private final PrescriptionRepository prescriptionRepository;
    private final UserService userService;
    private final DoctorService doctorService;

    public PrescriptionService(PrescriptionRepository prescriptionRepository, UserService userService, DoctorService doctorService) {
        this.prescriptionRepository = prescriptionRepository;
        this.userService = userService;
        this.doctorService = doctorService;
    }

    // Create Prescription
    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }
    
    // Create Prescription with current doctor from JWT
    public Prescription createPrescriptionForDoctor(java.util.Map<String, Object> prescriptionData, String doctorEmail) {
        try {
            System.out.println("DEBUG: Starting prescription creation for doctor: " + doctorEmail);
            
            // Find patient
            Long patientId = Long.valueOf(prescriptionData.get("patientId").toString());
            User patient = userService.findById(patientId);
            if (patient == null) {
                throw new RuntimeException("Patient not found with ID: " + patientId);
            }
            System.out.println("DEBUG: Found patient: " + patient.getName());
            
            // Find doctor user
            User doctorUser = userService.findByEmail(doctorEmail);
            if (doctorUser == null) {
                throw new RuntimeException("Doctor not found with email: " + doctorEmail);
            }
            System.out.println("DEBUG: Found doctor user: " + doctorUser.getName());
            
            // Find existing doctor profile from database
            java.util.List<com.example.medicine.med_pres.model.Doctor> allDoctors = 
                doctorService.getAllDoctors();
            
            com.example.medicine.med_pres.model.Doctor doctor = null;
            for (com.example.medicine.med_pres.model.Doctor d : allDoctors) {
                if (d.getUser() != null && doctorEmail.equals(d.getUser().getEmail())) {
                    doctor = d;
                    break;
                }
            }
            
            if (doctor == null) {
                throw new RuntimeException("Doctor profile not found for email: " + doctorEmail);
            }
            System.out.println("DEBUG: Found doctor profile: " + doctor.getId());
            
            // Create prescription
            Prescription prescription = new Prescription();
            prescription.setPatient(patient);
            prescription.setDoctor(doctor);
            prescription.setMedicationName((String) prescriptionData.get("medicationName"));
            prescription.setDosage((String) prescriptionData.get("dosage"));
            prescription.setFrequency((String) prescriptionData.get("frequency"));
            prescription.setNotes((String) prescriptionData.get("notes"));
            
            System.out.println("DEBUG: Saving prescription...");
            Prescription saved = prescriptionRepository.save(prescription);
            System.out.println("DEBUG: Prescription saved with ID: " + saved.getId());
            
            return saved;
        } catch (Exception e) {
            System.out.println("DEBUG: Error creating prescription: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create prescription: " + e.getMessage());
        }
    }

    // Get all Prescriptions
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    // Get Prescription by ID
    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    public List<Prescription> getPrescriptionsByPatient(User patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctor(Doctor doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }
    
    // Get prescriptions by patient email
    public List<Prescription> getPrescriptionsByPatientEmail(String patientEmail) {
        List<Prescription> allPrescriptions = prescriptionRepository.findAll();
        System.out.println("DEBUG: Total prescriptions in database: " + allPrescriptions.size());
        
        List<Prescription> filtered = allPrescriptions.stream()
            .filter(prescription -> {
                if (prescription.getPatient() == null) {
                    System.out.println("DEBUG: Prescription " + prescription.getId() + " has no patient");
                    return false;
                }
                String prescriptionPatientEmail = prescription.getPatient().getEmail();
                boolean matches = patientEmail.equals(prescriptionPatientEmail);
                System.out.println("DEBUG: Prescription " + prescription.getId() + 
                    " - Patient: " + prescriptionPatientEmail + 
                    " - Medication: " + prescription.getMedicationName() +
                    " - Matches: " + matches);
                return matches;
            })
            .collect(java.util.stream.Collectors.toList());
            
        System.out.println("DEBUG: Filtered prescriptions for " + patientEmail + ": " + filtered.size());
        return filtered;
    }

    // Update Prescription
    public Prescription updatePrescription(Long id, Prescription updatedPrescription) {
        return prescriptionRepository.findById(id).map(existing -> {
            existing.setMedicationName(updatedPrescription.getMedicationName());
            existing.setDosage(updatedPrescription.getDosage());
            existing.setFrequency(updatedPrescription.getFrequency());
            existing.setNotes(updatedPrescription.getNotes());
            existing.setDoctor(updatedPrescription.getDoctor());
            existing.setPatient(updatedPrescription.getPatient());
            return prescriptionRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Prescription not found with id " + id));
    }

    // Delete Prescription
    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }
}
    