type Props = {
    content: string;
};

export const NoteFormattedContent: React.FC<Props> = ({ content }) => {
    return (<>
        <article dangerouslySetInnerHTML={{ __html: content }}></article>
    </>)
};