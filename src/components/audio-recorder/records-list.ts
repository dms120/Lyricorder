import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'records-list',
    templateUrl: 'records-list.html'
})
export class RecordsList {

    records: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
        this.records = this.navParams.get('records');
    }

    onPlay(id) {
        this.viewCtrl.dismiss(
            {
                type: "play",
                id: id
            });

    }

    onDelete(id) {
        this.viewCtrl.dismiss(
            {
                type: "delete",
                id: id
            });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}