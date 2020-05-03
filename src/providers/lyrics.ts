import { Injectable, NgZone } from '@angular/core';
import { Data } from './data';
import { Subject } from 'rxjs/Subject';

/*
	Generated class for the Lyrics provider.

	See https://angular.io/docs/ts/latest/guide/dependency-injection.html
	for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Lyrics {

    lyricSubject: any = new Subject();
    lyricsToBeDeletedSubject: any = new Subject();
	blobUtil: any = require('blob-util');

	constructor(public dataService: Data, public zone: NgZone) {

		this.dataService.db.changes({ live: true, since: 'now', include_docs: true, attachments: false }).on('change', (change) => {
			if (change.doc.type === 'lyric') {
				this.emitLyrics();
			}
		});
	}

	getLyrics() {

		this.emitLyrics();

		return this.lyricSubject;

    }
    
    getLyricsToBeDeleted(){
        this.emitLyrics(); // TODO : Make a separated method?

        return this.lyricsToBeDeletedSubject;
    }

	reset = function () {
		this.dataService.db.destroy().then(function () {
			this.dataService.db = new PouchDB('foo');
		});
	}

	addLyric(lyric) {

		return this.dataService.db.post(lyric);
	}

	updateLyric(lyric) {
        return new Promise((resolve, reject) => {
            this.dataService.db.put(lyric)
            .then(function(config){
                resolve(config);
            })
            .catch((err) => {
                reject(err);
                console.log(err);
            });
		});
        
    }
    
    restoreLyric(lyric){
        delete lyric.toBeDeleted;
		this.dataService.db.put(lyric).catch((err) => {
			console.log(err);
		});
    }

    addToTrash(lyric){
        lyric.toBeDeleted = true;
		this.dataService.db.put(lyric).catch((err) => {
			console.log(err);
		});
    }

	deleteLyric(lyric) {
		lyric._deleted = true;
		this.dataService.db.put(lyric).catch((err) => {
			console.log(err);
		});
	}

	emitLyrics(): void {

		this.zone.run(() => {

			this.dataService.db.query('lyrics/by_created_date').then((data) => {

                let lyrics = [] ;
                let lyricsToBeDeleted = [];

				data.rows.forEach(row => {
                    if(row.value.toBeDeleted){
                        lyricsToBeDeleted.push(row.value);

                    }else{
                        lyrics.push( row.value );
                    }
					
                });
                
                if(lyricsToBeDeleted.length > 0){
                    this.lyricsToBeDeletedSubject.next(lyricsToBeDeleted);
                    //this.cleanTrash(lyricsToBeDeleted);
                }

				this.lyricSubject.next(lyrics);

			});
		});
    }


    


    /************************
     *  Attachments Methods *
     * *********************/
    
	saveAttachment(lyricId, fileName, revision, fileArrayBuffer) {

		var self = this;

		return new Promise(resolve => {
			self.blobUtil.arrayBufferToBlob(fileArrayBuffer, "audio/mpega").then((blob) => {
				self.dataService.db.putAttachment(lyricId, fileName, revision, blob, 'audio/mpeg').then(function (result) {
					// handle result
					resolve(result);
				});
			});

		});
	}

	getAttachment(lyricId, fileName, revision) {
		var self = this;

		return new Promise(resolve => {
			self.dataService.db.getAttachment(lyricId, fileName, { rev: revision }).then(function (blob) {
				// handle result
				resolve(blob);
			});

		});
	}

	removeAttachment(lyricId, fileName, revision) {
		var self = this;

		return new Promise(resolve => {
			self.dataService.db.removeAttachment(lyricId, fileName, revision).then(function (result) {
				// handle result
				resolve(result.rev);
			});

		});
	}

}
