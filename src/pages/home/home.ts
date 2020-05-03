import { Component, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, ModalController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { Lyrics } from '../../providers/lyrics';
import { Utils } from '../../providers/utils';
import { FilterPage } from '../filter/filter';
import { Lyric } from '../../app/models/Lyric-model';
import 'rxjs/add/operator/debounceTime';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild('playerDiv') set content(content: ViewContainerRef) {
        this.playerContainer = content;
    }

    public items = [];
    filteredItems = [];
    filterOptions: any = {};
    orderOptions: any = {};
    searchTerm: string = '';
    searchControl: FormControl;
    searching: any = false;
    lastPlayedIndex: number = 0;
    isPlaying: any = [];
    playerContainer: any;
    _wavesurfer: any = require('wavesurfer.js');
    wavesurferinstance: any = null;

    constructor(public navCtrl: NavController, public lyricsService: Lyrics, public modalCtrl: ModalController, private elementRef: ElementRef, private utils: Utils) {

        this.searchControl = new FormControl();
        this.filterOptions = {
            tuning: "",
            capo: null,
            speed: 0,
            happiness: 0,
            shouldFilter: false
        };

        this.orderOptions = {
            type: "createdDate",
            direction: "ascending",
            shouldOrder: false
        };
    }


    ionViewDidLoad() {
        var self = this;
        self.searchControl.valueChanges.debounceTime(700).subscribe(search => {
            self.filterItems();
            self.searching = false;
            self.orderItems(true);
        });

        self.lyricsService.getLyrics().subscribe((data) => {
            self.items = data;
            self.filteredItems = self.items;

            self.filterItems();
            self.orderItems(true);
        });

        self.wavesurferinstance = self._wavesurfer.create({
            container: '#waveform',
            waveColor: '#607d8b',
            progressColor: '#03a9f4',
            cursorColor: 'transparent',
            height: 90,
            normalize: true
        });

        self.wavesurferinstance.on('finish', function () {
            // Review
            self.wavesurferinstance.stop();
            self.isPlaying[self.lastPlayedIndex] = false;
        });
    }

    filterItems() {

        if (this.filterOptions.shouldFilter || this.searching) {

            this.filteredItems = this.items.filter((item) => {
                var textMatches = true,
                    tuningMatches = true,
                    capoMatches = true,
                    speedMatches = true,
                    moodMatches = true;

                if (this.searchTerm !== '') {
                    textMatches = item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
                }

                if (this.filterOptions.tuning && this.filterOptions.tuning != "") {
                    tuningMatches = item.tuning === this.filterOptions.tuning;
                }

                if (this.filterOptions.capo && this.filterOptions.capo != null) {
                    capoMatches = item.capo === this.filterOptions.capo;
                }

                if (this.filterOptions.speed && this.filterOptions.speed != 0) {
                    speedMatches = item.speed === this.filterOptions.speed;
                }

                if (this.filterOptions.happiness && this.filterOptions.happiness != 0) {
                    moodMatches = item.happiness === this.filterOptions.happiness;
                }

                return textMatches && tuningMatches && capoMatches && speedMatches && moodMatches;
            });

        } else {
            this.filteredItems = this.items;
        }

    }

    orderItems(force) {

        var self = this;

        if (self.orderOptions.shouldOrder || force) {
            self.filteredItems = self.filteredItems.sort(function (a, b) {
                if (self.orderOptions.type == "title") {
                    let aProperty: string = a.title,
                        bProperty: string = b.title;

                    if (self.orderOptions.direction == "ascending") {
                        return aProperty.localeCompare(bProperty);
                    } else {
                        return bProperty.localeCompare(aProperty);
                    }

                } else {
                    let aProperty: any = new Date(a[self.orderOptions.type]),
                        bProperty: any = new Date(b[self.orderOptions.type]);

                    if (self.orderOptions.direction == "ascending") {
                        return aProperty - bProperty;
                    } else {
                        return bProperty - aProperty;
                    }
                }
            });

            self.orderOptions.shouldOrder = false;
        }

    }

    onSearchInput() {
        this.searching = true;
    }

    addItemToTrash(itemToDelete) {
        this.lyricsService.addToTrash(itemToDelete);
    }

    addItem() {
        let newItem = new Lyric("", "").toMap();

        this.navCtrl.push("LyricEditor", {
            item: newItem,
            isNew: true
        });
    }


    viewItem(item) {
        this.navCtrl.push("LyricEditor", {
            item: item,
            isNew: false
        });
    }

    showFilters(): void {
        let profileModal = this.modalCtrl.create(FilterPage, {
            filterOptions: this.filterOptions,
            orderOptions: this.orderOptions
        });

        profileModal.onDidDismiss(data => {
            //this.filterOptions = data;
            this.toggleHasFilter();
            this.filterItems();
            this.orderItems(false);
        });
        profileModal.present();
    }

    toggleHasFilter() {
        if (this.filterOptions.tuning == '' || this.filterOptions || this.filterOptions || this.filterOptions) {

        }
    }


    playCurrentItem(e, item, i) {
        e.stopPropagation();

        var self = this;

        if (self.isPlaying[i]) {
            self.wavesurferinstance.stop();
            this.isPlaying[i] = false;
        } else {

            self.isPlaying[self.lastPlayedIndex] = false;

            let fileName = Object.keys(item._attachments)[0];

            self.lyricsService.getAttachment(item._id, fileName, item._rev).then(function (blob) {
                self.utils.getSourceFromBlob(fileName, blob, true).then(function (source) {
                    if (source != null) {

                        if (!self.playerContainer) {
                            self.playerContainer = self.elementRef.nativeElement.querySelector("#playerDiv");
                        }

                        var itemPlayerContainer = self.elementRef.nativeElement.querySelector("#item-" + i).querySelector("#playerContainer");
                        itemPlayerContainer.append(self.playerContainer);

                        self.wavesurferinstance.load(source); // TODO: Load with "loadBlob" method? 
                        self.wavesurferinstance.on('ready', function () {
                            self.wavesurferinstance.play();
                            self.wavesurferinstance.un('ready', function () { });
                        });

                        self.isPlaying[i] = true;
                        self.lastPlayedIndex = i;

                    } else {
                        // TODO: Throw an error
                    }
                })

            });

        }
    }

    isSomeTrackPlaying() {
        return this.isPlaying[this.lastPlayedIndex];
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
