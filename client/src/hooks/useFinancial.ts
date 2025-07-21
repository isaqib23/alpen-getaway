import { useState, useCallback } from 'react'
import { useToast } from './useToast'
import { 
  financialAPI, 
  Payment, 
  Commission, 
  PaymentMethodConfig,
  PaymentStats,
  PaymentFilters,
  CommissionStatus,
  CreatePaymentDto,
  UpdatePaymentDto,
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto
} from '../api/financial'

// Payments hook
export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
    limit: 10
  })
  const { success: showSuccess, error: showError } = useToast()

  const fetchPayments = useCallback(async (page = 1, limit = 10, filters?: PaymentFilters) => {
    try {
      setLoading(true)
      const response = await financialAPI.getPayments(page, limit, filters)
      setPayments(response.data)
      setPagination(response.meta)
    } catch (error: any) {
      console.error('Error fetching payments:', error)
      showError('Failed to fetch payments')
      setPayments([])
    } finally {
      setLoading(false)
    }
  }, [showError])

  const fetchPaymentStats = useCallback(async () => {
    try {
      const statsData = await financialAPI.getPaymentStats()
      setStats(statsData)
    } catch (error: any) {
      console.error('Error fetching payment stats:', error)
      showError('Failed to fetch payment statistics')
    }
  }, [showError])

  const createPayment = useCallback(async (data: CreatePaymentDto): Promise<Payment | null> => {
    try {
      setLoading(true)
      const newPayment = await financialAPI.createPayment(data)
      setPayments(prev => [newPayment, ...prev])
      showSuccess('Payment created successfully')
      return newPayment
    } catch (error: any) {
      console.error('Error creating payment:', error)
      showError(error.response?.data?.message || 'Failed to create payment')
      return null
    } finally {
      setLoading(false)
    }
  }, [showSuccess, showError])

  const updatePayment = useCallback(async (id: string, data: UpdatePaymentDto): Promise<Payment | null> => {
    try {
      setLoading(true)
      const updatedPayment = await financialAPI.updatePayment(id, data)
      setPayments(prev => prev.map(payment => 
        payment.id === id ? updatedPayment : payment
      ))
      showSuccess('Payment updated successfully')
      return updatedPayment
    } catch (error: any) {
      console.error('Error updating payment:', error)
      showError(error.response?.data?.message || 'Failed to update payment')
      return null
    } finally {
      setLoading(false)
    }
  }, [showSuccess, showError])

  const markAsPaid = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      const updatedPayment = await financialAPI.markPaymentAsPaid(id)
      setPayments(prev => prev.map(payment => 
        payment.id === id ? updatedPayment : payment
      ))
      showSuccess('Payment marked as paid successfully')
      return true
    } catch (error: any) {
      console.error('Error marking payment as paid:', error)
      showError(error.response?.data?.message || 'Failed to mark payment as paid')
      return false
    } finally {
      setLoading(false)
    }
  }, [showSuccess, showError])

  const markAsFailed = useCallback(async (id: string, reason: string): Promise<boolean> => {
    try {
      setLoading(true)
      const updatedPayment = await financialAPI.markPaymentAsFailed(id, reason)
      setPayments(prev => prev.map(payment => 
        payment.id === id ? updatedPayment : payment
      ))
      showSuccess('Payment marked as failed')
      return true
    } catch (error: any) {
      console.error('Error marking payment as failed:', error)
      showError(error.response?.data?.message || 'Failed to mark payment as failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [showSuccess, showError])

  const refundPayment = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      const updatedPayment = await financialAPI.refundPayment(id)
      setPayments(prev => prev.map(payment => 
        payment.id === id ? updatedPayment : payment
      ))
      showSuccess('Payment refunded successfully')
      return true
    } catch (error: any) {
      console.error('Error refunding payment:', error)
      showError(error.response?.data?.message || 'Failed to refund payment')
      return false
    } finally {
      setLoading(false)
    }
  }, [showSuccess, showError])

  return {
    payments,
    stats,
    loading,
    pagination,
    fetchPayments,
    fetchPaymentStats,
    createPayment,
    updatePayment,
    markAsPaid,
    markAsFailed,
    refundPayment
  }
}

