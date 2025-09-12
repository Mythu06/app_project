package com.example.medicine.med_pres.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.medicine.med_pres.model.Doctor;
import com.example.medicine.med_pres.model.Prescription;
import com.example.medicine.med_pres.model.User;

public interface PrescriptionRepository extends JpaRepository<Prescription,Long>{
        List<Prescription> findByPatientId(User patientId);
            List<Prescription> findByDoctorId(Doctor doctorId);

}
