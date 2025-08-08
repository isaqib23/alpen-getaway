import React, { ReactNode, createContext, useContext, useMemo, useState, useEffect } from 'react'
import * as bookcarsTypes from "../types/bookcars-types"
import { authUtils } from '../api/client'

// Create context
export interface GlobalContextType {
  notificationCount: number,
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>,
  // Authentication state
  user: bookcarsTypes.User | null,
  isAuthenticated: boolean,
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>,
  logout: () => Promise<void>,
  setUser: React.Dispatch<React.SetStateAction<bookcarsTypes.User | null>>
}

const GlobalContext = createContext<GlobalContextType | null>(null)

// Create a provider
interface GlobalProviderProps {
  children: ReactNode
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [notificationCount, setNotificationCount] = useState(0)
  const [user, setUser] = useState<bookcarsTypes.User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize authentication state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('bc-user')
        const hasToken = authUtils.isAuthenticated()
        
        if (storedUser && hasToken) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
        } else {
          // Clear any stale data
          setUser(null)
          setIsAuthenticated(false)
          if (!hasToken) {
            localStorage.removeItem('bc-user')
          }
        }
      } catch (error) {
        console.error('Error initializing auth state:', error)
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('bc-user')
        authUtils.removeToken()
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const UserService = await import('../services/UserService')
      const result = await UserService.signin({ email, password, stayConnected: false })
      
      if (result.status === 200 && result.data) {
        // Check if user is blacklisted
        if (result.data.blacklisted) {
          await UserService.signout(false, false)
          return { success: false, error: 'Account is blacklisted' }
        }
        
        setUser(result.data)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        return { success: false, error: 'Invalid credentials' }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const UserService = await import('../services/UserService')
      await UserService.signout(false, false) // Don't redirect automatically
      
      // Clear state
      setUser(null)
      setIsAuthenticated(false)
      
      // Clear storage
      localStorage.removeItem('bc-user')
      authUtils.removeToken()
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout API call fails, clear local state
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('bc-user')
      authUtils.removeToken()
    }
  }

  const value = useMemo(() => ({
    notificationCount,
    setNotificationCount,
    user,
    isAuthenticated,
    login,
    logout,
    setUser
  }), [notificationCount, user, isAuthenticated])

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  )
}

// Create a custom hook to access context
// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalContext = () => useContext(GlobalContext)
