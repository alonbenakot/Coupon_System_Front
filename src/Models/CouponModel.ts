import CompanyModel from "./CompanyModel";

class CouponModel {
    public id: number;
    public category: Category;
    public title: string;
    public description: string;
    public startDate: Date;
    public endDate: Date;
    public amount: number;
    public price: number;
    public company: CompanyModel;
    public image: FileList; 
    public imageName: string;
    public token: string;
}
export enum Category {
    FOOD = "FOOD", ELECTRICITY = "ELECTRICITY", RESTAURANT = "RESTAURANT", VACATION = "VACATION",
    HYGIENE_PRODUCTS = "HYGIENE_PRODUCTS", TRANSPORT = "TRANSPORT", MAGIC = "MAGIC"
}

export default CouponModel;