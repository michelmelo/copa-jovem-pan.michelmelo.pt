const ESCOLAS = [
  'Instituto São José','Colégio SEPP','Colégio Mater Dei','Colégio Anchieta',
  'Colégio Objetivo','Colégio Anglo','Colégio Poliedro','Colégio Cassiano Ricardo',
  'Colégio Tableau','Colégio Contemporâneo','Colégio do Carmo','Colégio Adventista',
  'SESI SJC','Tênis Clube SJC','Colégio Nova Geração','Colégio Fênix'
];

const CATEGORIAS = ['SUB 10','SUB 12','SUB 14','SUB 17','SUB 17 FEMININO'];

const MODALIDADES = ['Futsal'];

const LOCAIS = [
  'Ginásio do Tênis Clube','Farma Conde Arena','Ginásio Teatrão','SESI São José dos Campos','Ginásio Municipal'
];

const HORARIOS = ['08:30','09:30','10:30','11:30','14:00','15:00','16:00','17:00'];

const SEMANA_ATUAL = 5;
const TOTAL_SEMANAS = 5;

function timesDaCategoria(categoria){
  return categoria === 'SUB 17 FEMININO' ? ESCOLAS.slice(0, 8) : ESCOLAS;
}

function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function roundRobin(teams){
  const n = teams.length;
  const arr = teams.slice();
  const rounds = [];
  for(let r = 0; r < n - 1; r++){
    const pairs = [];
    for(let i = 0; i < n / 2; i++) pairs.push([arr[i], arr[n - 1 - i]]);
    rounds.push(pairs);
    const rest = arr.slice(1);
    rest.unshift(rest.pop());
    for(let i = 0; i < rest.length; i++) arr[i + 1] = rest[i];
  }
  return rounds;
}

function dataISO(semana){
  const base = new Date(Date.UTC(2026, 3, 11));
  base.setUTCDate(base.getUTCDate() + (semana - 1) * 7);
  return base.toISOString().slice(0, 10);
}

function buildJogos(){
  const rng = mulberry32(20260411);
  const jogos = [];
  let id = 0;

  for(let semana = 1; semana <= TOTAL_SEMANAS; semana++){
    for(const categoria of CATEGORIAS){
      const rounds = roundRobin(timesDaCategoria(categoria));
      const rodada = rounds[(semana - 1) % rounds.length];

      for(const [casa, fora] of rodada){
        const gc = Math.floor(rng() * 9);
        const gf = Math.floor(rng() * 9);

        let status = 'encerrado';
        if(semana === SEMANA_ATUAL){
          const s = rng();
          status = s < 0.6 ? 'encerrado' : (s < 0.82 ? 'ao_vivo' : 'agendado');
        }

        jogos.push({
          id: ++id,
          semana,
          rodada: (semana - 1) % rounds.length + 1,
          data: dataISO(semana),
          hora: HORARIOS[Math.floor(rng() * HORARIOS.length)],
          local: LOCAIS[Math.floor(rng() * LOCAIS.length)],
          modalidade: MODALIDADES[0],
          categoria,
          casa,
          fora,
          golsCasa: status === 'agendado' ? null : gc,
          golsFora: status === 'agendado' ? null : gf,
          status
        });
      }
    }
  }

  jogos.sort((a, b) =>
    a.semana - b.semana ||
    CATEGORIAS.indexOf(a.categoria) - CATEGORIAS.indexOf(b.categoria) ||
    a.hora.localeCompare(b.hora));
  return jogos;
}

const JOGOS = buildJogos();

