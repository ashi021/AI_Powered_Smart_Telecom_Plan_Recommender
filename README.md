# Telecom Plan Finder

A sophisticated, user-friendly web application designed to help users find, compare, and select telecom plans and products. This AI-powered tool provides personalized recommendations based on specific needs and requirements, supports a comprehensive list of countries, and includes several powerful utilities to assist in the decision-making process.

## Key Features

-   **AI-Powered Recommendations**: Utilizes the Google Gemini API to generate tailored plan recommendations based on a detailed user profile.
-   **Global Database**: Features an extensive database of over 190 countries, including their major cities, currencies, and real-world telecom providers.
-   **Advanced Filtering**: Users can specify budget, data usage, desired features (like OTT services), and even preferred providers to fine-tune results.
-   **Side-by-Side Comparison**: An intuitive interface to compare multiple plans across various metrics, including cost, data, speed, and perks.
-   **Interactive Coverage Map**: A fully functional map built with Leaflet.js and OpenStreetMap (no API key required) that visualizes simulated network coverage for providers in any selected country.
-   **Telecom Utilities**:
    -   **Speed Test**: A simulated tool to check network performance.
    -   **Bill Estimator**: Calculates the potential monthly bill based on a recommended plan and usage patterns.
-   **Responsive Design**: A clean, modern, and fully responsive UI built with Tailwind CSS, ensuring a great experience on both desktop and mobile devices.

## Tech Stack

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS
-   **Mapping**: Leaflet.js & OpenStreetMap
-   **AI Engine**: Google Gemini API (`@google/genai`)
-   **Runtime**: Browser-based (no server or build step required)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You only need a modern web browser (like Chrome, Firefox, or Safari) and a text editor.

### Setup Instructions

1.  **Obtain the Project Files**:
    Save all the provided project files (`index.html`, `index.tsx`, `App.tsx`, etc.) into a single folder on your computer.

2.  **Configure Environment Variables**:
    This project requires an API key for the Google Gemini API to power the recommendation engine.

    -   Create a new file named `.env` in the root of your project folder.
    -   Inside the `.env` file, add your API key like this:

    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```

    > **Important**: The application is configured to load this key from `process.env.API_KEY`. Without this key, the core "Find My Plan" feature will not work. You can get a key from [Google AI Studio](https://aistudio.google.com/).

3.  **Running the Application**:
    Since this project uses modern JavaScript features (`importmap`) and is designed for a no-build-step development environment, you need to serve the files using a simple local web server.

    -   Open a terminal or command prompt in your project folder.
    -   If you have Python 3, run: `python -m http.server`
    -   If you have Node.js, you can install a simple server: `npm install -g serve` and then run: `serve`
    -   Open your web browser and navigate to the local address provided by the server (usually `http://localhost:8000` or `http://localhost:3000`).

## How to Use

1.  **Navigate to the Finder Tab**: The application opens on the main recommender tool.
2.  **Fill out the Form**:
    -   Start typing your country name and select it from the autocomplete list.
    -   Choose a city and adjust sliders for the number of lines, data usage, and budget.
    -   Select your primary uses, desired features/perks, and optionally, preferred providers.
3.  **Get Recommendations**: Click the "Find My Plan" button. The AI will analyze your profile and return the top 3 recommendations.
4.  **Compare Plans**: Click "Add to Compare" on any plan card. The comparison table will appear at the bottom of the page.
5.  **Explore Other Tabs**:
    -   **Coverage**: Select a country to see an interactive map with simulated network overlays.
    -   **Speed Test**: Run a simulated test of your internet speed.
    -   **Bill Estimator**: Choose a recommended plan and estimate your monthly bill.