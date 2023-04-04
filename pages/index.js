// import Head from 'next/head';
// import Layout, { siteTitle } from '../components/layout';
// import utilStyles from '../styles/utils.module.css';
// import { getSortedPostsData } from '../lib/posts';
// import Link from 'next/link';
// import Date from '../components/date';

// export async function getStaticProps() {
//   const allPostsData = getSortedPostsData();
//   return {
//     props: {
//       allPostsData,
//     },
//   };
// }

// export default function Home({allPostsData}) {
//   return (
//     <Layout home>
//       <Head>
//         <title>{siteTitle}</title>
//       </Head>
//       <section className={utilStyles.headingMd}>
//         <p>Experienced Data Scientist and Flutter Developer who strives to revolutionize the businesses with power of AI to develop state of 
// the art applications. Proven track record in delivering high-impact solutions through hypothesis-driven analysis and software 
// development. I am eager to leverage that approach at Sadiq</p>
//         <p>
//           (This is a sample website - you’ll be building a site like this on{' '}
//           <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
//         </p>
//       </section>

//       <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
//         <h2 className={utilStyles.headingLg}>Blog</h2>
//         <ul className={utilStyles.list}>
//           {allPostsData.map(({ id, date, title }) => (
//             <li className={utilStyles.listItem} key={id}>
//             <Link href={`/posts/${id}`}>{title}</Link>
//             <br />
//             <small className={utilStyles.lightText}>
//               <Date dateString={date} />
//             </small>
//           </li>
//           ))}
//         </ul>
//       </section>
//     </Layout>
//   );
// }

import Head from 'next/head'
import Link from 'next/link'
import { AppBar, Button, Toolbar, Typography } from '@mui/material'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Self Study App</title>
        <meta name="description" content="A self study app for learners" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Self Study App
          </Typography>
          <Link href="/login">
            <Button style={{ color: "white" }}>Login</Button>
          </Link>
          <Link href="/register">
            <Button style={{ color: "white" }}>Register</Button>
          </Link>
        </Toolbar>
      </AppBar>

      <main>
        <h1>Welcome to Self Study App</h1>
        <p>
          This is a self study app designed to help learners achieve their goals through self-directed learning.
        </p>
      </main>
    </div>
  )
}
