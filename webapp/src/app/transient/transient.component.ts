import { Component, OnInit } from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {Pm4pyService} from "../pm4py-service.service";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-transient',
  templateUrl: './transient.component.html',
  styleUrls: ['./transient.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class TransientComponent implements OnInit {
  public isLoading: boolean;
  processModelBase64Original: string;
  processModelBase64Sanitized: SafeResourceUrl;
  pm4pyJson: JSON;
  public delay: number = 11.36675;
  public selectedDelay : number = 11.36675;
  public expSelectedDelay : number = Math.exp(this.selectedDelay);
  public shownString : string = this.secondsToString(this.expSelectedDelay);
  sanitizer: DomSanitizer;
  pm4pyService: Pm4pyService;

  constructor(private _sanitizer: DomSanitizer, private pm4pyServ: Pm4pyService) {
    this.sanitizer = _sanitizer;
    this.pm4pyService = pm4pyServ;
    // calls the retrieval of the simulation from the service
    this.populateSimulation();
  }

  secondsToString(seconds : number) {
    let numdays : number = Math.floor(seconds / 86400);
    let numhours : number = Math.floor((seconds % 86400) / 3600);
    let numminutes : number = Math.floor(((seconds % 86400) % 3600) / 60);
    let numseconds : number = Math.floor(((seconds % 86400) % 3600) % 60);

    if (numdays >= 1) {
      return numdays.toString() + "D " + numhours.toString() + "h";
    }
    else if (numhours >= 1) {
      return  numhours.toString() + "h " + numminutes.toString()+"m";
    }
    else if (numminutes >= 1) {
      return numminutes.toString() + "m " + numseconds.toString()+"s";
    }
    else if (numseconds >= 1) {
      return numseconds.toString()+"s";
    }
    return "0";
  }

  populateSimulation() {
    this.isLoading = true;
    let params: HttpParams = new HttpParams();
    params = params.set("delay", this.expSelectedDelay.toString());

    this.pm4pyService.transientAnalysis(params).subscribe(data => {
      this.pm4pyJson = data as JSON;
      this.processModelBase64Original = this.pm4pyJson["base64"];
      this.processModelBase64Sanitized = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,' + this.processModelBase64Original);
      this.setImageCorrectSize();
      this.isLoading = false;
    });
  }

  setImageCorrectSize() {
    /**
     * Sets the correct size of the image decribing the process schema
     */
    let targetHeight: number = (document.getElementById("container0").offsetHeight * 0.78);
    let targetWidth: number = (document.getElementById("container0").offsetWidth * 0.79);

    (<HTMLImageElement>document.getElementById("imageProcessModelImage")).height = targetHeight;
    (<HTMLImageElement>document.getElementById("imageProcessModelImage")).width = targetWidth;
  }

  sliderIsChanged(event: any) {
    /**
     * Manages the change to the value selected in the slider
     */
    this.selectedDelay = event.value;
    this.expSelectedDelay  = Math.exp(this.selectedDelay);
    this.shownString = this.secondsToString(this.expSelectedDelay);
    // calls the retrieval of the process schema from the service
    this.populateSimulation();
  }

  ngOnInit() {
  }

  manualInputManagement(event) {
    console.log("INPUTCHANGE");
    console.log(event);
    let noDays : number = parseFloat((<HTMLInputElement> document.getElementById("numberDays")).value);
    console.log(noDays);
    let noSeconds : number = noDays * 86400.0;
    this.delay = Math.log(noSeconds);
    this.selectedDelay = Math.log(noSeconds);
    this.expSelectedDelay = noSeconds;
    this.shownString = this.secondsToString(this.expSelectedDelay);
    this.populateSimulation();
  }

  onResize(event) {
    /**
     * Manages the resizing of a page
     */
    // sets the image size after the resizing
    this.setImageCorrectSize();
  }

  mouseWheel(event: any) {
    if (event["deltaY"] < 0) {
      (<HTMLImageElement>document.getElementById("imageProcessModelImage")).height = (<HTMLImageElement>document.getElementById("imageProcessModelImage")).height * 1.1;
      (<HTMLImageElement>document.getElementById("imageProcessModelImage")).width = (<HTMLImageElement>document.getElementById("imageProcessModelImage")).width * 1.1;
    } else {
      (<HTMLImageElement>document.getElementById("imageProcessModelImage")).height = (<HTMLImageElement>document.getElementById("imageProcessModelImage")).height * 0.9;
      (<HTMLImageElement>document.getElementById("imageProcessModelImage")).width = (<HTMLImageElement>document.getElementById("imageProcessModelImage")).width * 0.9;
    }
  }

}
