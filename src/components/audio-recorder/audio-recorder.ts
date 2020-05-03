import { Component, Input, Renderer, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MediaPlugin } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Lyrics } from '../../providers/lyrics';
import { Utils } from '../../providers/utils';
import { RecordsList } from './records-list';
import { Subject } from 'rxjs/Subject';


/*
  Generated class for the AudioRecorder component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
    selector: 'audio-recorder',
    templateUrl: 'audio-recorder.html'
})
export class AudioRecorderComponent {

    filename: string;

    // Rendering controls
    canRecord: boolean = true;
    isRecording: boolean = false;
    isPlaying: boolean = false;
    isSavePending: boolean = false; // Used to render save and discard
    file: any;
    mediaTimer: any;
    mainButton: any;
    newFilePromise: any;
    _wavesurfer: any = require('wavesurfer.js');
    wavesurferinstance: any = null;
    currentTime: any = "0.00";
    duration: any = "0.00";
    currentRecordId: any = null;
    isComponentVisible: boolean = false;
    statusSubject: any = new Subject();
    

    constructor(public el: ElementRef, public renderer: Renderer, private media: MediaPlugin, private filePlugin: File, public lyricsService: Lyrics, public cdRef: ChangeDetectorRef, private utils: Utils) {
        this.isRecording = false;
        this.canRecord = !this.utils.isPlatformBrowser();

        this.resetMainButton();
    }

    @Input() lyric: any = null; // Used to store the attachments

    // this.renderer.setElementAttribute(this.fabElem.nativeElement, 'left', "");

    ngOnInit() {
        var self = this;
        self.renderer.setElementClass(self.el.nativeElement, "center", true);

        self.wavesurferinstance = self._wavesurfer.create({
            container: '#editorWaveform',
            waveColor: '#607d8b',
            progressColor: '#03a9f4',
            cursorColor: 'transparent',
            //barWidth : 5.5,
            height: 90,
            normalize: true
        });

        self.wavesurferinstance.on('pause', function () {
            self.updateMainButton("play", self.startPlayback, null, false);
        });

        self.wavesurferinstance.on('play', function () {
            self.updateMainButton("pause", self.pausesPlayback, null, false);
        });

        self.wavesurferinstance.on('finish', function () {
            self.updateMainButton("play", self.startPlayback, null, false);
            self.wavesurferinstance.stop();
            self.currentTime = "0.00";
        });
    }

    /** 
      PUBLIC METHODS
    **/

    getStatusSubject(){
        return this.statusSubject;
    }

    hideComponent(hide) {
        this.isComponentVisible = !hide;
        this.renderer.setElementClass(this.el.nativeElement, 'hide', hide);
        this.emitStatusChange();
    }


    emitStatusChange(){
        this.statusSubject.next({
            isVisible: this.isComponentVisible,
            isRecording: this.isRecording,
            isPlaying: this.isPlaying
        });
    }



    startRecording() {
        //Recording to a file
        const self = this;
        const onStatusUpdate = (status) => this.handleStatus(status);

        self.updateMainButton("square", this.stopRecording, null, false);

        self.isSavePending = false;


        self.filename = self.getFormatedDate() + '.mp3';
        self.file = self.media.create(this.getLyricDataPath() + self.filename, onStatusUpdate);

        self.mediaTimer = setInterval(function () {
            // get media amplitude
            self.file.getCurrentAmplitude(
                // success callback
                function (amp) {
                    console.log(amp + "%");
                },
                // error callback
                function (e) {
                    console.log("Error getting amp=" + e);
                }
            );
        }, 1000);
        console.log('Trying to record');
        self.file.startRecord();
        self.isRecording = true;
    }

    handleStatus(status) {
        console.log(status);
        switch (status) {
            case 1: {
                break;
            }
            case 2: {
                this.isPlaying = true;
                break;
            }
            case 3: {
                this.isPlaying = false;
                break;
            }
            case 4: {
                this.isPlaying = false;
                break;
            }
        }

    }

    stopRecording() {
        var self = this;

        self.file.stopRecord();
        self.isRecording = false;
        self.isSavePending = true;

        self.utils.getBlobFromFile(self.filename).then(function (blob) {

            self.reloadWavesurfer(blob).then(function () {
                self.updateMainButton("play", self.startPlayback, null, false);
            });

        });

        clearInterval(self.mediaTimer);
    }

    startPlayback() {
        var self = this;
        self.isPlaying = true;

        self.wavesurferinstance.play();
    }

    /**
     * Stops the playback
     */
    stopsPlayback() {
        var self = this;
        self.wavesurferinstance.stop();
        self.isPlaying = false;
        self.currentTime = "0.00";
    }

    /**
     * Pauses the playback
     */
    pausesPlayback() {
        var self = this;
        self.wavesurferinstance.pause();
        self.isPlaying = false;
    }

    /**
     * Save Recod
     */
    saveRecord() {
        var self = this;

        // TODO: Add to the records list

        self.filePlugin.readAsArrayBuffer(self.getLyricDataPath(), self.filename)
            .then((buffer) => {
                self.lyricsService.saveAttachment(self.lyric.id, self.filename, self.lyric.rev, buffer).then(function (result) {
                    if (result['ok']) {
                        self.lyric.rev = result['rev'];

                        if (!self.lyric.attachments) {
                            self.lyric.attachments = {};
                        }

                        self.lyric.attachments[self.filename] = {};
                    } else {
                        // TODO:
                    }
                    self.isSavePending = false;
                })
            });
    }


    /**
     * Delete the file
     */
    deleteFile() {
        var self = this;
        self.filePlugin.removeFile(self.getLyricDataPath(), self.filename);
        self.isSavePending = false;
    }

    /**
     * Stop recording and discard it
     */
    stopAndDiscardRecording() {
        var self = this;

        self.stopRecording();
        self.deleteFile();
        self.updateMainButton("microphone", self.startRecording, null, false);
    }


    /**
     * Open and Record action
     */
    public openAndRecord(): void {
        this.enableComponent();

        // Starts recording!
        this.startRecording();
    }

    /**
     * Close button action
     */
    public closeButton(): void {
        this.disableComponent();

        if (this.isRecording) {
            this.stopRecording();
        }

        if (this.isPlaying) {
            this.stopsPlayback();
        }

        this.resetMainButton();
    }


    // VISUAL ACTIONS

    public get width() {
        let width = window.innerWidth / 56 * 2;
        return 'scale(' + width + ')';
    }

    enableComponent(): void {
        this.renderer.setElementClass(this.el.nativeElement, 'activated', true);
        this.isComponentVisible = true;
        this.emitStatusChange();
    }

    disableComponent(): void {
        this.renderer.setElementClass(this.el.nativeElement, 'activated', false);
        this.wavesurferinstance.empty();
        this.isComponentVisible = false;
        this.emitStatusChange();
    }

    /**
    PLAYLIST ACTIONS
    **/

    /**
     * Open the Records list
     */
    openRecordsList(): void {
        var self = this,
            attachmentsArray = [],
            attachs = self.lyric.attachments || {};

        for (let key of Object.keys(attachs)) {
            attachmentsArray.push({ id: key })
        }

        let profileModal = self.utils.getModalController().create(RecordsList,
            {
                records: attachmentsArray
            });

        profileModal.onDidDismiss(data => {
            //this.filterOptions = data;
            if (data && data.type === "play") {
                self.prepareRecord(data.id);
            }

            if (data && data.type === "delete") {
                self.deleteRecord(data.id);
            }
        });
        profileModal.present();
    }

    /**
     * Prepare Record and play it
     * @param recordID 
     */
    prepareRecord(recordID) {
        var self = this;

        self.currentRecordId = recordID;
        self.lyricsService.getAttachment(self.lyric.id, recordID, self.lyric.rec).then(function (blob) {

            self.utils.getSourceFromBlob(recordID, blob, true).then(function (source) {

                self.enableComponent();
                self.reloadWavesurfer(source).then(function () {
                    self.startPlayback();
                });

            })
        });
    }

    /**
     * Delete Record
     * @param recordID 
     */
    deleteRecord(recordID) {
        var self = this;

        self.lyricsService.removeAttachment(self.lyric.id, recordID, self.lyric.rev).then(function (revision) {

            if (revision) {
                self.lyric.rev = revision;

                // Just to disappear from the list
                delete self.lyric.attachments[recordID];

                if (self.currentRecordId && recordID == self.currentRecordId) {
                    self.closeButton(); // TODO: Load other song?
                }
            }
        })
    }

    updateMainButton(icon, action, color, hide) {
        var self = this;

        if (icon) {
            self.mainButton.icon = icon;
        }

        if (action) {
            self.mainButton.action = action;
        }

        if (color) {
            self.mainButton.color = color;
        }

        if (hide) {
            self.mainButton.hide = hide;
        } else {
            self.mainButton.hide = false;
        }

        self.cdRef.detectChanges();
    }


    mainButtonAction() {
        var self = this;

        self.mainButton.action.call(self);
    }

    resetMainButton() {
        this.mainButton = {
            icon: "microphone",
            color: "record",
            action: this.openAndRecord,
            hide: !this.canRecord
        }
    }

    reloadWavesurfer(source) {
        var self = this;

        self.wavesurferinstance.un('audioprocess');
        self.currentTime = "0.00";

        return new Promise((resolve, reject) => {

            if (source != null) {
                self.wavesurferinstance.load(source);
                // Show current time
                self.wavesurferinstance.on('audioprocess', function () {
                    //$('.waveform__counter').text( formatTime(wavesurfer.getCurrentTime()) );
                    self.currentTime = self.utils.formatTime(self.wavesurferinstance.getCurrentTime());
                    //console.log("Current Time: " + self.wavesurferinstance.getCurrentTime());
                    self.cdRef.detectChanges();
                });

                self.wavesurferinstance.on('ready', function () {
                    self.duration = self.utils.formatTime(self.wavesurferinstance.getDuration());
                    self.wavesurferinstance.un('ready');
                    resolve(true);
                });
            } else {
                reject();
            }
        });
    }

    /**
      UTILS
    **/
    getLyricDataPath() {
        return this.filePlugin.externalDataDirectory;
    }

    getFormatedDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var day = String(dd);
        var month = String(mm);

        if (dd < 10) {
            day = '0' + day;
        }
        if (mm < 10) {
            month = '0' + month;
        }

        var now = today.getFullYear() + month + day + today.getHours() + today.getMinutes() + today.getSeconds();

        return now;
    }
}
