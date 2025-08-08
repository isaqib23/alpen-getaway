import UserListByType from '../../components/users/UserListByType'
import { UserType } from '../../api/users'

const Customers = () => {
  return (
    <UserListByType 
      userType={UserType.CUSTOMER} 
      title="Customers"
      description="Manage customer accounts and their booking history"
    />
  )
}

export default Customers