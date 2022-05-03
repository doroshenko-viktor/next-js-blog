import styles from './NoteFormattedContent.module.css';

type Props = {
    title: string;
    content: string;
};

export const NoteFormattedContent: React.FC<Props> = ({ title, content }) => {
    return (<>
        <h1 className={styles.noteTitle}>{title}</h1>
        <article
            className={styles.note}
            dangerouslySetInnerHTML={{ __html: content }}
        ></article>
    </>);
};