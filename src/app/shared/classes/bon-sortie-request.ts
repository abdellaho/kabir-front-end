import { BonSortie } from "@/models/bon-sortie";
import { DetailBonSortie } from "@/models/detail-bon-sortie";

export interface BonSortieRequest {
    bonSortie: BonSortie;
    detailBonSorties: DetailBonSortie[];
}