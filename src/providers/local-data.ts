import { Injectable, NgZone } from '@angular/core';
import { Data } from './data';
import { Subject } from 'rxjs/Subject';

/*
  Generated class for the LocalDataProvider provider.

  This will be used mainly for store settings information
*/
@Injectable()
export class LocalDataProvider {

    settingsSubject: any = new Subject();

    constructor(public dataService: Data, public zone: NgZone) {
    }

    getSettingsSubject() {
        this.emitSettings();
        return this.settingsSubject;
    }

    updateSettings(updatedSettings) {
        var self = this;

        self.dataService.db.put(updatedSettings).catch((err) => {
            console.log(err);
        });
    }


    emitSettings(): void {
        var self = this;
        this.zone.run(() => {
            self.getSettings().then(function(data){
                self.settingsSubject.next(data);
            });
        });
    }


    getSettings(){
        var self = this;

        return new Promise((resolve, reject) => {
            this.dataService.db.get('_local/settings').then(function (data) {
                data.settings = {... self.defaultSettings(), ... data.settings};
                resolve(data);
            })
                .catch(function (err) {
                    if (err.name === 'not_found') {
                        resolve({settings: self.defaultSettings()});
                    } else {
                        reject(err);
                    }
                });
		});
        
    }


    defaultSettings() {
        // TODO: Crenate an object for this
        return {
            deleteLyricsAfter: "7",
            editorOptions : {
                scrollOptions : {
                    scrollSpeed: "3",
                    scrollDelay: 10,
                    stopOnBottom: true
                }               
            }
            
        }
    }
}
