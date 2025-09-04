
import { IQuantityItemModel, ItemModel } from './../../models/item-model';
import { AfterViewInit, Component, inject, viewChild, ViewChild, OnInit, signal, model } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { PageLayout } from "../../layouts/page-layout/page-layout";
import { ApiService } from '../../services/api-service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Request } from '../../interfaces/base-api-interface'
import { CreateOrderModel, OrderModel, OrderModelResponse } from '../../models/order-model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { PersonModel } from '../../models/person-model';
import { MatCardModule } from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { CreateOrderItemModel, OrderItemModel } from '../../models/order-item-model';
import { CdkStepper } from '@angular/cdk/stepper';
const MATERIAL = [
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatCardModule,
  MatChipsModule,
  MatButtonModule
];
const LAYOUT = [
  PageLayout
]
const ANGULAR = [
  FormsModule,
  ReactiveFormsModule,
]

@Component({
  selector: 'app-purchase-page',
  templateUrl: './purchase-page.html',
  styleUrls: ['./purchase-page.css'],
  imports: [...LAYOUT, ...MATERIAL, ...ANGULAR ],
  providers: [CdkStepper]
})
export class PurchasePage implements OnInit, AfterViewInit {

  private readonly _apiService = inject(ApiService);
private _formBuilder = inject(FormBuilder);

  stepper = viewChild(MatStepper);
  Items = signal<ItemModel[]>([]);
  Orders = signal<OrderModel[]>([]);
  Persons = signal<PersonModel[]>([]);
 CartItems = signal<{ id: number, quantity: number }[]>([]);
  selectedPersonId = model<number>(1);
  createdOrder = <OrderModel>{};
  OrderItems = signal<OrderItemModel[]>([]);
  OrderModelResponse = signal<OrderModelResponse | null>(null);

  ngOnInit(): void {
    this.getItems();
    // this.getOrders();
    this.getPersons();
  }

  ngAfterViewInit(): void {
    // Aquí puedes acceder a this.stepper si necesitas manipularlo
    // Por ejemplo: this.stepper.next();
  }
findItemForCart(id: number): IQuantityItemModel | undefined {
  const item = this.Items().find(item => item.id === id);
  if (!item) return undefined;
  return { ...item, quantity: 1 };
}
  addItemToCart(item: ItemModel) {
  this.CartItems.update(cart => {
    const found = cart.find(ci => ci.id === item.id);
    if (found) {
      return cart.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
    }
    return [...cart, { id: item.id, quantity: 1 }];
  });
}
updateCartItemQuantity(id: number, quantity: number) {
  this.CartItems.update(cart =>
    cart.map(ci => ci.id === id ? { ...ci, quantity: Math.max(1, quantity) } : ci)
  );
}
  removeItemFromCart(item: ItemModel) {
  this.CartItems.update(cart => cart.filter(ci => ci.id !== item.id));
}

  getPersons() {
  const request: Request = { url: 'Person' };
  this._apiService.getMany<PersonModel>(request).subscribe(response => {
    this.Persons.set(Array.isArray(response) ? response : []);
  });
}

getItems() {
  const request: Request = { url: 'Item' };
  this._apiService.getMany<ItemModel>(request).subscribe(response => {
    this.Items.set(Array.isArray(response) ? response : []);
  });
}

/* Si necesitas lo mismo en getOrders, descomenta y usa así: */
getOrders() {
  const request: Request = { url: 'Order' };
  this._apiService.getMany<OrderModel>(request).subscribe(response => {
    this.Orders.set(Array.isArray(response) ? response : []);
  });
}





/* Si necesitas lo mismo en getOrders, descomenta y usa así:
getOrders(){
  const request: Request = { url: 'Order' };
  this._apiService.get<OrderModel>(request).subscribe(response => {
    this.Orders.set(Array.isArray(response) ? response : response ? [response] : []);
  });
}
*/
  postOrderDetail(itemId: number){
    console.log(this.createdOrder.id)
      const request: Request = {
      url: 'OrderDetail',
      body:{
        itemId: itemId,
        orderId: this.createdOrder.id,
        quantity: this.findItemForCart(itemId)?.quantity

      }
    };
    this._apiService.post<CreateOrderItemModel>(request).subscribe(response => {
    });
  }
  confirmPurchase(){
    for (let cartItem of this.CartItems()){
      this.postOrderDetail(cartItem.id);
    }
    this.getInvoice(this.createdOrder.id);
  }
/*   getOrders(){
    const request: Request = {
      url: 'Order'
    };
    this._apiService.get<OrderModel>(request).subscribe(response => {
      this.Orders.set(response);
    });
  } */
  createOrder(){
const payload: CreateOrderModel = {
  personId: this.selectedPersonId(),
  number: Math.floor(Date.now() / 1000) // segundos desde 1970, cabe en int32
} ;

    const request: Request = {
      url: 'Order',
      body: payload

    };
    console.log(request.body.personId)
    this._apiService.post<OrderModel>(request).subscribe(response => {
      this.createdOrder = response
    });
  }
getInvoice(id: number) {
  const request: Request = { url: `Order/invoice/${id}` };
  this._apiService.getOne<OrderModelResponse>(request).subscribe(response => {
    this.OrderModelResponse.set(response ?? null);
  });
}
/*   getOrderItemsDetail(orderId: number, itemId: number){
      const request: Request = {
      url: `OrderDetail/${orderId}/${itemId}`,

    };
        this._apiService.get<OrderItemModel[]>(request).subscribe(response => {
      this.OrderItems.set(response)
    });
  } */

}
