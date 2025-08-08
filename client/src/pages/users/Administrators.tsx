import UserListByType from '../../components/users/UserListByType'
import { UserType } from '../../api/users'

const Administrators = () => {
  return (
    <UserListByType 
      userType={UserType.ADMIN} 
      title="Administrators"
      description="Manage admin accounts and system access permissions"
    />
  )
}

export default Administrators