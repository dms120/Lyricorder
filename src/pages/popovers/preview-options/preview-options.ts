import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
    template: `
    <ion-list>
        <ion-item-divider color="secondary">Options</ion-item-divider>
        <button ion-item detail-push (click)="showScrollPopover($event)">
            <ion-icon name="arrow-round-down" item-start></ion-icon>
            Scroll
        </button>
        <button ion-item detail-push (click)="showTextPopover($event)">
            <ion-icon name="quote" item-start></ion-icon>
            Text Options
        </button>
        <button ion-item (click)="showSharePopover($event)" detail-push>
            <ion-icon name="share" item-start></ion-icon>
            Share
        </button>
        <button ion-item (click)="deleteFromOptions($event)" detail-push >
        <ion-icon name="trash" item-start></ion-icon>
        Delete
    </button>
        <button detail-none ion-item (click)="close()">Close</button>
    </ion-list>
  `
})
export class PreviewOptions {

    contentElem: any;
    textElem: any;
    scrollProps : any;
    scrolldelay: any;
    deleteCallback: any;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public popoverCtrl: PopoverController) {
    }

    ngOnInit() {
        if (this.navParams.data) {
            this.scrollProps = this.navParams.data.scrollProps;
            this.contentElem = this.navParams.data.contentElem;
            this.textElem = this.navParams.data.textElem;
            this.deleteCallback = this.navParams.data.deleteCallback;
        }
    }

    /**
     * Actions
     */
    
    showScrollPopover(myEvent) {
        
        let popover = this.popoverCtrl.create("ScrollOptions", {
            scrollProps: this.scrollProps,
          });
        popover.present({
            ev: myEvent
        });      
    }

    showTextPopover(myEvent) {
        
        let popover = this.popoverCtrl.create("TextOptions", {
            contentElem: this.contentElem.getNativeElement(),
            textElem: this.textElem.nativeElement
          });
        popover.present({
            ev: myEvent
        });      
    }

    showSharePopover(myEvent) {

        let popover = this.popoverCtrl.create("ShareMenuPage");
        popover.present({
            ev: myEvent
        });      
    }

    deleteFromOptions() {
        this.deleteCallback();   
        this.viewCtrl.dismiss();
    }

    close() {
        this.viewCtrl.dismiss();
    }
}
