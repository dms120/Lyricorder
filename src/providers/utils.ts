import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { File } from '@ionic-native/file';
import { Network } from '@ionic-native/network';
import { Platform, ModalController, Events, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the Utils provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
  	*/
@Injectable()
export class Utils {
	isBrowser: boolean = true;
	blobUtil: any = require('blob-util');
	isSoundPlaying: any = false;

	constructor(public http: Http, platform: Platform, public filePlugin: File, public modalCtrl: ModalController, public events: Events, private network: Network, public alertCtrl: AlertController) {
		if (platform.is('cordova')) {
			this.isBrowser = false;
		}
	}

	/**
	Gets blob url or creates a file and return source
	**/
	getSourceFromBlob(fileName, blob, forceBlob) {
		var self = this,
			directory = this.filePlugin.externalDataDirectory;

		return new Promise((resolve, reject) => {
			if (self.isBrowser || forceBlob === true) {
				resolve(self.blobUtil.createObjectURL(blob));
			} else {
				let filePath = directory + fileName;
				this.filePlugin.checkFile(directory, fileName)
					.then(_ => {
						resolve(filePath);
					})
					.catch(_ => {
						self.filePlugin.writeFile(directory, fileName, blob, true)
							.then(_ => {
								resolve(filePath);
							})
							.catch(_ => {
								console.log('Error while creating File');
								reject(null);
							});
					});
			}
		});
	}


	createDirectory(folder, folderName) {
		const self = this;
		const promise = new Promise((resolve, reject) => {
			this.filePlugin.checkDir(folder, folderName)
				.then(_ => {
					console.log('Directory exists');
					resolve(true);
				})
				.catch(_ => {
					console.log('Directory doesnt exist');
					console.log('Creating Directory');
					self.filePlugin.createDir(folder, folderName, false)
						.then(_ => {
							console.log('Created Directory');
							resolve(true)
						})
						.catch(_ => {
							console.log('Error while creating Directory');
							reject(false);
						});
				});
		});

		return promise;
	}

	getBlobFromFile(fileName) {
		var self = this,
			directory = this.filePlugin.externalDataDirectory;

		return new Promise((resolve, reject) => {
			this.filePlugin.readAsDataURL(directory, fileName)
				.then(dataUrl => {
					self.blobUtil.dataURLToBlob(dataUrl).then(function (blob) {
						resolve(self.blobUtil.createObjectURL(blob));
					})

				})
				.catch(_ => {
					console.log(_);
				});
		});
	}

	hasNetworkAvailable() {
		let isConnected: boolean = this.network.type != "unknown";

		if (!isConnected) {

			const alert = this.alertCtrl.create({
				title: 'No Network available',
				subTitle: 'Please check your Network Connection',
				buttons: ['Ok']
			});
			alert.present();

		}

		return isConnected;
	}


    /**
     * Open Ambient Sounds modal
     */
	openAmbientSounds() {

		let profileModal = this.modalCtrl.create("AmbientSounds", { isSoundPlaying: this.isSoundPlaying });
		this.events.subscribe('modalDidDismissedEvent', (data) => {
			this.isSoundPlaying = data.isSoundPlaying;
		});

		profileModal.present();
	}


    /**
     * Check if is Browser
     */
	isPlatformBrowser() {
		return this.isBrowser;
	}


    /**
     * Is lyric empty
     * @param lyric
     */
    isLyricEmpty(lyric){
        return lyric.title == '' && lyric.text == ''; 
    }

	/**
	Get Modal Controller
	**/
	getModalController() {
		return this.modalCtrl;
	}

	/**
	  Returns time on 00m00s
	  **/
	formatTime = function (time) {
		return [
			Math.floor((time % 3600) / 60), // minutes
			('00' + Math.floor(time % 60)).slice(-2) // seconds
		].join(':');
	};


	getMonth(date) {
		let locale = "en-us";

		if (!date) {
			date = new Date();
		} else {
			date = new Date(date);
		}

		return date.toLocaleString(locale, { month: "long" });

	}


	getShortMonth(date) {
		let locale = "en-us";

		if (!date) {
			date = new Date();
		} else {
			date = new Date(date);
		}

		return date.toLocaleString(locale, { month: "short" });

	}


}
