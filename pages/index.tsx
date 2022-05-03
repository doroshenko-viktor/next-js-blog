import type { GetStaticPropsResult, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import Categories from '../components/Categories';
import NotesList from '../components/Notes';
import styles from './Home.module.css';
import * as foldersService from '../lib/folders';
import * as notesService from '../lib/notes';
import * as categoriesService from '../lib/categories';
import { CategoryDescription, NoteDescription } from '../lib/types';
import { MainHeader } from '../components/Header';

type Props = {
  categories: CategoryDescription[],
  notes: NoteDescription[]
}

const Home: NextPage<Props> = ({ categories, notes }) => {
  return (
    <>
      <Head>
        <title>Tech Notes</title>
        <link rel="icon" href="/images/favicon.ico" />
      </Head>

      <div className={styles.frame}>
        <section className={styles.sectionCategories}>
          <Categories values={categories} />
        </section>

        <main className={styles.sectionMain}>

          <Link href='/'>
            <a>
              <MainHeader title='Tech Notes' size='x' />
            </a>
          </Link>

          <div class={styles.notesList}>
            <NotesList values={notes} />
          </div>
        </main>
      </div>
    </>
  )
}

export const getStaticProps = async (): Promise<GetStaticPropsResult<Props>> => {
  try {
    const { categories: categoriesFiles } = await foldersService.getFolderAssetsSeparated([]);
    const categories = categoriesService.getCategoriesDescriptions(categoriesFiles);
    const lastNotes = await notesService.getLastNotesDetails(15);

    return {
      props: {
        notes: lastNotes,
        categories: categories,
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default Home
