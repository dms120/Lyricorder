import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LyricsTabPage } from './lyrics-tab';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
    declarations: [
        LyricsTabPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        IonicPageModule.forChild(LyricsTabPage), 
        ComponentsModule
    ],
    entryComponents: [
        LyricsTabPage
    ],
	exports: [
		LyricsTabPage
	]
})
export class LyricsTabPageModule { }