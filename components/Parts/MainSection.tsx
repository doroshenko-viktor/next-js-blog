import { ReactNode } from "react";
import styles from './MainSection.module.css';

type Props = {
    children: ReactNode[] | ReactNode,
};

export const MainSection: React.FC<Props> = ({ children }) => {
    return (<>
        <main className={styles.sectionMain}>
            {children}
        </main>
    </>)
};

