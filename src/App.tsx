import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectAuth } from "./contexts/slices/authSlice";

import DynamicMenu from "./components/DynamicMenu";
import ProtectedRoute from "./components/ProtectedRoute";

//import logo from "./logo.svg";
//import "./App.css";

import Login from "./pages/Login";
import Main from "./pages/Main";
import QrCodePrint from "./pages/JobPacking/QrCodePrint";
import QrCodePrintAll from "./pages/JobPacking/QrCodePrintAll";

import Error404 from "./pages/Error404";

const App: React.FC = () => {
  document.title = import.meta.env.VITE_APP_NAME as string;

  const { authResult } = useSelector(selectAuth);

  return (
    <>
      <Routes>
        <Route
          index
          element={
            <Navigate to={`${import.meta.env.VITE_APP_PUBLIC_URL}/`} replace />
          }
        />
        <Route
          //index
          path={`${import.meta.env.VITE_APP_PUBLIC_URL}/`}
          element={
            authResult?.status ? (
              <Navigate
                to={`${import.meta.env.VITE_APP_PUBLIC_URL}/Main`}
                replace
              />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path={`${import.meta.env.VITE_APP_PUBLIC_URL}/Main/*`}
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route path={`${import.meta.env.VITE_APP_PUBLIC_URL}/QrCodePrint`} element={<QrCodePrint/>} />
        <Route path={`${import.meta.env.VITE_APP_PUBLIC_URL}/QrCodePrintAll`} element={<QrCodePrintAll/>} /> 

        <Route path={`/*`} element={<Error404 />} />
        <Route
          path={`${import.meta.env.VITE_APP_PUBLIC_URL}/*`}
          element={<Error404 />}
        />
      </Routes>
    </>
  );
};

export default App;
