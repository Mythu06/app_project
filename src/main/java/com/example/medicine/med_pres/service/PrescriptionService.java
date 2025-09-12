package com.example.medicine.med_pres.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.medicine.med_pres.model.Doctor;
import com.example.medicine.med_pres.model.Prescription;
import com.example.medicine.med_pres.model.User;
import com.example.medicine.med_pres.repository.PrescriptionRepository;
import com.example.medicine.med_pres.service.UserService;

@Service
public class PrescriptionService {
private final PrescriptionRepository prescriptionRepository;
    private final UserService userService;

    public PrescriptionService(PrescriptionRepository prescriptionRepository, UserService userService) {
        this.prescriptionRepository = prescriptionRepository;
        this.userService = userService;
    }

    // Create Prescription
    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
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
    