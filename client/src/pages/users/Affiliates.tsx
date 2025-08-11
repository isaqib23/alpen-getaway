import CompanyUserManagement from '../../components/users/CompanyUserManagement'
import { UserType } from '../../api/users'

const Affiliates = () => {
  return (
    <CompanyUserManagement 
      userType={UserType.AFFILIATE} 
      title="Affiliates"
      description="Manage affiliate partner accounts and their company information with commission tracking"
    />
  )
}

export default Affiliates