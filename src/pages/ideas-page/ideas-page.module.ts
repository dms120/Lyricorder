import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { IonicPageModule } from 'ionic-angular';
import { IdeasPage } from './ideas-page';

@NgModule({
	declarations: [
        IdeasPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
        IonicPageModule.forChild(IdeasPage),
        ComponentsModule
    ],
    entryComponents: [
        IdeasPage
    ],
	exports: [
		IdeasPage
	]
})
export class IdeasPageModule { }