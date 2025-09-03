import { Component } from '@angular/core';
import { PageLayout } from '../../layouts/page-layout/page-layout';
import { DynamicView } from '../../components/dynamic-view/dynamic-view';
const COMPONENTS = [
  PageLayout,
  DynamicView
]
@Component({
  selector: 'app-home',
  imports: [COMPONENTS],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
