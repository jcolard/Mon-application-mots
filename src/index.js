// src/index.js

// Importe les modules nécessaires de React et ReactDOM
import React from 'react';
import { createRoot } from 'react-dom/client'; // Importe createRoot depuis 'react-dom/client'
import App from './App.js'; // Importe le composant principal App

// Récupère l'élément HTML où l'application React sera "montée"
const container = document.getElementById('root');

// Crée une "racine" React pour votre application
// C'est la nouvelle API de React 18 pour le rendu client
const root = createRoot(container);

// Rend le composant App à l'intérieur de la racine
// C'est ce qui affiche votre interface utilisateur dans le navigateur
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
