class Globals {

}

class DevelopmentGlobals extends Globals {
    public urls = {
        
        categoryCoupons: "http://localhost:8080/guest/get/coupons/category/",
        login: "http://localhost:8080/login",
        guestAddCustomer: "http://localhost:8080/guest/add/customer",
        images: "http://localhost:8080/",

        // admin globals
        addCompany: "http://localhost:8080/admin/add/company/",
        getCompanies: "http://localhost:8080/admin/get/companies/",
        deleteCompanies: "http://localhost:8080/admin/delete/company/",
        updateCompany: "http://localhost:8080/admin/update/company",
        addCustomer: "http://localhost:8080/admin/add/customer",
        getCustomers: "http://localhost:8080/admin/get/customers",
        updateCustomer: "http://localhost:8080/admin/update/customer",
        deleteCustomer: "http://localhost:8080/admin/delete/customer/",

        // company globals 
        getCompanyCoupons: "http://localhost:8080/company/get/company-coupons",
        addCoupon: "http://localhost:8080/company/add-coupon",
        deleteCoupon: "http://localhost:8080/company/delete-coupon/",
        updateCoupon: "http://localhost:8080/company/update/coupon",

        //customer globals
        purchaseCoupon: "http://localhost:8080/customer/purchase",
        getCustomerDetails: "http://localhost:8080/customer/details",
        getCustomerCoupons: "http://localhost:8080/customer/coupons"
        
    };
}
class ProductionGlobals extends Globals {
    public myUrl = "https://coupon-wonderland.herokuapp.com/"
    public urls = {
        categoryCoupons: this.myUrl + "guest/get/coupons/category/",
        login:  this.myUrl + "login",
        guestAddCustomer:  this.myUrl + "guest/add/customer",
        images: this.myUrl + "/",
        // images: "/couponProjectPhase3/src/main/resources/static/pics/",

        // admin globals
        addCompany:  this.myUrl + "admin/add/company/",
        getCompanies:  this.myUrl + "admin/get/companies",
        deleteCompanies:  this.myUrl + "admin/delete/company/",
        updateCompany:  this.myUrl + "admin/update/company",
        addCustomer:  this.myUrl + "admin/add/customer",
        getCustomers:  this.myUrl + "admin/get/customers",
        updateCustomer:  this.myUrl + "admin/update/customer",
        deleteCustomer:  this.myUrl + "admin/delete/customer/",

        // company globals 
        getCompanyCoupons:  this.myUrl + "company/get/company-coupons",
        addCoupon:  this.myUrl + "company/add-coupon",
        deleteCoupon:  this.myUrl + "company/delete-coupon/",
        updateCoupon:  this.myUrl + "company/update/coupon",
        

        //customer globals
        purchaseCoupon:  this.myUrl + "customer/purchase",
        getCustomerDetails:  this.myUrl + "customer/details",
        getCustomerCoupons:  this.myUrl + "customer/coupons"
    };
}

const globals = process.env.NODE_ENV === "development" ? new DevelopmentGlobals() : new ProductionGlobals();
export default globals;