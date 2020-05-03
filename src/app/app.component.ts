import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
//import { StatusBar, Splashscreen } from 'ionic-native';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = 'HomePage';
    currentPage: String = "home";
    @ViewChild(Nav) nav: Nav;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public menuCtrl: MenuController) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }


    openPage(name) {
        if (this.currentPage != name) {

            this.nav.setRoot(name);
            this.currentPage = name;

        }

        this.menuCtrl.close();
    }
}
