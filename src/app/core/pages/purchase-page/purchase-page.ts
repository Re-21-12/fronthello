import { ItemModel } from './../../models/item-model';
import { AfterViewInit, Component, inject, viewChild, ViewChild } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { PageLayout } from "../../layouts/page-layout/page-layout";
import { ApiService } from '../../services/api-service';
import { FormBuilder } from '@angular/forms';
import { Request } from '../../interfaces/base-api-interface'
import { OrderModel } from '../../models/order-model';
@Component({
  selector: 'app-purchase-page',
  templateUrl: './purchase-page.html',
  styleUrls: ['./purchase-page.css'],
  imports: [PageLayout, MatStepperModule]
})
export class PurchasePage implements AfterViewInit {
  private readonly _apiService = inject(ApiService);
private _formBuilder = inject(FormBuilder);

  stepper = viewChild(MatStepper);
  Items: ItemModel[] = [];
  Orders: OrderModel[] = [];
  ngAfterViewInit(): void {
    // Aquí puedes acceder a this.stepper si necesitas manipularlo
    // Por ejemplo: this.stepper.next();
  }
  getItems(){
    const request: Request = {
      url: 'Item'
    };
    this._apiService.get<ItemModel >(request).subscribe(response => {
      this.Items = response;
    });
  }
  getOrders(){
    const request: Request = {
      url: 'Order'
    };
    this._apiService.get<OrderModel>(request).subscribe(response => {
      this.Orders = response;
    });
  }


}
