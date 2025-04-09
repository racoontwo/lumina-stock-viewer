
import { create } from 'zustand';
import { Stock } from '../types/Stock';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Sample initial data
const initialStocks: Stock[] = [
  {
    id: '1',
    ticker: 'WULF',
    date: '2023-07-03',
    type: 'BO'
  },
  {
    id: '2',
    ticker: 'IONQ',
    date: '2023-06-28',
    type: 'BO'
  },
  {
    id: '3',
    ticker: 'TGTX',
    date: '2023-11-01',
    type: 'EP'
  }
];

interface StockState {
  stocks: Stock[];
  filteredStocks: Stock[];
  searchQuery: string;
  filterType: string;
  sortField: keyof Stock;
  sortDirection: 'asc' | 'desc';
  addStock: (stock: Omit<Stock, 'id'>) => void;
  removeStock: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: string) => void;
  setSortField: (field: keyof Stock) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  importStocks: (stocks: Stock[]) => void;
  resetFilters: () => void;
  applyFiltersAndSort: (stocks: Stock[]) => Stock[]; // Added this to the interface
}

export const useStockStore = create<StockState>((set, get) => ({
  stocks: initialStocks,
  filteredStocks: initialStocks,
  searchQuery: '',
  filterType: 'ALL',
  sortField: 'ticker',
  sortDirection: 'asc',
  
  addStock: (stock) => {
    const newStock = { 
      ...stock, 
      id: uuidv4() 
    };
    
    set((state) => {
      const updatedStocks = [...state.stocks, newStock];
      return { 
        stocks: updatedStocks,
        filteredStocks: get().applyFiltersAndSort(updatedStocks)
      };
    });
    
    toast({
      title: "Stock Added",
      description: `${stock.ticker} has been added to your database.`,
    });
  },
  
  removeStock: (id) => {
    set((state) => {
      const updatedStocks = state.stocks.filter(stock => stock.id !== id);
      return { 
        stocks: updatedStocks,
        filteredStocks: get().applyFiltersAndSort(updatedStocks)
      };
    });
    
    toast({
      title: "Stock Removed",
      description: "The stock has been removed from your database.",
    });
  },
  
  setSearchQuery: (query) => {
    set((state) => ({ 
      searchQuery: query,
      filteredStocks: get().applyFiltersAndSort(state.stocks)
    }));
  },
  
  setFilterType: (type) => {
    set((state) => ({ 
      filterType: type,
      filteredStocks: get().applyFiltersAndSort(state.stocks)
    }));
  },
  
  setSortField: (field) => {
    set((state) => {
      // If clicking the same field, toggle direction
      const direction = state.sortField === field && state.sortDirection === 'asc' ? 'desc' : 'asc';
      
      return { 
        sortField: field,
        sortDirection: direction,
        filteredStocks: get().applyFiltersAndSort(state.stocks)
      };
    });
  },
  
  setSortDirection: (direction) => {
    set((state) => ({ 
      sortDirection: direction,
      filteredStocks: get().applyFiltersAndSort(state.stocks)
    }));
  },
  
  importStocks: (stocks) => {
    // Ensure all imported stocks have IDs
    const stocksWithIds = stocks.map(stock => ({
      ...stock,
      id: stock.id || uuidv4()
    }));
    
    set((state) => ({ 
      stocks: stocksWithIds,
      filteredStocks: get().applyFiltersAndSort(stocksWithIds)
    }));
    
    toast({
      title: "Import Successful",
      description: `${stocks.length} stocks have been imported.`,
    });
  },
  
  resetFilters: () => {
    set((state) => ({ 
      searchQuery: '',
      filterType: 'ALL',
      filteredStocks: state.stocks
    }));
  },
  
  // Helper function to apply filters and sort
  applyFiltersAndSort: (stocks) => {
    const { searchQuery, filterType, sortField, sortDirection } = get();
    
    // Apply filtering
    let result = [...stocks];
    
    if (searchQuery) {
      result = result.filter(stock => 
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterType !== 'ALL') {
      result = result.filter(stock => stock.type === filterType);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }
}));
