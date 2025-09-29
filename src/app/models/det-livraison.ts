import { Livraison } from "./livraison";
import { Stock } from "./stock";

export interface DetLivraison {
  id: bigint;
  qteLivrer: number;
  champsRouge: number;
  remiseLivraison: number;
  prixVente: number;
  montantProduit: number;
  beneficeDH: number;
  benepourcentage: number;
  infinity: number;
  avecRemise: boolean;
  livraisonId: bigint;
  livraison?: Livraison | null;
  stockId: bigint;
  stock?: Stock | null;
}

export function initObjectDetLivraison(): DetLivraison {
  return {
    id: BigInt(0),
    qteLivrer: 0,
    champsRouge: 0,
    remiseLivraison: 0,
    prixVente: 0,
    montantProduit: 0,
    beneficeDH: 0,
    benepourcentage: 0,
    infinity: 0,
    avecRemise: false,
    livraisonId: BigInt(0),
    livraison: null,
    stockId: BigInt(0),
    stock: null,
  };
}