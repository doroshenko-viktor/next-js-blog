import Link from 'next/link';
import styles from './NoteListItem.module.css';

type Props = {
    link: string;
    title: string;
    description: string;
};

const NoteListItem: React.FC<Props> = ({ link, title, description }) => {
    return (<>
        <li>
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