export interface ConnectorInterface {
  id: string;
  name: string;
  description: string;
  image: string;
  enabled: boolean;
}
export interface AccountInterface {
  id: string;
  name: string;
  description: string;
  metadata: string;
  auth_type: string;
  active: boolean;
  user: string | any;
  connector: string | any;
}

export interface PostInterface {
  id: string;
  title: string;
  description: string;
  metadata: any;
  updatedAt: string;
  createdAt: string;
  accountData?: AccountInterface[] | null;
}
