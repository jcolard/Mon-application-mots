console.log("📌 Application démarrée");

const SUPABASE_URL = "https://aiddstzhjchcygpinifg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZGRzdHpoamNoY3lncGluaWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDA2OTQsImV4cCI6MjA3MDMxNjY5NH0.GIferB9cBMGehj3GkVVLbAHy0AHe-L9NY54pl7TGkPM";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const centreContainer = document.getElementById("centre");
const tiroirs = document.querySelectorAll(".dropzone");

async function loadData() {
  centreContainer.innerHTML = "";
  tiroirs.forEach(t => t.innerHTML = "");

  const { data, error } = await supabaseClient
    .from("nuage_de_mot")
    .select("*")
    .order("statut", { ascending: true });

  if (error) {
    console.error("Erreur chargement :", error);
    return;
  }

  data.forEach(item => renderCard(item));
}

function renderCard(item) {
  const card = document.createElement("div");
  card.className = "bg-blue-100 p-2 rounded shadow cursor-move flex justify-between items-center";
  card.setAttribute("draggable", true);
  card.dataset.id = item.id;

  const nomSpan = document.createElement("span");
  nomSpan.textContent = item.nom;
  nomSpan.ondblclick = () => editNom(item.id, nomSpan);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "❌";
  closeBtn.onclick = () => deleteCard(item.id);

  card.appendChild(nomSpan);
  card.appendChild(closeBtn);

  card.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", item.id);
  });

  if (item.statut === "Centre") {
    centreContainer.appendChild(card);
  } else {
    const tiroir = [...document.querySelectorAll("[data-tiroir]")].find(t => t.dataset.tiroir === item.statut);
    tiroir.querySelector(".dropzone").appendChild(card);
  }
}

// Gestion drop
tiroirs.forEach(zone => {
  zone.addEventListener("dragover", e => e.preventDefault());
  zone.addEventListener("drop", async e => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const tiroirName = zone.closest("[data-tiroir]").dataset.tiroir;
    await supabaseClient.from("nuage_de_mot").update({ statut: tiroirName }).eq("id", id);
    loadData();
  });
});

async function deleteCard(id) {
  await supabaseClient.from("nuage_de_mot").delete().eq("id", id);
  loadData();
}

async function editNom(id, span) {
  const nouveauNom = prompt("Nouveau nom :", span.textContent);
  if (nouveauNom && nouveauNom.trim()) {
    await supabaseClient.from("nuage_de_mot").update({ nom: nouveauNom.trim() }).eq("id", id);
    loadData();
  }
}

// Ajout
document.getElementById("addBtn").onclick = () => {
  document.getElementById("modal").classList.remove("hidden");
};
document.getElementById("cancelBtn").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};
document.getElementById("saveBtn").onclick = async () => {
  const nom = document.getElementById("newNom").value.trim();
  if (!nom) return;
  await supabaseClient.from("nuage_de_mot").insert([
    {
      id: crypto.randomUUID(),
      nom,
      statut: "Centre"
    }
  ]);
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("newNom").value = "";
  loadData();
};

loadData();
