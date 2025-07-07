import UserListByType from '../../components/users/UserListByType'
import { UserType } from '../../api/users'

const B2BUsers = () => {
  return (
    <UserListByType 
      userType={UserType.B2B} 
      title="B2B Users"
      description="Manage B2B corporate accounts and business partnerships"
    />
  )
}

export default B2BUsers