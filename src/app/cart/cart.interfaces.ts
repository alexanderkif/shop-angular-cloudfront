export type CartItem = {
  // cartId: string,
  productId: string;
  count: number;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
  status: Status;
};

export enum Status {
  open = 'OPEN',
  odered = 'ORDERED',
}
