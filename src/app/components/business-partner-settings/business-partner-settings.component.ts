import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { AppComponent } from '../../app.component';
import {CommonService} from '../../services/common.service';
import { MessagePropertiesService } from '../../services/message-properties.service';
import {EnvConfigurationService} from '../../services/env-configuration.service';


declare var $: any;
declare var jQuery: any;
declare var swal: any;
@Component({
  selector: 'app-business-partner-settings',
  templateUrl: './business-partner-settings.component.html',
  styleUrls: ['./business-partner-settings.component.css']
})
export class BusinessPartnerSettingsComponent implements OnInit {

 

    public method: any;
    public url: any;
    public close: any;
    public bpSettingsList: any
    public errorMsg: boolean
    public showError: boolean = false;
    public settingMsg: any;
    public collapseMock = "#collapseMock_";
    public settingsConstant: any;
    checkFlag:boolean=false;
    constructor( private app: AppComponent, private router: Router, private messageList: MessagePropertiesService
        , private reusableMethod: CommonService, private environment: EnvConfigurationService ) {

         this.app.isActive=true
        
        this.settingMsg = this.messageList.business_settings;
      //  this.settingsConstant = this.globalVariableService.bp_settings;
        if ( localStorage.getItem( "token" ) != null ) {

            this.getSettingsDisplay();


        }
        else {
            const path: string = '/login';
            this.router.navigate( [path] );
        }
    }

    getSettingsDisplay() {
        
        $('#loadingIcon').show();
        $("#black-overlay").show();

        var url = this.environment.getRequiredApi( "get_settings" );
        var url1 = url.replace( '{setting_type}', 'APP_SETTING' );
        url = url1.replace( '{ref_obj_id}', localStorage.getItem("orgId"));
        this.url = url + "?";
        this.method = "GET";
        this.reusableMethod.getData( this.url, this.method, '', localStorage.getItem( 'Application' ) )
            .subscribe(
            ( bpsettings ) => {
                console.log(bpsettings)
                if(bpsettings.status == 0){
                    this.showError = false;
                    this.bpSettingsList = bpsettings.data
                
                }else{
                     this.showError = true;
                }
                $('#loadingIcon').hide();
                $("#black-overlay").hide();
            },

            ( err ) => {
                if ( err.responseCode == 'SEC_MSG_0001') {
                  /*  setTimeout(() => {
                        this.router.navigate( ['/organizationlist'] );
                    }, 500 );*/

                }
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
       items['refObjType']="APP";
        var cred;
        var regExp;
        let errorMsg;
        if ( currentValue === '') {

            if ( currentValue === event.target.value ) {
                this.reusableMethod.responseMessages( '', this.settingMsg.settings_msg, 'danger' )
            }
            return false;
        }
        if (  items['details'][row]['formatType']=="textarea") {
            regExp = /^((2([0-4]\d|5[0-5])|1\d\d|[0]?[1-9]\d|[0]?[0]?\d)(\.(2([0-4]\d|5[0-5])|1\d\d|[0]?[1-9]\d|[0]?[0]?\d)){3}([\,](?!$)|$))*$/;
            errorMsg = this.settingMsg.business_settings.settings_msg_invalid;
          //  cred = this.igaspMessages.business_settings.settings_swal;
        }

        if (  items['details'][row]['formatType']=="text") {
            
            if(items['grpName'] == "USER"){
            regExp = /^-?\d*$/;
                errorMsg =  this.settingMsg.settings_msg_num_invalid;    
            }
            if (items['details'][row]['shortId'] == "SAP_CLIENT_CODE" || items['details'][row]['shortId']=="SMTP_PORT") {
                regExp = /^-?\d*$/;
                errorMsg = this.settingMsg.settings_msg_num_invalid;
            }
           
            
          //  errorMsg = this.igaspMessages.business_settings.settings_msg_num_invalid
          /*  if(settingType == this.settingsConstant.password_policy){
                if(value>15){
                   // this.reusableMethod.responseMessages( '', this.igaspMessages.business_settings.settings_pp_max_failed, 'warning' )
                    return false;
                }
                if(value<6){
                  //      this.reusableMethod.responseMessages( '', this.igaspMessages.business_settings.settings_pp_min_failed, 'warning' )
                        return false;
                }
            }*/
            
          /*  if(settingType == this.settingsConstant.thresholds){
             //   cred = this.igaspMessages.business_settings.settings_mismatch;
            }
            
            if(settingType == this.settingsConstant.password_policy){
            //    cred = this.igaspMessages.business_settings.settings_pp;
            }*/
        }
        if(items['details'][row]['formatType']=="checkbox" || items['details'][row]['formatType']=="radio"){
            currentValue=currentValue.toString();
            regExp=/^([Tt][Rr][Uu][Ee]|[Ff][Aa][Ll][Ss][Ee])$/;
          //  cred = this.igaspMessages.business_settings.settings_auto_save;
        }   
        if (!currentValue.match(regExp)) {
            
          this.reusableMethod.responseMessages( '', errorMsg, 'warning' )
            return false;
        }
        else {

            swal( {

                title: "Are you sure to change the value ?",
                text: "",
                type: "",
                showCancelButton: true,
                confirmButtonClass: "btn-default btn-primary-custom login-button-export",
                cancelButtonClass: "btn-danger btn-danger-custom ",
                confirmButtonText: "Ok",
                closeOnConfirm: true
            },
                () => {
                    this.errorMsg = false;
                    items["details"] = items["details"][row];

                    this.url = this.environment.
                        getRequiredApi( 'post_settings' )
                        + "?";
                    $('#loadingIcon').show();
                    $("#black-overlay").show();
                    
                    this.method = "POST";
                    [items][0]["details"] = [[items][0]["details"]];
                    [items][0]["details"][0]['val']=currentValue;
                    console.log([items]);
                    this.reusableMethod.getData( this.url, this.method, [items], localStorage.getItem( 'Application' ) )
                        .subscribe(( data ) => {
                            
                            console.log(data);
                            if(data.status == 1){
                                 this.reusableMethod.responseMessages( '', data.message, 'warning' )
                            }else{
                                this.reusableMethod.responseMessages( '', data.message, 'success' )
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
                            $('#loadingIcon').hide();
                            $("#black-overlay").hide();
                           /* if (data!=null) {
                             //   this.reusableMethod.responseMessages( '', this.igaspMessages.business_settings.settings_success, 'success' )
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
                                
                            }*/

                        },
                        ( err ) => {
                            
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
