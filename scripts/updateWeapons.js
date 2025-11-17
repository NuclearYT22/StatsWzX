// ===============================================
// updateWeapons.js – versão estável e corrigida
// ===============================================

import fetch from "node-fetch";
import fs from "fs";

const API_URL = "https://wzranked.io/api/weapons";

async function atualizarArmas() {
  console.log("📡 Buscando dados do WZRanked...");

  const resposta = await fetch(API_URL);
  const json = await resposta.json();

  if (!json || !json.weapons) {
    console.error("❌ Erro: não foi possível ler dados do WZRanked.");
    return;
  }

  console.log(`📦 ${json.weapons.length} armas recebidas`);

  const armasConvertidas = json.weapons.map(arma => {

    // Nome de fallback para evitar imagem preta
    const nomeSeguro = arma.name && arma.name.trim() !== "" 
      ? arma.name 
      : "Unknown Weapon";

    // Attachments PROTEGIDOS
    let atts = [];
    if (arma.bestAttachments && Array.isArray(arma.bestAttachments)) {
      atts = arma.bestAttachments.map(att => ({
        slot: att.slot || "Unknown Slot",
        nome: att.name || "Unknown Attachment"
      }));
    }

    return {
      name: nomeSeguro,
      category: arma.category || "Unknown",
      tier: arma.tier || "B",
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeSeguro)}&background=1a1a1a&color=fff`,
      stats: {
        usage: arma.popularity ? arma.popularity + "%" : "0%",
        kd: arma.kdRatio || "0.00",
        winrate: arma.winRate ? arma.winRate + "%" : "0%",
        ttk: arma.avgTTK || "N/A"
      },
      attachments: atts
    };
  });

  const finalJSON = {
    atualizado: new Date().toISOString(),
    armas: armasConvertidas
  };

  fs.writeFileSync("dados.json", JSON.stringify(finalJSON, null, 2));

  console.log("✅ dados.json atualizado com sucesso!");
}

atualizarArmas();
