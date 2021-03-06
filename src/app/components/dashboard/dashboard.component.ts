import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http , Headers, Response,RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';

declare var $: any; 
declare var jQuery: any;
declare var swal: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private http: Http, private formBuilder: FormBuilder,
          private router: Router,private ref: ChangeDetectorRef,private app:AppComponent) {
      this.app.isActive=true;
      
  }
    //lineChart
      public lineChartData:Array<any> = [
        [10, 40, 30, 0, 59, 65, 75, 60, 40, 50, 10, 0]
      ];
      public lineChartLegend:boolean = false;
      public lineChartLabels:Array<any> = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov','Dec','Jan','Feb','Mar'];
      public lineChartType:string = 'line';
      public pieChartType:string = 'pie';
      public lineChartColors:Array<any> = [
                                       { // grey
                                         backgroundColor: 'transparent',
                                         borderColor: '#ff8103',
                                         pointBackgroundColor: '#fff',
                                         pointBorderColor: '#ff8103',
                                         pointHoverBackgroundColor: '#fff',
                                         pointHoverBorderColor: '#004f4b',
                                         borderWidth: 4,
                                         pointBorderWidth: 4,
                                         pointRadius: 5,
                                         pointHoverRadius: 5,
                                       },
                                     ];
      public lineChartColors1:Array<any> = [
                                       { // grey
                                         backgroundColor: 'transparent',
                                         borderColor: '#3AA62C',
                                         pointBackgroundColor: '#fff',
                                         pointBorderColor: '#3AA62C',
                                         pointHoverBackgroundColor: '#fff',
                                         pointHoverBorderColor: '#ff8103',
                                         borderWidth: 4,
                                         pointBorderWidth: 4,
                                         pointRadius: 5,
                                         pointHoverRadius: 5,
                                       },
                                     ];
      public lineChartOptions:any = {
              animation: false,
              responsive: true,
              lineTension: 0,
              scaleShowGridLines : false,
              scaleGridLineColor : "transparent",
              scaleGridLineWidth : 1, 
              scaleFontFamily : "'OpenSans'",
          };
      // Pie
     
      public randomizeType():void {
        this.lineChartType = 'line';
        this.pieChartType = 'doughnut';
      }
   // Doughnut
      public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
      public doughnutChartData:number[] = [350, 450, 100];
      public doughnutChartType:string = 'doughnut';
      public doghnutChartColors:Array<any> = [
                                              {
                                                  backgroundColor:[
                                                                    "#FF6600",
                                                                    "#FF9900",
                                                                    "#FFCC33"
                                                                   ]   
                                              }
                                              ]
      public doghnutChartColors1:Array<any> = [
                                              {
                                                  backgroundColor:[
                                                                    "#72CF65",
                                                                    "#38A529",
                                                                    "#ABD9A4"
                                                                   ]   
                                              }
                                              ]

  ngOnInit() {
          if($('body').hasClass('cat__menu-left--visible')){
              $(".donut-graph").removeAttr("style");
          }else{
              $(".donut-graph").attr("style","width:320px");
          }
          $( "#loadingIcon" ).hide();
          $( "#black-overlay" ).hide();
  }

}
