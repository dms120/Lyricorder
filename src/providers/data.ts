import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import PouchDB from 'pouchdb';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Data {

	db: any;
	username: any;
	password: any;
	remote: any;

	constructor(public http: Http) {

		this.db = new PouchDB('lyricorder');

        // Define and uncomment for online sync
		//this.username = 'youruser';
		//this.password = 'yourpass';
		//this.remote = 'https://yourhost/lyricorder';

		//let options = {
			//live: true,
			//retry: true,
			//continuous: true,
			//auth: {
			//	username: this.username,
			//	password: this.password
			//}
		//};

		//this.db.sync(this.remote, options);

	}
}
