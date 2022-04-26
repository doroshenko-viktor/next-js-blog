import Link from 'next/link';
import styles from './CategoryItem.module.css';

type Props = {
    link: string;
    caption: string;
};

const CategoryItem: React.FC<Props> = ({ link, caption }: Props) => {
    return (<>
        <li>
            <Link href={link}>
                <a>
                    <div className={styles.categoryItem}>
                        {caption}
                    </div>
                </a>
            </Link>
        </li>
    </>);
};

export default CategoryItem;