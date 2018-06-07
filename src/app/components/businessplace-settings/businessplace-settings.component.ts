import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router , ActivatedRoute } from '@angular/router';
import { Http , Headers, Response,RequestOptions } from '@angular/http';
import { MessagePropertiesService } from '../../services/message-properties.service'; 
import { EnvConfigurationService } from '../../services/env-configuration.service';
import { CommonService } from '../../services/common.service';
import { AppComponent } from '../../app.component';
declare var $: any;
declare var jQuery: any;
declare var swal: any;
@Component({
  selector: 'app-businessplace-settings',
  templateUrl: './businessplace-settings.component.html',
  styleUrls: ['./businessplace-settings.component.css']
})
export class BusinessplaceSettingsComponent implements OnInit {

 public method: any;
    public url: any;
    public close: any;
    public settingsMockData: any
    public errorMsg: boolean
    public showError: boolean = false;
    public settingMsg: any;
    public collapseMock = "#collapseMock_";
    public settingsConstant: any;
    checkFlag:boolean=false;
    constructor( private http: Http, private formBuilder: FormBuilder,
             private router: Router,private app:AppComponent,
             private messagesService:MessagePropertiesService,
             private environment:EnvConfigurationService,private commonService:CommonService ) {

        //this.app.routeUrl = this.router.url;
        this.app.isActive = true;
       /* this.settingMsg = this.igaspMessages.business_settings.settings_msg;
        this.settingsConstant = this.globalVariableService.bp_settings;*/
        if ( localStorage.getItem( "token" ) != null ) {

            this.getSettingsDisplay();


        }
        else {
            const path: string = '/login';
            this.router.navigate( [path] );
        }
    }

    getSettingsDisplay() {

        var url = this.environment.getRequiredApi( "get_settings" );
        var url1 = url.replace( '{setting_type}', 'BP_SETTING' );
        url = url1.replace( '{ref_obj_id}', localStorage.getItem( 'bpId' ) );
        this.url = url + "?";
        this.method = "GET";
        this.commonService.getData( this.url, this.method, '','a02eb658-57e6-11e7-907b-a6006ad3dba0')
            .subscribe(
            ( bpsettings ) => {
              if (bpsettings.status == 0) {
                    this.settingsMockData = bpsettings.data;
                  console.log( this.settingsMockData);
                    this.showError = false;
                  }else{
                  this.commonService.responseMessages("",bpsettings.message, "error");
                  }
                if(this.settingsMockData.length ==0 ){
                    this.showError = true;
                    }
            },
            ( err ) => {
            }
            );
        setTimeout(function(){
            $('.styled').each(function(i){
                var id=$(this).attr('id');
                var value=$('#hidden-'+id).val();
                if(value!=null){
                    if(value==$(this).val()){
                        $(this).prop('checked',true);
                    }else{
                        $(this).prop('checked',false); 
                    }
                }else{
                    if($(this).val()=="true"){
                        $(this).prop('checked',true);
                    }else{
                        $(this).prop('checked',false); 
                    }   
                }
             });
        },1000);
    }

