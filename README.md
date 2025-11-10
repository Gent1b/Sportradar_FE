# Sportradar Frontend Challenge

This project is a small sports event calendar built with **Vanilla JavaScript**, **Vite**, and **happy-dom** for testing.  
It allows users to view, add, and filter sports events by type, with persistent storage using `localStorage`.


## Features
- Interactive monthly calendar  
- Add new events through a simple form  
- Filter events by sport  
- Save and load events from `localStorage`  
- Color-coded legend for different sports  
- Basic unit tests with Vitest and happy-dom  


## Tech Stack
- **Frontend:** HTML, CSS, JavaScript (ES Modules)  
- **Build Tool:** Vite  
- **Testing:** Vitest + happy-dom  
- **Storage:** localStorage (JSON-based persistence)


## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/Gent1b/Sportradar_FE.git
   cd Sportradar-Fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm run test
   ```


## Notes
This is a client-side application that runs fully in the browser.  
Events are stored locally and persist after reloading the page.  
Filtering and month navigation work dynamically without reloading.
