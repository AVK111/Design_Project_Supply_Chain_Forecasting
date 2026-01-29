import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Package, Calendar, BarChart3, Brain } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Model = () => {
  useScrollAnimation();
  const [product, setProduct] = useState('Mangoes');
  const [forecastPeriod, setForecastPeriod] = useState('3');
  const [isLoading, setIsLoading] = useState(false);

  // Demo historical data
  const historicalData = [
    { month: 'Jan', demand: 1200, supply: 1150 },
    { month: 'Feb', demand: 1350, supply: 1300 },
    { month: 'Mar', demand: 1500, supply: 1450 },
    { month: 'Apr', demand: 1800, supply: 1750 },
    { month: 'May', demand: 2200, supply: 2100 },
    { month: 'Jun', demand: 2500, supply: 2400 },
    { month: 'Jul', demand: 2800, supply: 2700 },
    { month: 'Aug', demand: 2600, supply: 2550 },
    { month: 'Sep', demand: 2100, supply: 2050 },
    { month: 'Oct', demand: 1700, supply: 1650 },
    { month: 'Nov', demand: 1400, supply: 1350 },
    { month: 'Dec', demand: 1300, supply: 1250 },
  ];

  // Generate forecast data based on selected period
  const generateForecast = () => {
    const periods = parseInt(forecastPeriod);
    const forecastData = [];
    const lastData = historicalData[historicalData.length - 1];
    
    for (let i = 1; i <= periods; i++) {
      const monthIndex = (historicalData.length + i - 1) % 12;
      const baseDemand = historicalData[monthIndex].demand;
      const baseSupply = historicalData[monthIndex].supply;
      
      // Add some variation and trend
      const trend = 1 + (i * 0.02); // 2% growth trend
      const variation = 0.9 + Math.random() * 0.2; // ±10% variation
      
      forecastData.push({
        month: `Month ${i}`,
        demand: Math.round(baseDemand * trend * variation),
        supply: Math.round(baseSupply * trend * variation * 0.95), // Slightly lower supply
        forecast: true,
      });
    }
    
    return forecastData;
  };

  const forecastData = generateForecast();
  const combinedData = [...historicalData, ...forecastData];

  const chartConfig = {
    demand: {
      label: 'Demand',
      color: 'hsl(var(--chart-1))',
    },
    supply: {
      label: 'Supply',
      color: 'hsl(var(--chart-2))',
    },
  };

  const handleForecast = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  // Calculate key metrics
  const avgDemand = Math.round(
    historicalData.reduce((sum, d) => sum + d.demand, 0) / historicalData.length
  );
  const avgSupply = Math.round(
    historicalData.reduce((sum, d) => sum + d.supply, 0) / historicalData.length
  );
  const forecastAvgDemand = Math.round(
    forecastData.reduce((sum, d) => sum + d.demand, 0) / forecastData.length
  );
  const forecastAvgSupply = Math.round(
    forecastData.reduce((sum, d) => sum + d.supply, 0) / forecastData.length
  );

  return (
    <section id="model" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6 animate-on-scroll hover-scale">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Forecasting
            </div>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6 animate-on-scroll">
              Supply Chain <span className="text-gradient animate-pulse-glow">Forecasting Model</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-on-scroll">
              Leverage advanced machine learning models to predict demand, optimize inventory, 
              and ensure seamless supply chain operations for your agricultural exports.
            </p>
          </div>

          {/* Model Input Section */}
          <Card className="mb-12 border-0 shadow-soft animate-on-scroll">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Forecast Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="product">Product Category</Label>
                  <Select value={product} onValueChange={setProduct}>
                    <SelectTrigger id="product">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mangoes">Mangoes</SelectItem>
                      <SelectItem value="Rice">Rice</SelectItem>
                      <SelectItem value="Spices">Spices</SelectItem>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Oil Seeds">Oil Seeds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Forecast Period (Months)</Label>
                  <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                    <SelectTrigger id="period">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleForecast}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-primary-light hover-lift animate-pulse-glow"
                  >
                    {isLoading ? 'Generating Forecast...' : 'Generate Forecast'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forecast Chart */}
          <Card className="mb-12 border-0 shadow-soft animate-on-scroll">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Demand & Supply Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="demand"
                      stroke={chartConfig.demand.color}
                      fill={chartConfig.demand.color}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="supply"
                      stroke={chartConfig.supply.color}
                      fill={chartConfig.supply.color}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[hsl(var(--chart-1))]"></div>
                  <span className="text-muted-foreground">Historical Demand</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[hsl(var(--chart-2))]"></div>
                  <span className="text-muted-foreground">Historical Supply</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-dashed border-primary"></div>
                  <span className="text-muted-foreground">Forecasted Period</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border-0 shadow-soft hover-lift animate-on-scroll stagger-delay-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Avg Historical Demand</p>
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{avgDemand.toLocaleString()} units</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft hover-lift animate-on-scroll stagger-delay-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Avg Historical Supply</p>
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{avgSupply.toLocaleString()} units</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft hover-lift animate-on-scroll stagger-delay-3">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Forecasted Demand</p>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{forecastAvgDemand.toLocaleString()} units</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft hover-lift animate-on-scroll stagger-delay-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Forecasted Supply</p>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{forecastAvgSupply.toLocaleString()} units</p>
              </CardContent>
            </Card>
          </div>

          {/* Model Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-soft hover-lift animate-on-scroll">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 hover-scale">
                  <Brain className="w-6 h-6 text-primary animate-bounce-gentle" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Predictions</h3>
                <p className="text-muted-foreground text-sm">
                  Advanced machine learning algorithms analyze historical patterns, 
                  seasonal trends, and market factors to generate accurate forecasts.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft hover-lift animate-on-scroll">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 hover-scale">
                  <Calendar className="w-6 h-6 text-primary animate-bounce-gentle" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multi-Period Forecasting</h3>
                <p className="text-muted-foreground text-sm">
                  Generate forecasts for 1, 3, 6, or 12 months ahead to plan your 
                  inventory, production, and export schedules effectively.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft hover-lift animate-on-scroll">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 hover-scale">
                  <BarChart3 className="w-6 h-6 text-primary animate-bounce-gentle" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-Time Insights</h3>
                <p className="text-muted-foreground text-sm">
                  Get instant insights into demand-supply gaps, inventory optimization 
                  opportunities, and risk factors affecting your supply chain.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Model;
