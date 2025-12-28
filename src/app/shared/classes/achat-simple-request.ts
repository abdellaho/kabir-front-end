import { AchatSimple } from "@/models/achat-simple";
import { DetAchatSimple } from "@/models/det-achat-simple";

export interface AchatSimpleRequest {
    achatSimple: AchatSimple;
    detAchatSimples: DetAchatSimple[];
}