import { Card } from '@/components/ui/card';
import { 
  Sword,
  Shield,
  Heart,
  Zap,
  Target,
  Flame,
  BarChart3,
  Users,
  Calendar,
  Cookie,
  MessageSquare,
  Bell,
  LineChart,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExampleComponentsProps {
  selectedColorProgress: string;
  selectedColorNotification: string;
  selectedColorCard: string;
  progress: number;
  getContrastColor: (color: string) => { text: string; overlay: string };
  colors: string[];
}

interface Notification {
  id?: number;
  title: string;
  desc: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  date: Date;
  type: 'elite' | 'gym' | 'special';
}

// Helper function to generate random values
const generateRandomValues = () => {
  return Array.from({ length: 7 }, () => ({
    value: Math.floor(Math.random() * 60) + 40,
    prev: Math.floor(Math.random() * 60) + 40
  }));
};

// Sample notifications data
const notificationTemplates: Notification[] = [
  { title: "New Challenge", desc: "Team Rocket wants to battle!" },
  { title: "Pokemon Center", desc: "Your team has been healed" },
  { title: "Level Up", desc: "Charizard reached level 36" },
  { title: "Evolution", desc: "Your Pikachu is evolving!" },
  { title: "Item Found", desc: "You found a rare candy!" },
  { title: "Gym Badge", desc: "You earned the Boulder Badge!" },
  { title: "New Record", desc: "Fastest battle time achieved!" },
  { title: "Achievement", desc: "Caught 100 different Pokemon!" }
];

export function ExampleComponents({
  selectedColorProgress,
  selectedColorNotification,
  selectedColorCard,
  progress,
  getContrastColor,
  colors
}: ExampleComponentsProps) {
  const mainColor = colors[0] || '#000000';
  const secondaryColor = colors[1] || mainColor;
  const tertiaryColor = colors[2] || secondaryColor;

  // State for dynamic bar values
  const [barData, setBarData] = useState(generateRandomValues());
  const [weeklyChange, setWeeklyChange] = useState('+20.1%');
  const [notifications, setNotifications] = useState(notificationTemplates.slice(0, 3));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "Elite Four Challenge",
      time: "2:30 PM",
      date: new Date(new Date().setDate(12)),
      type: 'elite'
    },
    {
      id: 2,
      title: "Gym Leader Battle",
      time: "4:00 PM",
      date: new Date(new Date().setDate(18)),
      type: 'gym'
    },
    {
      id: 3,
      title: "Pokemon Contest",
      time: "1:00 PM",
      date: new Date(new Date().setDate(23)),
      type: 'special'
    }
  ]);

  // Effect to update bar values periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateRandomValues();
      setBarData(newData);
      
      const avgPrev = barData.reduce((acc, curr) => acc + curr.value, 0) / 7;
      const avgNew = newData.reduce((acc, curr) => acc + curr.value, 0) / 7;
      const changeValue = ((avgNew - avgPrev) / avgPrev * 100);
      setWeeklyChange(`${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(1)}%`);
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, [barData]);

  // Effect to add new notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
      setNotifications(prev => {
        const updated = [
          { ...newNotification, id: Date.now() }, // Add unique ID for animation
          ...prev.slice(0, 2)
        ];
        return updated;
      });
    }, 4000); // Add new notification every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Stats Card - Subtle UI */}
      <Card className="p-6 md:col-span-2 h-[180px] relative overflow-hidden">
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-foreground">Statistics</h3>
          <div className="mt-2">
            <div className="text-3xl font-bold" style={{ color: mainColor }}>
              2,345
            </div>
            <div className="text-sm text-muted-foreground">
              Active trainers
            </div>
          </div>
          <div className="mt-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily active</span>
              <span className="font-medium" style={{ color: mainColor }}>+12.3%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: '65%',
                  backgroundColor: mainColor
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Battle Stats Card */}
      <Card className="p-6 md:col-span-2 min-h-[250px] relative overflow-hidden">
        <div className="flex flex-col h-full gap-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">Battle Stats</h3>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="animate-pulse whitespace-nowrap"
                style={{ 
                  backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 90%)`,
                  borderColor: mainColor
                }}
              >
                Last Battle: 2h ago
              </Badge>
              <LineChart className="w-4 h-4 shrink-0" style={{ color: mainColor }} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sword className="w-4 h-4 shrink-0" style={{ color: mainColor }} />
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold" style={{ color: mainColor }}>68%</p>
                <span className="text-xs text-green-500">+5%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: mainColor }}
                  initial={{ width: "0%" }}
                  animate={{ width: "68%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 shrink-0" style={{ color: secondaryColor }} />
                <p className="text-sm text-muted-foreground">Streak</p>
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold" style={{ color: secondaryColor }}>7</p>
                <span className="text-xs text-muted-foreground">max 12</span>
              </div>
              <div className="flex gap-0.5 h-1.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-full"
                    style={{ backgroundColor: secondaryColor }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i + 7}
                    className="flex-1 rounded-full bg-secondary"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 shrink-0" style={{ color: tertiaryColor }} />
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold" style={{ color: tertiaryColor }}>92%</p>
                <span className="text-xs text-orange-500">-2%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: tertiaryColor }}
                  initial={{ width: "0%" }}
                  animate={{ width: "92%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 shrink-0" style={{ color: mainColor }} />
                <span className="text-sm text-muted-foreground">Next Rank:</span>
                <span className="text-sm font-medium">Elite Trainer</span>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                230/300 points
              </div>
            </div>
            <motion.div 
              className="mt-2 w-full h-1.5 rounded-full bg-secondary overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: mainColor }}
                initial={{ width: "0%" }}
                animate={{ width: "77%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </motion.div>
          </div>
        </div>
      </Card>

      {/* Chat Interface Card */}
      <Card className="p-4 md:col-span-2 h-[400px] relative overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">Trainer Chat</h3>
            <Badge variant="outline" style={{ color: mainColor, borderColor: mainColor }}>
              Online
            </Badge>
          </div>
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback style={{ backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 70%)` }}>
                    TR
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Trainer Red</p>
                  <div className="rounded-lg p-3 bg-muted">
                    <p className="text-sm">Ready for our Pokemon battle?</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-start flex-row-reverse">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar-2.jpg" />
                  <AvatarFallback style={{ backgroundColor: `color-mix(in srgb, ${secondaryColor}, transparent 70%)` }}>
                    TB
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-right">You</p>
                  <div className="rounded-lg p-3" style={{ backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 90%)` }}>
                    <p className="text-sm">Let's do this! My team is ready.</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 rounded-lg bg-muted px-3 py-2 text-sm"
            />
            <Button size="icon" style={{ backgroundColor: mainColor }} className={getContrastColor(mainColor).text}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Calendar Card */}
      <Card className="p-4 md:col-span-2 h-[400px] relative overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: mainColor }} />
              <h3 className="text-lg font-semibold text-foreground">Tournament Schedule</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="hover:bg-muted"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="min-w-[120px] text-center font-medium">
                {format(currentDate, 'MMMM yyyy')}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="hover:bg-muted"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-muted-foreground font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
            {eachDayOfInterval({
              start: startOfMonth(currentDate),
              end: endOfMonth(currentDate)
            }).map((date, i) => {
              const dayEvents = calendarEvents.filter(event => 
                isSameDay(event.date, date)
              );
              const isSelected = isSameDay(date, selectedDate);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isCurrentDay = isToday(date);

              return (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer relative",
                          "transition-colors duration-200",
                          isSelected ? "text-white" : isCurrentMonth ? "text-foreground" : "text-muted-foreground/50",
                          isCurrentDay && !isSelected && "ring-2 ring-primary/20"
                        )}
                        style={isSelected ? { backgroundColor: mainColor } : {}}
                        onClick={() => setSelectedDate(date)}
                      >
                        <span className="relative z-10">{format(date, 'd')}</span>
                        {dayEvents.length > 0 && !isSelected && (
                          <div className="flex gap-0.5 mt-1">
                            {dayEvents.map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                className="w-1 h-1 rounded-full"
                                style={{ 
                                  backgroundColor: event.type === 'elite' ? mainColor : 
                                                 event.type === 'gym' ? secondaryColor :
                                                 tertiaryColor
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    {dayEvents.length > 0 && (
                      <TooltipContent>
                        <div className="space-y-1">
                          {dayEvents.map((event, eventIndex) => (
                            <div key={eventIndex} className="text-xs">
                              {event.time} - {event.title}
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {calendarEvents
                .filter(event => isSameDay(event.date, selectedDate))
                .map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    style={{ 
                      backgroundColor: `color-mix(in srgb, ${
                        event.type === 'elite' ? mainColor :
                        event.type === 'gym' ? secondaryColor :
                        tertiaryColor
                      }, transparent 95%)`
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ 
                        backgroundColor: event.type === 'elite' ? mainColor :
                                       event.type === 'gym' ? secondaryColor :
                                       tertiaryColor
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Training Progress Card */}
      <Card className="p-8 md:col-span-2 h-[300px] relative overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Training Progress</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{weeklyChange} from last week</p>
            </div>
            <Badge 
              variant="outline" 
              className="rounded-full px-3 py-0.5 text-xs bg-background"
              style={{ 
                color: 'var(--muted-foreground)',
                borderColor: 'var(--border)'
              }}
            >
              This Week
            </Badge>
          </div>

          <div className="flex-1 flex items-end px-1">
            {barData.map((data, i) => (
              <div key={i} className="group flex-1 flex flex-col items-center min-w-0">
                <div className="w-full relative h-[180px]">
                  <motion.div
                    className="absolute bottom-0 left-1/2 w-[8px] group-hover:scale-y-110 origin-bottom"
                    style={{
                      backgroundColor: i % 2 === 0 ? `color-mix(in srgb, ${mainColor}, transparent 15%)` : `color-mix(in srgb, ${secondaryColor}, transparent 15%)`,
                      transform: 'translateX(-50%)',
                      borderRadius: '4px'
                    }}
                    animate={{
                      height: `${data.value}%`
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  />
                </div>
                <div className="pt-4 flex flex-col items-center">
                  <span className="text-sm text-muted-foreground">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Notification Center Card */}
      <Card className="p-4 md:col-span-2 h-[300px] relative overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <Bell className="w-4 h-4" style={{ color: mainColor }} />
          </div>
          <ScrollArea className="flex-1 pr-4">
            <AnimatePresence mode="popLayout">
              {notifications.map((notif, i) => (
                <motion.div
                  key={notif.id || i}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1
                  }}
                  className="mb-3"
                >
                  <motion.div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `color-mix(in srgb, ${i % 2 ? secondaryColor : mainColor}, transparent 95%)` }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.desc}</p>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </Card>

      {/* Cookie Banner Card */}
      <Card className="p-4 md:col-span-4 h-[100px] relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full" style={{ backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 90%)` }}>
            <Cookie className="w-5 h-5" style={{ color: mainColor }} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Cookie Preferences</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We use cookies to enhance your Pokemon training experience.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Decline
            </Button>
            <Button size="sm" style={{ backgroundColor: mainColor }} className={getContrastColor(mainColor).text}>
              Accept
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 