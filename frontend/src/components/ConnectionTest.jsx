import React, { useState } from 'react'

const ConnectionTest = () => {
  const [status, setStatus] = useState('Not tested')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test', password: 'test' })
      })
      
      if (response.status === 400) {
        setStatus('✅ Backend is running (got expected 400 error)')
      } else {
        setStatus(`✅ Backend responded with status: ${response.status}`)
      }
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <div className="card m-4 max-w-md">
      <h3 className="text-lg font-semibold mb-4">Backend Connection Test</h3>
      <button 
        onClick={testConnection} 
        disabled={loading}
        className="btn-primary mb-4"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      <p className="text-sm">{status}</p>
      <div className="mt-4 text-xs text-gray-600">
        <p>Expected backend URL: http://localhost:8080</p>
        <p>Make sure your Spring Boot application is running</p>
      </div>
    </div>
  )
}

export default ConnectionTest