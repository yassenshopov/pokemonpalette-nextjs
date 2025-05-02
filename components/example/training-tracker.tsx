'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Zap, Flame, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TrainingTrackerProps {
  mainColor: string;
  secondaryColor: string;
  getContrastColor: (color: string) => { text: string; overlay: string };
}

interface DataPoint {
  x: number;
  y: number;
}

// Generate random data points with interesting patterns
const generatePokemonTrainingData = (count: number, min: number, max: number, volatility: number, pattern: 'peak' | 'upward' | 'wave' | 'steady'): DataPoint[] => {
  const data: DataPoint[] = [];
  let value = min + Math.random() * (max - min) / 2;
  
  if (pattern === 'peak') {
    // Create a peak in the middle
    for (let i = 0; i < count; i++) {
      const peakFactor = Math.sin((i / (count - 1)) * Math.PI);
      value = min + (peakFactor * (max - min) * 0.8) + (Math.random() * volatility);
      data.push({ x: i, y: value });
    }
  } else if (pattern === 'upward') {
    // Create gradually increasing trend
    for (let i = 0; i < count; i++) {
      const trendFactor = i / (count - 1);
      value = min + (trendFactor * (max - min) * 0.7) + (Math.random() * volatility);
      data.push({ x: i, y: value });
    }
  } else if (pattern === 'wave') {
    // Create a wave pattern
    for (let i = 0; i < count; i++) {
      const waveFactor = Math.sin((i / (count - 1)) * Math.PI * 2);
      value = min + ((waveFactor + 1) / 2) * (max - min) * 0.6 + (Math.random() * volatility);
      data.push({ x: i, y: value });
    }
  } else {
    // Steady with random fluctuations
    for (let i = 0; i < count; i++) {
      const change = (Math.random() - 0.5) * volatility;
      value = Math.max(min, Math.min(max, value + change));
      data.push({ x: i, y: value });
    }
  }
  
  return data;
};

// Pokemon training metrics to display
const trainingMetrics = [
  { id: 'power', name: 'Power Level', icon: Zap },
  { id: 'battles', name: 'Battle Wins', icon: Flame },
  { id: 'training', name: 'Training Hours', icon: Clock }
];

