import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotesTabPage } from './notes-tab';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [
        NotesTabPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        IonicPageModule.forChild(NotesTabPage)
    ],
    entryComponents: [
        NotesTabPage
    ],
	exports: [
		NotesTabPage
	]
})
export class NotesTabPageModule { }