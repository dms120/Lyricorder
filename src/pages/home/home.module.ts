import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { HomePage } from './home';
import { Truncate } from './../../app/pipes/truncate';
import { IonicAudioModule, AudioProvider, defaultAudioProviderFactory } from 'ionic-audio';

@NgModule({
    declarations: [
        HomePage,
        Truncate
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        CommonModule,
        IonicAudioModule.forRoot(defaultAudioProviderFactory)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
    ]
})
export class HomePageModule { }