import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TextOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-text-options',
    templateUrl: 'text-options.html',
})
export class TextOptions {
    background: string;
    contentElem: any;
    textElem: any;
    fontFamily;

    colors = {
        'white': {
            'bg': 'rgb(255, 255, 255)',
            'fg': 'rgb(0, 0, 0)'
        },
        'tan': {
            'bg': 'rgb(249, 241, 228)',
            'fg': 'rgb(0, 0, 0)'
        },
        'grey': {
            'bg': 'rgb(76, 75, 80)',
            'fg': 'rgb(255, 255, 255)'
        },
        'black': {
            'bg': 'rgb(0, 0, 0)',
            'fg': 'rgb(255, 255, 255)'
        },
    };

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ngOnInit() {
        var self = this;
        if (self.navParams.data) {
            self.contentElem = self.navParams.data.contentElem;
            self.textElem = self.navParams.data.textElem;

            self.background = self.getColorName(self.contentElem.style.backgroundColor);
            self.setFontFamily();
        }
    }

    getColorName(background) {
        let colorName = 'white';

        if (!background) return 'white';

        for (var key in this.colors) {
            if (this.colors[key].bg == background) {
                colorName = key;
            }
        }

        return colorName;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TextOptionsPage');
    }

    setFontFamily() {
        if (this.textElem.style.fontFamily) {
            this.fontFamily = this.textElem.style.fontFamily.replace(/'/g, "");
        }
    }

    changeBackground(color) {
        this.background = color;
        this.contentElem.style.backgroundColor = this.colors[color].bg;
        this.textElem.style.color = this.colors[color].fg;
    }

    changeFontSize(direction) {
        this.textElem.className = direction;
    }

    changeFontFamily() {
        if (this.fontFamily) this.textElem.style.fontFamily = this.fontFamily;
    }

}
