import { Injectable } from '@angular/core';

@Injectable()
export class MessagePropertiesService {

    constructor() { }

    //login messages 
    login = {
        "login_valid_email": "Please enter a valid Email ID",
        "EMAIL_ERR_MSG": "Please enter your Email ID",
        "PWD_ERR_MSG": "Please enter your Password",
        "login_cred": "Please enter valid credentials",
        "session_invalid": "Your session has become invalid. Please login again.",
        "reg_first_name": "Please enter first name",
        "reg_last_name": "Please enter last name",
        "otp": "OTP will be send to your mobile number",
        "enter_ph_num": "Please enter mobile number",
        "invalid_ph_num": "Please enter a valid mobile number",
        "cnf_pwd": "Please enter confirm password",
        "pwd_match": "Password and Confirm Password do not match",
        "err_login_pwd": "Please verify your password and try again",
        "reg_invalid_token": "You were already registered using this link. Please login..",
        "in_memory_token": "Already registered using this link",
        "pwd_policy": "* Password must contain at least one upper case letter ([A-Z]),one lower case letter([a-z]),one digit([0-9]) and one special character([#?!@$%^&*-])",
        "pwd_min_length": "* Password must be min of  6 characters",
        "pwd_max_length": "* Password must be max of  15 characters",
        "user_locked_msg": "User account is locked.Please try after sometime"

    };
    forgot_pwd = {
        "forgot_pwd_success": "A link to reset your password is sent to your registered Email Id",
        "forgot_pwd_invalid": "If you are registered with us using this email address, you will receive an email to reset your password",
        "error_forgot_pwd_success": "Your email id is not registered with us"
    };

    sales_order_details_msg = {
        "cust_req": "Please enter Customer Name",
        "order_type_req": "Please select Order Type",
        "sold_to_party_req": "Please enter Sold To Party",
        "filter_from_date": "Please select from date",
        "filter_to_date": "Please select to date",
        "filter_sales_status": "Please enter status"
    }
    billing_det_msg = {
        "bill_doc_no": "Please enter Document Number",
        "billing_date": "Please enter Billing Date",
        "bill_select":"Please select atleast one billing",
        "bill_sel_cancel":"You have selected a cancelled bills"
    }
    outbound_delivery_msg = {
        "out_date_req_msg": "Please enter Date",
        "out_order_req_msg": "Please enter order Type",
        "frm_item_req_msg": "Please enter From Item ",
        "to_item_req_msg": "Please enter To Item",

        "out_shippingPoint_req": "Please enter shipping point",
        "out_order_num_req_msg": "Please enter order Number",
        "out_doc_date_req_msg": "Please enter Document Date",
        "out_gi_date": "Please enter Gi Date ",
        "out_no_package": "Please enter Package Count",
        "out_totWeight": "Please enter Total Weight ",
        
        "cust_req": "Please enter Customer Name",
        "order_type_req": "Please select Order Type",
        "sold_to_party_req": "Please enter Sold To Party",
        "filter_from_date": "Please select from date",
        "filter_to_date": "Please select to date",
        "filter_sales_status": "Please enter status"
        
    }

