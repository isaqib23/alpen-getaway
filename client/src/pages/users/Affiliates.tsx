import UserListByType from '../../components/users/UserListByType'
import { UserType } from '../../api/users'

const Affiliates = () => {
  return (
    <UserListByType 
      userType={UserType.AFFILIATE} 
      title="Affiliates"
      description="Manage affiliate partner accounts and their referral activities"
    />
  )
}

export default Affiliates