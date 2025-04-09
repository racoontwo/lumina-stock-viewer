
import React from 'react';
import { useStockStore } from '@/store/stockStore';
import { Stock } from '@/types/Stock';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const StockTable: React.FC = () => {
  const { 
    filteredStocks, 
    removeStock, 
    sortField, 
    sortDirection,
    setSortField 
  } = useStockStore();
  
  const navigate = useNavigate();

  const getSortIcon = (field: keyof Stock) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' ? 
      <ArrowUpDown className="ml-2 h-4 w-4 text-neonBlue" /> : 
      <ArrowUpDown className="ml-2 h-4 w-4 text-neonPink" />;
  };

  const handleSort = (field: keyof Stock) => {
    setSortField(field);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd, yyyy');
    } catch (e) {
      return dateStr; // Return original if parsing fails
    }
  };
  
  const handleRowClick = (id: string) => {
    navigate(`/stock/${id}`);
  };

  return (
    <div className="rounded-md border border-neonBlue border-opacity-30 overflow-hidden">
      <Table>
        <TableHeader className="bg-darkBg2">
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:text-neonPink transition-colors w-1/3"
              onClick={() => handleSort('ticker')}
            >
              Ticker {getSortIcon('ticker')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-neonPink transition-colors w-1/3"
              onClick={() => handleSort('date')}
            >
              Date {getSortIcon('date')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-neonPink transition-colors w-1/4"
              onClick={() => handleSort('type')}
            >
              Type {getSortIcon('type')}
            </TableHead>
            <TableHead className="w-1/12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStocks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                No stocks found
              </TableCell>
            </TableRow>
          ) : (
            filteredStocks.map((stock) => (
              <TableRow 
                key={stock.id} 
                className="hover:bg-darkBg2 transition-colors cursor-pointer"
              >
                <TableCell 
                  className="font-medium text-neonPink"
                  onClick={() => handleRowClick(stock.id!)}
                >
                  {stock.ticker}
                </TableCell>
                <TableCell onClick={() => handleRowClick(stock.id!)}>
                  {formatDate(stock.date)}
                </TableCell>
                <TableCell onClick={() => handleRowClick(stock.id!)}>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-neonBlue bg-opacity-20 text-neonBlue">
                    {stock.type}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStock(stock.id!);
                    }}
                    className="hover:text-neonPink hover:bg-red-900 hover:bg-opacity-20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockTable;
