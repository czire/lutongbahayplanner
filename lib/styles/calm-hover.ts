// Calm hover utilities for Filipino cuisine-inspired interactions
export const calmHoverStyles = {
  // Subtle warm glow - like sunset over rice fields
  warmGlow:
    "transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-orange-200/30 hover:scale-[1.02] hover:text-gray-300!",

  // Gentle lift - like steam rising from hot soup
  gentleLift:
    "transition-all duration-400 ease-out hover:translate-y-[-2px] hover:shadow-md hover:shadow-amber-100/40",

  // Soft fade - like coconut milk dissolving
  softFade:
    "transition-all duration-300 ease-in-out hover:opacity-80 hover:backdrop-blur-sm",

  // Warm embrace - like the comfort of home cooking
  warmEmbrace:
    "transition-all duration-350 ease-in-out hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:px-3 hover:py-1 hover:rounded-md",

  // Gentle pulse - like a heartbeat of home
  gentlePulse:
    "transition-all duration-500 ease-in-out hover:animate-pulse hover:text-orange-700",

  // Bamboo sway - subtle movement like tropical breeze
  bambooSway:
    "transition-all duration-400 ease-in-out hover:skew-x-1 hover:text-emerald-700",

  // Default calm hover for links
  default:
    "transition-all duration-300 ease-in-out hover:text-orange-600 hover:drop-shadow-sm hover:translate-x-1",
};

// Combine multiple effects
export const calmHoverCombos = {
  // Navigation links - warm and inviting
  navigation: `${calmHoverStyles.warmGlow} hover:text-orange-600`,

  // Action buttons - encouraging but not aggressive
  action: `${calmHoverStyles.gentleLift} hover:bg-orange-100 hover:text-orange-800`,

  // Logo/brand - welcoming home feeling
  brand: `${calmHoverStyles.warmEmbrace} hover:text-orange-700`,

  // Secondary links - gentle attention
  secondary: `${calmHoverStyles.softFade} hover:text-amber-600`,

  none: "hover:scale-100",
};

// Utility function to get calm hover styles
export function getCalmHover(
  type: keyof typeof calmHoverCombos = "navigation"
) {
  return calmHoverCombos[type] || calmHoverStyles.default;
}
