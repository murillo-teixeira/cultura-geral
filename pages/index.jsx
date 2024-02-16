import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import usePageVisibility from '../hooks/usePageVisibility';

export default function Home({  }) {

  return (
    <div>
      <Head>
        <title>Pontuação - Competição Geral</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700;900&display=swap" rel="stylesheet"/>
        <link rel="shortcut icon" href="/logo_mc_preto.svg" />

      </Head>
      <main>

      <Link href={"/"}><span>🔠</span></Link>
        <img src='/logo_mc.svg'></img>
        <h1>TESTE</h1>
        <h3>COMPETIÇÃO</h3>
    </main>
    </div>
  );
}
