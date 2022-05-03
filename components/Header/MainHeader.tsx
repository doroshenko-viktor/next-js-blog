import Image from 'next/image';
import styles from './Header.module.css';

type Props = {
    title: string;
    size: 'x' | 'm' | 's'
};

const getHeaderClassName = (size: 'x' | 'm' | 's') => {
    if (size === 'x') return styles.mainHeaderX;
    if (size === 'm') return styles.mainHeaderM;
    if (size === 's') return styles.mainHeaderS;
};

const MainHeader: React.FC<Props> = ({ title, size }) => {
    return (
        <header className={styles.mainHeader + ' ' + getHeaderClassName(size)}>
            <div className={styles.mainLogoImg}>
                <Image width='100%' height='100%' src="/images/profile-pic.png" alt="main logo image" />
            </div>
            <h1 className={styles.blogName}>{title}</h1>
        </header>
    );
};

export default MainHeader;