import { useState, useEffect, useCallback, useRef } from 'react'

export const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    syncAcrossTabs = true,
    onError = (error) => console.error(`LocalStorage error for key "${key}":`, error)
  } = options

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return initialValue instanceof Function ? initialValue() : initialValue
      }
      return deserializer(item)
    } catch (error) {
      onError(error)
      return initialValue instanceof Function ? initialValue() : initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, serializer(valueToStore))
      }
    } catch (error) {
      onError(error)
    }
  }, [key, storedValue, serializer, onError])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(undefined)
      window.localStorage.removeItem(key)
    } catch (error) {
      onError(error)
    }
  }, [key, onError])

  const clearStorage = useCallback(() => {
    try {
      window.localStorage.clear()
      setStoredValue(undefined)
    } catch (error) {
      onError(error)
    }
  }, [onError])

  // Sync across tabs
  useEffect(() => {
    if (!syncAcrossTabs) return

    const handleStorageChange = (event) => {
      if (event.key === key) {
        try {
          const newValue = event.newValue ? deserializer(event.newValue) : undefined
          setStoredValue(newValue)
        } catch (error) {
          onError(error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, deserializer, syncAcrossTabs, onError])

  return {
    value: storedValue,
    setValue,
    removeValue,
    clearStorage,
    isSet: storedValue !== undefined && storedValue !== null
  }
}

// Specialized localStorage hooks
export const useLocalStorageObject = (key, initialValue = {}) => {
  return useLocalStorage(key, initialValue, {
    serializer: (value) => JSON.stringify(value),
    deserializer: (value) => JSON.parse(value)
  })
}

export const useLocalStorageArray = (key, initialValue = []) => {
  return useLocalStorage(key, initialValue, {
    serializer: (value) => JSON.stringify(value),
    deserializer: (value) => JSON.parse(value)
  })
}

export const useLocalStorageString = (key, initialValue = '') => {
  return useLocalStorage(key, initialValue, {
    serializer: (value) => String(value),
    deserializer: (value) => value
  })
}

export const useLocalStorageNumber = (key, initialValue = 0) => {
  return useLocalStorage(key, initialValue, {
    serializer: (value) => String(value),
    deserializer: (value) => Number(value)
  })
}

export const useLocalStorageBoolean = (key, initialValue = false) => {
  return useLocalStorage(key, initialValue, {
    serializer: (value) => String(value),
    deserializer: (value) => value === 'true'
  })
}

// Hook for managing multiple localStorage items
export const useLocalStorageMulti = (items) => {
  const keys = Object.keys(items)
  const values = {}

  keys.forEach(key => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { value } = useLocalStorage(key, items[key])
    values[key] = value
  })

  const setItems = useCallback((updates) => {
    Object.keys(updates).forEach(key => {
      if (keys.includes(key)) {
        const { setValue } = useLocalStorage(key, items[key])
        setValue(updates[key])
      }
    })
  }, [keys, items])

  const removeItems = useCallback((keysToRemove) => {
    keysToRemove.forEach(key => {
      if (keys.includes(key)) {
        const { removeValue } = useLocalStorage(key, items[key])
        removeValue()
      }
    })
  }, [keys, items])

  return {
    values,
    setItems,
    removeItems
  }
}

// Hook with expiration
export const useLocalStorageWithExpiry = (key, initialValue, ttl = 3600000) => { // 1 hour default
  const { value, setValue, removeValue } = useLocalStorage(key, null)

  const setValueWithExpiry = useCallback((value) => {
    const item = {
      value,
      expiry: Date.now() + ttl
    }
    setValue(item)
  }, [setValue, ttl])

  const getValue = useCallback(() => {
    if (!value) return initialValue

    if (Date.now() > value.expiry) {
      removeValue()
      return initialValue
    }

    return value.value
  }, [value, initialValue, removeValue])

  const isExpired = useCallback(() => {
    if (!value) return true
    return Date.now() > value.expiry
  }, [value])

  const timeUntilExpiry = useCallback(() => {
    if (!value || !value.expiry) return 0
    return Math.max(0, value.expiry - Date.now())
  }, [value])

  return {
    value: getValue(),
    setValue: setValueWithExpiry,
    removeValue,
    isExpired,
    timeUntilExpiry
  }
}

// Hook for session storage (same API as localStorage)
export const useSessionStorage = (key, initialValue, options = {}) => {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onError = (error) => console.error(`SessionStorage error for key "${key}":`, error)
  } = options

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      if (item === null) {
        return initialValue instanceof Function ? initialValue() : initialValue
      }
      return deserializer(item)
    } catch (error) {
      onError(error)
      return initialValue instanceof Function ? initialValue() : initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (valueToStore === undefined) {
        window.sessionStorage.removeItem(key)
      } else {
        window.sessionStorage.setItem(key, serializer(valueToStore))
      }
    } catch (error) {
      onError(error)
    }
  }, [key, storedValue, serializer, onError])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(undefined)
      window.sessionStorage.removeItem(key)
    } catch (error) {
      onError(error)
    }
  }, [key, onError])

  return {
    value: storedValue,
    setValue,
    removeValue,
    isSet: storedValue !== undefined && storedValue !== null
  }
}