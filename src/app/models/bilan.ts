export interface Bilan {
  id: bigint;
  date1: Date;
  date2: Date;
  stock: number;
  banque: number;
  caisse1: number;
  caisse2: number;
  actifDivers: number;
  capital: number;
  dgi: number;
  cnss: number;
  loyer: number;
  salaire: number;
  tva: number;
  chiffreAffaire: number;
  passifDivers: number;
  compteCourant: number;
  resultatPrecedent: number;
  resultat: number;
}

export function initObjectBilan(): Bilan {
  return {
    id: BigInt(0),
    date1: new Date(),
    date2: new Date(),
    stock: 0,
    banque: 0,
    caisse1: 0,
    caisse2: 0,
    actifDivers: 0,
    capital: 0,
    dgi: 0,
    cnss: 0,
    loyer: 0,
    salaire: 0,
    tva: 0,
    chiffreAffaire: 0,
    passifDivers: 0,
    compteCourant: 0,
    resultatPrecedent: 0,
    resultat: 0,
  };
}