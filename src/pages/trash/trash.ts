import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Lyrics } from '../../providers/lyrics';
import { LocalDataProvider } from '../../providers/local-data';
import { Utils } from '../../providers/utils';


/**
 * Generated class for the TrashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-trash',
    templateUrl: 'trash.html',
})
export class TrashPage {

    trashItems: any = [];
    settings: any = {};

    constructor(public navCtrl: NavController, public navParams: NavParams, public lyricsService: Lyrics, public localDataService: LocalDataProvider, public utils: Utils) {

    }

    ionViewDidLoad() {
        var self = this;

        self.lyricsService.getLyricsToBeDeleted().subscribe((data) => {
            //self.cleanTrash(data); // Review
            self.trashItems = self.cleanTrash(data);
        });

        self.localDataService.getSettingsSubject().subscribe((settingsDoc) => {
            self.settings = settingsDoc.settings;
        });
    }

    /**
     * Clean old items
     * @param lyricsToBeDeleted 
     */
    cleanTrash(lyricsToBeDeleted) {
        let self = this,
            hasChanges = false,
            daysToStoreDeleted = self.settings.deleteLyricsAfter ? self.settings.deleteLyricsAfter : 7;

        lyricsToBeDeleted =lyricsToBeDeleted.filter((row) => {
            var lyricModifiedDate = new Date(row.updatedDate);
            let dateToCompare = new Date();
            dateToCompare.setDate(dateToCompare.getDate() - daysToStoreDeleted);
            let toDeleteNow = lyricModifiedDate < dateToCompare || self.utils.isLyricEmpty(row);

            if(toDeleteNow){
                // If Lyric date is smaller/older that one week ago delete it
                self.lyricsService.deleteLyric(row);
                hasChanges = true;
            }

            return !toDeleteNow;
        });

        if (hasChanges) {
            // TODO: Test the behaviour!!
        }

        return lyricsToBeDeleted;
    }


    viewItem(item) {
        // TODO:
    }


    restoreItem(item) {
        this.lyricsService.restoreLyric(item);
        this.trashItems = this.trashItems.filter((row) => {
            return row._id !== item._id;
        });
    }

    getDay(date) {
        return new Date(date).getDate();
    }

    getMonth(date) {
        return this.utils.getShortMonth(date).toUpperCase();
    }

    getYear(date) {
        return new Date(date).getFullYear();
    }
}
