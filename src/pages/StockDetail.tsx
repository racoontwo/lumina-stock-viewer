
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStockStore } from '@/store/stockStore';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  CartesianGrid, 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';

// Generate some mock data for the stock
const generateMockData = (ticker: string, date: string) => {
  const startDate = parseISO(date);
  const data = [];
  
  // Generate 30 days of mock data
  for (let i = 30; i >= 0; i--) {
    const currentDate = subDays(startDate, i);
    // Generate a somewhat random but trending price (between $10 and $100)
    const basePrice = 10 + Math.floor(Math.random() * 90);
    const trend = i % 5 === 0 ? -1 : 1; // Add some volatility
    const price = basePrice + (trend * (Math.random() * 5));
    
    data.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  return data;
};

const StockDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { stocks } = useStockStore();
  
  const stock = stocks.find(s => s.id === id);
  
  if (!stock) {
    return (
      <div className="min-h-screen bg-darkBg text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl text-neonPink">Stock Not Found</h1>
          <p className="my-4">The stock you're looking for doesn't exist.</p>
          <Button asChild className="bg-neonBlue hover:bg-blue-700">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const stockData = generateMockData(stock.ticker, stock.date);
  
  // Calculate some basic stats
  const currentPrice = stockData[stockData.length - 1].price;
  const previousPrice = stockData[stockData.length - 2].price;
  const priceDiff = currentPrice - previousPrice;
  const percentChange = (priceDiff / previousPrice) * 100;
  
  return (
    <div className="min-h-screen bg-darkBg text-white pb-12">
      {/* Header */}
      <header className="py-8 px-4 mb-8 bg-darkBg2 border-b border-neonPink border-opacity-30">
        <div className="container mx-auto">
          <Link to="/" className="inline-flex items-center text-neonBlue hover:text-neonPink mb-4">
            <ChevronLeft className="mr-1" size={20} />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neonPink to-neonBlue">
                {stock.ticker}
              </span>
            </h1>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium bg-neonBlue bg-opacity-20 text-neonBlue">
              {stock.type}
            </span>
          </div>
          <p className="mt-2 text-muted-foreground">
            Added on {format(parseISO(stock.date), 'MMMM dd, yyyy')}
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8">
          {/* Price info */}
          <section className="bg-darkBg2 p-6 rounded-lg border border-neonBlue border-opacity-30">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-muted-foreground">Current Price</span>
                <h2 className="text-3xl font-bold text-neonPink">${currentPrice}</h2>
              </div>
              <div className={`text-xl font-semibold ${priceDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {priceDiff >= 0 ? '+' : ''}{priceDiff.toFixed(2)} ({percentChange.toFixed(2)}%)
              </div>
            </div>
          </section>
          
          {/* Chart */}
          <section className="bg-darkBg2 p-6 rounded-lg border border-neonBlue border-opacity-30">
            <h2 className="text-xl font-bold mb-4 text-neonBlue">Price History</h2>
            <div className="h-[400px] w-full">
              <ChartContainer
                config={{
                  price: {
                    color: '#ec4899', // neon pink
                  },
                  tooltip: {
                    color: '#3b82f6', // neon blue
                  }
                }}
              >
                <LineChart data={stockData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="var(--color-price, #ec4899)" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                  <CartesianGrid stroke="#2A303C" strokeDasharray="5 5" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888" 
                    tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                  />
                  <YAxis stroke="#888" />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent />
                    } 
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </section>
          
          {/* Additional Info */}
          <section className="bg-darkBg2 p-6 rounded-lg border border-neonBlue border-opacity-30">
            <h2 className="text-xl font-bold mb-4 text-neonBlue">Stock Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-muted-foreground">Ticker Symbol</h3>
                <p className="font-medium">{stock.ticker}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Type</h3>
                <p className="font-medium">{stock.type}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Date Added</h3>
                <p className="font-medium">{format(parseISO(stock.date), 'MMMM dd, yyyy')}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">ID</h3>
                <p className="font-medium text-neonPink/70">{stock.id}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StockDetail;
