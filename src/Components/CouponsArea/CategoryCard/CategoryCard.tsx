import { ReactNode } from "react";
import { Category } from "../../../Models/CouponModel";
import { Card, CardHeader } from '@material-ui/core';
import globals from "../../../Services/Globals";
import "./CategoryCard.css";

interface CategoryCardProps {
    category: Category;
    children: ReactNode;
}

/**
 * Displays a card according to the category.
 * @param props 
 * @returns 
 */
function CategoryCard(props: CategoryCardProps): JSX.Element {

    /**
     *  Manipulates a string, making each word begin with a capital letter followed by lower case letters.
     * @param categoryName 
     * @returns string
     */
    function niceString(categoryName: string): string {
        categoryName = categoryName.toLowerCase();
        categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        categoryName = categoryName.replace('_', ' ')
        let words = categoryName.split(' ');
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        return words.join(" ");
    }

    return (
        <div className="CategoryCard">
            <Card>
                <CardHeader title={props.children} subheader={niceString(props.category)} />
            </Card>


        </div>
    );
}

export default CategoryCard;
