import styles from './CategoryItem.module.css';

type Props = {
    link: string;
    caption: string;
};

const CategoryItem: React.FC<Props> = ({ link, caption }: Props) => {
    return (<>
        <li>
            <a href={link}>
                <div className={styles.categoryItem}>
                    {caption}
                </div>
            </a>
        </li>
    </>);
};

export default CategoryItem;