    getSettings( settingType, items, value, row, currentValue, event,collapseId ) {
        items['refObjType']="BP";
        var cred;
        var regExp;
        var errorMsg;
        /*if ( currentValue === '') {

            if ( currentValue === event.target.value ) {
                //this.reusableMethod.responseMessages( '', this.settingMsg, 'danger' )
            }
            return false;
        }
        if ( settingType == this.settingsConstant.ipw && items['details'][row]['settingTypeFormat']=="textarea") {
            regExp = /^((2([0-4]\d|5[0-5])|1\d\d|[0]?[1-9]\d|[0]?[0]?\d)(\.(2([0-4]\d|5[0-5])|1\d\d|[0]?[1-9]\d|[0]?[0]?\d)){3}([\,](?!$)|$))*$/;
            errorMsg = this.igaspMessages.business_settings.settings_msg_invalid;
            cred = this.igaspMessages.business_settings.settings_swal;
        }

        if ( (settingType == this.settingsConstant.thresholds || settingType == this.settingsConstant.password_policy) && items['details'][row]['settingTypeFormat']=="text") {
            regExp = /^-?\d*$/
            errorMsg = this.igaspMessages.business_settings.settings_msg_num_invalid
            if(settingType == this.settingsConstant.password_policy){
                if(value>15){
                    this.reusableMethod.responseMessages( '', this.igaspMessages.business_settings.settings_pp_max_failed, 'warning' )
                    return false;
                }
                if(value<6){
                        this.reusableMethod.responseMessages( '', this.igaspMessages.business_settings.settings_pp_min_failed, 'warning' )
                        return false;
                }
            }
            
            if(settingType == this.settingsConstant.thresholds){
                cred = this.igaspMessages.business_settings.settings_mismatch;
            }
            
            if(settingType == this.settingsConstant.password_policy){
                cred = this.igaspMessages.business_settings.settings_pp;
            }
        }
        if(items['details'][row]['settingTypeFormat']=="checkbox" || items['details'][row]['settingTypeFormat']=="radio"){
            currentValue=currentValue.toString();
            regExp=/^([Tt][Rr][Uu][Ee]|[Ff][Aa][Ll][Ss][Ee])$/;
            //cred = this.igaspMessages.business_settings.settings_auto_save;
        }  */ 
        if (!currentValue.match(regExp)) {
            //this.reusableMethod.responseMessages( '', errorMsg, 'danger' )
            console.log("you are at right place");
            return false;
        }
        else {

            swal( {

                title: "Are you sure?You want to update the setting value",
                text: "",
                type: "",
                showCancelButton: true,
                cancelButtonClass: "btn-danger btn-danger-custom",
                confirmButtonClass: "btn-primary btn-primary-custom",
                confirmButtonText: "Ok",
                closeOnConfirm: true
            },
                () => {
                    this.errorMsg = false;
                    items["details"] = items["details"][row];

                    this.url = this.environment.
                        getRequiredApi( 'post_settings' )
                        + "?";
                    this.method = "POST";
                    [items][0]["details"] = [[items][0]["details"]];
                    [items][0]["details"][0]['val']=currentValue;
                    console.log(this.url);
                    console.log([items]);
                    this.commonService.getData( this.url, this.method, [items], 'a02eb658-57e6-11e7-907b-a6006ad3dba0' )
                        .subscribe(( data ) => {
                            if (data!=null) {
                                console.log(data);
                                this.commonService.responseMessages( '', data.message, 'success' )
                                this.getSettingsDisplay();
                                setTimeout(() => {
                                    $( '#collapseMock_'+collapseId).collapse( 'show' );
                                    $('.styled').each(function(i){
                                        var id=$(this).attr('id');
                                        var value=$('#hidden-'+id).val();
                                        if(value!=null){
                                            if(value==$(this).val()){
                                                $(this).prop('checked',true);
                                            }else{
                                                $(this).prop('checked',false); 
                                            }
                                        }else{
                                            if($(this).val()=="true"){
                                                $(this).prop('checked',true);
                                            }else{
                                                $(this).prop('checked',false); 
                                            }   
                                        }
                                     });
                                }, 500 );
                                
                            }

                        },
                        ( err ) => {
                            if(err.message=='Your subscription has been expired. Please contact our administrator.'){
                                this.getSettingsDisplay();
                            }
                        } );


                } );


        }

    }

    ngOnInit() {

        $( document ).on( 'change', '#organization_name', function() {


        } );
    }
    openCollapse( id, i ) {

        $( '.closeIcon' ).each( function( index ) {
            if ( index == i ) {
                $( '#' + id + i ).toggle( 'collapse' );
            }
            else {
                $( '#' + id + index ).toggle( 'hide' );
            }
        } );

    }


}
