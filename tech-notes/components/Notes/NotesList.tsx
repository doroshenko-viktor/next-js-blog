import { NoteData } from "../../types/notes";
import NoteListItem from "./NoteListItem";
import styles from './NotesList.module.css';

type Props = {
    values: NoteData[];
};

const NotesList: React.FC<Props> = ({ values }) => {
    return (<>
        <ul className={styles.notesList}>
            {
                values.map((noteData, index) => {
                    return <NoteListItem
                        key={noteData.id || index}
                        id={noteData.id}
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