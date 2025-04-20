
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStockStore } from '@/store/stockStore';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO, subDays } from 'date-fns';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AreaClosed, LinePath, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip';

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
      date: currentDate,
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  return data;
};

// Tooltip styles
const tooltipStyles = {
  ...defaultStyles,
  background: '#2A303C',
  border: '1px solid #3b82f6',
  color: 'white',
  fontFamily: 'system-ui',
  fontSize: 12,
  padding: 12,
  borderRadius: 4,
};

// Accessors
const getDate = (d: { date: Date; price: number }) => d.date;
const getPrice = (d: { date: Date; price: number }) => d.price;

const StockDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { stocks } = useStockStore();
  const [tooltipData, setTooltipData] = useState<{date: Date; price: number} | null>(null);
  const [tooltipLeft, setTooltipLeft] = useState<number | undefined>(undefined);
  const [tooltipTop, setTooltipTop] = useState<number | undefined>(undefined);
  
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
  
  const stockData = useMemo(() => generateMockData(stock.ticker, stock.date), [stock.ticker, stock.date]);
  
  // Calculate some basic stats
  const currentPrice = stockData[stockData.length - 1].price;
  const previousPrice = stockData[stockData.length - 2].price;
  const priceDiff = currentPrice - previousPrice;
  const percentChange = (priceDiff / previousPrice) * 100;
  
  // Define chart dimensions and margins
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Scales
  const dateScale = useMemo(
    () => 
      scaleTime<number>({
        range: [0, innerWidth],
        domain: [stockData[0].date, stockData[stockData.length - 1].date],
      }),
    [innerWidth, stockData]
  );
  
  const priceScale = useMemo(() => {
    const minPrice = Math.min(...stockData.map(getPrice)) * 0.95;
    const maxPrice = Math.max(...stockData.map(getPrice)) * 1.05;
    return scaleLinear<number>({
      range: [innerHeight, 0],
      domain: [minPrice, maxPrice],
    });
  }, [innerHeight, stockData]);
  
  // Handle tooltip
  const handleTooltip = (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
    const { x } = localPoint(event) || { x: 0 };
    const x0 = dateScale.invert(x - margin.left);
    const index = stockData.findIndex(d => {
      const date = d.date;
      return date.getTime() > x0.getTime();
    });
    
    const d0 = stockData[index - 1];
    const d1 = stockData[index];
    
    // Choose the closer data point
    let d = d0;
    if (d1 && d0) {
      d = x0.valueOf() - d0.date.valueOf() > d1.date.valueOf() - x0.valueOf() ? d1 : d0;
    } else if (d1) {
      d = d1;
    } else if (!d0) {
      // Default to first item if none found
      d = stockData[0];
    }
    
    setTooltipData(d);
    setTooltipLeft(dateScale(d.date) + margin.left);
    setTooltipTop(priceScale(d.price) + margin.top);
  };

  return (
  <div className="min-h-screen bg-darkBg text-white pb-12">
    {/* Header */}
    <header className="py-8 px-4 mb-8 bg-darkBg2 border-b border-neonPink border-opacity-30">
      ...
    </header>
  </div>
);
  
//   return (
//     <div className="min-h-screen bg-darkBg text-white pb-12">
//       {/* Header */}
//       <header className="py-8 px-4 mb-8 bg-darkBg2 border-b border-neonPink border-opacity-30">
//         <div className="container mx-auto">
//           <Link to="/" className="inline-flex items-center text-neonBlue hover:text-neonPink mb-4">
//             <ChevronLeft className="mr-1" size={20} />
//             Back to Dashboard
//           </Link>
//           <div className="flex items-center justify-between">
//             <h1 className="text-3xl md:text-4xl font-bold">
//               <span className="bg-clip-text text-transparent bg-gradient-to-r from-neonPink to-neonBlue">
//                 {stock.ticker}
//               </span>
//             </h1>
//             <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium bg-neonBlue bg-opacity-20 text-neonBlue">
//               {stock.type}
//             </span>
//           </div>
//           <p className="mt-2 text-muted-foreground">
//             Added on {format(parseISO(stock.date), 'MMMM dd, yyyy')}
//           </p>
//         </div>
//       </header>
      
//       {/* Main Content */}
//       <main className="container mx-auto px-4">
//         <div className="grid grid-cols-1 gap-8">
//           {/* Price info */}
//           <section className="bg-darkBg2 p-6 rounded-lg border border-neonBlue border-opacity-30">
//             <div className="flex justify-between items-center">
//               <div>
//                 <span className="text-sm text-muted-foreground">Current Price</span>
//                 <h2 className="text-3xl font-bold text-neonPink">${currentPrice}</h2>
//               </div>
//               <div className={`text-xl font-semibold ${priceDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                 {priceDiff >= 0 ? '+' : ''}{priceDiff.toFixed(2)} ({percentChange.toFixed(2)}%)
//               </div>
//             </div>
//           </section>
          
