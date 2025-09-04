export interface CreateOrderItemModel {
    orderId:  number;
    itemId:   number;
    quantity: number;
}
export interface OrderItemModel {
    total:     number;
    quantity:  number;
    itemPrice: number;
    itemName:  string;
}

