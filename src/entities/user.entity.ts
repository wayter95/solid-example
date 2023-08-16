import { BaseEntity } from "./base.entity";

interface UserProps {
  name: string;
  email: string;
  password: string;
}

class User extends BaseEntity<UserProps> {
  get name() {
   return this.props.name
  }
  
  get email() {
   return this.props.email
  }
  
  get password() {
   return this.props.password
  }

  constructor(props: UserProps, id?: string) {
    super(props, id);
  }
}

export { User, UserProps}