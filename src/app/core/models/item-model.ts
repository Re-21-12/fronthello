export interface ItemModel {
    id:           number;
    name:         string;
    price:        number;
    createdBy:    number;
    createdAt:    Date;
    updatedBy:    number;
    updatedAt:    null;
    orderDetails: any[];
}
