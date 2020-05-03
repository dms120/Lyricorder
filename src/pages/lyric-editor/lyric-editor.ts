import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Lyrics } from '../../providers/lyrics';
import { Utils } from '../../providers/utils';
import { Lyric } from '../../app/models/Lyric-model'; 
import { LocalDataProvider } from '../../providers/local-data';


@IonicPage()
@Component({
    selector: 'page-lyric-editor',
    templateUrl: 'lyric-editor.html'
})
export class LyricEditor {

    tab1: any;
    tab2: any;
    tab3: any;
    lyric;
    isNew = false;
    isPreview: boolean = true;
    parentObj;
    saveItemMethod = this.saveItem;
    loadPromise: any;
    settingsDoc: any;

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        public lyricsService: Lyrics, 
        public toastCtrl: ToastController, 
        public utils: Utils,
        public localProvider: LocalDataProvider) {

        this.parentObj = this;
        this.lyric = new Lyric('', '');
        this.tab1 = 'LyricsTabPage';
        this.tab2 = 'NotesTabPage';
        this.tab3 = 'IdeasPage';
    }

    ionViewDidLoad() {
        var self = this;
        
        let settingsPromise = self.localProvider.getSettings().then((settingsDoc) => {
            self.settingsDoc = settingsDoc;
        });

        this.loadPromise = new Promise(resolve => {
            this.isNew = this.navParams.get('isNew');
            let item = this.navParams.get('item');
            let shouldProceed = true;

            if(item){   
                this.lyric.fromMap(item);
            } else if(!this.isNew){
                // Fallback during dev process
                shouldProceed = false;
                this.navCtrl.setRoot("HomePage");   
            }          

            if(shouldProceed){
                if (this.isNew) {
                    this.lyricsService.addLyric(this.lyric.toMap()).then(function (response) {
                        self.lyric.id = response.id;
                        self.lyric.rev = response.rev;
                        self.isPreview = false;
    
                        console.log("New ID: " + self.lyric.id);
    
                        settingsPromise.then(function(){
                            resolve(
                                {
                                    lyric: self.lyric,
                                    isNew: true,
                                }
                            );
                        })
                    });
                } else {
                    self.isPreview = true;
                    settingsPromise.then(function(){
                        resolve(
                            {
                                lyric: self.lyric,
                                isNew: self.isNew,
                            }
                        );
                    })
                    
                }
            }
        })
    }

    ionViewWillLeave() {
        this.checkEmptyAndDelete();
        this.localProvider.updateSettings(this.settingsDoc);
    }

    /**
     * Check if is empty and remove
     */
    checkEmptyAndDelete() {
        if (this.lyric.title == '' && this.lyric.text == '') {
            this.lyricsService.deleteLyric(this.lyric.toMap());
        }
    }


    saveItem(doNotShowToast) {

        var self = this;
        if (self.lyric.title === '') {
            self.lyric.title = 'untitled';
        }

        let lyricToSave = self.lyric.toMap();
        lyricToSave.updatedDate = new Date();

        self.lyricsService.updateLyric(lyricToSave).then(function(result : any){
            self.lyric.rev = result.rev; 
        });

        if (!doNotShowToast) {
            self.presentToast();
        }
    }

    presentToast() {
        let toast = this.toastCtrl.create({
            message: 'Your lyric was saved successfully',
            duration: 3000
        });
        toast.present();
    }
}
