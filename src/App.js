// src/App.js

import React, { useState, useEffect } from 'react';
import WordItem from './components/WordItem.js';
import Drawer from './components/Drawer.js';
import { supabase } from './services/supabaseClient.js';

function App() {
    // État pour stocker la liste des mots récupérés de Supabase
    // Chaque mot aura la structure: { id, created_at, Nom, Statut }
    const [words, setWords] = useState([]);
    // État pour gérer le champ d'entrée du nouveau mot
    const [newWordText, setNewWordText] = useState('');
    // État pour stocker l'ID du mot actuellement glissé
    const [draggedWordId, setDraggedWordId] = useState(null);

    // Liste des statuts (tiroirs)
    const drawerStatuses = ["Tiroir 1", "Tiroir 2", "Tiroir 3", "Tiroir 4"];
    const centerStatus = "Centre"; // Statut pour les mots non rangés

    // Fonction pour récupérer les mots depuis Supabase
    const fetchWords = async () => {
        try {
            // Requête SELECT * from "Nuage de mot"
            const { data, error } = await supabase
                .from('Nuage de mot')
                .select('*');

            if (error) throw error;
            setWords(data || []); // Met à jour l'état avec les données récupérées
        } catch (error) {
            console.error('Erreur lors de la récupération des mots:', error.message);
        }
    };

    // Utilise useEffect pour exécuter fetchWords au chargement initial de l'application
    useEffect(() => {
        fetchWords();
    }, []); // Le tableau vide [] signifie que cela ne s'exécute qu'une seule fois au montage

    // Gère l'ajout d'un nouveau mot
    const handleAddWord = async () => {
        if (!newWordText.trim()) return; // Ne rien faire si le champ est vide

        // 1. Optimistic UI: Ajoute immédiatement le mot à l'état local
        // Cela rend l'expérience utilisateur plus réactive
        const tempId = `temp-${Date.now()}`; // ID temporaire pour le nouveau mot
        const newWord = {
            id: tempId, // Utilise l'ID temporaire pour l'affichage immédiat
            Nom: newWordText.trim(),
            Statut: centerStatus, // Le nouveau mot est par défaut au centre
            created_at: new Date().toISOString() // Date actuelle
        };
        setWords(prevWords => [...prevWords, newWord]);
        setNewWordText(''); // Réinitialise le champ d'entrée

        try {
            // 2. Envoie la requête INSERT à Supabase
            // Supabase remplira automatiquement ID et created_at
            const { data, error } = await supabase
                .from('Nuage de mot')
                .insert([{ Nom: newWord.Nom, Statut: newWord.Statut }])
                .select(); // Retourne les données insérées

            if (error) throw error;

            // 3. Met à jour l'état avec les données réelles de Supabase (ID final)
            // Remplace le mot temporaire par le mot avec l'ID réel de la BDD
            setWords(prevWords =>
                prevWords.map(word =>
                    word.id === tempId ? { ...data[0], id: data[0].ID } : word
                )
            );
            console.log('Mot ajouté à Supabase:', data[0]);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du mot:', error.message);
            // En cas d'erreur, retire le mot temporaire de l'UI
            setWords(prevWords => prevWords.filter(word => word.id !== tempId));
        }
    };

    // Gère le déplacement d'un mot vers un tiroir
    const handleDropWord = async (wordId, newStatus) => {
        // Met à jour l'état local de manière optimiste
        setWords(prevWords =>
            prevWords.map(word =>
                word.id === wordId ? { ...word, Statut: newStatus } : word
            )
        );

        try {
            // Envoie la requête UPDATE à Supabase
            const { error } = await supabase
                .from('Nuage de mot')
                .update({ Statut: newStatus })
                .eq('ID', wordId); // Met à jour le mot avec l'ID correspondant

            if (error) throw error;
            console.log(`Mot ${wordId} déplacé vers ${newStatus} dans Supabase.`);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error.message);
            // En cas d'erreur, revert l'état local pour refléter la BDD
            fetchWords();
        }
    };

    // Gère la suppression d'un mot
    const handleDeleteWord = async (wordId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce mot ?")) {
            return; // Annule si l'utilisateur ne confirme pas
        }

        // Met à jour l'état local de manière optimiste (retire le mot de l'UI)
        setWords(prevWords => prevWords.filter(word => word.id !== wordId));

        try {
            // Envoie la requête DELETE à Supabase
            const { error } = await supabase
                .from('Nuage de mot')
                .delete()
                .eq('ID', wordId); // Supprime le mot avec l'ID correspondant

            if (error) throw error;
            console.log(`Mot ${wordId} supprimé de Supabase.`);
        } catch (error) {
            console.error('Erreur lors de la suppression du mot:', error.message);
            // En cas d'erreur, ré-affiche le mot en le récupérant de la BDD
            fetchWords();
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-4">Glissez les mots dans les tiroirs !</h1>

            {/* Section pour ajouter un nouveau mot */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex gap-2 w-full max-w-md">
                <input
                    type="text"
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ajouter un nouveau mot..."
                    value={newWordText}
                    onChange={(e) => setNewWordText(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleAddWord();
                        }
                    }}
                />
                <button
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                    onClick={handleAddWord}
                >
                    Ajouter
                </button>
            </div>

            {/* Conteneur des mots non rangés (Statut: Centre) */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mots non rangés</h2>
            <div id="wordCloud" className="word-cloud-container">
                {words
                    .filter(word => word.Statut === centerStatus)
                    .map(word => (
                        <WordItem
                            key={word.id}
                            word={word}
                            onDelete={handleDeleteWord}
                            onDragStart={setDraggedWordId}
                        />
                    ))}
                {/* Zone de dépôt implicite pour le centre (si vous voulez y redéposer) */}
                <Drawer title={centerStatus} onDropWord={handleDropWord}>
                    {/* Les mots sont filtrés directement dans le .map ci-dessus */}
                </Drawer>
            </div>

            {/* Conteneur des tiroirs (Zones de dépôt) */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">Tiroirs</h2>
            <div id="dropZones" className="drop-zones-container">
                {drawerStatuses.map(status => (
                    <Drawer key={status} title={status} onDropWord={handleDropWord}>
                        {words
                            .filter(word => word.Statut === status)
                            .map(word => (
                                <WordItem
                                    key={word.id}
                                    word={word}
                                    onDelete={handleDeleteWord}
                                    onDragStart={setDraggedWordId}
                                />
                            ))}
                    </Drawer>
                ))}
            </div>
        </div>
    );
}

export default App;
