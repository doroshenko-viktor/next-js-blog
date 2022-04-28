import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, GetStaticPropsResult } from "next";
import Head from "next/head";
import path from "path";
import { BuildTimeError } from "../../lib/errors";
import * as notesService from '../../lib/notes';
import { NoteContent } from "../../lib/types";
import * as assetService from '../../lib/assets';
import { Layout } from "../../components/Parts/Layout";
import { MainSection } from "../../components/Parts/MainSection";
import NotesList from "../../components/Notes";
import MainHeader from "../../components/MainHeader";
import Link from "next/link";
import { SectionCategories } from "../../components/Parts/SectionCategories";
import Categories from "../../components/Categories";
import { NoteFormattedContent } from "../../components/Notes/NoteFormattedContent";

type Props = {
    note: NoteContent;
    noteKey: string[];
};

const Note: React.FC<Props> = ({ noteKey, note }) => {
    return (<>
        <Head>
            <title>{note.title}</title>
            <link rel="icon" href="/images/favicon.ico" />
        </Head>
        <Layout>
            <MainSection>
                <Link href='/'>
                    <a>
                        <MainHeader title='Tech Notes' />
                    </a>
                </Link>
                <NoteFormattedContent content={note.content} />
            </MainSection>
        </Layout>
    </>);
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await notesService.getAllNotesPaths();
    console.log('paths')
    console.dir(paths);
    return {
        paths,
        fallback: false,
    }
};

type PageParams = {
    noteKey?: string[];
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<Props>> => {
    if (!params?.noteKey) throw new BuildTimeError("note ");
    const noteFileRelPath = assetService.getRelativeNoteFilePathFromLink(params.noteKey);
    const note = await notesService.getNoteContent(noteFileRelPath);

    return {
        props: {
            noteKey: params.noteKey,
            note,
        }
    };
};

export default Note;