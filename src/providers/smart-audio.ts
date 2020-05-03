import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';

@Injectable()
export class SmartAudio {

    audioType: string = 'html5';
    sounds: any = [];

    constructor(public nativeAudio: NativeAudio, platform: Platform) {

        if (platform.is('cordova')) {
            //this.audioType = 'native';
        }

    }

    preload(key, asset) {

        if (this.isNotLoaded(key)) {
            if (this.audioType === 'html5') {

                let audio = {
                    key: key,
                    asset: asset,
                    type: 'html5',
                    isPlaying: false,
                };

                this.sounds.push(audio);

            } else {

                this.nativeAudio.preloadComplex(key, asset, 1, 1, 0);

                let audio = {
                    key: key,
                    asset: key,
                    type: 'native',
                    isPlaying: false,
                    volume: 0.1
                };

                this.sounds.push(audio);
            }

        }

    }

    play(key, volume) {

        let audio = this.getSound(key);

        if (!audio.isPlaying) {
            audio.isPlaying = true;

            if (audio.type === 'html5') {

                let audioAsset;
                if (!audio.audioAsset) {
                    audioAsset = new Audio(audio.asset);
                } else {
                    audioAsset = audio.audioAsset;
                }

                if (volume) {
                    audioAsset.volume = volume
                }

                audioAsset.play();

                audio.audioAsset = audioAsset;

            } else {

                if (volume) {
                    this.nativeAudio.setVolumeForComplexAsset(key, volume);
                    audio.volume = volume;
                }

                this.nativeAudio.play(audio.asset).then((res) => {
                    console.log(res);
                }, (err) => {
                    console.log(err);
                });

            }

        } else if (volume) {
            this.changeVolume(key, audio, volume);
        }

    }

    stop(key) {

        let audio = this.getSound(key);
        audio.isPlaying = false;

        if (audio.type === 'html5') {

            let audioAsset = audio.audioAsset;
            audioAsset.pause();
            audioAsset.currentTime = 0;

        } else {

            this.nativeAudio.stop(audio.asset).then((res) => {
                console.log(res);
            }, (err) => {
                console.log(err);
            });

        }
    }

    getSound(key) {
        return this.sounds.find((sound) => {
            return sound.key === key;
        });
    }

    isNotLoaded(key) {
        return this.getSound(key) === undefined;
    }


    changeVolume(key, audio, volume) {

        if (audio.type === 'html5') {

            audio.audioAsset.volume = volume

        } else {
            this.nativeAudio.setVolumeForComplexAsset(key, volume);

        }
    }

    getVolume(key) {
        let audio = this.getSound(key);

        if (audio === undefined) {
            return 0.1;
        } else {
            if (audio.type === 'html5') {

                if (!audio.audioAsset) {
                    return 0.1
                } else {
                    return audio.audioAsset.volume;
                }

            } else {
                return audio.volume;

            }
        }

    }

    isPlaying(key) {
        let sound = this.getSound(key);

        return sound && sound.isPlaying;
    }

}