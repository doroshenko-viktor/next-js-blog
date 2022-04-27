import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, GetStaticPropsResult } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as folders from '../../lib/folders';
import * as categoriesService from '../../lib/categories';
import * as notesService from '../../lib/notes';
import { NoteDescription, CategoryDescription } from '../../lib/types';
import path from 'path';

type Props = {
    notes: NoteDescription[],
    categories: CategoryDescription[],
};

const Folders: React.FC<Props> = ({ notes, categories }: Props) => {
    const router = useRouter();
    const currentPath = router.asPath;
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
        <button onClick={() => router.back()}><a>Back</a></button>
    </>);
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await folders.getFolderAssetPaths();
    return {
        paths: paths,
        fallback: false,
    };
};

type PageParams = {
    id?: string[]
};

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<Props>> => {
    // console.dir(params)
    // const { notes, categories } = await folders.getFolderAssetsSeparated(params?.id || []);
    // return {
    //     props: {
    //         files,
    //         dirs,
    //     }
    // }
    try {
        const { categories: categoriesFiles } = await folders
            .getFolderAssetsSeparated(params?.id || []);
        const categories = categoriesService.getCategoriesDescriptions(categoriesFiles);

        const pagePath = params?.id && path.join(...params.id) || '';
        console.log(`page path: ${pagePath}`);

        const notes = await notesService.getFolderNotesDetails(pagePath);
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
