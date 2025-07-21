'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Send, Smile } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTheme } from 'next-themes';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other' | 'system';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  senderName: string;
  senderAvatar?: string;
}

interface ChatProps {
  mainColor: string;
  secondaryColor: string;
  getContrastColor: (color: string) => { text: string; overlay: string };
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    content: 'Ready for our Pokemon battle?',
    sender: 'other',
    timestamp: new Date('2024-01-01T10:00:00Z'),
    status: 'read',
    senderName: 'Trainer Red',
    senderAvatar: '/images/trainers/red.svg',
  },
  {
    id: '2',
    content: "Let's do this! My team is ready.",
    sender: 'user',
    timestamp: new Date('2024-01-01T10:01:00Z'),
    status: 'read',
    senderName: 'You',
    senderAvatar: '/placeholder-avatar-2.jpg',
  },
  {
    id: '3',
    content: "Great! I've been training my Charizard specially for this.",
    sender: 'other',
    timestamp: new Date('2024-01-01T10:02:00Z'),
    status: 'read',
    senderName: 'Trainer Red',
    senderAvatar: '/images/trainers/red.svg',
  },
];

const MessageStatus = ({ status, color }: { status: Message['status']; color: string }) => {
  switch (status) {
    case 'sending':
      return (
        <div
          className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: color }}
        />
      );
    case 'sent':
      return <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />;
    case 'delivered':
      return <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />;
    case 'read':
      return <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />;
    default:
      return null;
  }
};

// Common emojis for quick access
const COMMON_EMOJIS = ['😊', '👍', '❤️', '🎮', '⚡', '🔥', '✨', '🌟', '💪', '🏆'];

