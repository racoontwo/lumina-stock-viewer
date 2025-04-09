
import React, { useRef } from 'react';
import { useStockStore } from '@/store/stockStore';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Download, Upload } from 'lucide-react';
import { Stock } from '@/types/Stock';

const ImportExport: React.FC = () => {
  const { stocks, importStocks } = useStockStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      // Create a JSON file with the current stocks
      const stockData = JSON.stringify(stocks, null, 2);
      const blob = new Blob([stockData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `stock-database-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: `${stocks.length} stocks have been exported to JSON.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your stock data.",
        variant: "destructive"
      });
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content) as Stock[];
        
        if (!Array.isArray(parsedData)) {
          throw new Error('Invalid data format');
        }
        
        // Validate each stock object
        parsedData.forEach(stock => {
          if (!stock.ticker || !stock.date || !stock.type) {
            throw new Error('Invalid stock data format');
          }
        });
        
        importStocks(parsedData);
      } catch (error) {
        console.error('Import failed:', error);
        toast({
          title: "Import Failed",
          description: "The selected file contains invalid data.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    // Reset the file input
    event.target.value = '';
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json"
        className="hidden"
      />
      
      <Button 
        variant="outline" 
        onClick={handleImportClick}
        className="flex-1 border-neonBlue border-opacity-50 hover:border-opacity-100 hover:bg-neonBlue hover:bg-opacity-10"
      >
        <Upload className="mr-2 h-4 w-4" />
        Import
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleExport}
        className="flex-1 border-neonPink border-opacity-50 hover:border-opacity-100 hover:bg-neonPink hover:bg-opacity-10"
      >
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </div>
  );
};

export default ImportExport;
