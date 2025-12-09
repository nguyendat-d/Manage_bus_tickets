// Trong Login.jsx, thay thế bằng:
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useLocation } from 'react-router-dom'
import LoginForm from '../../components/auth/LoginForm'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/'
  const message = location.state?.message

  return (
    <>
      <Helmet>
        <title>Đăng Nhập | BusTicket</title>
        <meta name="description" content="Đăng nhập vào tài khoản BusTicket của bạn" />
      </Helmet>
      
      <LoginForm />
    </>
  )
}

export default Login