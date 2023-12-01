import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import usePageVisibility from '../hooks/usePageVisibility';

export default function Home({ sheetData, number_of_participants, reset_state, server }) {
  const [isGuest, setIsGuest] = useState(false);
  const [wasPageOnBackground, setWasPageOnBackground] = useState('n');
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [cheatingAlertWasSent, setCheatingAlertWasSent] = useState('n');

  usePageVisibility(setWasPageOnBackground);
  
  useEffect(() => {
    if (reset_state === 'on') {
      setWasPageOnBackground('n');
      setCheatingAlertWasSent('n')
      localStorage.setItem('ccg2023-eliminated', 'n');
      localStorage.setItem('ccg2023-eliminated-alert', 'n');
    }
  }, [reset_state]);

  useEffect(() => {
    if (wasPageOnBackground == 'y') {
      localStorage.setItem('ccg2023-eliminated', 'y');
    }
    if (wasPageOnBackground == 'y' && cheatingAlertWasSent == 'n') {
      setCheatingAlertWasSent('y');
      localStorage.setItem('ccg2023-eliminated-alert', 'y');
      const requestBody = {
        group: selectedGroup,
      };

      // Send the POST request to your desired endpoint
      fetch(server + '/cheater', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Response:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

    }
  }, [wasPageOnBackground]);

  // Load the selected group from localStorage when the component mounts
  useEffect(() => {
    const savedGroup = localStorage.getItem('ccg2023-selected-group');
    if (savedGroup > 0) {
      setSelectedGroup(savedGroup);
    }
    const eliminated = localStorage.getItem('ccg2023-eliminated');
    setWasPageOnBackground(eliminated);

    const eliminatedAlert = localStorage.getItem('ccg2023-eliminated-alert');
    setCheatingAlertWasSent(eliminatedAlert);
    // if (eliminated == 'y') {
    //   setWasPageOnBackground('y');
    // }
  }, []);

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

  const range2 = 'Atual!B1:B4';

  const res2 = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range2}?key=${apiKey}`); // URL da sua API Next.js
  const data2 = await res2.json();
  const number_of_participants = data2.values[2][0];
  const reset_state = data2.values[3][0];
  const server = data2.values[1][0];

  return {
    props: {
      sheetData,
      number_of_participants,
      reset_state,
      server
    },
    revalidate: 5, // Atualiza a página a cada 10 segundos
  };
}
