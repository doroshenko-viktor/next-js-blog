import { ReactNode } from 'react';
import styles from './Layout.module.css';

type Props = {
    children: ReactNode[] | ReactNode;
};

const SingleCenteredColumnLayout: React.FC<Props> = ({ children }) => {
    return (
        <section className={styles.centeredSection}>
            {children}
        </section>
    );
}

export default SingleCenteredColumnLayout;