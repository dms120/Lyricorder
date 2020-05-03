import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, LoadingController, ToastController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { IdeasData } from '../../providers/ideas-data';
import { Ideas } from '../../providers/ideas';
import { Utils } from '../../providers/utils';
import { Clipboard } from '@ionic-native/clipboard';
/*
  Generated class for the IdeasPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
    selector: 'page-ideas-page',
    templateUrl: 'ideas-page.html'
})
export class IdeasPage {

    @ViewChild(Navbar) navBar: Navbar;
    parentObj: any = null;
    ideasType;
    rhymeInput: string = '';
    dictionaryInput: string = '';
    randomWord: string = "";
    currentMood: string = "";
    wordsControl: FormControl;
    rhymesControl: FormControl;
    dictionaryControl: FormControl;
    public moodWordsList = [];
    public rhymes = [];
    public dictionary = [];
    searching: any = false;


    constructor(public navCtrl: NavController, public navParams: NavParams, public ideasData: IdeasData, public _ideasService: Ideas, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public utils: Utils) {
        this.wordsControl = new FormControl();
        this.rhymesControl = new FormControl();
        this.dictionaryControl = new FormControl();
        this.parentObj = navParams.data.parentObj;
        this.ideasType = this.parentObj ? 'words' : 'myIdeas';
    }

    ionViewDidLoad() {

        if (this.parentObj) {
            this.navBar.backButtonClick = (e: UIEvent) => {
                this.parentObj.navCtrl.pop();
            }
        }

    }

    getRandom() {
        let loading = this.loadingCtrl.create({
            content: 'Fetching content...'
        });

        loading.present();
        this.ideasData.getRandomWord().map(res => res.json()).subscribe(data => {
            this.randomWord = data.word;
            loading.dismiss();
        });
    }

    onMoodInput(word) {

        if (this.utils.hasNetworkAvailable()) {
            this.currentMood = word;

            let loading = this.loadingCtrl.create({
                content: 'Fetching content...'
            });

            loading.present();
            this.ideasData.getByMood(word).map(res => res.json()).subscribe(data => {
                this.moodWordsList = data;
                loading.dismiss();
            });
        }
    }

    onRhymeInput() {
        let loading = this.loadingCtrl.create({
            content: 'Fetching content...'
        });

        if (this.utils.hasNetworkAvailable() && this.rhymeInput != "") {
            loading.present();
            this.ideasData.getRhymes(this.rhymeInput)
                .map(res => res.json())
                .subscribe(
                data => {
                    this.rhymes = data;
                    loading.dismiss();
                }
                );
        } else {
            this.rhymes = [];
        }
    }

    onDictionaryInput() {

        let loading = this.loadingCtrl.create({
            content: 'Fetching content...'
        });

        if (this.utils.hasNetworkAvailable() && this.dictionaryInput != "") {
            loading.present();

            this.ideasData.getDictionary(this.dictionaryInput).map(res => res.json()).subscribe(
                data => {
                    this.dictionary = data;
                    loading.dismiss();
                },
                err => {
                    console.log(err);
                    loading.dismiss();
                }
            );

        } else {
            this.dictionary = [];
        }
    }

    copyToClipboard(word) {

        let self = this;
        let idea = {
            text: word,
            type: "idea"
        }

        self._ideasService.addIdea(idea).then(function (response) {
            let toast = self.toastCtrl.create({
                message: 'Your idea was saved successfully;',
                duration: 1500
            });
            toast.present();
        });
    }
}
