import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { DateAdapter } from '@angular/material';
import { MessagePropertiesService } from '../../services/message-properties.service';
import {EnvConfigurationService} from '../../services/env-configuration.service';
@Component({
  selector: 'app-reports-gallery',
  templateUrl: './reports-gallery.component.html',
  styleUrls: ['./reports-gallery.component.css']
})
export class ReportsGalleryComponent implements OnInit {

  constructor(private http: Http, private formBuilder: FormBuilder,
        private router: Router, private ref: ChangeDetectorRef, private app: AppComponent, private messagesService: MessagePropertiesService,
        private commonService: CommonService, private dateAdapter: DateAdapter<Date>, private activatedRoute: ActivatedRoute, private environment: EnvConfigurationService) { }

  ngOnInit() {
  }

  navigateToReportPage(page) {
      const path: any = page;
      if(page == "stkdet" || page =="inventorystock"){
          this.commonService.reportFlag = true;
      }
      this.router.navigate([path]);

  }
}
