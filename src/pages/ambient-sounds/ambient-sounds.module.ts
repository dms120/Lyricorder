import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmbientSounds } from './ambient-sounds';

@NgModule({
    declarations: [
        AmbientSounds,
    ],
    imports: [
        IonicPageModule.forChild(AmbientSounds),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [
        AmbientSounds
    ]
})
export class AmbientSoundsModule { }
