import { AppComponent } from '../../app.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'cat-footer',
  templateUrl: './footer.component.html',
  providers: [],
  styles:[]
})
export class FooterComponent implements OnInit{
    
    constructor(private http: Http,
            private formBuilder: FormBuilder,public actRoute: ActivatedRoute,
            private router: Router,private app: AppComponent) { 
        
        
    }

    ngOnInit() {
    }
    
   
}
