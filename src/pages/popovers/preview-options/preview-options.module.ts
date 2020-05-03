import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreviewOptions } from './preview-options';

@NgModule({
  declarations: [
    PreviewOptions,
  ],
  imports: [
    IonicPageModule.forChild(PreviewOptions),
  ],
})
export class PreviewOptionsPageModule {}
