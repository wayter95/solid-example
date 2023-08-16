import { v4 as uuidv4 } from 'uuid';

abstract class BaseEntity<T> {
  protected readonly _id: string;
  public readonly props: T;

  get id() {
    return this._id;
  }

  constructor(props: T, id?: string) {
    this._id = id || uuidv4();
    this.props = props;
  }
}

export {BaseEntity}