console.log("📌 Début exécution code.js");

// --- CONFIGURATION ---
const SUPABASE_URL = "https://aiddstzhjchcygpinifg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZGRzdHpIamNoY3lncGluaWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyNzU1NzgsImV4cCI6MjAzODg1MTU3OH0.5VVlp9AvwAs3cY01lCAnVgHV21Cta2rrYVtG2D2oXnE"; // ⚠️ Clé publique

// Vérification que Supabase est chargé
if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("❌ Supabase n'est pas disponible !");
} else {
    console.log("✅ Supabase est disponible");

    // Création du client
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("📦 Client Supabase créé :", supabaseClient);

    // Exemple : lecture de la table "nuage_de_mot"
    (async () => {
        try {
            const { data, error } = await supabaseClient
                .from("nuage_de_mot")
                .select("*");

            if (error) {
                throw error;
            }

            console.log("📄 Données reçues :", data);
            document.getElementById("output").innerText = JSON.stringify(data, null, 2);
        } catch (err) {
            console.error("⚠️ Erreur Supabase :", err);
            document.getElementById("output").innerText = "Erreur : " + err.message;
        }
    })();
}
