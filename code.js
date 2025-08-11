const { createClient } = window.supabase;

const supabaseUrl = 'https://aiddstzhjchcygpinifg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZGRzdHpoamNoY3lncGluaWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDA2OTQsImV4cCI6MjA3MDMxNjY5NH0.GIferB9cBMGehj3GkVVLbAHy0AHe-L9NY54pl7TGkPM';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Composant pour chaque mot
function WordItem({ word, onDelete, onDragStart }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', word.id);
    e.currentTarget.classList.add('opacity-50');
    onDragStart(word.id);
  };
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50');
  };
  return React.createElement("div", { id: `word-${word.id}`, className: "word-item", draggable: "true", onDragStart: handleDragStart, onDragEnd: handleDragEnd },
    word.nom,
    React.createElement("span", { className: "delete-btn", onClick: () => onDelete(word.id) }, "×")
  );
}

// Composant tiroir
function Drawer({ title, children, onDropWord }) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => { setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const wordId = e.dataTransfer.getData('text/plain');
    onDropWord(wordId, title);
  };
  return React.createElement("div", { className: `drop-zone ${isDragOver ? 'drag-over' : ''}`, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop },
    React.createElement("h2", { className: "text-xl font-semibold text-gray-700 mb-2" }, title),
    React.createElement("div", { className: "word-container" }, children)
  );
}

// Composant principal
function App() {
  const [words, setWords] = React.useState([]);
  const [newWordText, setNewWordText] = React.useState('');
  const drawerStatuses = ["Tiroir 1", "Tiroir 2", "Tiroir 3", "Tiroir 4"];
  const centerStatus = "Centre";

  const fetchWords = async () => {
    const { data, error } = await supabaseClient.from('nuage_de_mot').select('*');
    if (error) {
      console.error('Erreur Supabase (fetch):', error);
    } else {
      setWords(data || []);
    }
  };

  React.useEffect(() => { fetchWords(); }, []);

  const handleAddWord = async () => {
    if (!newWordText.trim()) return;
    const tempId = `temp-${Date.now()}`;
    const newWord = { id: tempId, nom: newWordText.trim(), statut: centerStatus };
    setWords(prevWords => [...prevWords, newWord]);
    setNewWordText('');

    const { data, error } = await supabaseClient
      .from('nuage_de_mot')
      .insert([{ nom: newWord.nom, statut: newWord.statut }])
      .select();

    if (error) {
      console.error('Erreur Supabase (add):', error);
      setWords(prevWords => prevWords.filter(word => word.id !== tempId));
    } else {
      setWords(prevWords => prevWords.map(word => word.id === tempId ? data[0] : word));
    }
  };

  const handleDropWord = async (wordId, newStatus) => {
    const numericWordId = isNaN(parseInt(wordId, 10)) ? wordId : parseInt(wordId, 10);
    setWords(prevWords => prevWords.map(word => word.id === numericWordId ? { ...word, statut: newStatus } : word));

    const { error } = await supabaseClient
      .from('nuage_de_mot')
      .update({ statut: newStatus })
      .eq('id', numericWordId);

    if (error) {
      console.error('Erreur Supabase (drop):', error);
      fetchWords();
    }
  };

  const handleDeleteWord = async (wordId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce mot ?")) return;
    const numericWordId = isNaN(parseInt(wordId, 10)) ? wordId : parseInt(wordId, 10);
    const originalWords = [...words];
    setWords(prevWords => prevWords.filter(word => word.id !== numericWordId));

    const { error } = await supabaseClient
      .from('nuage_de_mot')
      .delete()
      .eq('id', numericWordId);

    if (error) {
      console.error('Erreur Supabase (delete):', error);
      setWords(originalWords);
    }
  };

  return React.createElement("div", { className: "flex flex-col items-center p-4" },
    React.createElement("h1", { className: "text-3xl font-bold text-gray-800 mb-8 mt-4" }, "Glissez les mots dans les tiroirs !"),
    React.createElement("div", { className: "bg-white p-4 rounded-lg shadow-md mb-8 flex gap-2 w-full max-w-md" },
      React.createElement("input", { type: "text", className: "flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Ajouter un nouveau mot...", value: newWordText, onChange: (e) => setNewWordText(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleAddWord() }),
      React.createElement("button", { className: "px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors", onClick: handleAddWord }, "Ajouter")
    ),
    React.createElement("h2", { className: "text-2xl font-semibold text-gray-800 mb-4" }, "Mots non rangés"),
    React.createElement("div", { id: "wordCloud", className: "word-cloud-container" },
      words.filter(word => word.statut === centerStatus).map(word => React.createElement(WordItem, { key: word.id, word: word, onDelete: handleDeleteWord, onDragStart: () => {} }))
    ),
    React.createElement("h2", { className: "text-2xl font-semibold text-gray-800 mb-4 mt-8" }, "Tiroirs"),
    React.createElement("div", { id: "dropZones", className: "drop-zones-container" },
      drawerStatuses.map(status => React.createElement(Drawer, { key: status, title: status, onDropWord: handleDropWord },
        words.filter(word => word.statut === status).map(word => React.createElement(WordItem, { key: word.id, word: word, onDelete: handleDeleteWord, onDragStart: () => {} }))
      ))
    )
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(React.StrictMode, null, React.createElement(App, null)));
