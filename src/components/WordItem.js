// src/components/WordItem.js

import React from 'react';

// WordItem est un composant fonctionnel React
function WordItem({ word, onDelete, onDragStart }) {
    // Gère le début du glisser-déposer pour cet élément
    const handleDragStart = (e) => {
        // Envoie les données (l'ID du mot) via l'événement de transfert
        e.dataTransfer.setData('text/plain', word.id);
        // Ajoute une classe pour l'effet visuel pendant le glisser
        e.currentTarget.classList.add('opacity-50');
        // Appelle la fonction onDragStart passée par le parent (App.js)
        // pour stocker l'ID du mot actuellement glissé
        onDragStart(word.id);
    };

    // Gère la fin du glisser-déposer
    const handleDragEnd = (e) => {
        // Supprime la classe d'opacité à la fin du glisser
        e.currentTarget.classList.remove('opacity-50');
    };

    return (
        <div
            id={`word-${word.id}`} // ID unique basé sur l'ID Supabase
            className="word-item"
            draggable="true" // Rend l'élément déplaçable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {word.Nom} {/* Affiche le nom du mot */}
            <span
                className="delete-btn"
                onClick={() => onDelete(word.id)} // Appelle onDelete avec l'ID du mot
            >
                &times; {/* Affiche une croix pour la suppression */}
            </span>
        </div>
    );
}

export default WordItem;
