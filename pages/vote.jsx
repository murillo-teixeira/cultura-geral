import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import usePageVisibility from '../hooks/usePageVisibility';

export default function Home({ data, server }) {

    const [selectedNames, setSelectedNames] = useState([]);

    const handleCheckboxChange = (name) => {
        if (selectedNames.includes(name)) {
            setSelectedNames(selectedNames.filter((selected) => selected !== name));
        } else if (selectedNames.length < 3) {
            setSelectedNames([...selectedNames, name]);
        }
    };
  
    
  const handleSubmit = () => {
    console.log(selectedNames)
    // Create a POST request with the selected group and answer
    if (selectedNames.length < 3) 
      alert("Selecione 3 participantes!")
    else {
      const requestBody = {
        names: selectedNames,
      };

      // Send the POST request to your desired endpoint
      fetch(server + '/vote', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Voto enviado!")
          console.log('Response:', data);
        })
        .catch((error) => {
          alert("O servidor está fechado!")
          console.error('Error:', error);
        });
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
        <img src='/logo_mc.svg'></img>
        <h1>CULTURA GERAL</h1>
        <h3>COMPETIÇÃO</h3>
        <table className='voting-table'>
          <thead>
            <tr>
              <th>Escolha</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            {data.values.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(row[0])}
                    checked={selectedNames.includes(row[0])}
                  />
                </td>
                <td>{row[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="submit-button" onClick={handleSubmit}>
          Enviar
        </button>
    </main>
    </div>
  );
}

export async function getStaticProps() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  
  const range = 'Votacao!A1:A20';
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`); // URL da sua API Next.js
  const data = await res.json();

  const range2 = 'Atual!B1:B6';
  const res2 = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range2}?key=${apiKey}`); // URL da sua API Next.js
  const data2 = await res2.json();
  const server = data2.values[1][0];

  return {
    props: {
        data,
        server
    },
    revalidate: 5, // Atualiza a página a cada 10 segundos
  };
}
