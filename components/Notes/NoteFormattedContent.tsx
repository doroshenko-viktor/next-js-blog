import styles from './NoteFormattedContent.module.css';

type Props = {
    content: string;
};

export const NoteFormattedContent: React.FC<Props> = ({ content }) => {
    return (<article
        className={styles.note}
        dangerouslySetInnerHTML={{ __html: content }}
    ></article>)
};