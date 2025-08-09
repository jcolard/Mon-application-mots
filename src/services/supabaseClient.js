// src/services/supabaseClient.js

// Importe la fonction createClient de la bibliothèque Supabase JavaScript
// La bibliothèque est chargée via importmap dans index.html
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// Vos informations Supabase
const supabaseUrl = 'https://aiddstzhjchcygpinifg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZGRzdHpoamNoY3lncGluaWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDA2OTQsImV4cCI6MjA3MDMxNjY5NH0.GIferB9cBMGehj3GkVVLbAHy0AHe-L9NY54pl7TGkPM';

// Crée et exporte le client Supabase pour l'utiliser dans d'autres fichiers
export const supabase = createClient(supabaseUrl, supabaseKey);
