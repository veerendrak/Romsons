import { Component , OnInit,Input} from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/pairwise';
import { Router,ActivatedRoute,NavigationStart,RoutesRecognized,NavigationEnd} from '@angular/router';
import { routing } from './app.routing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class AppComponent implements OnInit{
  title = 'app';
	routeUrlTest:boolean=false;
    bussinessPartner:boolean=true;
	isActive = true;
	routePreviousUrlData:any=[];
    prevIdentifiedUrl:string;
	hideMenuLinks:boolean=false;
    bpLegalName:any;
	constructor(private formBuilder: FormBuilder,private router:Router,private act:ActivatedRoute,
          private http:Http) {
		this.routeUrlTest=false;
		
	}
	ngOnInit(){
       
		this.router.events
			  .subscribe((event) => {
				
                  this.bpLegalName = localStorage.getItem("bpLegalName");
				if (event instanceof NavigationEnd) {
				  	if(event.url=='/' || event.url=='/login'|| event.url.includes("/resetPassword")){
						this.routeUrlTest=false;
						$( 'body' ).addClass('login-background');
					}else{
					    if(event.url=='/delarshipdetails'){
					        this.bussinessPartner=false;
					        setTimeout(()=>{$("#logo-block").show();
					        },500);
					    }else{
					        this.bussinessPartner=true;
					        setTimeout(()=>{$("#logo-block").hide();
                            },500);
					    }
					    this.routeUrlTest=true;
					    $( 'body' ).removeClass('login-background');
					}
                     
				}
                 
			setTimeout(function(){
                    var windowHeight=Math.round($(document).height());
                    var topBarheight=Math.round($('.cat__top-bar').height());
                    var footerHeight=Math.round($('.footer-background').height());
                    var containerHeight = windowHeight-(topBarheight+footerHeight+63);
                    //$('#mainContent').css("min-height",containerHeight);
                jQuery.extend( jQuery.fn.dataTableExt.oSort, {
                "currency-pre": function ( a ) {
                    a = (a==="-") ? 0 : a.replace( /[^\d\-\.]/g, "" );
                    return parseFloat( a );
                },
                "currency-asc": function ( a, b ) {
                    return a - b;
                },
                "currency-desc": function ( a, b ) {
                    return b - a;
                }
            });
                $(function(){
                    var scroll = document.getElementById("scroll-range");
                    try{
                        scroll.oninput = function () {
                            var id="";
                            if($(".table-divs").is(":visible")){
                                id=$(".table-divs").attr('id');
                            }
                            var panel = document.getElementById(id);
                            var total = panel.scrollWidth - panel.offsetWidth;
                            var percentage = total*($(this).val()/100);
                            
                            panel.scrollLeft = percentage;
                        }
                    }catch(e){
                        
                    }
                     
                });
                },1000);
			  });
			
		
	}
}
