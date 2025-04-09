
export type StockType = 'BO' | 'EP' | 'IPO' | 'SPAC' | 'OTHER';

export interface Stock {
  ticker: string;
  date: string;
  type: StockType;
  id?: string; // Optional ID for internal tracking
}
