import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the IdeasData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class IdeasData {

	constructor(public http: Http) {
		console.log('Hello IdeasData Provider');
	}

	getRandomWord() {
		return this.http.get('http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5');
	}

	getByMood(word) {
		return this.http.get('https://api.datamuse.com/words?rel_syn=' + word);
	}

	getRhymes(word) {
		return this.http.get('https://api.datamuse.com/words?rel_rhy=' + word);
	}

	getDictionary(word) {
		return this.http.get('http://api.wordnik.com:80/v4/word.json/' + word + '/definitions?limit=200&includeRelated=true&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5');
	}
}
