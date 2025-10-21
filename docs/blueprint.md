# **App Name**: ReciPie AI

## Core Features:

- User Onboarding: Collect user dietary preferences and skill level via a multi-step form for personalized recommendations.
- Ingredient Detection: Enable users to upload ingredient photos, using the Google Vision API as a tool to detect ingredients. Present the detected ingredients in an editable list.
- Recipe Recommendations: Display personalized recipe recommendations based on dietary preferences and detected ingredients.
- Full Recipe Details: Display detailed recipe information including nutritional breakdown and step-by-step instructions, sourced from internal data and external APIs such as Spoonacular.
- Waste Tracking: Track user food waste based on marked ingredients and provide insights via a dashboard with charts and motivational messages, with real-time synchronization to Cloud Firestore.
- Data Storage and Retrieval: Utilize Cloud Firestore and PostgreSQL(via Firebase Data Connect) to store and retrieve recipe data.
- Image storage: Store the images in Cloud Storage

## Style Guidelines:

- Primary color: Light green (#90EE90), symbolizing freshness, health, and natural ingredients. The light tint also invokes a spirit of clarity.
- Background color: Very light green (#F0FFF0), complements the primary color and provides a clean backdrop. Note: this color is of the same hue, heavily desaturated, with appropriate brightness for the light scheme.
- Accent color: Yellow-green (#B0E296), an analogous color that highlights key interactive elements.
- Body font: 'PT Sans', sans-serif, for body text
- Headline font: 'Playfair', serif, for titles, recipe names and emphasis
- Use clear, modern icons to represent dietary preferences and ingredient categories.
- Employ a grid layout for recipe recommendations, ensuring a clean and visually appealing presentation.
- Use subtle transitions and loading animations to enhance the user experience.