export function TrainingTracker({ mainColor, secondaryColor, getContrastColor }: TrainingTrackerProps) {
  // Data for two lines (your pokemon's progress and league average)
  const [yourData, setYourData] = useState<DataPoint[]>([]);
  const [leagueData, setLeagueData] = useState<DataPoint[]>([]);
  
  const [currentPeriod, setCurrentPeriod] = useState<string>('This Season');
  const [comparisonValue, setComparisonValue] = useState<number>(0);
  const [selectedMetric, setSelectedMetric] = useState(trainingMetrics[0]);
  const [animationKey, setAnimationKey] = useState(0); // Used to trigger re-animations
  
  // Generate new data
  const generateNewData = () => {
    // Generate different patterns based on the selected metric
    let pattern: 'peak' | 'upward' | 'wave' | 'steady' = 'steady';
    
    if (selectedMetric.id === 'power') {
      pattern = 'upward';
    } else if (selectedMetric.id === 'battles') {
      pattern = 'wave';
    } else {
      pattern = 'peak';
    }
    
    const userData = generatePokemonTrainingData(7, 30, 95, 10, pattern);
    const avgData = generatePokemonTrainingData(7, 20, 75, 8, 'steady');
    
    // Calculate comparison value (how much above average)
    const userAvg = userData.reduce((sum, dp) => sum + dp.y, 0) / userData.length;
    const othersAvg = avgData.reduce((sum, dp) => sum + dp.y, 0) / avgData.length;
    const difference = Math.round(((userAvg - othersAvg) / othersAvg) * 100);
    
    // Update the state
    setYourData(userData);
    setLeagueData(avgData);
    setComparisonValue(difference);
    setAnimationKey(prev => prev + 1); // Increment to trigger re-animations
  };
  
  // Generate initial data on mount and when color/metric changes
  useEffect(() => {
    generateNewData();
  }, [mainColor, secondaryColor, selectedMetric]);
  
  // Function to convert data points to SVG path with smooth curves
  const getPathFromData = (data: DataPoint[], width: number, height: number): string => {
    if (data.length === 0) return '';
    
    const maxX = data.length - 1;
    const maxY = Math.max(...data.map(d => d.y));
    const minY = Math.min(...data.map(d => d.y)) - 5; // Add some padding at the bottom
    const range = maxY - minY || 1;
    
    // Create a smooth curved path using cubic bezier curves
    let path = '';
    
    data.forEach((point, i) => {
      const x = (point.x / maxX) * width;
      const y = height - ((point.y - minY) / range) * height;
      
      if (i === 0) {
        path += `M ${x},${y}`;
      } else {
        // Calculate control points for smooth curve
        const prevPoint = data[i - 1];
        const prevX = (prevPoint.x / maxX) * width;
        const prevY = height - ((prevPoint.y - minY) / range) * height;
        
        // Calculate distance between points
        const dx = x - prevX;
        
        // Control point distance (adjust for smoother/sharper curves)
        const curveIntensity = 0.3;
        
        // First control point
        const cp1x = prevX + dx * curveIntensity;
        const cp1y = prevY;
        
        // Second control point
        const cp2x = x - dx * curveIntensity;
        const cp2y = y;
        
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
      }
    });
    
    return path;
  };
  
  // Chart dimensions
  const chartWidth = 400;
  const chartHeight = 150;
  
  // Paths for the charts
  const yourPath = getPathFromData(yourData, chartWidth, chartHeight);
  const leaguePath = getPathFromData(leagueData, chartWidth, chartHeight);
  
  // Days of the week
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card className="p-6 h-[400px] relative overflow-hidden shadow-md">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" style={{ color: mainColor }} />
            <h3 className="text-lg font-semibold text-foreground">Pokémon Training Progress</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 py-1"
              style={{ 
                borderColor: mainColor,
                color: mainColor
              }}
            >
              <span>{currentPeriod}</span>
            </Badge>
            
            <Badge 
              className="flex items-center gap-1 py-1"
              style={{ 
                backgroundColor: comparisonValue > 0 ? mainColor : 'rgb(239 68 68)',
                color: comparisonValue > 0 ? getContrastColor(mainColor).text : 'white'
              }}
            >
              <TrendingUp className="h-3 w-3" />
              <span>{comparisonValue > 0 ? `+${comparisonValue}%` : `${comparisonValue}%`}</span>
            </Badge>
          </div>
        </div>
        
        {/* Metrics toggle buttons */}
        <div className="flex gap-2 mb-4">
          {trainingMetrics.map(metric => (
            <Button
              key={metric.id}
              variant={selectedMetric.id === metric.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric(metric)}
              className="flex items-center gap-1"
              style={selectedMetric.id === metric.id ? { 
                backgroundColor: mainColor,
                color: getContrastColor(mainColor).text 
              } : {}}
            >
              <metric.icon className="h-3.5 w-3.5" />
              <span>{metric.name}</span>
            </Button>
          ))}
        </div>
        
        {/* Subtitle */}
        <AnimatePresence mode="wait">
          <motion.p 
            key={selectedMetric.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground mb-4"
          >
            {selectedMetric.id === 'power' && "Your Pokémon's power level is developing faster than the league average."}
            {selectedMetric.id === 'battles' && "Your battle win rate has been exceptional compared to other trainers."}
            {selectedMetric.id === 'training' && "You've dedicated more training hours than most trainers this season."}
          </motion.p>
        </AnimatePresence>
        
        {/* Chart */}
        <div className="relative flex-1">
          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            preserveAspectRatio="xMidYMid meet"
            className="overflow-visible"
          >
            {/* Definitions for perfect circles */}
            <defs>
              <circle id="point-large" cx="0" cy="0" r="4" />
              <circle id="point-small" cx="0" cy="0" r="3" />
            </defs>
            
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3].map((i) => (
              <line 
                key={i}
                x1="0" 
                y1={i * (chartHeight / 3)} 
                x2={chartWidth} 
                y2={i * (chartHeight / 3)}
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity={0.5}
              />
            ))}
            
            {/* Your pokemon's data line with simple transition animations */}
            <motion.g key={`your-${animationKey}`}>
              {/* Line */}
              <motion.path
                d={yourPath}
                fill="none"
                stroke={mainColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              
              {/* Data points */}
              {yourData.map((point, i) => {
                const x = (point.x / (yourData.length - 1)) * chartWidth;
                const maxY = Math.max(...yourData.map(d => d.y));
                const minY = Math.min(...yourData.map(d => d.y)) - 5;
                const range = maxY - minY || 1;
                const y = chartHeight - ((point.y - minY) / range) * chartHeight;
                
                return (
                  <use 
                    href="#point-large" 
                    x={x} 
                    y={y} 
                    fill={mainColor}
                    key={i}
                  />
                );
              })}
            </motion.g>
            
            {/* League average data line with simple transition animations */}
            <motion.g key={`league-${animationKey}`}>
              {/* Line */}
              <motion.path
                d={leaguePath}
                fill="none"
                stroke={secondaryColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.8}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
              
              {/* Data points */}
              {leagueData.map((point, i) => {
                const x = (point.x / (leagueData.length - 1)) * chartWidth;
                const maxY = Math.max(...leagueData.map(d => d.y));
                const minY = Math.min(...leagueData.map(d => d.y)) - 5;
                const range = maxY - minY || 1;
                const y = chartHeight - ((point.y - minY) / range) * chartHeight;
                
                return (
                  <use 
                    href="#point-small" 
                    x={x} 
                    y={y} 
                    fill={secondaryColor}
                    key={i}
                  />
                );
              })}
            </motion.g>
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-4">
            {days.map((day, i) => (
              <div 
                key={day} 
                className="text-xs text-muted-foreground flex-1 text-center"
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-6 mt-4 pt-4 border-t" style={{ borderColor: `color-mix(in srgb, ${mainColor}, transparent 85%)` }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mainColor }}></div>
            <span className="text-sm">Your Pokémon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
            <span className="text-sm">League Average</span>
          </div>
          
          {/* Refresh button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generateNewData}
            className="ml-2"
            style={{ color: mainColor }}
          >
            Refresh Data
          </Button>
        </div>
      </div>
    </Card>
  );
} 