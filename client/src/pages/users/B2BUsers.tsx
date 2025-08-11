import CompanyUserManagement from '../../components/users/CompanyUserManagement'
import { UserType } from '../../api/users'

const B2BUsers = () => {
  return (
    <CompanyUserManagement 
      userType={UserType.B2B} 
      title="B2B Users"
      description="Manage B2B corporate accounts and their company information"
    />
  )
}

export default B2BUsers