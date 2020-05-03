import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { MediaPlugin } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { NativeAudio } from '@ionic-native/native-audio';
import { Clipboard } from '@ionic-native/clipboard';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { Network } from '@ionic-native/network';

// Modals
import { FilterPage } from '../pages/filter/filter';
import { RecordsList } from '../components/audio-recorder/records-list';


/**
  PROVIDERS
**/
import { Data } from '../providers/data';
import { Lyrics } from '../providers/lyrics';
import { Ideas } from '../providers/ideas';
import { IdeasData } from '../providers/ideas-data';
import { SmartAudio } from '../providers/smart-audio';
import { Utils } from '../providers/utils';
import { LocalDataProvider } from '../providers/local-data';



/**
  NON NATIVE/IONIC PLUGINS
**/
import { IonicAudioModule, defaultAudioProviderFactory } from 'ionic-audio';


@NgModule({
    declarations: [
        MyApp,
        FilterPage,
        RecordsList
      ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        IonicAudioModule.forRoot(defaultAudioProviderFactory)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        FilterPage,
        RecordsList
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        Data,
        Lyrics,
        Ideas,
        IdeasData,
        MediaPlugin,
        File,
        StatusBar,
        SplashScreen,
        SmartAudio,
        NativeAudio,
        Clipboard,
        WheelSelector,
        Network,
        Utils,
        LocalDataProvider
    ]
})
export class AppModule { }
