import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DelayOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-scroll-options',
    templateUrl: 'scroll-options.html',
})
export class ScrollOptions {

    scrollSpeed: String = "3";
    scrollDelay: Number = 10;
    stopOnBottom: Boolean = true;
    isScrolling: Boolean = false;

    //contentEle: any;
    scrollProps: any;
    scrollTimeout: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    }

    ngOnInit() {
        if (this.navParams.data) {
            this.scrollProps = this.navParams.data.scrollProps;
            this.scrollSpeed = this.scrollProps.values.scrollSpeed;
            this.scrollDelay = this.scrollProps.values.scrollDelay;
            this.stopOnBottom = this.scrollProps.values.stopOnBottom;
            this.isScrolling = this.scrollProps.values.isScrolling;
        }
    }

    close() {
        this.viewCtrl.dismiss();
    }

    toggleScrolling(){
        var self = this;

        self.scrollProps.toggleScrolling();

        self.isScrolling = !self.isScrolling;
    }

    startScrolling() {
        var self = this;

        self.isScrolling = true;

        self.scrollProps.setScrollSpeed(self.scrollSpeed);
        self.scrollProps.startScrolling();
    }

    setStopOnBottom(){
        this.scrollProps.setStopOnBottom(this.stopOnBottom);

    }

    setScrollDelay(){
        this.scrollProps.setScrollDelay(this.scrollDelay);
    }
}
