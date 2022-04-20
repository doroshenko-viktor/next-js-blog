import Link from 'next/link';
import styles from './NoteListItem.module.css';

type Props = {
    id: string | number;
    link: string;
    title: string;
    description: string;
};

const NoteListItem: React.FC<Props> = ({ id, link, title, description }) => {
    return (<>
        <li key={id}>
            <Link href={link} >
                <a>
                    <div className={styles.noteListItem}>
                        <header className={styles.noteHeader}>
                            <h2 className="note-title-heading">{title}</h2>
                        </header>
                        <main className={styles.noteBody}> {description} </main>
                    </div>
                </a>
            </Link>
        </li>
    </>);
};

export default NoteListItem;