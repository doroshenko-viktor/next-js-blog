import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, GetStaticPropsResult } from 'next';
import Link from 'next/link';
import folders, { FolderAsset } from '../../lib/folders';

type Props = {
    files: FolderAsset[],
    dirs: FolderAsset[],
};

const Folders: React.FC<Props> = ({ files, dirs }: Props) => {
    return (<>
        <h2>Folders:</h2>
        <ul>

            {dirs.map((dir, ind) => <Link key={ind} href={`/folders/${encodeURIComponent(dir.name)}`}>
                <a>
                    <li >{dir.displayName}</li>
                </a>
            </Link>)}

        </ul>

        <h2>Files:</h2>
        <ul>
            {files.map((file, ind) => <li key={ind}>{file.displayName}</li>)}
        </ul>
    </>);
};

export const getStaticProps: GetStaticProps = async (): Promise<GetStaticPropsResult<Props>> => {
    const { files, dirs } = await folders.getFolderDetails([]);
    return {
        props: {
            files,
            dirs,
        }
    }
};

export default Folders;