function computeStandings(jogos, categoria, modalidade){
  const tabela = new Map();
  const times = categoria ? timesDaCategoria(categoria) : ESCOLAS;

  for(const e of times){
    tabela.set(e, { escola: e, J: 0, V: 0, E: 0, D: 0, GP: 0, GC: 0, SG: 0, P: 0 });
  }

  for(const j of jogos){
    if(j.status === 'agendado') continue;
    if(categoria && j.categoria !== categoria) continue;
    if(modalidade && j.modalidade !== modalidade) continue;

    const c = tabela.get(j.casa), f = tabela.get(j.fora);
    if(!c || !f) continue;

    c.J++; f.J++;
    c.GP += j.golsCasa; c.GC += j.golsFora;
    f.GP += j.golsFora; f.GC += j.golsCasa;

    if(j.golsCasa > j.golsFora){ c.V++; f.D++; c.P += 3; }
    else if(j.golsCasa < j.golsFora){ f.V++; c.D++; f.P += 3; }
    else { c.E++; f.E++; c.P++; f.P++; }
  }

  const lista = [...tabela.values()];
  for(const t of lista) t.SG = t.GP - t.GC;
  lista.sort((a, b) => b.P - a.P || b.SG - a.SG || b.GP - a.GP || a.escola.localeCompare(b.escola));
  return lista;
}

const ARTILHEIROS = [
  { nome:'Arthur Peixoto', escola:'Instituto São José', categoria:'SUB 10', modalidade:'Futsal', gols:14, jogos:5 },
  { nome:'Enzo Ribeiro', escola:'Colégio Mater Dei', categoria:'SUB 10', modalidade:'Futsal', gols:13, jogos:5 },
  { nome:'Gabriel Ristori', escola:'Colégio SEPP', categoria:'SUB 10', modalidade:'Futsal', gols:12, jogos:5 },
  { nome:'Théo Marques', escola:'Colégio Objetivo', categoria:'SUB 10', modalidade:'Futsal', gols:11, jogos:5 },
  { nome:'Antônio Carvalho', escola:'Colégio Anglo', categoria:'SUB 12', modalidade:'Futsal', gols:17, jogos:5 },
  { nome:'Miguel Prado', escola:'Colégio Poliedro', categoria:'SUB 12', modalidade:'Futsal', gols:15, jogos:5 },
  { nome:'Davi Alves', escola:'Instituto São José', categoria:'SUB 12', modalidade:'Futsal', gols:14, jogos:5 },
  { nome:'Otávio Nunes', escola:'Colégio Tableau', categoria:'SUB 12', modalidade:'Futsal', gols:12, jogos:5 },
  { nome:'Eduardo Bertoluzzi', escola:'Colégio SEPP', categoria:'SUB 12', modalidade:'Futsal', gols:11, jogos:5 },
  { nome:'Pedro Augusto', escola:'Colégio Mater Dei', categoria:'SUB 14', modalidade:'Futsal', gols:19, jogos:5 },
  { nome:'Lucas Ferraz', escola:'Colégio Cassiano Ricardo', categoria:'SUB 14', modalidade:'Futsal', gols:16, jogos:5 },
  { nome:'Nicolas Bardin', escola:'Instituto São José', categoria:'SUB 14', modalidade:'Futsal', gols:15, jogos:5 },
  { nome:'Vinícius Alencar', escola:'Colégio Anchieta', categoria:'SUB 14', modalidade:'Futsal', gols:13, jogos:5 },
  { nome:'Caio Bittencourt', escola:'Colégio Objetivo', categoria:'SUB 14', modalidade:'Futsal', gols:12, jogos:5 },
  { nome:'Rafael Okuda', escola:'Colégio Fênix', categoria:'SUB 17', modalidade:'Futsal', gols:21, jogos:5 },
  { nome:'Heitor Sanches', escola:'Colégio SEPP', categoria:'SUB 17', modalidade:'Futsal', gols:18, jogos:5 },
  { nome:'João Vitor Reis', escola:'Colégio Poliedro', categoria:'SUB 17', modalidade:'Futsal', gols:16, jogos:5 },
  { nome:'Murilo Sampaio', escola:'Tênis Clube SJC', categoria:'SUB 17', modalidade:'Futsal', gols:14, jogos:5 },
  { nome:'Igor Salgado', escola:'Colégio Anglo', categoria:'SUB 17', modalidade:'Futsal', gols:12, jogos:5 },
  { nome:'Isadora Lemos', escola:'Colégio Mater Dei', categoria:'SUB 17 FEMININO', modalidade:'Futsal', gols:23, jogos:5 },
  { nome:'Sofia Camargo', escola:'Instituto São José', categoria:'SUB 17 FEMININO', modalidade:'Futsal', gols:20, jogos:5 },
  { nome:'Manuela Prado', escola:'Colégio SEPP', categoria:'SUB 17 FEMININO', modalidade:'Futsal', gols:18, jogos:5 },
  { nome:'Beatriz Nogueira', escola:'Colégio Anchieta', categoria:'SUB 17 FEMININO', modalidade:'Futsal', gols:15, jogos:5 },
  { nome:'Larissa Moraes', escola:'Colégio Objetivo', categoria:'SUB 17 FEMININO', modalidade:'Futsal', gols:13, jogos:5 },
  { nome:'Bruno Tavares', escola:'Colégio Adventista', categoria:'SUB 14', modalidade:'Futsal', gols:10, jogos:5 },
  { nome:'Felipe Andrade', escola:'SESI SJC', categoria:'SUB 12', modalidade:'Futsal', gols:10, jogos:5 },
  { nome:'Gustavo Rocha', escola:'Colégio do Carmo', categoria:'SUB 14', modalidade:'Futsal', gols:9, jogos:5 },
  { nome:'Henrique Lopes', escola:'Colégio Contemporâneo', categoria:'SUB 17', modalidade:'Futsal', gols:9, jogos:5 },
  { nome:'Samuel Duarte', escola:'Colégio Nova Geração', categoria:'SUB 10', modalidade:'Futsal', gols:8, jogos:5 },
  { nome:'Daniel Ambrósio', escola:'Tênis Clube SJC', categoria:'SUB 12', modalidade:'Futsal', gols:8, jogos:5 }
];

