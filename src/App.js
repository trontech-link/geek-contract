import React from 'react';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import './assets/styles/App.css';
import Question from './components/Question';
import Main from './components/Main';
import { useSelector } from 'react-redux';

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
  console.log("App.js connectStatus=" + useSelector(state => state.rooter.connectStatus));
  return (
    <RouterProvider router={router} />
  );
}

export default App;
