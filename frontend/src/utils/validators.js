// Thêm các hàm validate riêng lẻ
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
  return phoneRegex.test(phone)
}

export const validateTaxCode = (taxCode) => {
  // Basic tax code validation - 10 or 13 digits
  const taxCodeRegex = /^\d{10}$|^\d{13}$/
  return taxCodeRegex.test(taxCode)
}

export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) return 'Email là bắt buộc'
    if (!emailRegex.test(value)) return 'Email không hợp lệ'
    return null
  },

  password: (value) => {
    if (!value) return 'Mật khẩu là bắt buộc'
    if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự'
    return null
  },

  phone: (value) => {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
    if (!value) return 'Số điện thoại là bắt buộc'
    if (!phoneRegex.test(value)) return 'Số điện thoại không hợp lệ'
    return null
  },

  required: (value, fieldName = 'Trường này') => {
    if (!value || value.toString().trim() === '') return `${fieldName} là bắt buộc`
    return null
  },

  minLength: (value, min, fieldName = 'Trường này') => {
    if (value && value.length < min) return `${fieldName} phải có ít nhất ${min} ký tự`
    return null
  },

  match: (value, confirmValue, fieldName = 'Mật khẩu') => {
    if (value !== confirmValue) return `${fieldName} không khớp`
    return null
  }
}

export const validateForm = (formData, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field]
    const value = formData[field]
    
    for (const rule of fieldRules) {
      const error = rule(value, formData)
      if (error) {
        errors[field] = error
        break
      }
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Export mặc định
export default {
  validateEmail,
  validatePhone,
  validateTaxCode,
  validators,
  validateForm
}