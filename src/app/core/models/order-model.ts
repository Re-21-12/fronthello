export interface OrderModel {
    id:           number;
    personId:     number;
    person:       null;
    number:       number;
    createdBy:    number;
    createdAt:    Date;
    updatedBy:    number;
    updatedAt:    null;
    orderDetails: any[];
}
export interface CreateOrderModel{
personId: number,
    number: number,

}
export interface OrderModelResponse {
    number:       number;
    person:       Person;
    orderDetails: OrderDetail[];
    createdAt:    Date;
}
export interface OrderDetail {
    total:     number;
    quantity:  number;
    itemPrice: number;
    itemName:  string;
}
export interface Person {
    firstName: string;
    lastName:  string;
    email:     string;
}
