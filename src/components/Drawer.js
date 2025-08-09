// src/components/Drawer.js

import React, { useState } from 'react';

// Drawer est un composant fonctionnel React
function Drawer({ title, children, onDropWord }) {
    const [isDragOver, setIsDragOver] = useState(false); // État pour gérer le style de survol

    // Gère l'événement quand un élément est au-dessus de la zone de dépôt
    const handleDragOver = (e) => {
        e.preventDefault(); // Nécessaire pour permettre le dépôt
        setIsDragOver(true); // Active le style de survol
    };

    // Gère l'événement quand un élément quitte la zone de dépôt
    const handleDragLeave = () => {
        setIsDragOver(false); // Désactive le style de survol
    };

    // Gère l'événement quand un élément est déposé dans la zone
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false); // Désactive le style de survol

        // Récupère l'ID du mot déposé depuis les données de transfert
        const wordId = e.dataTransfer.getData('text/plain');
        // Appelle la fonction onDropWord passée par le parent (App.js)
        // avec l'ID du mot et le nouveau statut (titre du tiroir)
        onDropWord(wordId, title);
    };

    return (
        <div
            className={`drop-zone ${isDragOver ? 'drag-over' : ''}`} // Applique le style de survol si nécessaire
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
            {children} {/* Affiche les mots contenus dans ce tiroir */}
        </div>
    );
}

export default Drawer;
