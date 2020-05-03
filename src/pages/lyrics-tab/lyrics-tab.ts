import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Navbar, PopoverController, IonicPage } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { AudioRecorderComponent } from '../../components/audio-recorder/audio-recorder';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { Lyrics } from '../../providers/lyrics';


/*
  Generated class for the LyricsTab page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
    selector: 'page-lyrics-tab',
    templateUrl: 'lyrics-tab.html'
})
export class LyricsTabPage {

    @ViewChild(Navbar) navBar: Navbar;
    @ViewChild('lyricTabContent') lyricTabContent: ElementRef;
    @ViewChild('previewContainer') previewContainer: ElementRef;
    @ViewChild('audioRecorder') audioRec: AudioRecorderComponent;

    lyric;
    parentObj: any;
    isPreview: boolean = false;
    previewText: string;
    editorSettings: any;
    isAudioComponentVisible: boolean = false;

    //SCROLL
    isScrolling: Boolean = false;
    autoStartScrollTimeout: any;
    scrollInterval: any;
    currentSpeed: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private selector: WheelSelector, public popoverCtrl: PopoverController, public lyricsService: Lyrics) {

        this.parentObj = navParams.data.parentObj;
        this.lyric = navParams.data.parentObj.lyric;
        this.previewText = this.processTextToPreview(this.lyric.text);
    }

    ionViewDidLoad() {
        var self = this;
        console.log('tab loaded!!');

        this.parentObj.loadPromise
            .then(
            function (data) {
                self.lyric = data.lyric;
                self.isPreview = self.parentObj.isPreview;
                self.editorSettings = self.parentObj.settingsDoc.settings.editorOptions;
                self.initAutoStartScrollTimeout();
                self.subscribeAudioComponent();
            });

        this.navBar.backButtonClick = (e: UIEvent) => {
            this.parentObj.navCtrl.pop();
        }
    }


    ionViewWillEnter() {
        var self = this;
        self.isPreview = self.parentObj.isPreview;
    }

    subscribeAudioComponent(){
        var self = this;
        this.audioRec.getStatusSubject().subscribe((status) => {
            self.isAudioComponentVisible = status.isVisible;
        });
    }

    toggleEdit() {

        if (!this.isPreview) {
            this.parentObj.saveItem();
            this.previewText = this.processTextToPreview(this.lyric.text);
        }

        this.isPreview = !this.isPreview;
        this.parentObj.isPreview = this.isPreview;
        this.audioRec.hideComponent(!this.isPreview);
    }

    addOrShare(ev) {
        if (!this.isPreview) {
            this.addChord();
        } else {
            this.showSharePopover(ev);
        }
    }

    showSharePopover(myEvent) {

        var self = this;

        let popover = this.popoverCtrl.create("PreviewOptions", {
            contentElem: this.lyricTabContent,
            textElem: this.previewContainer,
            scrollProps: {
                values: {
                    scrollSpeed: self.editorSettings.scrollOptions.scrollSpeed,
                    scrollDelay: self.editorSettings.scrollOptions.scrollDelay,
                    stopOnBottom: self.editorSettings.scrollOptions.stopOnBottom,
                    isScrolling: self.isScrolling
                },
                toggleScrolling: self.toggleScrolling.bind(self),
                startScrolling: self.startScrolling.bind(self),
                setScrollDelay: self.setScrollDelay.bind(self),
                setScrollSpeed: self.setScrollSpeed.bind(self),
                setStopOnBottom: self.setStopOnBottom.bind(self),
            },
            deleteCallback: self.deleteAndGoBack.bind(self)
          });
        popover.present({
            ev: myEvent
        });
    }

    deleteAndGoBack(){
        this.lyricsService.deleteLyric(this.lyric.toMap());
        this.parentObj.navCtrl.pop();
    }


    addChord() {
        this.selector.show({
            title: "How Much?",
            items: [
                [
                    { description: "1" },
                    { description: "2" },
                    { description: "3" }
                ], [
                    { description: "Apple" },
                    { description: "Banana" },
                    { description: "Tangerine" }
                ]
            ],
            positiveButtonText: "Ok",
            negativeButtonText: "Nope",
            defaultItems: [
                { description: "3" },
                { description: "banana" }
            ]
        }).then(
            result => {
                console.log(result[0].description + ' ' + result[1].description);
            },
            err => console.log('Error: ' + JSON.stringify(err))
            );

    }

    /**
     * SCROLL METHODS
     */
    toggleScrolling(){
        var self = this;
        if(self.isScrolling){
            clearInterval(self.scrollInterval);
        } else{
            self.startScrolling();
        }

        self.isScrolling = !self.isScrolling;
    }

    startScrolling() {
        var self = this,
            content : any;

        content = self.lyricTabContent;       
        self.isScrolling = true;

        let currentScroll = content._scrollContent.nativeElement.scrollTop;
        let scrollHeight = content._scrollContent.nativeElement.scrollHeight;
        let clientHeight = content._scrollContent.nativeElement.clientHeight;

        if(currentScroll < scrollHeight - clientHeight || !self.editorSettings.scrollOptions.stopOnBottom){
            
            if(self.currentSpeed != this.editorSettings.scrollOptions.scrollSpeed){
                // Clear Previous Timeout
                clearInterval(self.scrollInterval);

                // Set speed
                self.currentSpeed = this.editorSettings.scrollOptions.scrollSpeed;

                self.scrollInterval = setInterval(function(){
                    self.startScrolling();
                }, self.getTimeoutDelay());
            }

            content._scrollContent.nativeElement.scrollTop = currentScroll + 1;
            
        } else {
            self.toggleScrolling();
        }      
    }


    getTimeoutDelay() {
        let timeoutDelay;

        switch (this.editorSettings.scrollOptions.scrollSpeed) {
            case "1": {
                timeoutDelay = 80;
                break;
            }
            case "3": {
                timeoutDelay = 40;
                break;
            }
            case "5": {
                timeoutDelay = 10;
                break;
            }
            default: {
                timeoutDelay = 40;
                break;
            }
        }
        return timeoutDelay;
    }


    setScrollSpeed(scrollSpeed){
        this.editorSettings.scrollOptions.scrollSpeed = scrollSpeed;
    }

    setStopOnBottom(stopOnBottom){
        this.editorSettings.scrollOptions.stopOnBottom = stopOnBottom;
    }

    setScrollDelay(scrollDelay){
        this.editorSettings.scrollOptions.scrollDelay = scrollDelay;
    }

    initAutoStartScrollTimeout(){
        var self = this,
            scrollDelay = this.editorSettings.scrollOptions.scrollDelay;

        if(scrollDelay != 0){
            self.autoStartScrollTimeout = setTimeout(function(){
                if(!self.isScrolling && self.isPreview){
                    self.startScrolling();
                }
            }, 1000 * scrollDelay);
        }
    }
    


    /**
     * UTILS
     */
    
    processTextToPreview(text) {
        const regex = /\{.*?\}/g;
        let m;
        let result = text;

        if (text != "") {
            while ((m = regex.exec(text)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.
                m.forEach((match, groupIndex) => {

                    let matchNoBrackets = match.substring(1, match.length - 1);
                    result = result.replace(match, "<sup class='chord'>" + matchNoBrackets + "</sup>");
                });
            }

        }

        return result;
    }
}
