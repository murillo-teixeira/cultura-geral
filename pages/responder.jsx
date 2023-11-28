import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Responses({ question_type, server }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleGroupSelect = (group) => {
    if (selectedAnswer === group) {
      setSelectedGroup(null);
    } else {
      setSelectedGroup(group);
    }
  };

  const handleAnswerSelect = (answer, server) => {
    if (selectedAnswer === answer) {
      setSelectedAnswer(null);
    } else {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    // Create a POST request with the selected group and answer
    const requestBody = {
      group: selectedGroup,
      answer: selectedAnswer,
    };

    // Send the POST request to your desired endpoint
    fetch(server + '/submit', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Envio ok")
        console.log('Response:', data);
      })
      .catch((error) => {
        alert("Erro")
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <Head>
        <title>Responder - Competição Geral</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700;900&display=swap" rel="stylesheet"/>
        <link rel="shortcut icon" href="/logo_mc_preto.svg" />
      </Head>

      <main>
        <Link href="/"><span>🥇</span></Link>
        <img src='/logo_mc.svg'></img>
        <h1>CULTURA GERAL</h1>
        <h3>COMPETIÇÃO</h3>
        <div className="group-label">Selecione a equipa</div>
        <div className="button-container">
          <div className="button-row">
            {[1, 2, 3, 4, 5].map((buttonId) => (
              <button
                key={buttonId}
                className={selectedGroup === buttonId ? 'selected-button' : 'unselected-button'}
                onClick={() => handleGroupSelect(buttonId)}
              >
                {buttonId}
              </button>
            ))}
          </div>
          <div className="button-row">
            {[6, 7, 8, 9, 10].map((buttonId) => (
              <button
                key={buttonId}
                className={selectedGroup === buttonId ? 'selected-button' : 'unselected-button'}
                onClick={() => handleGroupSelect(buttonId)}
              >
                {buttonId}
              </button>
            ))}
          </div>
        </div>
        {/* <div className="question-label">{question_name}</div> */}
        <div className="answer-label">Selecione a resposta</div>
        <div className="answer-container">
          <div className="answer-row">
            {['A', 'B'].map((answer) => (
              <button
                key={answer}
                className={selectedAnswer === answer ? 'selected-answer' : 'unselected-answer'}
                onClick={() => handleAnswerSelect(answer)}
              >
                {answer}
              </button>
            ))}
          </div>
          <div className="answer-row">
            {['C', 'D'].map((answer) => (
              <button
                key={answer}
                className={selectedAnswer === answer ? 'selected-answer' : 'unselected-answer'}
                onClick={() => handleAnswerSelect(answer)}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
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
  const range = 'Atual!B1:B2';

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`); // URL da sua API Next.js
  
  const data = await res.json();
  console.log(data)

  const question_type = data.values[0][0];
  const server = data.values[1][0];

  console.log(question_type, server)

  return {
    props: {
      question_type, server
    },
    revalidate: 10, // Atualiza a página a cada 10 segundos
  };
}
