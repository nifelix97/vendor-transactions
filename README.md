Vidaripay Transaction History

A standalone React web page that displays a list of Vidaripay transactions using data fetched from a mock API.
This project was completed as part of the Phase 2 Technical Assessment.

🚀 Features

Fetches live transaction data from a mock API.

Displays transaction history in a clean, user-friendly UI.

Handles loading and error states gracefully.

Formats amounts in currency format (e.g., 5,000 RWF).

Shows human-readable dates for transactions.

Status indicators with color codes:

🟢 Success

🔴 Failed

🟠 Pending

Fully mobile responsive layout.

Filter transactions by status.

🛠️ Tech Stack

React + Vite

TypeScript

Tailwind CSS

Fetch() API

Vercel for deployment

📡 API Endpoint

Transaction data is fetched from the following mock API endpoint:

[https://f776e1f2-7f74-4d4d-9ce7-5dfbfbf8b2b2.mock.pstmn.io/test-api/transactions/]

💻 Installation & Setup

Clone the repository:

git clone https://github.com/nifelix97/vendor-transactions.git


Navigate into the project directory:

cd vendor-transactions


Install dependencies:

npm install


Start the development server:

npm run dev


Open your browser at http://localhost:5173.

🌐 Deployment

The project is hosted on Vercel for easy live access.
[View Live Demo](https://vendor-transactions.vercel.app/)
