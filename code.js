console.log("✅ Début exécution code.js");

window.addEventListener("DOMContentLoaded", function () {
    console.log("📌 DOMContentLoaded déclenché");
    console.log("📦 Contenu de window :", window);

    // Vérif si Supabase est défini
    console.log("🔍 window.supabase =", window.supabase);
    console.log("🔍 typeof window.supabase =", typeof window.supabase);

    console.log("🔍 typeof createClient global =", typeof createClient);

    if (!window.supabase && typeof createClient !== "function") {
        console.error("❌ ERREUR : Supabase n'est pas chargé du tout !");
        return;
    }

    // Cas 1 : createClient est global (nouvelle version UMD)
    if (typeof createClient === "function") {
        console.log("✅ createClient trouvé dans le global scope");
    }
    // Cas 2 : createClient vient de window.supabase (ancienne version UMD)
    else if (window.supabase && typeof window.supabase.createClient === "function") {
        console.log("✅ createClient trouvé dans window.supabase");
        createClient = window.supabase.createClient;
    }

    // Initialisation Supabase
    const supabaseUrl = 'https://aiddstzhjchcygpinifg.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZGRzdHpIamNoY3lncGluaWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyNzU1NzgsImV4cCI6MjAzODg1MTU3OH0.5VVlp9AvwAs3cY01lCAnVgHV21Cta2rrYVtG2D2oXnE';
    
    console.log("🚀 Initialisation du client Supabase…");
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Client Supabase créé :", supabaseClient);

    // Petit test de requête
    supabaseClient.from('nuage_de_mot').select('*').then(({ data, error }) => {
        if (error) {
            console.error("❌ Erreur lors de la requête test :", error);
        } else {
            console.log("✅ Données reçues depuis Supabase :", data);
        }
    });
});
