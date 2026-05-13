import React, { useState, useEffect } from "react";

const STORAGE_KEY = "disco:hub:banco";
const CATEGORIAS = ["Novidade Shopify", "Case Disco", "Inspiração de Post"];
const CATEGORIA_COLORS = { "Novidade Shopify": "#7C3AED", "Case Disco": "#0891B2", "Inspiração de Post": "#D97706" };

const EDITORIAS = {
  segunda: { label: "Segunda", tag: "#DesafioShopify", descricao: "Conteúdo educativo que resolve dúvidas e quebra objeções de lojistas enterprise.", cor: "#7C3AED" },
  quarta:  { label: "Quarta",  tag: "Go Live / Bem-vindo", descricao: "Anúncio de novo cliente, go-live de projeto ou showcase de case Disco.", cor: "#0891B2" },
  sexta:   { label: "Sexta",   tag: "Novidades", descricao: "Novidades da Shopify, do ecossistema Disco ou do mundo do e-commerce.", cor: "#D97706" }
};

const PERSONAS = {
  bruno: {
    name: "Bruno Berezaga", role: "CXO · Arquiteto Visionário", emoji: "🛸", color: "#7C3AED",
    systemPrompt: `Você é o ghostwriter do Bruno Berezaga, CXO da Agência Disco. TOM: Provocador, técnico. Emojis: 🛸 ✨. Termina com 'Bora? 👽'. Regras: Varie o início, frases com ritmo humano, evite clichês de IA.`
  },
  vini: {
    name: "Vinicius Ramos", role: "Sales · Vendedor Relacional", emoji: "🤝", color: "#0891B2",
    systemPrompt: `Você é o ghostwriter do Vinicius Ramos. TOM: Relacional, humano. Termina com 'Bora bater um papo?'. Regras: Fuja de fórmulas fixas, conte histórias reais.`
  },
  disco: {
    name: "Agência Disco", role: "Voz Institucional · Premier Partner", emoji: "🛸", color: "#D97706",
    systemPrompt: `Você é a voz institucional da Agência Disco. TOM: Autoridade técnica, sofisticado. Foco em resultados e engenharia de elite.`
  }
};

const FORMATOS = ["Texto + Imagem", "Roteiro de Vídeo"];

