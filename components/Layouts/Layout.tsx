import { ReactNode } from "react"
import styles from './Layout.module.css';

type Props = {
    children: ReactNode[] | ReactNode,
}

export const Layout: React.FC<Props> = ({ children }) => {
    return (
        <div className={styles.frame}>
            {children}
        </div>
    );
}