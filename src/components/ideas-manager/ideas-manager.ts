import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Ideas } from '../../providers/ideas';
import { Clipboard } from '@ionic-native/clipboard';

/**
 * Generated class for the IdeasManager component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
    selector: 'ideas-manager',
    templateUrl: 'ideas-manager.html'
})
export class IdeasManager {

    text: string;
    public ideas = [];

    constructor(public _ideasService: Ideas, public toastCtrl: ToastController, public clipboard: Clipboard) {
        console.log('Hello IdeasManager Component');
        this.text = 'Hello World';
    }

    ngOnInit() {

        var self = this;
        self._ideasService.getIdeas().subscribe((data) => {
            self.ideas = data;
        });
    }

    copy(idea) {
        let word = idea.text;

        this.clipboard.copy(word);
        let toast = this.toastCtrl.create({
            message: 'Idea was copied to the clipboard',
            duration: 2000
        });
        toast.present();

    }

    delete(idea) {
        var self = this;
        self._ideasService.deleteIdea(idea);

        let toast = self.toastCtrl.create({
            message: 'Your idea was successfully deleted',
            duration: 1500
        });
        toast.present();
    }
}
