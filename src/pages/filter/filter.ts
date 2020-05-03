import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the Filter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-filter',
    templateUrl: 'filter.html'
})
export class FilterPage {
    filterOptions;
    orderOptions;
    filterCleared: boolean = false;


    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {

        this.filterOptions = this.navParams.get('filterOptions');
        this.orderOptions = this.navParams.get('orderOptions');
    }

    dismiss() {
        // Not being needed!!
        this.viewCtrl.dismiss({
            filterOptions: this.filterOptions,
            orderOptions: this.orderOptions
        });
    }

    clearFilters() {
        this.filterOptions.tuning = "";
        this.filterOptions.capo = null;
        this.filterOptions.speed = 0;
        this.filterOptions.happiness = 0;
        this.filterOptions.shouldFilter = false;

        this.filterCleared = true;
    }

    onFilterChange() {
        if(!this.filterCleared){
            this.filterOptions.shouldFilter = true;
        }else{
            this.filterCleared = true;
        }       
    }

    changeOrderingType(type) {
        this.orderOptions.type = type;
        this.orderOptions.shouldOrder = true;
    }

    changeOrderingDirection(direction) {
        this.orderOptions.direction = direction;
        this.orderOptions.shouldOrder = true;

    }


}
