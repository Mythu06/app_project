import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getNavLinks = () => {
    if (user?.role === 'PATIENT') {
      return (
        <>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/search-doctors" className="nav-link">Find Doctors</Link>
          <Link to="/my-appointments" className="nav-link">My Appointments</Link>
          <Link to="/my-prescriptions" className="nav-link">My Prescriptions</Link>
        </>
      )
    } else if (user?.role === 'DOCTOR') {
      return (
        <>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/manage-appointments" className="nav-link">Manage Appointments</Link>
        </>
      )
    } else if (user?.role === 'ADMIN') {
      return (
        <>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/manage-doctors" className="nav-link">Manage Doctors</Link>
        </>
      )
    }
  }

  return (
    <nav className="bg-medical-gradient shadow-xl border-b border-blue-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-white text-2xl font-bold flex items-center">
              <span className="medical-icon mr-2">🏥</span>
              MedPres Tracker
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {getNavLinks()}
            
            <div className="flex items-center space-x-4 ml-6">
              <span className="text-white text-sm">
                {user?.email} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar