import styles from './Header.module.css';

type Props = {
    title: string;
};

const TextHeader: React.FC<Props> = ({ title }) => {
    return (
        <header className={styles.mainHeader}>
            <h1 className={styles.blogName}>{title}</h1>
        </header>
    );
}

export default TextHeader;