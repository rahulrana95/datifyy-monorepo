// apps/frontend/src/theme/styles/global.ts
/**
 * Global styles for dating app
 * Includes animations, utilities, and base overrides
 */

import { mode } from '@chakra-ui/theme-tools';

export const globalStyles = (props: any) => ({
  // Base body styles
  body: {
    bg: mode('white', 'gray.900')(props),
    color: mode('gray.800', 'gray.100')(props),
    lineHeight: 'normal',
    fontFamily: 'body',
    
    // Optimize for mobile
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    
    // Prevent horizontal scroll on mobile
    overflowX: 'hidden',
  },
  
  // Optimize text rendering
  '*': {
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  },
  
  // Placeholder styles
  '*::placeholder': {
    color: mode('gray.400', 'gray.500')(props),
    opacity: 1,
  },
  
  // Focus styles
  '*:focus': {
    outline: 'none',
  },
  
  // Selection styles
  '*::selection': {
    bg: mode('brand.100', 'brand.700')(props),
    color: mode('brand.900', 'brand.100')(props),
  },
  
  // Scrollbar styles (webkit)
  '*::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  
  '*::-webkit-scrollbar-track': {
    bg: mode('gray.100', 'gray.700')(props),
    borderRadius: 'full',
  },
  
  '*::-webkit-scrollbar-thumb': {
    bg: mode('gray.300', 'gray.500')(props),
    borderRadius: 'full',
    
    '&:hover': {
      bg: mode('gray.400', 'gray.400')(props),
    },
  },
  
  // Border color fallback
  '*, *::before, *::after': {
    borderColor: mode('gray.200', 'gray.600')(props),
  },
  
  // Dating app specific global styles
  '.swipe-card': {
    touchAction: 'pan-y pinch-zoom',
    userSelect: 'none',
  },
  
  '.chat-message': {
    wordBreak: 'break-word',
    hyphens: 'auto',
  },
  
  // Animation classes
  '.fade-in': {
    animation: 'fadeIn 0.3s ease-in-out',
  },
  
  '.slide-up': {
    animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  '.bounce-in': {
    animation: 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Keyframe animations
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  
  '@keyframes slideUp': {
    from: { 
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: { 
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  
  '@keyframes bounceIn': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.3)',
    },
    '50%': {
      opacity: 1,
      transform: 'scale(1.05)',
    },
    '70%': {
      transform: 'scale(0.9)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
  
  // Heart animation for likes
  '@keyframes heartBeat': {
    '0%': {
      transform: 'scale(1)',
    },
    '14%': {
      transform: 'scale(1.3)',
    },
    '28%': {
      transform: 'scale(1)',
    },
    '42%': {
      transform: 'scale(1.3)',
    },
    '70%': {
      transform: 'scale(1)',
    },
  },
  
  '.heart-beat': {
    animation: 'heartBeat 1s ease-in-out',
  },
  
  // Swipe animations
  '@keyframes swipeRight': {
    to: {
      transform: 'translateX(100vw) rotate(30deg)',
      opacity: 0,
    },
  },
  
  '@keyframes swipeLeft': {
    to: {
      transform: 'translateX(-100vw) rotate(-30deg)',
      opacity: 0,
    },
  },
  
  '.swipe-right': {
    animation: 'swipeRight 0.3s ease-out forwards',
  },
  
  '.swipe-left': {
    animation: 'swipeLeft 0.3s ease-out forwards',
  },
  
  // Pulse animation for notifications
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
  },
  
  '.pulse': {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  
  // Shimmer loading animation
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-200px 0',
    },
    '100%': {
      backgroundPosition: 'calc(200px + 100%) 0',
    },
  },
  
  '.shimmer': {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200px 100%',
    animation: 'shimmer 1.5s infinite',
  },
  
  // Match celebration animation
  '@keyframes celebrate': {
    '0%, 100%': {
      transform: 'rotate(0deg)',
    },
    '25%': {
      transform: 'rotate(-5deg)',
    },
    '75%': {
      transform: 'rotate(5deg)',
    },
  },
  
  '.celebrate': {
    animation: 'celebrate 0.5s ease-in-out 3',
  },
  
  // Floating animation for FABs
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-6px)',
    },
  },
  
  '.float': {
    animation: 'float 3s ease-in-out infinite',
  },
  
  // Love pulse animation
  '@keyframes lovePulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '50%': {
      transform: 'scale(1.2)',
      opacity: 0.8,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
  
  '.love-pulse': {
    animation: 'lovePulse 1.5s ease-in-out infinite',
  },
  
  // Notification bounce
  '@keyframes notificationBounce': {
    '0%, 20%, 50%, 80%, 100%': {
      transform: 'translateY(0)',
    },
    '40%': {
      transform: 'translateY(-10px)',
    },
    '60%': {
      transform: 'translateY(-5px)',
    },
  },
  
  '.notification-bounce': {
    animation: 'notificationBounce 1s ease-in-out',
  },
  
  // Utility classes
  '.gradient-text': {
    backgroundImage: 'linear-gradient(135deg, #e85d75, #d14361)',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  
  '.gradient-bg': {
    background: 'linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)',
  },
  
  '.premium-gradient': {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  },
  
  '.love-gradient': {
    background: 'linear-gradient(135deg, #e85d75 0%, #d14361 100%)',
  },
  
  // Glass morphism utility
  '.glass': {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  
  '.glass-dark': {
    background: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  
  // Truncate text utilities
  '.truncate': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  
  '.truncate-2': {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  
  '.truncate-3': {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
  },
  
  // Safe area utilities for mobile
  '.safe-top': {
    paddingTop: 'env(safe-area-inset-top)',
  },
  
  '.safe-bottom': {
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  
  '.safe-left': {
    paddingLeft: 'env(safe-area-inset-left)',
  },
  
  '.safe-right': {
    paddingRight: 'env(safe-area-inset-right)',
  },
  
  // Hide scrollbars but keep functionality
  '.hide-scrollbar': {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  
  // Image aspect ratio utilities
  '.aspect-square': {
    aspectRatio: '1',
  },
  
  '.aspect-photo': {
    aspectRatio: '4/5',
  },
  
  '.aspect-video': {
    aspectRatio: '16/9',
  },
  
  // Interactive states
  '.interactive': {
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    
    '&:hover': {
      transform: 'translateY(-1px)',
    },
    
    '&:active': {
      transform: 'scale(0.98)',
    },
  },
  
  // Dating app specific classes
  '.profile-image': {
    aspectRatio: '4/5',
    objectFit: 'cover',
    borderRadius: 'xl',
  },
  
  '.match-glow': {
    boxShadow: '0 0 20px rgba(232, 93, 117, 0.4)',
  },
  
  '.premium-glow': {
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
  },
  
  '.verified-glow': {
    boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
  },
  
  // Chat bubble styles
  '.chat-bubble-sent': {
    background: 'linear-gradient(135deg, #e85d75, #d14361)',
    color: 'white',
    borderRadius: '18px 18px 4px 18px',
    marginLeft: 'auto',
    maxWidth: '80%',
    padding: '12px 16px',
    wordBreak: 'break-word',
  },
  
  '.chat-bubble-received': {
    background: mode('#f5f5f5', '#2d3748')(props),
    color: mode('#333', '#e2e8f0')(props),
    borderRadius: '18px 18px 18px 4px',
    marginRight: 'auto',
    maxWidth: '80%',
    padding: '12px 16px',
    wordBreak: 'break-word',
  },
  
  // Loading states
  '.skeleton': {
    background: mode(
      'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      'linear-gradient(90deg, #2d3748 25%, #4a5568 50%, #2d3748 75%)'
    )(props),
    backgroundSize: '200px 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: 'md',
  },
  
  // Touch feedback
  '.touch-feedback': {
    position: 'relative',
    overflow: 'hidden',
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 0,
      height: 0,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.3)',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.3s, height 0.3s',
    },
    
    '&:active::before': {
      width: '200px',
      height: '200px',
    },
  },
  
  // Notification styles
  '.notification-dot': {
    position: 'relative',
    
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '-2px',
      right: '-2px',
      width: '8px',
      height: '8px',
      background: '#ef4444',
      borderRadius: '50%',
      border: '2px solid white',
    },
  },
  
  // Status indicator styles
  '.status-online': {
    position: 'relative',
    
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '5%',
      right: '5%',
      width: '20%',
      height: '20%',
      background: '#22c55e',
      borderRadius: '50%',
      border: '2px solid white',
    },
  },
  
  '.status-away': {
    position: 'relative',
    
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '5%',
      right: '5%',
      width: '20%',
      height: '20%',
      background: '#f59e0b',
      borderRadius: '50%',
      border: '2px solid white',
    },
  },
  
  '.status-offline': {
    position: 'relative',
    
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '5%',
      right: '5%',
      width: '20%',
      height: '20%',
      background: '#6b7280',
      borderRadius: '50%',
      border: '2px solid white',
    },
  },
  
  // Swipe overlay styles
  '.swipe-overlay-like': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.8))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '2xl',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 'wider',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
    borderRadius: 'inherit',
  },
  
  '.swipe-overlay-nope': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '2xl',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 'wider',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
    borderRadius: 'inherit',
  },
  
  '.swipe-overlay-super': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '2xl',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 'wider',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
    borderRadius: 'inherit',
  },
  
  // Show overlays on swipe
  '.swiping-right .swipe-overlay-like': {
    opacity: 1,
  },
  
  '.swiping-left .swipe-overlay-nope': {
    opacity: 1,
  },
  
  '.swiping-up .swipe-overlay-super': {
    opacity: 1,
  },
  
  // Match celebration styles
  '.match-celebration': {
    background: 'radial-gradient(circle, rgba(232, 93, 117, 0.2) 0%, transparent 70%)',
    animation: 'celebrate 0.5s ease-in-out 3',
  },
  
  // Premium shimmer effect
  '.premium-shimmer': {
    position: 'relative',
    overflow: 'hidden',
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      transition: 'left 0.5s',
    },
    
    '&:hover::before': {
      left: '100%',
    },
  },
  
  // Like button special effects
  '.like-button-active': {
    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
    animation: 'heartBeat 0.6s ease-in-out',
  },
  
  // Nope button special effects
  '.nope-button-active': {
    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
    animation: 'pulse 0.3s ease-in-out',
  },
  
  // Dating app card stack
  '.card-stack': {
    perspective: '1000px',
    
    '& .card': {
      transformStyle: 'preserve-3d',
      transition: 'transform 0.3s ease-in-out',
    },
    
    '& .card:nth-child(1)': {
      zIndex: 3,
      transform: 'translateY(0px) scale(1)',
    },
    
    '& .card:nth-child(2)': {
      zIndex: 2,
      transform: 'translateY(8px) scale(0.98)',
    },
    
    '& .card:nth-child(3)': {
      zIndex: 1,
      transform: 'translateY(16px) scale(0.96)',
    },
  },
  
  // Message typing indicator
  '.typing-indicator': {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    
    '& .dot': {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: '#9ca3af',
      margin: '0 2px',
      animation: 'typing 1.4s infinite ease-in-out',
    },
    
    '& .dot:nth-child(1)': {
      animationDelay: '0s',
    },
    
    '& .dot:nth-child(2)': {
      animationDelay: '0.2s',
    },
    
    '& .dot:nth-child(3)': {
      animationDelay: '0.4s',
    },
  },
  
  '@keyframes typing': {
    '0%, 60%, 100%': {
      transform: 'translateY(0)',
      opacity: 0.4,
    },
    '30%': {
      transform: 'translateY(-10px)',
      opacity: 1,
    },
  },
  
  // Dark mode specific overrides
  '.dark': {
    '.skeleton': {
      background: 'linear-gradient(90deg, #2d3748 25%, #4a5568 50%, #2d3748 75%)',
    },
    
    '.glass': {
      background: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    
    '.gradient-bg': {
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    },
  },
  
  // Alternative: Use color mode conditionally within each class
//   '.skeleton': {
//     background: mode(
//       'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
//       'linear-gradient(90deg, #2d3748 25%, #4a5568 50%, #2d3748 75%)'
//     )(props),
//   },
  
//   '.glass': {
//     background: mode(
//       'rgba(255, 255, 255, 0.1)',
//       'rgba(0, 0, 0, 0.1)'
//     )(props),
//     backdropFilter: 'blur(10px)',
//     border: '1px solid',
//     borderColor: mode(
//       'rgba(255, 255, 255, 0.2)',
//       'rgba(255, 255, 255, 0.1)'
//     )(props),
//   },
  
//   '.gradient-bg': {
//     background: mode(
//       'linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)',
//       'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
//     )(props),
//   },
});