const DESTAQUES_RODADA = [
  { nome:'Isadora Lemos', escola:'Colégio Mater Dei', categoria:'SUB 17 FEMININO', feito:'9 gols em um único jogo', gols:9 },
  { nome:'Rafael Okuda', escola:'Colégio Fênix', categoria:'SUB 17', feito:'Melhor em quadra na vitória por 8 a 3', gols:5 },
  { nome:'Arthur Peixoto', escola:'Instituto São José', categoria:'SUB 10', feito:'Decidiu a final da rodada nos segundos finais', gols:4 },
  { nome:'Gabriel Ristori', escola:'Colégio SEPP', categoria:'SUB 10', feito:'Goleiro pegou pênalti e ainda marcou', gols:1 }
];

function computeChampions(jogos){
  const linhas = [];
  for(const categoria of CATEGORIAS){
    for(const modalidade of MODALIDADES){
      const t = computeStandings(jogos, categoria, modalidade);
      linhas.push({ categoria, modalidade, lider: t[0], vice: t[1] });
    }
  }
  return linhas;
}

function computeResumo(jogos){
  const jogados = jogos.filter(j => j.status !== 'agendado');
  const gols = jogados.reduce((s, j) => s + j.golsCasa + j.golsFora, 0);
  const goleada = jogados.slice().sort((a, b) =>
    (Math.abs(b.golsCasa - b.golsFora)) - (Math.abs(a.golsCasa - a.golsFora)))[0];
  const times = new Set();
  jogos.forEach(j => { times.add(j.casa); times.add(j.fora); });
  return {
    escolas: times.size,
    categorias: CATEGORIAS.length,
    modalidades: MODALIDADES.length,
    total: jogos.length,
    jogados: jogados.length,
    gols,
    media: jogados.length ? (gols / jogados.length).toFixed(1) : '0',
    goleada
  };
}
