import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Snackbar, Alert, AlertColor } from '@mui/material'

interface NotificationContextType {
  showNotification: (message: string, type?: AlertColor) => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

interface NotificationState {
  open: boolean
  message: string
  type: AlertColor
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    type: 'info'
  })

  const showNotification = (message: string, type: AlertColor = 'info') => {
    setNotification({
      open: true,
      message,
      type
    })
  }

  const handleClose = () => {
    setNotification(prev => ({ ...prev, open: false }))
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={notification.type} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}