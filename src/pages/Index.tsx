
import React from 'react';
import AddStockForm from '@/components/AddStockForm';
import StockTable from '@/components/StockTable';
import StockFilters from '@/components/StockFilters';
import ImportExport from '@/components/ImportExport';
import { Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-darkBg text-white pb-12">
      {/* Header */}
      <header className="py-8 px-4 mb-8 bg-darkBg2 border-b border-neonPink border-opacity-30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center">
              <Sparkles className="inline-block mr-2 text-neonBlue animate-pulse" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neonPink to-neonBlue animate-glow">
                Lumina Stock Viewer
              </span>
            </h1>
            <ImportExport />
          </div>
          <p className="mt-2 text-muted-foreground">
            Manage your stock database with a beautiful, user-friendly interface.
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8">
          {/* Add Stock Form */}
          <section>
            <AddStockForm />
          </section>
          
          {/* Stock Filtering */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold neon-text-blue">Your Stocks</h2>
            </div>
            <StockFilters />
            <StockTable />
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-12 py-4 border-t border-neonBlue border-opacity-20 text-center text-muted-foreground">
        <p className="text-sm">
          Lumina Stock Viewer &copy; {new Date().getFullYear()} | Built with React & TailwindCSS
        </p>
      </footer>
    </div>
  );
};

export default Index;
