import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar } from 'ionic-angular';
import { ViewController, IonicPage } from 'ionic-angular';

/*
  Generated class for the NotesTab page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
@IonicPage()
@Component({
    selector: 'page-notes-tab',
    templateUrl: 'notes-tab.html'
})
export class NotesTabPage {
    @ViewChild(Navbar) navBar: Navbar;

    lyric;
    parentObj: any;
    isPreview: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
        this.parentObj = navParams.data.parentObj;
        this.lyric = navParams.data.parentObj.lyric;
    }

    ionViewDidLoad() {
        var self = this;

        this.parentObj.loadPromise
            .then(
            function (data) {
                self.lyric = data.lyric;
                self.isPreview = self.parentObj.isPreview;
            })
            ;


        this.navBar.backButtonClick = (e: UIEvent) => {
            this.parentObj.navCtrl.pop();
        }
    }

    ionViewWillEnter(){
        var self = this;

        self.isPreview = self.parentObj.isPreview;

    }

    toggleEdit() {
        
        if (!this.isPreview) {
            this.parentObj.saveItem();
        }

        this.isPreview = !this.isPreview;
        this.parentObj.isPreview = this.isPreview;
    }
}
