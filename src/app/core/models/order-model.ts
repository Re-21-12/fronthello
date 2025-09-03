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
