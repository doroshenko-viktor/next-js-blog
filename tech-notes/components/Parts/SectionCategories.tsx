import { ReactNode } from "react"
import styles from './SectionCategories.module.css';

type Props = {
    children: ReactNode[] | ReactNode
}

export const SectionCategories: React.FC<Props> = ({ children }) => {
    return <>
        <section className={styles.sectionCategories}>
            {children}
        </section>
    </>
}; 