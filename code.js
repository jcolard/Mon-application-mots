console.log("📌 Début exécution code.js");

// --- CONFIGURATION ---
const SUPABASE_URL = "https://<TON-PROJET>.supabase.co";
const SUPABASE_KEY = "<TA-CLÉ-ANON-PUBLIQUE>"; // ⚠️ Clé publique uniquement

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
