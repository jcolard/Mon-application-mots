// Vérification que Supabase est chargé
if (!window.supabase) {
    console.error("❌ Supabase n'est pas chargé. Vérifie que le script du CDN est bien avant ce fichier.");
} else {
    const { createClient } = window.supabase;

    // 🔑 Config Supabase avec clé anon publique complète
    const supabaseUrl = 'https://aiddstzhjchcygpinifg.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZGRzdHpIamNoY3lncGluaWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyNzU1NzgsImV4cCI6MjAzODg1MTU3OH0.5VVlp9AvwAs3cY01lCAnVgHV21Cta2rrYVtG2D2oXnE';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Composant WordItem
    function WordItem({ word, onMove }) {
        return React.createElement(
            "div",
            { className: "p-2 bg-white rounded shadow cursor-pointer hover:bg-blue-100", onClick: () => onMove(word) },
            word.text
        );
    }

    // Composant Drawer
    function Drawer({ title, words, onMove }) {
        return React.createElement(
            "div",
            { className: "p-4 bg-gray-100 rounded-lg shadow min-h-[150px] flex flex-col gap-2" },
            React.createElement("h2", { className: "font-bold mb-2" }, title),
            words.map(w => React.createElement(WordItem, { key: w.id, word: w, onMove }))
        );
    }

    // Composant principal
    function App() {
        const [words, setWords] = React.useState([]);
        const centerStatus = "Centre";
        const drawerStatuses = ["Tiroir 1", "Tiroir 2", "Tiroir 3", "Tiroir 4"];

        // Charger les données depuis Supabase
        React.useEffect(() => {
            (async () => {
                const { data, error } = await supabase.from('nuage_de_mot').select('*');
                if (error) {
                    console.error("Erreur Supabase :", error.message);
                } else {
                    setWords(data || []);
                }
            })();
        }, []);

        // Déplacer un mot
        function moveWord(word) {
            const newStatus =
                word.status === centerStatus
                    ? drawerStatuses[0]
                    : word.status === drawerStatuses[drawerStatuses.length - 1]
                    ? centerStatus
                    : drawerStatuses[drawerStatuses.indexOf(word.status) + 1];

            const updatedWords = words.map(w =>
                w.id === word.id ? { ...w, status: newStatus } : w
            );
            setWords(updatedWords);

            // Mettre à jour dans Supabase
            supabase
                .from('nuage_de_mot')
                .update({ status: newStatus })
                .eq('id', word.id)
                .then(({ error }) => {
                    if (error) console.error("Erreur mise à jour :", error.message);
                });
        }

        // Rendu
        return React.createElement(
            "div",
            { className: "grid grid-cols-5 gap-4" },
            React.createElement(
                Drawer,
                {
                    title: centerStatus,
                    words: words.filter(w => w.status === centerStatus),
                    onMove: moveWord
                }
            ),
            drawerStatuses.map((status, i) =>
                React.createElement(Drawer, {
                    key: i,
                    title: status,
                    words: words.filter(w => w.status === status),
                    onMove: moveWord
                })
            )
        );
    }

    // Monter l'app React
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(React.createElement(App, null));
}
