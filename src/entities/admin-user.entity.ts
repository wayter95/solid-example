import { User, UserProps } from './user.entity';

interface AdminUserProps extends UserProps {
  role: string;
}

class AdminUser extends User {
  private readonly _role: string;

  get role(): string {
    return this._role
  }

  constructor(props: AdminUserProps, id?: string) {
    super(props, id);
    this._role = props.role;
  }
}

export { AdminUser }