import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IdeasManager } from './ideas-manager/ideas-manager';
import { AudioRecorderComponent} from './audio-recorder/audio-recorder';
import { CommonModule } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
    declarations: [
        IdeasManager,
        AudioRecorderComponent
    ],
    imports: [
        CommonModule,
        IonicPageModule.forChild(IdeasManager),
        IonicPageModule.forChild(AudioRecorderComponent)
    ],
    entryComponents: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [
        IdeasManager,
        AudioRecorderComponent
    ]
})
export class ComponentsModule { }
