
import React from 'react';
import { useStockStore } from '@/store/stockStore';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';

const StockFilters: React.FC = () => {
  const { 
    searchQuery, 
    filterType, 
    setSearchQuery, 
    setFilterType, 
    resetFilters,
    filteredStocks,
    stocks
  } = useStockStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:w-auto flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-neonBlue border-opacity-30 bg-darkBg focus:border-neonPink"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0 text-muted-foreground"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center w-full md:w-auto gap-2">
          <Filter className="h-4 w-4 text-muted-foreground hidden md:block" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="border-neonBlue border-opacity-30 bg-darkBg focus:border-neonPink w-full md:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-darkBg border-neonBlue">
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="BO">BO</SelectItem>
              <SelectItem value="EP">EP</SelectItem>
              <SelectItem value="IPO">IPO</SelectItem>
              <SelectItem value="SPAC">SPAC</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            className="border-neonPink border-opacity-50 hover:border-opacity-100 hover:bg-neonPink hover:bg-opacity-10"
            onClick={resetFilters}
          >
            Reset
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-neonBlue">{filteredStocks.length}</span> of{' '}
          <span className="font-medium text-neonPink">{stocks.length}</span> stocks
        </p>
      </div>
    </div>
  );
};

export default StockFilters;
