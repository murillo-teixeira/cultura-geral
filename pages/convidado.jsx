import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import usePageVisibility from '../hooks/usePageVisibility';
import NameModal from '../components/NameModal';

export default function Responses({ question_type, number_of_participants, server, reset_state, participantes, convidados }) {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isButtonCooldown, setIsButtonCooldown] = useState(false);
  const [wasPageOnBackground, setWasPageOnBackground] = useState('n');
  const [cheatingAlertWasSent, setCheatingAlertWasSent] = useState('n');

  const [showModal, setShowModal] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Function to handle selecting a name from the modal
  const handleSelectName = (name) => {
    const idx = convidados.indexOf(name)
    setSelectedGroup(idx + 11);
    closeModal();
  };

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
  }, []);

  // Save the selected group to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ccg2023-selected-group', selectedGroup);
  }, [selectedGroup]);

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
        { wasPageOnBackground == 'n' ? 
        (<>
        <img src='/logo_mc.svg'></img>
        <h1>CULTURA GERAL</h1>
        <h3>COMPETIÇÃO</h3>
        <div className="group-label">
          {selectedGroup ?
            <p>{convidados[selectedGroup - 11]}</p>
            : 
            <button onClick={openModal}>Selecione seu nome</button>  
          }
        </div>
        

        {showModal && (
          <NameModal names={convidados} onSelectName={handleSelectName} onClose={closeModal} />
        )}

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

  const question_type = data.values[0][0];
  const server = data.values[1][0];
  const reset_state = data.values[3][0];
  const number_of_participants = data.values[2][0];


  const range2 = 'Respostas!A3:D50';
  const res2 = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range2}?key=${apiKey}`); // URL da sua API Next.js
  const data2 = await res2.json();
  
  const participantes = data2.values.filter(item => item[3] === 'Participante').map(item => item[0]);;
  const convidados = data2.values.filter(item => item[3] === 'Convidado').map(item => item[0]);;
  
  return {
    props: {
      question_type, 
      number_of_participants,
      server,
      reset_state,
      participantes,
      convidados
    },
    revalidate: 5, // Atualiza a página a cada 10 segundos
  };
}
