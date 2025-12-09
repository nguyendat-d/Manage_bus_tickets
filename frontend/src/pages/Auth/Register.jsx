import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import RegisterForm from '../../components/auth/RegisterForm'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('') // Thêm state success
  const isSubmittingRef = useRef(false)

  const handleRegister = async (userData) => {
    // Prevent multiple submissions
    if (isSubmittingRef.current) {
      return
    }

    try {
      isSubmittingRef.current = true
      setLoading(true)
      setError('')
      setSuccess('')
      
      console.log('📝 Register page - calling register with:', userData)
      
      const result = await register(userData)
      
      console.log('📝 Register page - result:', result)

      if (result.success) {
        setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...')
        
        // Chuyển hướng sau 2 giây
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Đăng ký thành công! Vui lòng đăng nhập.',
              email: userData.email
            } 
          })
        }, 2000)
      } else {
        setError(result.message || 'Đăng ký thất bại. Vui lòng thử lại.')
      }
    } catch (err) {
      console.error('Register page error:', err)
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
      // Reset after 3 seconds
      setTimeout(() => {
        isSubmittingRef.current = false
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center px-4 py-8">
      <RegisterForm 
        onSubmit={handleRegister}
        loading={loading}
        error={error}
        success={success} // Truyền success message
      />
    </div>
  )
}

export default Register