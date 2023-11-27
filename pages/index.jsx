import Head from 'next/head';
import Link from 'next/link';

export default function Home({ sheetData }) {
  // Client-side JavaScript to refresh the page every 5 seconds
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

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
      case '3°': return '#C18D3D';   // Color for 2nd position
      
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
      <Link href="/responder"><span>🔠</span></Link>
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
            {sheetData.map((row, index) => (
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
  console.log(data)

  const headers = data.values[0];
  const sheetData = data.values.slice(1).map(row => {
    let rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index] || '';
    });
    return rowData;
  });

  return {
    props: {
      sheetData,
    },
    revalidate: 10, // Atualiza a página a cada 10 segundos
  };
}
