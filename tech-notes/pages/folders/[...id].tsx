import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, GetStaticPropsResult } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as folders from '../../lib/folders';

type Props = {
    files: folders.FolderAsset[],
    dirs: folders.FolderAsset[],
};

const Folders: React.FC<Props> = ({ files, dirs }: Props) => {
    const router = useRouter();
    const currentPath = router.asPath;
    return (<>
        <h2>Folders:</h2>
        <ul>

            {dirs.map((dir, ind) => <Link key={ind} href={`${currentPath}/${encodeURIComponent(dir.name)}`}>
                <a>
                    <li >{dir.displayName}</li>
                </a>
            </Link>)}

        </ul>

        <h2>Files:</h2>
        <ul>
            {files.map((file, ind) => <li key={ind}>{file.displayName}</li>)}
        </ul>
        <button onClick={() => router.back()}><a>Back</a></button>
    </>);
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await folders.getFolderAssetPaths();
    console.dir(paths);
    return {
        paths: paths,
        fallback: false,
    };
};

type PageParams = {
    id?: string[]
};

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<Props>> => {
    console.dir(params)
    const { notes, categories } = await folders.getFolderAssetsSeparated(params?.id || []);
    return {
        props: {
            files,
            dirs,
        }
    }
};

export default Folders;
