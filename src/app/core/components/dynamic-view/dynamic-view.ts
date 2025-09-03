import { Component, inject, Injector, signal, Type } from '@angular/core';
import { DynamicFormComponent } from "../dynamic-form/dynamic-form.component";
import { DynamicTableComponent } from "../dynamic-table/dynamic-table.component";
import { BehaviorSubject } from 'rxjs';
import { FormTemplateModel } from '../../interfaces/form-interface';
import { Forms } from '../../utils/form-list';
import { table_list } from '../../utils/table-list';
import { BaseApiService } from '../../interfaces/base-api-interface';
import { TypeOption } from '../../interfaces/type-option-interface';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-dynamic-view',
  imports: [DynamicFormComponent, DynamicTableComponent],
  templateUrl: './dynamic-view.html',
  styleUrl: './dynamic-view.css'
})
export class DynamicView {
  private _injector = inject(Injector);

  private servicesMap: { [key: string]: Type<BaseApiService<any>> } = {
    'Item': ApiService,
    'Message': ApiService,
    'Order': ApiService,
    'Person': ApiService,
    'OrderDetail': ApiService,
    'Persona': ApiService,
  };

  /* Form */
  formSelect = new BehaviorSubject<FormTemplateModel>({} as FormTemplateModel);
  displayForm = new BehaviorSubject<FormTemplateModel>({} as FormTemplateModel);
  selectedForm: string = 'Person';
  defaultFormData$ = new BehaviorSubject<any>({});
  /* Tables */
  dataSelected$ = new BehaviorSubject<any[]>([]);
  columnsSelected$ = new BehaviorSubject<string[]>([]);
  /* Mode view */
  mode = signal<TypeOption>('ins');
  dynamicId: any;
  /* Service */
  currentService: BaseApiService<any> | null = null;

  ngOnInit(): void {
    this.formSelect.next({ ...Forms["opciones"] });
  }

  getAll = () => {
    const request = { url: `/${this.selectedForm}` };
    this.currentService?.get<any>(request).subscribe({
      next: (data: any) => {
        this.dataSelected$.next(data);
      },
      error: (err: any) => console.error('Error loading data', err)
    });
  }

  getById = (id: number) => {
    const request = { url: `/${this.selectedForm}`, id };
    return this.currentService?.get<any>(request);
  }

  create = (data: any) => {
    const request = { url: `/${this.selectedForm}`, body: data };
    return this.currentService?.post<any>(request);
  }

  update = (id: number, data: any) => {
    const request = { url: `/${this.selectedForm}`, id, body: data };
    return this.currentService?.put<any>(request);
  }

  delete = (id: number) => {
    const request = { url: `/${this.selectedForm}`, id };
    return this.currentService?.delete<any>(request);
  }

  listenSendData = (event: { type: TypeOption, data: any }) => {
    this.mode.set(event.type);
    const keys = Object.keys(event.data);

    if (keys.length === 0) return;

    const firstKey = keys[0];
    const firstValue = event.data[firstKey];

    this.dynamicId = firstValue;

    if (event.type === 'view' || event.type === 'upd') {
      this.getById(firstValue)?.subscribe({
        next: (data: any) => {
          this.defaultFormData$.next(data);
        }
      });
    }
    if (event.type === 'del') {
      this.delete(firstValue)?.subscribe({
        next: () => {
          this.getAll();
        }
      });
    }
  }

  listenValue = (event: any) => {
    try {
      const parsedData = JSON.parse(event);
      this.selectedForm = parsedData.form.opcion;

      // Obtenemos el servicio dinámicamente
      this.currentService = this.getCurrentService();

      if (this.currentService) {
        this.getAll();
      }

      this.displayForm.next({ ...Forms[`${this.selectedForm}`] });
      this.columnsSelected$.next([...table_list[`${this.selectedForm}`].columns]);
      this.mode.set('ins');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  getCurrentService(): BaseApiService<any> | null {
    const serviceType = this.servicesMap[this.selectedForm];
    if (!serviceType) return null;
    return this._injector.get(serviceType);
  }

  submitDisplay = (event: any) => {
    const parsedData = JSON.parse(event);
    const data = parsedData.form;
    if (this.mode() === 'ins') {
      this.create(data)?.subscribe({
        next: () => {
          this.getAll();
        },
        error: (err: any) => console.error('Error creating data', err)
      });
    }

    if (this.mode() === 'upd') {
      this.update(this.dynamicId, data)?.subscribe({
        next: () => {
          this.getAll();
        },
        error: (err: any) => console.error('Error updating data', err)
      });
    }
  }
}
