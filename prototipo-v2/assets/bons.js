const BONS_KEY = 'copaJp.bons.v3';

const DEMO_BONS = {
  1: [
    { nome:'Antônio Carvalho', escola:'Colégio Anglo', categoria:'SUB 12', modalidade:'Futsal', posicao:'Ala', gols:3, obs:'Hat-trick na estreia da copa.' },
    { nome:'Davi Alves', escola:'Instituto São José', categoria:'SUB 12', modalidade:'Futsal', posicao:'Atacante', gols:2, obs:'Decidiu o clássico no fim.' },
    { nome:'Eduardo Bertoluzzi', escola:'Colégio SEPP', categoria:'SUB 12', modalidade:'Futsal', posicao:'Fixo', gols:1, obs:'Muralha na defesa.' },
    { nome:'Gabriel Ristori', escola:'Colégio SEPP', categoria:'SUB 10', modalidade:'Futsal', posicao:'Goleiro', gols:0, obs:'Pegou pênalti nos segundos finais.' },
    { nome:'Arthur Peixoto', escola:'Instituto São José', categoria:'SUB 10', modalidade:'Futsal', posicao:'Atacante', gols:4, obs:'Artilheiro da rodada.' },
    { nome:'Isadora Lemos', escola:'Colégio Mater Dei', categoria:'SUB 17 FEMININO', modalidade:'Futsal', posicao:'Ala', gols:9, obs:'Recorde de gols na semana.' },
    { nome:'Pedro Augusto', escola:'Colégio Mater Dei', categoria:'SUB 14', modalidade:'Futsal', posicao:'Pivô', gols:5 },
    { nome:'Rafael Okuda', escola:'Colégio Fênix', categoria:'SUB 17', modalidade:'Futsal', posicao:'Ala', gols:5, obs:'Melhor em quadra na vitória por 8 a 3.' },
    { nome:'Miguel Prado', escola:'Colégio Poliedro', categoria:'SUB 12', modalidade:'Futsal', posicao:'Lateral', gols:2 },
    { nome:'Sofia Camargo', escola:'Instituto São José', categoria:'SUB 17 FEMININO', modalidade:'Futsal', posicao:'Fixo', gols:4 }
  ],
  2: [
    { nome:'Antônio Carvalho', escola:'Colégio Anglo', categoria:'SUB 12', modalidade:'Futsal', posicao:'Ala', gols:2, obs:'Segue decisivo na competição.' },
    { nome:'Nicolas Bardin', escola:'Instituto São José', categoria:'SUB 14', modalidade:'Futsal', posicao:'Pivô', gols:4 },
    { nome:'Théo Marques', escola:'Colégio Objetivo', categoria:'SUB 10', modalidade:'Futsal', posicao:'Atacante', gols:4 },
    { nome:'Manuela Prado', escola:'Colégio SEPP', categoria:'SUB 17 FEMININO', modalidade:'Futsal', posicao:'Ala', gols:6, obs:'Melhor em quadra.' },
    { nome:'Lucas Ferraz', escola:'Colégio Cassiano Ricardo', categoria:'SUB 14', modalidade:'Futsal', posicao:'Goleiro', gols:0, obs:'Fechou o gol na vitória por 5 a 0.' },
    { nome:'João Vitor Reis', escola:'Colégio Poliedro', categoria:'SUB 17', modalidade:'Futsal', posicao:'Fixo', gols:3 },
    { nome:'Enzo Ribeiro', escola:'Colégio Mater Dei', categoria:'SUB 10', modalidade:'Futsal', posicao:'Ala', gols:3 },
    { nome:'Larissa Moraes', escola:'Colégio Objetivo', categoria:'SUB 17 FEMININO', modalidade:'Futsal', posicao:'Ponta', gols:5 },
    { nome:'Kaique Moraes', escola:'Colégio Adventista', categoria:'SUB 12', modalidade:'Futsal', posicao:'Zagueiro', gols:1, obs:'Gol no último segundo.' },
    { nome:'Murilo Sampaio', escola:'Tênis Clube SJC', categoria:'SUB 17', modalidade:'Futsal', posicao:'Goleiro', gols:0, obs:'Duas defesas decisivas.' }
  ]
};

function loadBons(){
  try{
    const raw = localStorage.getItem(BONS_KEY);
    if(!raw) return JSON.parse(JSON.stringify(DEMO_BONS));
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  }catch(e){ return JSON.parse(JSON.stringify(DEMO_BONS)); }
}

function saveBons(data){
  localStorage.setItem(BONS_KEY, JSON.stringify(data));
}

function getWeekBons(data, week){
  return Array.isArray(data[String(week)]) ? data[String(week)] : [];
}

function setWeekBons(data, week, list){
  data[String(week)] = list;
  saveBons(data);
}

function resetBons(){
  localStorage.removeItem(BONS_KEY);
  return JSON.parse(JSON.stringify(DEMO_BONS));
}

function initials(name){
  return String(name || '?').trim().split(/\s+/).slice(0,2).map(p => p[0]).join('').toUpperCase();
}

function countAll(data){
  return Object.keys(data).reduce((acc,k) => acc + (Array.isArray(data[k]) ? data[k].length : 0), 0);
}

function ultimaSemanaComDados(data, fallback){
  const semanas = Object.keys(data).map(Number).filter(w => getWeekBons(data, w).length);
  return semanas.length ? Math.max.apply(null, semanas) : fallback;
}
