import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-medical-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 fade-in">
        <div className="text-center">
          <div className="medical-icon-large mb-4">🏥</div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-blue-100 text-lg">
            Medical Appointment & Prescription Tracker
          </p>
          
          {/* Demo Credentials */}
          <div className="bg-white bg-opacity-10 rounded-lg p-4 mt-4 text-white text-sm">
            <h3 className="font-semibold mb-2">Demo Credentials:</h3>
            <div className="space-y-1">
              <p><strong>Admin:</strong> admin@example.com / admin123</p>
              <p><strong>Doctor:</strong> doctor@example.com / doctor123</p>
              <p><strong>Patient:</strong> patient@example.com / patient123</p>
            </div>
          </div>
        </div>
        
        <div className="card mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="notification-error">
                {error}
              </div>
            )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register here
              </Link>
            </span>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login