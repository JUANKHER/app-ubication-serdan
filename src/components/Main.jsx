import React from "react";
import { Route, Routes, Navigate } from "react-router-native";
import LogInPage from "../pages/Login";
import RegistroPage from "../pages/RegistroPage"; // Asegúrate de importar RegistroPage
import LocationForm from "../pages/UbicationPage";

const Main = () => {
    return (
        <Routes>
            <Route path="/" element={<LogInPage />} />
            <Route path="/registro" element={<RegistroPage />} />
            <Route path="/location" element={<LocationForm />} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Redirección por defecto */}
        </Routes>
    );
};

export default Main;