export default function App() {
  const [tab, setTab] = useState("ghost");
  const [apiKey, setApiKey] = useState("");
  const [items, setItems] = useState([]);
  const [persona, setPersona] = useState("bruno");
  const [editoria, setEditoria] = useState("segunda");
  const [tema, setTema] = useState("");
  const [formato, setFormato] = useState("Texto + Imagem");
  const [generating, setGenerating] = useState(false);
  const [post, setPost] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const gerarPost = async () => {
    if (!apiKey) return alert("Insira sua API Key da Anthropic");
    setGenerating(true);
    try {
      const p = PERSONAS[persona];
      const ed = EDITORIAS[editoria];
      const bancoRef = items.slice(0, 10).map(i => `[${i.categoria}] ${i.titulo}: ${i.conteudo}`).join("\n");
      
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "dangerously-allow-browser": "true"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1000,
          system: p.systemPrompt,
          messages: [{ role: "user", content: `BANCO DE DADOS:\n${bancoRef}\n\nTEMA: ${tema}\nEDITORIA: ${ed.tag}\nFORMATO: ${formato}` }]
        })
      });
      const data = await res.json();
      setPost(data.content[0].text);
    } catch { alert("Erro ao gerar."); }
    setGenerating(false);
  };

  const S = {
    app: { fontFamily: "'Inter',sans-serif", minHeight: "100vh", background: "#0F0F0F", color: "#F5F5F5", padding: "24px 16px" },
    wrap: { maxWidth: 680, margin: "0 auto" },
    label: { fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8, display: "block" },
    input: { width: "100%", background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 9, color: "#F5F5F5", fontSize: 14, padding: "11px 13px", outline: "none", boxSizing: "border-box" },
    card: { background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 12, padding: 16, marginBottom: 12 },
    tabBtn: (active) => ({ flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer", background: active ? "#2A2A2A" : "transparent", color: active ? "#F5F5F5" : "#444", fontWeight: active ? 700 : 400, fontSize: 13 })
  };

  return (
    <div style={S.app}>
      <div style={S.wrap}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Disco Hub 🛸</h1>
          <p style={{ fontSize: 12, color: "#555", marginTop: 6 }}>Ghostwriter semanal · #mkt-comercial</p>
        </div>

        <div style={S.card}>
            <label style={S.label}>API KEY (Anthropic)</label>
            <input type="password" style={S.input} value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-..." />
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 28, background: "#1A1A1A", borderRadius: 10, padding: 4 }}>
          <button onClick={() => setTab("ghost")} style={S.tabBtn(tab === "ghost")}>🍎 Ghostwriter</button>
          <button onClick={() => setTab("banco")} style={S.tabBtn(tab === "banco")}>📊 Banco</button>
        </div>

        {tab === "ghost" && (
          <div>
            <div style={{ background: "#7C3AED18", border: "1px solid #7C3AED33", borderRadius: 10, padding: "10px 14px", marginBottom: 22, fontSize: 12, color: "#A78BFA" }}>
              🌐 Pesquisa na internet + {items.length} itens do banco · 3 vozes: Bruno, Vini e Agência
            </div>

            <label style={S.label}>PARA QUEM?</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {Object.entries(PERSONAS).map(([key, p]) => (
                <button key={key} onClick={() => setPersona(key)} style={{ background: persona === key ? p.color : "#1A1A1A", border: `2px solid ${persona === key ? p.color : "#2A2A2A"}`, borderRadius: 12, padding: "14px 10px", cursor: "pointer", textAlign: "left", color: "#F5F5F5" }}>
                  <div style={{ fontSize: 18 }}>{p.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{p.name.split(" ")[0]}</div>
                  <div style={{ fontSize: 10, opacity: 0.6 }}>{p.role.split("·")[0]}</div>
                </button>
              ))}
            </div>

            <label style={S.label}>EDITORIA DA SEMANA</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
              {Object.entries(EDITORIAS).map(([key, e]) => (
                <button key={key} onClick={() => setEditoria(key)} style={{ padding: "13px 10px", borderRadius: 11, border: `2px solid ${editoria === key ? e.cor : "#2A2A2A"}`, background: editoria === key ? e.cor + "22" : "#1A1A1A", color: editoria === key ? e.cor : "#555", cursor: "pointer" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{e.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.8 }}>{e.tag}</div>
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 20, padding: "8px 12px", background: "#1A1A1A", borderRadius: 8, fontSize: 12, color: "#555" }}>{EDITORIAS[editoria].descricao}</div>

            <label style={S.label}>FORMATO</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {FORMATOS.map(f => (
                <button key={f} onClick={() => setFormato(f)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${formato === f ? "#555" : "#2A2A2A"}`, background: formato === f ? "#2A2A2A" : "transparent", color: formato === f ? "#F5F5F5" : "#555", fontSize: 11, cursor: "pointer" }}>{f}</button>
              ))}
            </div>

            <label style={S.label}>TEMA OU INSTRUÇÃO</label>
            <textarea style={{ ...S.input, minHeight: 100, marginBottom: 20 }} value={tema} onChange={e => setTema(e.target.value)} placeholder="Ex: Go-Live da Garmin com foco em metaobjetos..." />

            <button onClick={gerarPost} disabled={generating} style={{ width: "100%", padding: "16px", borderRadius: 10, border: "none", background: PERSONAS[persona].color, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
              {generating ? "Gerando..." : "Gerar Conteúdo de Elite"}
            </button>

            {post && (
              <div style={{ ...S.card, marginTop: 26, border: `1px solid ${PERSONAS[persona].color}44` }}>
                <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.8 }}>{post}</div>
                <button onClick={() => navigator.clipboard.writeText(post)} style={{ width: "100%", marginTop: 15, padding: "10px", background: "#2A2A2A", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer" }}>Copiar Texto</button>
              </div>
            )}
          </div>
        )}
        
        {tab === "banco" && (
            <div style={{ textAlign: "center", color: "#555", padding: 40 }}>
                Funcionalidade de banco disponível. Adicione seus itens aqui.
            </div>
        )}
      </div>
    </div>
  );
}
