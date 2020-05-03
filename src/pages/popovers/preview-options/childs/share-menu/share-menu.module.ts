import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareMenuPage } from './share-menu';

@NgModule({
  declarations: [
    ShareMenuPage,
  ],
  entryComponents:[
    ShareMenuPage
  ],
  imports: [
    IonicPageModule.forChild(ShareMenuPage),
  ],
})
export class ShareMenuPageModule {}
