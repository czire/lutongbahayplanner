export interface RecipeData {
  name: string;
  description: string;
  servings: number;
  cookingTime: number;
  costPerServing: number;
  image: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  steps: string[];
  substitutions: {
    originalItem: string;
    alternative: string;
  }[];
}

export const filipinoRecipes: RecipeData[] = [
  {
    name: "Chicken Adobo",
    description:
      "The Philippines' unofficial national dish - tender chicken braised in soy sauce, vinegar, and spices",
    servings: 4,
    cookingTime: 45,
    costPerServing: 45.0,
    image: "/images/recipes/chicken-adobo.jpg",
    ingredients: [
      { name: "Chicken thighs", quantity: "1", unit: "kg" },
      { name: "Soy sauce", quantity: "1/2", unit: "cup" },
      { name: "White vinegar", quantity: "1/4", unit: "cup" },
      { name: "Garlic", quantity: "6", unit: "cloves" },
      { name: "Bay leaves", quantity: "3", unit: "pieces" },
      { name: "Black peppercorns", quantity: "1", unit: "tsp" },
      { name: "Onion", quantity: "1", unit: "medium" },
    ],
    steps: [
      "Marinate chicken in soy sauce and vinegar for 30 minutes",
      "Heat oil in a pan and brown the chicken pieces",
      "Add garlic, onion, bay leaves, and peppercorns",
      "Pour in the marinade and bring to a boil",
      "Reduce heat and simmer for 30-40 minutes until tender",
      "Serve hot with steamed rice",
    ],
    substitutions: [
      { originalItem: "Chicken thighs", alternative: "Pork belly" },
      { originalItem: "White vinegar", alternative: "Coconut vinegar" },
    ],
  },
  {
    name: "Pork Sinigang",
    description: "A comforting sour soup with tender pork and fresh vegetables",
    servings: 6,
    cookingTime: 60,
    costPerServing: 35.0,
    image: "/images/recipes/pork-sinigang.jpg",
    ingredients: [
      { name: "Pork ribs", quantity: "500", unit: "g" },
      { name: "Tamarind paste", quantity: "2", unit: "tbsp" },
      { name: "Tomatoes", quantity: "2", unit: "medium" },
      { name: "Onion", quantity: "1", unit: "medium" },
      { name: "Kangkong", quantity: "1", unit: "bunch" },
      { name: "Radish", quantity: "1", unit: "medium" },
      { name: "Green chili", quantity: "2", unit: "pieces" },
      { name: "Fish sauce", quantity: "2", unit: "tbsp" },
    ],
    steps: [
      "Boil pork ribs in water for 30 minutes until tender",
      "Add tomatoes and onion, cook for 5 minutes",
      "Add tamarind paste and fish sauce",
      "Add radish and cook for 10 minutes",
      "Add kangkong and green chili",
      "Season with salt and pepper to taste",
    ],
    substitutions: [
      { originalItem: "Pork ribs", alternative: "Beef short ribs" },
      { originalItem: "Tamarind paste", alternative: "Sinigang mix" },
    ],
  },
  {
    name: "Beef Caldereta",
    description: "Rich and hearty beef stew with vegetables in tomato sauce",
    servings: 6,
    cookingTime: 90,
    costPerServing: 65.0,
    image: "/images/recipes/beef-caldereta.jpg",
    ingredients: [
      { name: "Beef chuck", quantity: "1", unit: "kg" },
      { name: "Tomato sauce", quantity: "1", unit: "can" },
      { name: "Liver spread", quantity: "3", unit: "tbsp" },
      { name: "Potatoes", quantity: "3", unit: "medium" },
      { name: "Carrots", quantity: "2", unit: "medium" },
      { name: "Bell pepper", quantity: "1", unit: "large" },
      { name: "Onion", quantity: "1", unit: "large" },
      { name: "Garlic", quantity: "4", unit: "cloves" },
    ],
    steps: [
      "Brown beef chunks in oil until all sides are seared",
      "Add onion and garlic, sauté until fragrant",
      "Pour in tomato sauce and simmer for 1 hour",
      "Add potatoes and carrots, cook for 15 minutes",
      "Stir in liver spread and bell pepper",
      "Season with salt and pepper, simmer until tender",
    ],
    substitutions: [
      { originalItem: "Beef chuck", alternative: "Goat meat" },
      { originalItem: "Liver spread", alternative: "Tomato paste" },
    ],
  },
  {
    name: "Pancit Canton",
    description: "Stir-fried noodles with mixed vegetables and meat",
    servings: 4,
    cookingTime: 25,
    costPerServing: 30.0,
    image: "/images/recipes/pancit-canton.jpg",
    ingredients: [
      { name: "Canton noodles", quantity: "250", unit: "g" },
      { name: "Pork strips", quantity: "200", unit: "g" },
      { name: "Shrimp", quantity: "150", unit: "g" },
      { name: "Cabbage", quantity: "2", unit: "cups" },
      { name: "Carrots", quantity: "1", unit: "medium" },
      { name: "Snow peas", quantity: "100", unit: "g" },
      { name: "Soy sauce", quantity: "3", unit: "tbsp" },
      { name: "Oyster sauce", quantity: "2", unit: "tbsp" },
    ],
    steps: [
      "Soak noodles in hot water until soft, drain",
      "Stir-fry pork and shrimp until cooked",
      "Add vegetables and stir-fry for 3 minutes",
      "Add noodles, soy sauce, and oyster sauce",
      "Toss everything together until well combined",
      "Garnish with green onions and serve hot",
    ],
    substitutions: [
      { originalItem: "Canton noodles", alternative: "Bihon noodles" },
      { originalItem: "Pork strips", alternative: "Chicken strips" },
    ],
  },
  {
    name: "Lumpiang Shanghai",
    description: "Crispy fried spring rolls filled with seasoned ground pork",
    servings: 6,
    cookingTime: 45,
    costPerServing: 25.0,
    image: "/images/recipes/lumpiang-shanghai.jpg",
    ingredients: [
      { name: "Ground pork", quantity: "500", unit: "g" },
      { name: "Spring roll wrapper", quantity: "1", unit: "pack" },
      { name: "Carrot", quantity: "1", unit: "small" },
      { name: "Onion", quantity: "1", unit: "small" },
      { name: "Egg", quantity: "1", unit: "piece" },
      { name: "Soy sauce", quantity: "2", unit: "tbsp" },
      { name: "Salt", quantity: "1", unit: "tsp" },
      { name: "Pepper", quantity: "1/2", unit: "tsp" },
    ],
    steps: [
      "Mix ground pork with minced carrot, onion, egg, and seasonings",
      "Place 1 tbsp of filling on wrapper corner",
      "Roll tightly and seal with water",
      "Deep fry in hot oil until golden brown",
      "Drain on paper towels",
      "Serve with sweet and sour sauce",
    ],
    substitutions: [
      { originalItem: "Ground pork", alternative: "Ground chicken" },
      { originalItem: "Spring roll wrapper", alternative: "Lumpia wrapper" },
    ],
  },
  {
    name: "Chicken Tinola",
    description:
      "Ginger-flavored chicken soup with green papaya and chili leaves",
    servings: 4,
    cookingTime: 40,
    costPerServing: 40.0,
    image: "/images/recipes/chicken-tinola.jpg",
    ingredients: [
      { name: "Chicken pieces", quantity: "1", unit: "kg" },
      { name: "Green papaya", quantity: "1", unit: "medium" },
      { name: "Ginger", quantity: "2", unit: "inches" },
      { name: "Onion", quantity: "1", unit: "medium" },
      { name: "Chili leaves", quantity: "1", unit: "cup" },
      { name: "Fish sauce", quantity: "2", unit: "tbsp" },
      { name: "Water", quantity: "6", unit: "cups" },
    ],
    steps: [
      "Sauté ginger and onion until fragrant",
      "Add chicken pieces and cook until browned",
      "Pour in water and bring to a boil",
      "Simmer for 20 minutes until chicken is tender",
      "Add green papaya and cook for 10 minutes",
      "Add chili leaves and season with fish sauce",
    ],
    substitutions: [
      { originalItem: "Green papaya", alternative: "Sayote" },
      { originalItem: "Chili leaves", alternative: "Malunggay leaves" },
    ],
  },
  {
    name: "Pork Menudo",
    description: "Hearty pork and liver stew with vegetables in tomato sauce",
    servings: 6,
    cookingTime: 50,
    costPerServing: 45.0,
    image: "/images/recipes/pork-menudo.jpg",
    ingredients: [
      { name: "Pork shoulder", quantity: "500", unit: "g" },
      { name: "Pork liver", quantity: "200", unit: "g" },
      { name: "Potatoes", quantity: "2", unit: "medium" },
      { name: "Carrots", quantity: "2", unit: "medium" },
      { name: "Tomato sauce", quantity: "1", unit: "can" },
      { name: "Onion", quantity: "1", unit: "medium" },
      { name: "Garlic", quantity: "4", unit: "cloves" },
      { name: "Bay leaves", quantity: "2", unit: "pieces" },
    ],
    steps: [
      "Cut pork and liver into cubes",
      "Sauté garlic and onion until fragrant",
      "Add pork and cook until browned",
      "Pour in tomato sauce and add bay leaves",
      "Simmer for 30 minutes until pork is tender",
      "Add potatoes, carrots, and liver, cook until done",
    ],
    substitutions: [
      { originalItem: "Pork liver", alternative: "Chicken liver" },
      { originalItem: "Tomato sauce", alternative: "Fresh tomatoes" },
    ],
  },
  {
    name: "Bistek Tagalog",
    description: "Filipino beef steak marinated in soy sauce and calamansi",
    servings: 4,
    cookingTime: 30,
    costPerServing: 55.0,
    image: "/images/recipes/bistek-tagalog.jpg",
    ingredients: [
      { name: "Beef sirloin", quantity: "500", unit: "g" },
      { name: "Soy sauce", quantity: "1/4", unit: "cup" },
      { name: "Calamansi juice", quantity: "3", unit: "tbsp" },
      { name: "Onion", quantity: "2", unit: "large" },
      { name: "Garlic", quantity: "3", unit: "cloves" },
      { name: "Black pepper", quantity: "1/2", unit: "tsp" },
      { name: "Cooking oil", quantity: "3", unit: "tbsp" },
    ],
    steps: [
      "Marinate beef in soy sauce, calamansi, and pepper for 30 minutes",
      "Heat oil and sauté garlic until golden",
      "Add beef and cook until browned",
      "Pour in marinade and simmer for 15 minutes",
      "Add sliced onions and cook until tender",
      "Serve hot with steamed rice",
    ],
    substitutions: [
      { originalItem: "Calamansi juice", alternative: "Lemon juice" },
      { originalItem: "Beef sirloin", alternative: "Beef tenderloin" },
    ],
  },
  {
    name: "Kare-Kare",
    description: "Rich peanut stew with oxtail and vegetables",
    servings: 6,
    cookingTime: 120,
    costPerServing: 70.0,
    image: "/images/recipes/kare-kare.jpg",
    ingredients: [
      { name: "Oxtail", quantity: "1", unit: "kg" },
      { name: "Peanut butter", quantity: "1/2", unit: "cup" },
      { name: "Ground rice", quantity: "3", unit: "tbsp" },
      { name: "Eggplant", quantity: "2", unit: "medium" },
      { name: "String beans", quantity: "200", unit: "g" },
      { name: "Banana heart", quantity: "1", unit: "piece" },
      { name: "Bok choy", quantity: "1", unit: "bunch" },
      { name: "Shrimp paste", quantity: "2", unit: "tbsp" },
    ],
    steps: [
      "Boil oxtail for 2 hours until very tender",
      "Reserve the broth and set aside meat",
      "Mix peanut butter and ground rice with broth",
      "Return to pot and add vegetables",
      "Simmer until vegetables are tender",
      "Serve with shrimp paste on the side",
    ],
    substitutions: [
      { originalItem: "Oxtail", alternative: "Beef short ribs" },
      { originalItem: "Peanut butter", alternative: "Ground peanuts" },
    ],
  },
  {
    name: "Lechon Kawali",
    description: "Crispy deep-fried pork belly served with liver sauce",
    servings: 4,
    cookingTime: 80,
    costPerServing: 60.0,
    image: "/images/recipes/lechon-kawali.jpg",
    ingredients: [
      { name: "Pork belly", quantity: "1", unit: "kg" },
      { name: "Bay leaves", quantity: "3", unit: "pieces" },
      { name: "Salt", quantity: "2", unit: "tbsp" },
      { name: "Black peppercorns", quantity: "1", unit: "tsp" },
      { name: "Garlic", quantity: "1", unit: "head" },
      { name: "Water", quantity: "6", unit: "cups" },
      { name: "Cooking oil", quantity: "4", unit: "cups" },
    ],
    steps: [
      "Boil pork belly with salt, bay leaves, pepper, and garlic for 1 hour",
      "Remove and let cool completely",
      "Pat dry with paper towels",
      "Heat oil to 350°F and deep fry until golden and crispy",
      "Drain on paper towels",
      "Slice and serve with lechon sauce",
    ],
    substitutions: [
      { originalItem: "Pork belly", alternative: "Pork shoulder" },
    ],
  },
];
