import React from 'react';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import './assets/styles/App.css';
import Question from './components/Question';
import Main from './components/Main';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "questions/:questionId",
        element: <Question />,
      }
    ]
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
