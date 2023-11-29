import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home({ sheetData, number_of_participants }) {
  const [isGuest, setIsGuest] = useState(false);
  
  // Client-side JavaScript to refresh the page every 5 seconds
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  useEffect(() => {
    const savedGroup = localStorage.getItem('ccg2023-selected-group');
    if (savedGroup && savedGroup > 10) {
      setIsGuest(true);
      console.log("Convidado");
    }
  }, []);

  // Function to render the colored circle
  const renderCircle = (position) => {
    const circleStyle = {
      backgroundColor: getColorForPosition(position), // Get color based on position
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
    };

    return <div style={circleStyle}>{position}</div>;
  };

  // Function to determine the color based on position
  const getColorForPosition = (position) => {
    switch (position) {
      case '1°': return '#D1B20D';    // Color for 1st position
      case '2°': return '#B7B6B4';   // Color for 2nd position
      case '3°': return '#C18D3D';   
      case '4°': return '#83bfea';
      case '5°': return '#83bfea';
      case '6°': return '#83bfea';
      
      // Add more cases as needed for different positions
      default: return 'white';     // Default color
    }
  };

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
      <Link href={isGuest ? "/convidado" : "/responder"}><span>🔠</span></Link>
        <img src='/logo_mc.svg'></img>
        <h1>CULTURA GERAL</h1>
        <h3>COMPETIÇÃO</h3>
        <table>
          <thead>
            <tr>
              {sheetData.length > 0 &&
                Object.keys(sheetData[0]).map((key, index) => (
                  <th key={index}>{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {sheetData.slice(0, number_of_participants).map((row, index) => (
              <tr key={index}>
                {Object.entries(row).map(([key, value], index) => (
                  <td key={index}>
                    <div>
                    {key === 'Posição' ? renderCircle(value) : value}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {sheetData.length > number_of_participants && (
        <>
        <div className="guests-label">Convidados</div>
        <table>
          <thead>
            <tr>
              {sheetData.length > 0 &&
                Object.keys(sheetData[0]).map((key, index) => (
                  <th key={index}>{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {sheetData.slice(number_of_participants, 20).map((row, index) => (
              <tr key={index}>
                {Object.entries(row).map(([key, value], index) => (
                  <td key={index}>
                    <div>
                    {key === 'Posição' ? renderCircle(value) : value}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const range = 'Pontuacao';

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`); // URL da sua API Next.js
  
  const data = await res.json();

  const headers = data.values[0];
  const sheetData = data.values.slice(1).map(row => {
    let rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index] || '';
    });
    return rowData;
  });

  const range2 = 'Atual!B3';

  const res2 = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range2}?key=${apiKey}`); // URL da sua API Next.js
  const data2 = await res2.json();
  const number_of_participants = data2.values[0][0];
  
  return {
    props: {
      sheetData,
      number_of_participants
    },
    revalidate: 5, // Atualiza a página a cada 10 segundos
  };
}