    incoming_payments_msg = {
        "custAccount_req": "Please enter Customer Account",
        //        "docType_req"     : "Please enter Doc Type",
        //        "cmpyCode_req"    : "Please enter Company Code",
        "payment_req": "Please enter Payment",
        "refNo_req": "Please enter Reference Number",
        //        "bplace_req"      : "Please enter Business Place",
        //        "bsnArea_req"     : "Please enter Business Area",
        "amount_req": "Please enter Amount",
        //        "glAccount_req"   : "Please enter GL Account",
        //"profitCenter_req": "Please enter Profit Center"
    }
    outgoing_payments_msg = {
        "vendAccount_req": "Please enter Vendor Account",
        "docType_req": "Please enter Doc Type",
        "paymentDate_req": "Please enter Payment Date",
        "docDate_req": "Please enter Doc Date",
        "cmpnCode_req": "Please enter Company Code",
        "payment_req": "Please enter Payment",
        "reference_req": "Please enter Reference Number",
        "currency_req": "Please enter currency",
        "remarks_req": "Please enter remarks",
        "amount_req": "Please enter Amount",
        "glAccount_req": "Please enter GL Account",
        "profitCenter_req": "Please enter Profit Center"
    }
    customer_details_msg = {
        "name_req": "Please enter Name",
        "mobile_req": "Please enter Mobile Number",
        "email_req": "Please enter Email",
        "druglicence_req": "Please enter Drug Licence",
        "creditLimit_req": "Please enter Credit Limit",
        // "doorNumber_req": "Please enter Door Number",
        "area_req": "Please enter Area",
        "street_req": "Please enter Street",
        "city_req": "Please enter City",
        //"mandal_req": "Please enter Mandal",
        //"district_req": "Please enter District",
        "state_req": "Please enter State",
        "pincode_req": "Please enter Pincode",
        // "registrationType_req": "Please enter Registration Type",
        "gstNumber_req": "Please enter GST Number",
        "pan_req": "Please enter PAN Number",
        "bankName_req": "Please enter Bank Name",
        "ifcCode_req": "Please enter IFC Code",
        "accountNum_req": "Please enter Account Number",
        "customer_type": "Please enter Customer Type",
        "email_req_error": "Please enter a valid email id",
        "mobile_err_req": "Please enter a valid mobile number",
        "pincode_invalid_error": "Please enter valid PIN code",
        "status_req": "Please select Status",
        "panNum_invalid_error": "Please enter a valid PAN",
        "creditLimit_invalid_error": "Please enter a valid Credit Limit",
        "price_list": "Please select price list",
        "recon_account": "Please select recon account",
        "tax_grp1": "Please select tax group1",
        "tax_grp2": "Please select tax group2",
        "tax_grp3": "Please select tax group3",
        "tax_grp4": "Please select tax group4",
        "mobile_num_exceed": "Telephone can be max 15 character long",
        "mobile_num_min":"Telephone must be at least 10 characters long"
    }
    purchase_order_details_msg = {
        "purchase_type_req": "Please select Purchase Type",
        "vendor_req": "Please enter Vendor Name",
        "docType_req": "Please enter Doc Type",
        "vendor_code_req": "Please enter Vendor Code",
        "docDate_req": "Please enter Doc Date",
    }
    goods_receipt_details_msg = {
        "delivery_num": "Please enter delivery number",
        "doc_date": "Please select Doc Date",
        "pos_date": "Please select Pos Date",
        "delivery_note": "Please enter delivery note",
        "header_text": "Please enter header text",
    }
    invoice_details_msgs = {
        "inv_ref": "Please enter Invoice reference",
        "inv_date": "Please select Invoice Date",
        "pos_date": "Please select Pos Date",
        "inv_Amt": "Please enter invoice amount",
        "bsline_Date": "Please enter baseline date",
        "valid_inv_Amt": "Please enter valid invoice amount",
    }
    resetPwd = {
        "reset_success": "Your password has been reset successfully",
        "invalid_token": "Invalid Token",

        "error_passwords_match": "New Password and Confirm Password  does not match ",
        "error_no_newpassword": "Please enter a Password Passwords did not match",
        "password_matches": "Congratulations! You have successfully changed your password",
        "error_no_confirm_new_password": "Please enter a Password Passwords did not match",
        "error_change_password": "Please enter new password",
        "error_confirm_password": "Please enter confirm password",

    }
    manageRoles = {
        //Role management
        //add role messages

        "error_role_submit": "Please enter a Role Name",
        "error_role__ref_submit": "Please select a Role Reference",
        "role_submit_success": "New Role has been created successfully",
        "role_clicks_cancel": "Do you really want to cancel?",

        //Edit Role messages

        "role_rename_success": "You have successfully changed the Role Name",
        "role_delete_success": "Role <Role-Name> has been deleted",
        "role_permissions_edited": "Access permissions have been altered",
        "error_invalid_role": "You entered role name is already registered please try different one",
        "edit_role_name": "Role name is successfully updated",
        "delete_role": "Organization Role is successfully removed",
        "role_added": "Organization Role is successfully added"
    }
    bussinessPartnerMsgs = {
        "error_branch_name": "Please enter Business Partner",
        "error_branch_GSTN": "Please enter your GSTIN ",
        "error_branch_GSTN_invalid": "Please enter a valid GSTIN ID",
        "error_branch_phone_number_miss": "Please enter  mobile number",
        "error_branch_phone_invalid": "Please enter a valid mobile number",
        "error_branch_gstin_status": "Please select GSTIN status",
        "error_branch_address": "Please enter address",
        "error_branch_country_name": "Please Select Country ",
        "error_branch_state": "Please select state",
        "error_branch_city": "Please enter city",
        "error_branch_zip_code": "Please enter Pincode",
        "error_branch_zip_invalid": "Please enter a valid  Pincode",
        "error_branch_partner_type": "Please select BP Type",
        "error_branch_erpBankGl": "Enter ERPBANKGL",
        "error_branch_drugLicNum": "Enter Drug licence number",
        "error_branch_erpProfitCenter": "Please enter ERP Profit Center",
        "error_branch_partner": "Please enter ERP Business partner name",
        "error_branch_erpBusArea": "Please enter Business partner Area",
        "error_branch_panNumber": "Please enter Pan Number",
        "error_branch_panNumber_invalid": "Enter a valid Pan Number",
    }

