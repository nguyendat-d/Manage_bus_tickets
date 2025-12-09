import { useState, useEffect, useCallback, useRef } from 'react'
import { useNotification } from '../contexts/NotificationContext'

export const useApi = (apiFunction, options = {}) => {
  const {
    immediate = true,
    initialData = null,
    onSuccess,
    onError,
    showNotifications = true,
    successMessage = null,
    errorMessage = null,
    dependencies = []
  } = options

  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('idle') // 'idle', 'loading', 'success', 'error'
  const { showSuccess, showError } = useNotification()
  const isMounted = useRef(true)

  // Reset mount status on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const execute = useCallback(async (...args) => {
    if (!isMounted.current) return

    try {
      setLoading(true)
      setError(null)
      setStatus('loading')

      const result = await apiFunction(...args)
      
      if (!isMounted.current) return

      setData(result.data)
      setStatus('success')

      // Call success callback
      if (onSuccess) {
        onSuccess(result.data, ...args)
      }

      // Show success notification
      if (showNotifications && successMessage) {
        showSuccess(successMessage)
      } else if (showNotifications && result.message) {
        showSuccess(result.message)
      }

      return result
    } catch (err) {
      if (!isMounted.current) return

      const errorData = err.response?.data || err
      setError(errorData)
      setStatus('error')

      // Call error callback
      if (onError) {
        onError(errorData, ...args)
      }

      // Show error notification
      if (showNotifications) {
        const message = errorMessage || errorData.message || 'Đã xảy ra lỗi'
        showError(message)
      }

      throw err
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [apiFunction, onSuccess, onError, showNotifications, successMessage, errorMessage, showSuccess, showError])

  // Manual refresh function
  const refresh = useCallback((...args) => {
    return execute(...args)
  }, [execute])

  // Reset state function
  const reset = useCallback(() => {
    setData(initialData)
    setError(null)
    setStatus('idle')
    setLoading(false)
  }, [initialData])

  // Retry function
  const retry = useCallback((...args) => {
    return execute(...args)
  }, [execute])

  // Auto-execute on mount or when dependencies change
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute, ...dependencies])

  return {
    // State
    data,
    loading,
    error,
    status,
    
    // Actions
    execute,
    refresh,
    reset,
    retry,
    
    // Status flags
    isIdle: status === 'idle',
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    
    // Utility
    hasData: !!data,
    hasError: !!error
  }
}

// Specialized API hooks for common operations
export const useQuery = (apiFunction, options = {}) => {
  return useApi(apiFunction, { ...options, immediate: true })
}

export const useMutation = (apiFunction, options = {}) => {
  return useApi(apiFunction, { ...options, immediate: false })
}

export const useLazyQuery = (apiFunction, options = {}) => {
  return useApi(apiFunction, { ...options, immediate: false })
}

// Hook for paginated data
export const usePaginatedApi = (apiFunction, initialPage = 1, pageSize = 10) => {
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(1)
  const [allData, setAllData] = useState([])

  const api = useApi(
    () => apiFunction(page, pageSize),
    {
      immediate: true,
      onSuccess: (result) => {
        setTotalPages(result.totalPages || 1)
        setAllData(prev => {
          const newData = [...prev]
          newData[page - 1] = result.data
          return newData
        })
      }
    }
  )

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const nextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }

  const refreshAll = () => {
    setAllData([])
    setPage(1)
  }

  return {
    ...api,
    page,
    totalPages,
    allData: allData.flat().filter(Boolean),
    currentData: api.data,
    goToPage,
    nextPage,
    prevPage,
    refreshAll,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }
}

// Hook for infinite scroll
export const useInfiniteApi = (apiFunction, pageSize = 10) => {
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [allData, setAllData] = useState([])

  const api = useApi(
    () => apiFunction(page, pageSize),
    {
      immediate: true,
      onSuccess: (result) => {
        setAllData(prev => [...prev, ...result.data])
        setHasMore(result.hasMore || page * pageSize < result.totalCount)
      }
    }
  )

  const loadMore = () => {
    if (hasMore && !api.loading) {
      setPage(prev => prev + 1)
    }
  }

  const refresh = () => {
    setPage(1)
    setAllData([])
    setHasMore(true)
  }

  const reset = () => {
    refresh()
    api.reset()
  }

  return {
    ...api,
    data: allData,
    page,
    hasMore,
    loadMore,
    refresh,
    reset,
    isFirstLoad: page === 1 && api.loading
  }
}