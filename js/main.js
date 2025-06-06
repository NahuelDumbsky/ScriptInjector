const csInterface = new CSInterface();

function loadScripts() {
  csInterface.evalScript("loadScriptList()", result => {
    const scripts = JSON.parse(result || "[]");
    const list = document.getElementById("script-list");
    list.innerHTML = "";

    if (scripts.length === 0) return;

    scripts.forEach(script => {
      const div = document.createElement("div");
      div.className = "script-card";
      div.innerHTML = `
        <div class="script-info">
          <strong>${script.name}</strong><br/>
          <em>${script.type}</em>
        </div>
        <div class="script-buttons">
          <label><input type="checkbox" class="slider" ${script.autorun ? "checked" : ""}></label>
          <button class="button-run">▶</button>
          <button class="button-edit">✎</button>
          <button class="button-move">☰</button>
          <button class="button-delete">✕</button>
        </div>
      `;
      // Eventos
      div.querySelector(".button-run").onclick = () => {
        csInterface.evalScript(`runScript("${script.name}")`);
      };

      div.querySelector(".button-delete").onclick = () => {
        if (confirm(`¿Eliminar script "${script.name}"?`)) {
          csInterface.evalScript(`deleteScript("${script.name}")`, loadScripts);
        }
      };

      div.querySelector(".button-edit").onclick = () => {
        document.getElementById("editor-modal").classList.remove("hidden");
        document.getElementById("editor-title").textContent = script.name;
        csInterface.evalScript(`readScript("${script.name}")`, content => {
          document.getElementById("editor-code").value = content;
        });
      };

      list.appendChild(div);
    });
  });
}

document.getElementById("add-script").addEventListener("click", () => {
  const name = prompt("Nombre del script:");
  const code = prompt("Código ExtendScript (.jsx):");

  if (name && code) {
    csInterface.evalScript(`saveScript("${name}", \`${code}\`)`, loadScripts);
  }
});

loadScripts();

// Cancelar edición
document.getElementById("editor-cancel").addEventListener("click", () => {
  document.getElementById("editor-modal").classList.add("hidden");
  document.getElementById("editor-code").value = "";
});

// Guardar edición
document.getElementById("editor-save").addEventListener("click", () => {
  const name = document.getElementById("editor-title").textContent;
  const code = document.getElementById("editor-code").value;
  csInterface.evalScript(`saveScript("${name}", \`${code}\`)`, () => {
    document.getElementById("editor-modal").classList.add("hidden");
    loadScripts();
  });
});
