import CategoryItem from "./CategoryItem";
import styles from './Categories.module.css';
import { CategoryDescription } from "../../lib/types";

type Props = {
    values: CategoryDescription[]
};

const Categories: React.FC<Props> = ({ values }: Props) => {
    return (<>
        <ul className={styles.categories}>
            {
                values.map((categoryData, index) =>
                    <CategoryItem
                        key={index}
                        link={categoryData.link}
                        caption={categoryData.title}
                    />
                )
            }
        </ul>
    </>);
}

export default Categories;