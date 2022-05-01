import { GetStaticProps, GetStaticPropsResult } from 'next';
import Link from 'next/link';
import { CategoryDescription, NoteDescription } from '../../lib/types';
import * as folders from "../../lib/folders";
import * as categoriesService from '../../lib/categories';
import * as notesService from '../../lib/notes';

type Props = {
    notes: NoteDescription[],
    categories: CategoryDescription[],
};

const Folders: React.FC<Props> = ({ categories, notes }: Props) => {
    return (<>
        <h2>Folders:</h2>
        <ul>

            {categories.map((category, ind) => <Link key={ind} href={category.link}>
                <a>
                    <li >{category.title}</li>
                </a>
            </Link>)}

        </ul>

        <h2>Files:</h2>
        <ul>
            {notes.map((note, ind) => <li key={ind}>{note.title}</li>)}
        </ul>
    </>);
};

export const getStaticProps: GetStaticProps = async (): Promise<GetStaticPropsResult<Props>> => {
    try {
        const { categories: categoriesFiles } = await folders.getFolderAssetsSeparated([]);
        const categories = categoriesService.getCategoriesDescriptions(categoriesFiles);
        const notes = await notesService.getFolderNotesDetails("");
        return {
            props: {
                notes,
                categories,
            }
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export default Folders;
