import styles from './NoteFormattedContent.module.css';

type Props = {
    title: string;
    content: string;
};

export const NoteFormattedContent: React.FC<Props> = ({ title, content }) => {
    return (<>
        <h1>{title}</h1>
        <article
            className={styles.note}
            dangerouslySetInnerHTML={{ __html: content }}
        ></article>
    </>);
};