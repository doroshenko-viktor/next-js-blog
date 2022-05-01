import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, GetStaticPropsResult } from "next";
import Head from "next/head";
import { BuildTimeError } from "../../lib/errors";
import * as notesService from '../../lib/notes';
import * as assetService from '../../lib/assets';
import { NoteContent } from "../../lib/types";
import { MainSection } from "../../components/Parts/MainSection";
import Link from "next/link";
import { NoteFormattedContent } from "../../components/Notes/NoteFormattedContent";
import { TextHeader } from "../../components/Header";
import { SingleColumnLayout } from "../../components/Layouts";

type Props = {
    note: NoteContent;
    noteKey: string[];
};

const Note: React.FC<Props> = ({ note }) => {
    return (<>
        <Head>
            <title>{note.title}</title>
            <link rel="icon" href="/images/favicon.ico" />
        </Head>
        <SingleColumnLayout>
            <div>

                <Link href='/'>
                    <a>
                        <TextHeader title="Tech Notes" />
                    </a>
                </Link>
            </div>
            <NoteFormattedContent content={note.content} />
        </SingleColumnLayout>
    </>);
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await notesService.getAllNotesPaths();
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