import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocalDataProvider } from '../../providers/local-data';

/**
 * Generated class for the Settings page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
})
export class Settings {

    settingsDoc: any = {};
    settings: any = {};

	constructor(public navCtrl: NavController, public navParams: NavParams, public localProvider: LocalDataProvider) {
	}

	ionViewDidLoad() {

        var self = this;
        
        self.localProvider.getSettingsSubject().subscribe((settingsDoc) => {

            self.settingsDoc = settingsDoc;
            self.settings = self.settingsDoc.settings;
                
        });
    }

    onSettingsChange(){
        var self = this;

        self.localProvider.updateSettings(self.settingsDoc);

    }

}