export function Chat({ mainColor, secondaryColor, getContrastColor }: ChatProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent styles after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get contrast text color for message bubbles based on theme
  const userBubbleColor =
    mounted && theme === 'dark'
      ? `color-mix(in srgb, ${secondaryColor}, #1a1a2e 30%)`
      : `color-mix(in srgb, ${secondaryColor}, transparent 85%)`;
  const otherBubbleColor =
    mounted && theme === 'dark'
      ? `color-mix(in srgb, ${mainColor}, #1a1a2e 30%)`
      : `color-mix(in srgb, ${mainColor}, transparent 85%)`;
  const systemBubbleColor =
    mounted && theme === 'dark'
      ? `color-mix(in srgb, #888888, #1a1a2e 40%)`
      : `color-mix(in srgb, #888888, transparent 90%)`;

  // Define background colors for light and dark mode
  const messageAreaBgLight = 'rgba(248, 250, 252, 0.3)';
  const messageAreaBgDark = 'rgba(12, 15, 20, 0.15)';
  const messageAreaBg = mounted && theme === 'dark' ? messageAreaBgDark : messageAreaBgLight;

  // Define CSS variables for global themeing
  const cssVariables = {
    '--ring': mainColor,
    '--ring-offset-shadow': `0 0 0 2px ${mainColor}`,
    '--focus-ring': `0 0 0 2px ${secondaryColor}`,
  } as React.CSSProperties;

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBlock = () => {
    setIsBlocked(true);
    setMessages([
      {
        id: Date.now().toString(),
        content: 'You have blocked Trainer Red. They can no longer send you messages.',
        sender: 'system',
        timestamp: new Date(),
        status: 'read',
        senderName: 'System',
      },
    ]);
    setIsTyping(false);
  };

  const handleUnblock = () => {
    setIsBlocked(false);
    setMessages(MOCK_MESSAGES);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isBlocked) return;

    // Use a stable timestamp for new messages
    const now = new Date();
    now.setMilliseconds(0); // Remove milliseconds for consistency

    const newMessage: Message = {
      id: now.toISOString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: now,
      status: 'sending',
      senderName: user?.fullName || 'You',
      senderAvatar: user?.imageUrl || '/placeholder-avatar-2.jpg',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate message sending states
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg => (msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg))
      );
    }, 500);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg => (msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg))
      );
    }, 1000);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg => (msg.id === newMessage.id ? { ...msg, status: 'read' } : msg))
      );
    }, 1500);

    // Update response message timestamp handling
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responseTime = new Date(now.getTime() + 3000);
        responseTime.setMilliseconds(0);
        const response: Message = {
          id: responseTime.toISOString(),
          content: getRandomResponse(),
          sender: 'other',
          timestamp: responseTime,
          status: 'read',
          senderName: 'Trainer Red',
          senderAvatar: '/images/trainers/red.svg',
        };
        setMessages(prev => [...prev, response]);
      }, 2000 + Math.random() * 1000);
    }, 1000);
  };

  const getRandomResponse = () => {
    const responses = [
      "That's an impressive strategy! Let's see how it plays out.",
      'Your Pokemon seem well-trained. This will be interesting!',
      "I've been waiting for a challenge like this!",
      'Remember, the bond with your Pokemon is what matters most.',
      'May the best trainer win!',
      "I can see why you've come so far in your journey.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (date: Date) => {
    // Use UTC methods to ensure consistent formatting
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const clearChat = () => {
    setMessages([]);
  };

  const onEmojiSelect = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const getAvatarUrl = (url?: string) => {
    if (!url || (url.startsWith('/placeholder') && !url.includes('trainers'))) {
      return undefined;
    }
    return url;
  };

  return (
    <Card
      className="p-4 h-[400px] relative overflow-hidden shadow-md border-none"
      style={{
        ...cssVariables,
        backgroundColor: mounted && theme === 'dark' ? 'rgba(18, 22, 30, 0.85)' : undefined,
        backgroundImage:
          mounted && theme === 'dark'
            ? 'linear-gradient(to bottom right, rgba(22, 27, 34, 0.8), rgba(13, 17, 23, 0.6))'
            : undefined,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50 backdrop-blur-sm rounded-xl pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div
          className="flex justify-between items-center pb-3 border-b mb-3"
          style={{
            borderColor:
              mounted && theme === 'dark'
                ? `color-mix(in srgb, ${mainColor}, #ffffff 20%)`
                : `color-mix(in srgb, ${mainColor}, transparent 85%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="relative rounded-full p-0.5"
              style={{
                background:
                  mounted && theme === 'dark'
                    ? `linear-gradient(45deg, ${mainColor}40, ${secondaryColor}30)`
                    : 'transparent',
                boxShadow: mounted && theme === 'dark' ? `0 0 12px ${mainColor}40` : 'none',
              }}
            >
              <Avatar className="h-8 w-8 ring-2" style={{ borderColor: mainColor }}>
                <AvatarImage src="/images/trainers/red.svg" alt="Trainer Red" />
                <AvatarFallback
                  style={{ backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 70%)` }}
                >
                  TR
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Trainer Red</h3>
              <p className="text-xs text-muted-foreground">Elite Trainer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                isBlocked
                  ? 'bg-destructive/10 text-destructive border-destructive'
                  : 'animate-pulse',
                'transition-colors duration-300'
              )}
              style={!isBlocked ? { color: mainColor, borderColor: mainColor } : {}}
            >
              {isBlocked ? 'Blocked' : 'Online'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  style={{ color: 'var(--foreground)' }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                style={{
                  borderColor:
                    mounted && theme === 'dark'
                      ? `color-mix(in srgb, ${mainColor}, #ffffff 50%)`
                      : `color-mix(in srgb, ${mainColor}, transparent 70%)`,
                }}
              >
                <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
                <DropdownMenuSeparator
                  style={{
                    backgroundColor:
                      mounted && theme === 'dark'
                        ? `color-mix(in srgb, ${mainColor}, #ffffff 40%)`
                        : `color-mix(in srgb, ${mainColor}, transparent 85%)`,
                  }}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      View Profile
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    className="sm:max-w-[425px] border-2"
                    style={{ borderColor: mainColor }}
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle style={{ color: mainColor }}>
                        Trainer Profile
                      </AlertDialogTitle>
                      <div className="flex flex-col items-center gap-4 py-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src="/images/trainers/red.svg" alt="Trainer Red" />
                          <AvatarFallback
                            style={{
                              backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 70%)`,
                            }}
                          >
                            TR
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                          <h3 className="font-semibold text-lg">Trainer Red</h3>
                          <p className="text-sm text-muted-foreground">Elite Trainer</p>
                        </div>
                        <div className="w-full grid grid-cols-3 gap-4 text-center">
                          <div style={{ color: mainColor }}>
                            <p className="font-semibold">142</p>
                            <p className="text-sm text-muted-foreground">Battles</p>
                          </div>
                          <div style={{ color: secondaryColor }}>
                            <p className="font-semibold">89%</p>
                            <p className="text-sm text-muted-foreground">Win Rate</p>
                          </div>
                          <div style={{ color: mainColor }}>
                            <p className="font-semibold">Elite</p>
                            <p className="text-sm text-muted-foreground">Rank</p>
                          </div>
                        </div>
                      </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction style={{ backgroundColor: mainColor }}>
                        Close
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      Clear Chat
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-2" style={{ borderColor: mainColor }}>
                    <AlertDialogHeader>
                      <AlertDialogTitle style={{ color: mainColor }}>
                        Clear Chat History
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to clear all messages? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={clearChat} style={{ backgroundColor: mainColor }}>
                        Clear Chat
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      {isBlocked ? 'Unblock User' : 'Block User'}
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-2" style={{ borderColor: mainColor }}>
                    <AlertDialogHeader>
                      <AlertDialogTitle style={{ color: mainColor }}>
                        {isBlocked ? 'Unblock Trainer Red' : 'Block Trainer Red'}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {isBlocked
                          ? 'Are you sure you want to unblock this user? They will be able to send you messages again.'
                          : 'Are you sure you want to block this user? They will no longer be able to send you messages.'}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={isBlocked ? handleUnblock : handleBlock}
                        style={{ backgroundColor: mainColor }}
                      >
                        {isBlocked ? 'Unblock' : 'Block'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 pr-4 rounded-md"
          style={
            {
              backgroundColor:
                mounted && theme === 'dark' ? 'rgba(12, 15, 20, 0.4)' : messageAreaBgLight,
              backgroundImage:
                mounted && theme === 'dark'
                  ? 'linear-gradient(rgba(13, 17, 23, 0.1), rgba(18, 22, 30, 0.2))'
                  : undefined,
              '--scrollbar-thumb': `color-mix(in srgb, ${mainColor}, transparent 50%)`,
              '--scrollbar-track': 'transparent',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            } as React.CSSProperties
          }
        >
          <AnimatePresence initial={false}>
            <div className="space-y-4 p-2">
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'flex gap-3 items-end max-w-[85%]',
                    message.sender === 'user'
                      ? 'flex-row-reverse ml-auto'
                      : message.sender === 'system'
                      ? 'mx-auto justify-center'
                      : ''
                  )}
                >
                  {message.sender !== 'system' && (
                    <Avatar className={cn('h-6 w-6', message.sender === 'user' ? 'mb-5' : '')}>
                      <AvatarImage
                        src={
                          message.sender === 'user'
                            ? getAvatarUrl(user?.imageUrl || message.senderAvatar)
                            : '/images/trainers/red.svg'
                        }
                        alt={message.senderName}
                      />
                      <AvatarFallback
                        style={{
                          backgroundColor: `color-mix(in srgb, ${
                            message.sender === 'user' ? secondaryColor : mainColor
                          }, transparent 70%)`,
                        }}
                      >
                        {message.senderName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col gap-1">
                    <div
                      className={cn(
                        'px-3 py-2 rounded-2xl max-w-full backdrop-blur-sm',
                        message.sender === 'user'
                          ? 'rounded-br-sm'
                          : message.sender === 'other'
                          ? 'rounded-bl-sm'
                          : 'rounded-2xl text-center text-xs opacity-75'
                      )}
                      style={{
                        backgroundColor:
                          message.sender === 'user'
                            ? userBubbleColor
                            : message.sender === 'other'
                            ? otherBubbleColor
                            : systemBubbleColor,
                        color:
                          mounted && theme === 'dark'
                            ? message.sender === 'system'
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'var(--foreground)'
                            : 'inherit',
                        borderWidth: message.sender === 'system' ? '1px' : '0',
                        borderColor:
                          mounted && theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        borderStyle: 'solid',
                        boxShadow:
                          mounted && theme === 'dark' ? '0 2px 5px rgba(0,0,0,0.25)' : undefined,
                      }}
                    >
                      <p className="text-sm break-words">{message.content}</p>
                    </div>
                    <div
                      className={cn(
                        'flex items-center text-xs text-muted-foreground',
                        message.sender === 'user' ? 'justify-end mr-1' : 'ml-1'
                      )}
                    >
                      {formatTime(message.timestamp)}
                      {message.sender === 'user' && (
                        <span className="ml-1.5">
                          <MessageStatus status={message.status} color={secondaryColor} />
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-3 items-end max-w-[85%]"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/images/trainers/red.svg" alt="Trainer Red" />
                    <AvatarFallback
                      style={{
                        backgroundColor: `color-mix(in srgb, ${mainColor}, transparent 70%)`,
                      }}
                    >
                      TR
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className="px-3 py-2 rounded-2xl rounded-bl-sm backdrop-blur-sm"
                    style={{
                      backgroundColor: otherBubbleColor,
                      color: mounted && theme === 'dark' ? 'var(--foreground)' : 'inherit',
                      boxShadow:
                        mounted && theme === 'dark' ? '0 2px 5px rgba(0,0,0,0.25)' : undefined,
                    }}
                  >
                    <div className="flex gap-1.5 items-center">
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor:
                            mounted && theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : mainColor,
                          animationDelay: '0ms',
                        }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor:
                            mounted && theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : mainColor,
                          animationDelay: '150ms',
                        }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor:
                            mounted && theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : mainColor,
                          animationDelay: '300ms',
                        }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </ScrollArea>

        {/* Input */}
        <div
          className="flex items-center gap-2 mt-3 pt-2 border-t"
          style={{
            borderColor:
              mounted && theme === 'dark'
                ? `color-mix(in srgb, ${mainColor}, #ffffff 30%)`
                : `color-mix(in srgb, ${mainColor}, transparent 85%)`,
          }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                style={{ color: mainColor }}
              >
                <Smile className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="p-2"
              style={{
                borderColor:
                  mounted && theme === 'dark'
                    ? `color-mix(in srgb, ${mainColor}, #ffffff 50%)`
                    : `color-mix(in srgb, ${mainColor}, transparent 70%)`,
              }}
            >
              <div className="grid grid-cols-5 gap-2">
                {COMMON_EMOJIS.map((emoji, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-muted"
                    onClick={() => onEmojiSelect(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="rounded-full border-muted-foreground/20 backdrop-blur-sm"
            style={
              {
                borderColor: `color-mix(in srgb, ${mainColor}, transparent 70%)`,
                backgroundColor: mounted && theme === 'dark' ? 'rgba(18, 22, 30, 0.6)' : undefined,
                color: mounted && theme === 'dark' ? 'var(--foreground)' : undefined,
                '&:focus': { borderColor: mainColor, boxShadow: `0 0 0 2px ${secondaryColor}` },
              } as React.CSSProperties
            }
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={isBlocked}
          />
          <Button
            onClick={sendMessage}
            disabled={isBlocked}
            size="icon"
            className="rounded-full h-8 w-8"
            style={{
              backgroundColor: secondaryColor,
              opacity: isBlocked ? '0.5' : '1',
              boxShadow: mounted && theme === 'dark' ? `0 0 10px ${secondaryColor}60` : 'none',
            }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
