import { Injectable, NgZone } from '@angular/core';
import { Data } from './data';
import { Subject } from 'rxjs/Subject';
/*
  Generated class for the Ideas provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class Ideas {

    ideasSubject: any = new Subject();

    constructor(public dataService: Data, public zone: NgZone) {

        this.dataService.db.changes({ live: true, since: 'now', include_docs: true, attachments: false }).on('change', (change) => {
            if (change.doc.type === 'idea') {
                this.emitIdeas();
            }
        });
    }

    getIdeas() {
        this.emitIdeas();
        return this.ideasSubject;
    }

    addIdea(idea) {
        return this.dataService.db.post(idea);
    }

    updateIdea(idea) {
        this.dataService.db.put(idea).catch((err) => {
            console.log(err);
        });
    }

    deleteIdea(idea) {
        idea._deleted = true;
        this.dataService.db.put(idea).catch((err) => {
            console.log(err);
        });
    }

    emitIdeas(): void {
        this.zone.run(() => {
            this.dataService.db.query('ideas/by_created_date').then((data) => {
                let ideas = data.rows.map(row => {
                    return row.value;
                });

                this.ideasSubject.next(ideas);
            });
        });
    }
}
