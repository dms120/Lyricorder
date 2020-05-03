import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { SmartAudio } from '../../providers/smart-audio';

/**
 * Generated class for the AmbientSounds page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-ambient-sounds',
    templateUrl: 'ambient-sounds.html',
})
export class AmbientSounds {

    isPlaying: {};
    volume: {};
    soundsType: string = 'ambience';

    constructor(public navCtrl: NavController, public navParams: NavParams, public smartAudio: SmartAudio, public viewCtrl: ViewController, public events: Events) {

        this.isPlaying = {
            fire: smartAudio.isPlaying('fire'),
            garden: smartAudio.isPlaying('garden'),
            rain: smartAudio.isPlaying('rain'),
            seaside: smartAudio.isPlaying('seaside'),
            storm: smartAudio.isPlaying('storm'),
            moon: smartAudio.isPlaying('moon'),
            water: smartAudio.isPlaying('water'),
            wind: smartAudio.isPlaying('wind'),
        };

        this.volume = {

            fire: smartAudio.getVolume('fire') * 10,
            garden: smartAudio.getVolume('garden') * 10,
            rain: smartAudio.getVolume('rain') * 10,
            seaside: smartAudio.getVolume('seaside') * 10,
            storm: smartAudio.getVolume('storm') * 10,
            moon: smartAudio.getVolume('moon') * 10,
            water: smartAudio.getVolume('water') * 10,
            wind: smartAudio.getVolume('wind') * 10,
        };

        smartAudio.preload('fire', 'assets/audio/fire.mp3');
        smartAudio.preload('garden', 'assets/audio/garden.mp3');
        smartAudio.preload('rain', 'assets/audio/rain.mp3');
        smartAudio.preload('seaside', 'assets/audio/seaside.mp3');
        smartAudio.preload('storm', 'assets/audio/storm.mp3');
        smartAudio.preload('moon', 'assets/audio/summer-night.mp3');
        smartAudio.preload('water', 'assets/audio/water-stream.mp3');
        smartAudio.preload('wind', 'assets/audio/wind.mp3');
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad AmbientSounds');
    }

    playSound(sound) {

        if (this.isPlaying[sound]) {
            this.smartAudio.stop(sound);

        } else {
            this.smartAudio.play(sound, (this.volume[sound] / 10));
        }

        this.isPlaying[sound] = !this.isPlaying[sound];
    }


    updateVolume(sound) {

        this.smartAudio.play(sound, (this.volume[sound] / 10));
        this.isPlaying[sound] = true;
    }


    changeVolume(event, key) {


    }

    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }

    viewWillLeave() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }

    isSoundPlaying() {
        let result = false;
        for (let key in this.isPlaying) {
            if (this.isPlaying[key]) {
                result = true;
            }
            if (result === true) {
                break;
            }
        }

        return result;
    }

    ngOnDestroy() {
        this.events.publish(
            'modalDidDismissedEvent',
            {
                isSoundPlaying: this.isSoundPlaying()
            }
        );
    }

}
