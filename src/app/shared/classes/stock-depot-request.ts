import { DetStockDepot } from "@/models/det-stock-depot";
import { StockDepot } from "@/models/stock-depot";

export interface StockDepotRequest {
    stockDepot: StockDepot;
    detStockDepots: DetStockDepot[];
}