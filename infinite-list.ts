import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { TrytonProvider } from '../ngx-tryton-providers/tryton-provider'

import { EncodeJSONRead } from '../ngx-tryton-json/encode-json-read'

@Component({
    selector: 'infnite-list',
    templateUrl: 'infinite-list-example.html',

})
/**
 * Locations page.
 * This view exposes a infinite scrolling list.
 * An infinite scrolling list is a list that its not loaded will all the date
 * but it keeps updating itself with new date once the user scrolls pass
 * a thereshold.
 *
 * DO NOT MODIFY THIS CLASS, EXTEND IT INSTEAD
 */
export class InfiniteList {

    /**
     * Method to search information
     * @type {string}
     */
    method: string;
    /**
     * Domain of the method
     * @type {array}
     */
    domain: any[];
    /**
     * Fields to search
     * @type {Array<string>}
     */
    fields: Array<string>;
    /**
     * Default location value
     * @type {string}
     */
    default_value: string;
    /**
     * Current offset, this number will increase each time more data is loaded
     * @type {number}
     */
    offset: number = 0;
    /**
     * Number of entries to gather from the server
     * @type {number}
     */
    limit: number = 10;

    /**
     * Items to display
     * @type {Array<any>}
     */
    list_items: Array<any> = [];



    constructor(public navCtrl: NavController,
        public trytond_provider: TrytonProvider,
        public events: Events) {
    }

    /**
     * Allows a view to have infinite scrolling, meaning that it will not
     * load all the items from a list at the same time, but will load them as
     * time goes on.
     * @param {any} infiniteScroll Infinite scroll event
     */
    doInfinite(infiniteScroll: any) {
      if (this.list_items.length == 0)
        infiniteScroll.enable(false);
        console.log("Begin async op");
        this.loadData().then(() => {
          // Disable scroll if list is empty
          if (this.list_items.length == 0)
            //infiniteScroll.enable(false);
            console.log(this.list_items)
          infiniteScroll.complete();

        })
    }

    /**
     * Loads new data into the data array
     */
    loadData() {
        let json_constructor = new EncodeJSONRead;
        json_constructor.addNode(this.method, this.domain,
            this.fields, this.offset, this.limit);

        let json = json_constructor.createJson()

        return new Promise(resolve => {
            this.trytond_provider.search(json).subscribe(
            data =>{
                // We do this so we can be sure of the data type afterwards
                this.list_items = this.list_items.concat(data[this.method]);
                console.log("Received data", this.list_items);
                this.offset+=this.limit;

                console.log("Done");
                this.events.publish("Data loading finished")
                resolve(true)
            },
            error => {
                console.log("Error", error)
            });
        })
    }
}
