import { useState, useEffect } from 'react';
import './atletas.css';
import logo from '../assets/logo.png';


const apiUrl = 'http://localhost:3000/atletas';

function AtletasForm({ handleSubmit, nome, setNome, idade, setIdade, posicao, setPosicao}) {
  
  return (
    <>
      <label htmlFor="nome">Nome</label>
      <input
        type="text"
        id="nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <label htmlFor="idade">Idade</label>
      <input
        type="text"
        id="idade"
        value={idade}
        onChange={(e) => setIdade(e.target.value)}
        required
      />
      <label htmlFor="posicao">Posicao</label>
      <input
        type="text"
        id="posicao"
        value={posicao}
        onChange={(e) => setPosicao(e.target.value)}
        required
      />
      <button type="submit">Adicionar Atleta</button>
    </>
  );
}

function AtletaEditForm({ handleSubmit, nome, setNome, idade, setIdade, posicao, setPosicao }) {
  return (
    <>
      <label htmlFor="nome">Nome</label>
      <input
        type="text"
        id="nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <label htmlFor="idade">Idade</label>
      <input
        type="text"
        id="idade"
        value={idade}
        onChange={(e) => setIdade(e.target.value)}
        required
      />
      <label htmlFor="posicao">Posicao</label>
      <input
        type="text"
        id="posicao"
        value={posicao}
        onChange={(e) => setPosicao(e.target.value)}
        required
      />
      <button type="submit">Salvar Dados</button>
    </>
  );
}

function AtletaTable({ atletas: atletas, handleDelete, handleEdit }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nome</th>
          <th>Idade</th>
          <th>Posicao</th>
          <th>Excluir</th>
          <th>Editar</th>
        </tr>
      </thead>
      <tbody>
        {atletas.map((atletas) => (
          <tr key={atletas.id}>
            <td>{atletas.id}</td>
            <td>{atletas.nome}</td>
            <td>{atletas.idade}</td>
            <td>{atletas.posicao}</td>
            <td>
              <button onClick={() => handleDelete(atletas.id)}>Excluir</button>
            </td>
            <td>
              <button onClick={() => handleEdit(atletas)}>Editar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function App() {
  const [atletas, setAtletas] = useState([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [posicao, setPosicao] = useState('');
  const [filtro, setFiltro] = useState('');
  const [editando, setEditando] = useState(false);
  const [atletaEditando, setAtletaEditando] = useState({});
  const [filtroPosicao, setFiltroPosicao] = useState('');

  useEffect(() => {
    async function fetchAtletas() {
      let endpoint = apiUrl;
      if (filtro || filtroPosicao) {
        endpoint = `${apiUrl}?nome_like=${filtro}&posicao_like=${filtroPosicao}`;
      }
      const response = await fetch(endpoint);
      const data = await response.json();
      setAtletas(data);
    }
    fetchAtletas();
  }, [filtro, filtroPosicao]);
  

async function handleAddAtleta(e) {
  e.preventDefault();
  const atletaExistente = atletas.find(a => a.posicao === posicao);
  if (atletaExistente) {
    alert("Esse atleta já está cadastrado!");
    return;
  }
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome,
      idade,
      posicao
    })
  });
  const data = await response.json();
  setAtletas([...atletas, data]);
  setNome('');
  setIdade('');
  setPosicao('');
}


  async function handleEditAtleta(e) {
    e.preventDefault();
    const response = await fetch(`${apiUrl}/${atletaEditando.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome,
        idade,
        posicao
      })
    });
    const data = await response.json();
    const index = atletas.findIndex(a => a.id === data.id);
    const newAtleta = [...atletas];
    newAtleta[index] = data;
    setAtletas(newAtleta);
    setNome('');
    setIdade('');
    setPosicao('');
    setEditando(false);
    setAtletaEditando({});
  }

  async function handleDelete(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      const newAtleta = atletas.filter((atleta) => atleta.id !== id);
      setAtletas(newAtleta);
    }
  }

  function handleEdit(atleta) {
    setEditando(true);
    setAtletaEditando(atleta);
    setNome(atleta.nome);
    setIdade(atleta.idade);
    setPosicao(atleta.posicao);
  }

  return (
    <>
      <div className="container">
        <img src={logo} alt="Logo" className="logo" />
        <form className="form" onSubmit={editando ? handleEditAtleta : handleAddAtleta}>
          {editando ? (
            <AtletaEditForm
              handleSubmit={handleEditAtleta}
              nome={nome}
              setNome={setNome}
              idade={idade}
              setIdade={setIdade}
              posicao={posicao}
              setPosicao={setPosicao}
            />
          ) : (
            <AtletasForm
              handleSubmit={handleAddAtleta}
              nome={nome}
              setNome={setNome}
              idade={idade}
              setIdade={setIdade}
              posicao={posicao}
              setPosicao={setPosicao}
            />
          )}
        </form>
        <div>
          <label htmlFor="filtro">Filtrar por nome:</label>
          <input
            type="text"
            id="filtro"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <div>
        <label htmlFor="posicaoFiltro">Filtrar por posição: </label>
          <input
            type="text"
            id="posicaoFiltro"
            value={filtroPosicao}
            onChange={(e) => setFiltroPosicao(e.target.value)}
          />
        </div>
        <AtletaTable atletas={atletas} handleDelete={handleDelete} handleEdit={handleEdit} />
      </div>
    </>
  );
}

export default App;