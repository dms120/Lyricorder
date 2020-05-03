export class Lyric {
    id: string;
    rev: string;
    attachments: {};
    notes: any;
    createdDate: any;
    updatedDate: any;
    key: string; // Chord Object?
    tuning: string;
    capo: number;
    happiness: number; // 1 - 10;
    speed: number; // 1- 10


 
    constructor(public title: string, public text: string){  //, public items: any[]
        this.title = title;
        this.text = text;
        this.notes = "";
        this.createdDate = new Date();
        this.updatedDate = new Date();
        this.key = null; // Object?
        this.tuning = null;
        this.capo = null,
        this.happiness = null;
        this.speed = null;
    }

    getTitle(){
        return  this.title;
    }
 
    setTitle(title){
        this.title = title;
    }

    setText(text){
        this.text = text;
    }

    fromMap(map){
        this.id = map._id;
        this.rev = map._rev;
        this.title = map.title;
        this.text = map.text;
        this.notes = map.notes;
        this.createdDate = new Date(map.createdDate);
        this.updatedDate = new Date(map.updatedDate);
        this.key = map.key;
        this.tuning = map.tuning;
        this.capo = map.capo;
        this.happiness = map.happiness;
        this.speed = map.speed;
        if(map._attachments){
          this.attachments = map._attachments;
        }
    }

    toMap(){
        let result = {
          _id: this.id,
          _rev: this.rev,
          _attachments: this.attachments,
          title: this.title,
          text: this.text,
          notes: this.notes,
          key: this.key,
          tuning: this.tuning,
          capo: this.capo,
          happiness: this.happiness,
          speed: this.speed,
          createdDate: this.createdDate,
          updatedDate: this.updatedDate,
          type: "lyric"
        };

        if(!this.attachments){
          delete result._attachments;
        }

        return result;
    }
}