// Commissions hook
export const useCommissions = () => {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
    limit: 10
  })
  const { success: showSuccess, error: showError } = useToast()

  const fetchCommissions = useCallback(async (page = 1, limit = 10, status?: CommissionStatus) => {
    try {
      setLoading(true)
      const response = await financialAPI.getCommissions(page, limit, status)
      setCommissions(response.data)
      setPagination(response.meta)
    } catch (error: any) {
      console.error('Error fetching commissions:', error)
      showError('Failed to fetch commissions')
      setCommissions([])
    } finally {
      setLoading(false)
    }
  }, [showError])


  const approveCommission = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      const updatedCommission = await financialAPI.approveCommission(id)
      setCommissions(prev => prev.map(commission => 
        commission.id === id ? updatedCommission : commission
      ))
      showSuccess('Commission approved successfully')
      return true
    } catch (error: any) {
      console.error('Error approving commission:', error)
      showError(error.response?.data?.message || 'Failed to approve commission')
      return false
    } finally {
      setLoading(false)
    }
  }, [showSuccess, showError])

  const payCommission = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      const updatedCommission = await financialAPI.payCommission(id)
      setCommissions(prev => prev.map(commission => 
        commission.id === id ? updatedCommission : commission
      ))
      showSuccess('Commission paid successfully')
      return true
    } catch (error: any) {
      console.error('Error paying commission:', error)
      showError(error.response?.data?.message || 'Failed to pay commission')
      return false
    } finally {
      setLoading(false)
    }
  }, [showSuccess, showError])

  return {
    commissions,
    loading,
    pagination,
    fetchCommissions,
    approveCommission,
    payCommission
  }
}

// Payment Methods hook
export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([])
  const [loading, setLoading] = useState(false)
  const { success: showSuccess, error: showError } = useToast()

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true)
      const methods = await financialAPI.getPaymentMethods()
      setPaymentMethods(methods)
    } catch (error: any) {
      console.error('Error fetching payment methods:', error)
      showError('Failed to fetch payment methods')
      setPaymentMethods([])
    } finally {
      setLoading(false)
    }
  }, [showError])

  const createPaymentMethod = useCallback(async (data: CreatePaymentMethodDto): Promise<PaymentMethodConfig | null> => {
    try {
      setLoading(true)
      const newMethod = await financialAPI.createPaymentMethod(data)
      setPaymentMethods(prev => [...prev, newMethod])
      showSuccess('Payment method created successfully')
      return newMethod
    } catch (error: any) {
      console.error('Error creating payment method:', error)
      showError(error.response?.data?.message || 'Failed to create payment method')
      return null
    } finally {
      setLoading(false)
    }
  }, [showSuccess, showError])

  const updatePaymentMethod = useCallback(async (id: string, data: UpdatePaymentMethodDto): Promise<PaymentMethodConfig | null> => {
    try {
      setLoading(true)
      const updatedMethod = await financialAPI.updatePaymentMethod(id, data)
      setPaymentMethods(prev => prev.map(method => 
        method.id === id ? updatedMethod : method
      ))
      showSuccess('Payment method updated successfully')
      return updatedMethod
    } catch (error: any) {
      console.error('Error updating payment method:', error)
      showError(error.response?.data?.message || 'Failed to update payment method')
      return null
    } finally {
      setLoading(false)
    }
  }, [showSuccess, showError])

  const deletePaymentMethod = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      await financialAPI.deletePaymentMethod(id)
      setPaymentMethods(prev => prev.filter(method => method.id !== id))
      showSuccess('Payment method deleted successfully')
      return true
    } catch (error: any) {
      console.error('Error deleting payment method:', error)
      showError(error.response?.data?.message || 'Failed to delete payment method')
      return false
    } finally {
      setLoading(false)
    }
  }, [showSuccess, showError])

  return {
    paymentMethods,
    loading,
    fetchPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
  }
}