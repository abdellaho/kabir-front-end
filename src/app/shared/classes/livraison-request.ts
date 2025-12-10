import { DetLivraison } from "@/models/det-livraison";
import { Livraison } from "@/models/livraison";

export interface LivraisonRequest {
    livraison: Livraison;
    detLivraisons: DetLivraison[];
}