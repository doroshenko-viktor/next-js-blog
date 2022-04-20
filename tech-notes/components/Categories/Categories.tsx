import CategoryItem from "./CategoryItem";
import { CategoryData } from "../../types/categories";
import styles from './Categories.module.css';

type Props = {
    values: CategoryData[]
};

const Categories: React.FC<Props> = ({ values }: Props) => {
    return (<>
        <ul className={styles.categories}>
            {
                values.map((categoryData, index) =>
                    <CategoryItem
                        key={categoryData.id || index}
                        link={categoryData.link}
                        caption={categoryData.caption}
                    />
                )
            }
        </ul>
    </>);
}

export default Categories;