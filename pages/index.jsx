import Head from 'next/head';

export default function Home({ sheetData }) {
  // Client-side JavaScript to refresh the page every 5 seconds
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }
  
  return (
    <div>
      <Head>
        <title>Google Sheets Data in Next.js</title>
      </Head>

      <main>
        <h1>Dados do Google Sheets</h1>
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
                {Object.values(row).map((cell, index) => (
                  <td key={index}>{cell}</td>
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
