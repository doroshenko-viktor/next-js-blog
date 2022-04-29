import Image from 'next/image';
import Link from 'next/link';
import styles from './MainHeader.module.css';

type Props = {
    title: string;
};

const MainHeader: React.FC<Props> = ({ title }) => {
    return (
        <header className={styles.mainHeader}>
            <div className={styles.mainLogoImg}>
                <Image width='100%' height='100%' src="/images/profile-pic.png" alt="main logo image" />
            </div>
            <h1 className={styles.blogName}>{title}</h1>
        </header>
    );
};

export default MainHeader;