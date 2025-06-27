# CCCWeb/CCChamps.org

CCChamps.org is a web app allowing users to view match statistics from the [Collegiate Cubing Championship](https://www.youtube.com/@CollegiateCubingChampionship), a 32-team online speedcubing tournament. There is also an admin-only system for managing matches and updating the livestream overlay in real time.

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- Firebase CLI and a Firebase project (required for admin-only system described above)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShidemantleJ/cccweb.git
   cd cccweb
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Firebase (required if using judging dashboard, available to logged-in admins only):
   - Install Firebase CLI if not already installed:
     ```bash
     npm install -g firebase-tools
     ```
   - Log in to Firebase and initialize:
     ```bash
     firebase login
     firebase init
     ```
   - Configure your Firebase project settings in `src/firebase.js`.

### Running Locally

To start the development server:
```bash
npm start
```
The app will be available at [http://localhost:3000](http://localhost:3000).