//           {/* Chart */}
//           <section className="bg-darkBg2 p-6 rounded-lg border border-neonBlue border-opacity-30">
//             <h2 className="text-xl font-bold mb-4 text-neonBlue">Price History</h2>
//             <div className="h-[400px] w-full flex justify-center">
//               <svg width={width} height={height}>
//                 <rect
//                   x={0}
//                   y={0}
//                   width={width}
//                   height={height}
//                   fill="#1A1F2C"
//                   rx={14}
//                 />
//                 <LinearGradient
//                   id="area-gradient"
//                   from="#ec4899" // neon pink
//                   to="#ec489900"
//                   toOpacity={0.1}
//                 />
//                 <Group left={margin.left} top={margin.top}>
//                   <GridRows
//                     scale={priceScale}
//                     width={innerWidth}
//                     height={innerHeight}
//                     stroke="#2A303C"
//                     strokeDasharray="3,3"
//                     strokeOpacity={0.5}
//                   />
//                   <GridColumns
//                     scale={dateScale}
//                     height={innerHeight}
//                     width={innerWidth}
//                     stroke="#2A303C"
//                     strokeDasharray="3,3"
//                     strokeOpacity={0.5}
//                   />
//                   <AreaClosed<{date: Date; price: number}>
//                     data={stockData}
//                     x={(d) => dateScale(d.date)}
//                     y={(d) => priceScale(d.price)}
//                     yScale={priceScale}
//                     curve={curveMonotoneX}
//                     fill="url(#area-gradient)"
//                     strokeWidth={2}
//                     stroke="#ec4899"
//                   />
//                   <LinePath<{date: Date; price: number}>
//                     data={stockData}
//                     x={(d) => dateScale(d.date)}
//                     y={(d) => priceScale(d.price)}
//                     curve={curveMonotoneX}
//                     stroke="#3b82f6" // neon blue
//                     strokeWidth={2}
//                     strokeOpacity={1}
//                   />
                  
//                   {tooltipData && (
//                     <g>
//                       <circle
//                         cx={dateScale(tooltipData.date)}
//                         cy={priceScale(tooltipData.price)}
//                         r={6}
//                         fill="#ec4899"
//                         stroke="#1A1F2C"
//                         strokeWidth={2}
//                         pointerEvents="none"
//                       />
//                     </g>
//                   )}
                  
//                   <Bar
//                     x={0}
//                     y={0}
//                     width={innerWidth}
//                     height={innerHeight}
//                     fill="transparent"
//                     onTouchStart={handleTooltip}
//                     onTouchMove={handleTooltip}
//                     onMouseMove={handleTooltip}
//                     onMouseLeave={() => setTooltipData(null)}
//                   />
//                 </Group>
//               </svg>
              
//               {tooltipData && (
//                 <TooltipWithBounds
//                   key={Math.random()}
//                   top={tooltipTop}
//                   left={tooltipLeft}
//                   style={tooltipStyles}
//                 >
//                   <div className="text-xs text-neonBlue">
//                     {format(tooltipData.date, 'MMM dd, yyyy')}
//                   </div>
//                   <div className="text-neonPink font-bold text-base pt-1">
//                     ${tooltipData.price.toFixed(2)}
//                   </div>
//                 </TooltipWithBounds>
//               )}
//             </div>
            
//             <div className="flex justify-between mt-4 text-xs text-muted-foreground">
//               <div>{format(stockData[0].date, 'MMM dd')}</div>
//               <div>{format(stockData[stockData.length - 1].date, 'MMM dd')}</div>
//             </div>
//           </section>
          
//           {/* Additional Info */}
//           <section className="bg-darkBg2 p-6 rounded-lg border border-neonBlue border-opacity-30">
//             <h2 className="text-xl font-bold mb-4 text-neonBlue">Stock Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <h3 className="text-sm text-muted-foreground">Ticker Symbol</h3>
//                 <p className="font-medium">{stock.ticker}</p>
//               </div>
//               <div>
//                 <h3 className="text-sm text-muted-foreground">Type</h3>
//                 <p className="font-medium">{stock.type}</p>
//               </div>
//               <div>
//                 <h3 className="text-sm text-muted-foreground">Date Added</h3>
//                 <p className="font-medium">{format(parseISO(stock.date), 'MMMM dd, yyyy')}</p>
//               </div>
//               <div>
//                 <h3 className="text-sm text-muted-foreground">ID</h3>
//                 <p className="font-medium text-neonPink/70">{stock.id}</p>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
};

export default StockDetail;
