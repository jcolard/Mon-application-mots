console.log("✅ Script démarré");

// Récupère la fonction createClient depuis Supabase v1
const { createClient } = window.supabase;

// Clés publiques (anon) → OK pour un site public
const supabaseUrl = 'https://aiddstzhjchcygpinifg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZGRzdHpIamNoY3lncGluaWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyNzU1NzgsImV4cCI6MjAzODg1MTU3OH0.5VVlp9AvwAs3cY01lCAnVgHV21Cta2rrYVtG2D2oXnE';

// Création du client
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchData() {
  const { data, error } = await supabase.from('nuage_de_mot').select('*');

  if (error) {
    console.error("❌ Erreur lors de la récupération :", error);
    document.getElementById('output').textContent = "Erreur : " + error.message;
    return;
  }

  console.log("✅ Données reçues :", data);
  document.getElementById('output').textContent = JSON.stringify(data, null, 2);
}

fetchData();