    userManagement = {

        "role_req": "Please select Role ",
        "business_partner_req": "Please select Business Partner",
        "firstName_req": "Please enter first name ",
        "lastName_req": "Please enter last name ",
        "mobile_req": "Please enter mobile number",
        "mobile_err_req": "Please enter a valid mobile number",
        "email_req": "Please enter email id",
        "email_req_error": "Please enter a valid email id",

        "RMS_restrict": "You cannot Admin other than RMS type.Please select other Role",
        "user_existed": "User is already assigned for same Business Partner",
        "inactive_user": "User is Inactive.Please contact Administrator",
        "user_existed_add": "User already existed.You can add to this Business Partner",
        "user_added": "User is successfully added",
        "edit_user": "User is successfully updated",
        "user_delete": "User is successfully removed",
        "reset_link": "Reset Password link is successfully sent to the user"

    }

    business_settings = {
        "settings_msg": "This input is required",
        "settings_success": "Settings updated successfully",
        "settings_msg_invalid": "Please enter valid data",
        "settings_msg_num_invalid": "Enter only number ",
        "settings_swal": "You can access this business place, only from configured IP address(s)",
        "settings_swal_org": "You can access this organization, only from configured IP address(s)",
        "settings_mismatch": "Are you sure to change current threshold limit",
        "settings_round_off": "Are you sure to change current value round off",
        "settings_auto_save": "Are you sure you want to update the setting ?",
        "settings_pp": "Are you sure to change the value",
        "settings_pp_max_failed": "Password must be max of 15 characters",
        "settings_pp_min_failed": "Password must be min of 6 characters",


    }
    
    check_box_error ={
        "select_msg":"Please select only one ",  
        "select_atleast_msg":"Please select atleast one ",  
    }
    configError={
        "group_name":"Please enter Group Name",
        "desc_req":"Please enter Description"    
    }
    oneTimeCustomer={
        "firstname":"Please enter First Name",
        "lasttname":"Please enter Last Name",
        "gstnNumber": "Please Enter GST Number",
        "panNumber": "Please enter PAN Number",
        "mobile": "Please enter Mobile Number",
        "email": "Please enter Email",
        "panNum_invalid_error": "Please enter a valid PAN",
        "gstnNumber_invalid_error": "Please enter a valid GSTN Number",
        "email_invalid_error": "Please enter a valid Email",
        "mobile_invalid_error": "Please enter a valid Mobile",
        "houseNum":"Please enter House Number",
        "country":"Please select country",
        "state":"Please select State",
        "city":"Please select city",
        "postalcode":"Please enter postcode",
        "postcode_invalid_error":"Please enter a valid postcode",
        "drugLcnNumber":"Please enter Drug Licence Number",
        "streetNo":"Please enter street number"
    }
    delarwisereposrt_msg = {
        "plant":"Please enter plant",
        "billing_date":"Please select billing date",
        "customer_name":"Please enter customer name",
        "dis_chanel":"Please enter distribution chanel"
    }
    pendingReportMessages = {
        "plant":"Please enter plant",
        "dlv_date":"Please select billing date",
        "customer_name":"Please enter customer name",
        "sonum":"Please enter SO number",
        "materialNum":"Please enter material number"
    }
}
