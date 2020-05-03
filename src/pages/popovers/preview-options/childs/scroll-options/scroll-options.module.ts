import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScrollOptions } from './scroll-options';

@NgModule({
  declarations: [
    ScrollOptions,
  ],
  imports: [
    IonicPageModule.forChild(ScrollOptions),
  ],
})
export class ScrollOptionsPageModule {}
