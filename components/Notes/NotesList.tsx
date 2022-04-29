import { NoteDescription } from "../../lib/types";
import NoteListItem from "./NoteListItem";
import styles from './NotesList.module.css';

type Props = {
    values: NoteDescription[];
};

const NotesList: React.FC<Props> = ({ values }) => {
    return (<>
        <ul className={styles.notesList}>
            {
                values.map((noteData, index) => {
                    return <NoteListItem
                        key={noteData.link || index}
                        link={noteData.link}
                        title={noteData.title}
                        description={noteData.description}
                    />
                })
            }
        </ul>
    </>);
};

export default NotesList;