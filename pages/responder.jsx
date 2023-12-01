import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import usePageVisibility from '../hooks/usePageVisibility';


export default function Responses({ question_type, server, reset_state }) {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isButtonCooldown, setIsButtonCooldown] = useState(false);
  const [wasPageOnBackground, setWasPageOnBackground] = useState(false);

  usePageVisibility(setWasPageOnBackground);
  
  useEffect(() => {
    if (reset_state === 'ok') {
      console.log(reset_state)
      console.log(wasPageOnBackground)
      setWasPageOnBackground(false);
    }
  }, [reset_state]);

  useEffect(() => {
    if (wasPageOnBackground) {
      console.log('Sending state change to backend');
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
  }, []);

  // Save the selected group to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ccg2023-selected-group', selectedGroup);
  }, [selectedGroup]);

  const handleGroupSelect = (group) => {
    if (selectedAnswer === group) {
      setSelectedGroup(null);
    } else {
      setSelectedGroup(group);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer === answer) {
      setSelectedAnswer(null);
    } else {
      setSelectedAnswer(answer);
    }
  };

  const handleAnswerChange = (event) => {
    // Update the text answer state when the text input changes
    setSelectedAnswer(event.target.value);
  };

  const handleSubmit = () => {
    if (isButtonCooldown) {
      alert('Por favor, aguarde 2 segundos antes de enviar novamente.');
      return;
    }
    // Create a POST request with the selected group and answer
    if(!selectedGroup || !selectedAnswer) 
      alert("Verifique se ambos os campos estão preenchidos")
    else {
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
          alert("Resposta enviada!")
          console.log('Response:', data);
        })
        .catch((error) => {
          alert("O servidor está fechado!")
          console.error('Error:', error);
        });
      
        // Set button to cooldown state
      setIsButtonCooldown(true);

      // Reset cooldown state after 2 seconds
      setTimeout(() => setIsButtonCooldown(false), 2000);
    }
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
        { !wasPageOnBackground ? 
        (<>
        <img src='/logo_mc.svg'></img>
        <h1>CULTURA GERAL</h1>
        <h3>COMPETIÇÃO</h3>
        <div className="group-label">Selecione a equipa</div>
        <div className="button-container">
          <div className="button-row">
            {[1, 2, 3, 4, 5].map((buttonId) => (
              <button
                key={buttonId}
                value={selectedGroup}
                className={selectedGroup == buttonId ? 'selected-button' : 'unselected-button'}
                onClick={() => handleGroupSelect(buttonId)}
                disabled={selectedGroup > 0}
              >
                {buttonId}
              </button>
            ))}
          </div>
          <div className="button-row">
            {[6, 7, 8, 9, 10].map((buttonId) => (
              <button
                key={buttonId}
                value={selectedGroup}
                className={selectedGroup == buttonId ? 'selected-button' : 'unselected-button'}
                onClick={() => handleGroupSelect(buttonId)}
                disabled={selectedGroup > 0}
              >
                {buttonId}
              </button>
            ))}
          </div>
        </div>
        {question_type == 'M' ? (<>
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
                </>
        ) : (
          // Render the text input when question_type is 'A'
          <><div className="answer-label">Digite a resposta:</div>
          <div className="text-answer-container">
            <input
              type="text"
              onChange={handleAnswerChange}
              className="text-answer-input"
            />
          </div>
          </>
        )}
      
        <button className="submit-button" disabled={isButtonCooldown} onClick={handleSubmit}>
          Enviar
        </button>
        </>)
        :
        <div className='eliminado'>Eliminado</div>  
      }
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const range = 'Atual!B1:B4';

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`); // URL da sua API Next.js
  
  const data = await res.json();
  console.log(data)

  const question_type = data.values[0][0];
  const server = data.values[1][0];
  const reset_state = data.values[3][0]

  return {
    props: {
      question_type, 
      server,
      reset_state
    },
    revalidate: 5, // Atualiza a página a cada 10 segundos
  };
}
