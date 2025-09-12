import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import DoctorSearch from './pages/DoctorSearch'
import BookAppointment from './pages/BookAppointment'
import MyAppointments from './pages/MyAppointments'
import MyPrescriptions from './pages/MyPrescriptions'
import ManageAppointments from './pages/ManageAppointments'
import IssuePrescription from './pages/IssuePrescription'
import ManageDoctors from './pages/ManageDoctors'
import ManageUsers from './pages/ManageUsers'
import Reports from './pages/Reports'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-medical-gradient">
        <div className="text-center">
          <div className="loading-spinner h-16 w-16 mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading MedPres Tracker...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          user ? (
            user.role === 'PATIENT' ? <PatientDashboard /> :
            user.role === 'DOCTOR' ? <DoctorDashboard /> :
            user.role === 'ADMIN' ? <AdminDashboard /> :
            <Navigate to="/login" />
          ) : <Navigate to="/login" />
        } />
        
        {/* Patient Routes */}
        <Route path="/search-doctors" element={
          user?.role === 'PATIENT' ? <DoctorSearch /> : <Navigate to="/login" />
        } />
        <Route path="/book-appointment/:doctorId" element={
          user?.role === 'PATIENT' ? <BookAppointment /> : <Navigate to="/login" />
        } />
        <Route path="/my-appointments" element={
          user?.role === 'PATIENT' ? <MyAppointments /> : <Navigate to="/login" />
        } />
        <Route path="/my-prescriptions" element={
          user?.role === 'PATIENT' ? <MyPrescriptions /> : <Navigate to="/login" />
        } />
        
        {/* Doctor Routes */}
        <Route path="/manage-appointments" element={
          user?.role === 'DOCTOR' ? <ManageAppointments /> : <Navigate to="/login" />
        } />
        <Route path="/issue-prescription/:appointmentId" element={
          user?.role === 'DOCTOR' ? <IssuePrescription /> : <Navigate to="/login" />
        } />
        
        {/* Admin Routes */}
        <Route path="/manage-doctors" element={
          user?.role === 'ADMIN' ? <ManageDoctors /> : <Navigate to="/login" />
        } />
        <Route path="/manage-users" element={
          user?.role === 'ADMIN' ? <ManageUsers /> : <Navigate to="/login" />
        } />
        <Route path="/reports" element={
          user?.role === 'ADMIN' ? <Reports /> : <Navigate to="/login" />
        } />
        
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  )
}

export default App