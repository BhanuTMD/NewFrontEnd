# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



# CSIR-TMD-TDMP Frontend

This is the frontend of the **CSIR-TMD-TDMP** system, developed using **ReactJS** and **TailwindCSS**. The code is cleanly structured with reusable components, separate page-level modules, and well-organized logic — ideal for scalability and collaboration.

---

## 🧠 Project Author

**Developed by:** *[Ritesh Gupta]*  
**Role:** Full-Stack Developer  
**Experience:** 2+ years  

---

## 🚀 Project Structure

src/
│
├── components/ # Reusable UI components
│ ├── auth/ # Login, Signup, OTP, Validations etc.
│ ├── common/ # Header, Footer, Navbar, SearchBar etc.
│ └── utils/ # Helpers like CustomSelect etc.
│
├── pages/ # Route-level screens
│ ├── TechSearch/ # Form-based multi-section Tech Search page
│ └── WelcomePage/ # Landing/introductory page
│
├── routes/ # All routes and navigation config
│
├── App.js # App entry component
├── index.js # ReactDOM rendering
├── index.css # TailwindCSS styles
└── tailwind.config.js # Tailwind custom config


---

## ⚙️ Technologies Used

- **ReactJS**
- **TailwindCSS**
- **React Router DOM**
- **JavaScript (ES6)**

---

## 💻 Setup Instructions

### 1. Clone the project

```bash
git clone https://github.com/your-username/csir-frontend.git
cd csir-frontend

2. Install node modules
bash
Copy
Edit
npm install
3. Start development server
bash
Copy
Edit
npm run start
Open http://localhost:3000 to view it in your browser.

🧩 Folder Responsibility
Folder	Purpose
components/auth	Login/Signup-related components
components/common	Footer, Header, Navbar, etc.
pages/WelcomePage	Welcome/Landing screen
pages/TechSearch	Multi-step tech form with preview & options
utils	Shared utility components or functions

📘 Coding Guidelines
Use PascalCase for component files (e.g. TechSearchForm.js)

Use camelCase for variable and function names

Keep logic modular and reusable

Maintain relative imports properly

🔐 .gitignore Recommendations
Ensure you add this .gitignore:

bash
Copy
Edit
node_modules/
.env
dist/