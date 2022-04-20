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
            <div className={styles.noteListItem}>
                <a href={link}>
                    <div className={styles.noteListItemEffectBottom}></div>
                    <div className={styles.noteListItemEffectTop}></div>

                    <header className={styles.noteHeader}>
                        <h2 className="note-title-heading">{title}</h2>
                    </header>
                    <main className={styles.noteBody}> {description} </main>
                </a>
            </div>
        </li>
    </>);
};

export default NoteListItem;