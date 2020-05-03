import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TextOptions } from './text-options';

@NgModule({
  declarations: [
    TextOptions,
  ],
  imports: [
    IonicPageModule.forChild(TextOptions),
  ],
})
export class TextOptionsPageModule {}
