import React, { useState, useEffect } from 'react'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'PATIENT',
    password: ''
  })

  // Mock users data
  const mockUsers = [
    { id: 1, name: 'John Patient', email: 'patient@example.com', role: 'PATIENT', status: 'Active' },
    { id: 2, name: 'Dr. Smith', email: 'doctor@example.com', role: 'DOCTOR', status: 'Active' },
    { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', status: 'Active' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'PATIENT', status: 'Active' },
    { id: 5, name: 'Dr. Johnson', email: 'dr.johnson@clinic.com', role: 'DOCTOR', status: 'Inactive' }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setUsers(mockUsers)
      setLoading(false)
    }, 500)
  }, [])

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'DOCTOR': return 'bg-blue-100 text-blue-800'
      case 'PATIENT': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const handleAddUser = () => {
    setShowAddModal(true)
  }

  const handleSaveUser = () => {
    const newUserWithId = {
      id: users.length + 1,
      ...newUser,
      status: 'Active'
    }
    setUsers([...users, newUserWithId])
    setShowAddModal(false)
    setNewUser({ name: '', email: '', role: 'PATIENT', password: '' })
  }

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner h-16 w-16"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-gray-600">Manage system users and their roles</p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Showing {users.length} users
        </p>
        <button onClick={handleAddUser} className="btn-primary">
          Add New User
        </button>
      </div>
    </div>
  )
}

export default ManageUsers