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
    prompt: `Você é o ghostwriter do Bruno Berezaga, CXO da Agência Disco. 
    TOM: Provocador, técnico, visionário. Referencia cases reais (Garmin, Via Veneto). 
    REGRAS: Varie o início, use bullet points para dados técnicos, parágrafos curtos. 
    TERMINA SEMPRE COM: "Bora? 👽"`
  },
  vini: {
    name: "Vinicius Ramos", role: "Sales · Vendedor Relacional", emoji: "🤝", color: "#0891B2",
    prompt: `Você é o ghostwriter do Vinicius Ramos, Head de Sales da Disco. 
    TOM: Humano, relacional, conta histórias de bastidores e parcerias. 
    REGRAS: Fuja de clichês, soe como um colega de trabalho. 
    TERMINA SEMPRE COM: "Bora bater um papo?"`
  },
  disco: {
    name: "Agência Disco", role: "Voz Institucional", emoji: "🛸", color: "#D97706",
    prompt: `Você é a voz institucional da Agência Disco, Shopify Premier Partner. 
    TOM: Autoridade técnica, foco em engenharia de elite e resultados robustos. 
    REGRAS: Direto ao ponto, uso de checklists para diferenciais do projeto.`
  }
};

export default function App() {
  const [tab, setTab] = useState("ghost");
  const [apiKey, setApiKey] = useState(localStorage.getItem("disco_api_key") || "");
  const [persona, setPersona] = useState("bruno");
  const [editoria, setEditoria] = useState("segunda");
  const [tema, setTema] = useState("");
  const [generating, setGenerating] = useState(false);
  const [post, setPost] = useState("");

  useEffect(() => {
    localStorage.setItem("disco_api_key", apiKey);
  }, [apiKey]);

  const gerarPost = async () => {
    if (!apiKey) return alert("Insira sua Gemini API Key");
    setGenerating(true);
    
    try {
      const p = PERSONAS[persona];
      const ed = EDITORIAS[editoria];
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `INSTRUÇÕES DE PERSONA: ${p.prompt}\n\nTEMA: ${tema}\nEDITORIA: ${ed.tag} - ${ed.descricao}\n\nCrie o post seguindo rigorosamente o tom de voz e as regras de escaneabilidade:` }] }]
        })
      });
      
      const data = await res.json();
      setPost(data.candidates[0].content.parts[0].text);
    } catch (e) {
      alert("Erro ao gerar. Verifique sua chave Pro.");
    }
    setGenerating(false);
  };

  const S = {
    app: { fontFamily: "'Inter',sans-serif", minHeight: "100vh", background: "#0F0F0F", color: "#F5F5F5", padding: "24px 16px" },
    wrap: { maxWidth: 680, margin: "0 auto" },
    label: { fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8, display: "block" },
    input: { width: "100%", background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 9, color: "#F5F5F5", padding: "11px 13px", outline: "none", fontSize: 14 },
    card: { background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 12, padding: 16, marginBottom: 12 },
    tabBtn: (active) => ({ flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer", background: active ? "#2A2A2A" : "transparent", color: active ? "#F5F5F5" : "#444", fontWeight: active ? 700 : 400 })
  };

  return (
    <div style={S.app}>
      <div style={S.wrap}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Disco Hub 🛸</h1>
          <p style={{ fontSize: 12, color: "#555", marginTop: 6 }}>Ghostwriter semanal · #mkt-comercial</p>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 28, background: "#1A1A1A", borderRadius: 10, padding: 4 }}>
          <button onClick={() => setTab("ghost")} style={S.tabBtn(tab === "ghost")}>🍎 Ghostwriter</button>
          <button onClick={() => setTab("banco")} style={S.tabBtn(tab === "banco")}>📊 Banco</button>
        </div>

        <div style={S.card}>
            <label style={S.label}>GEMINI PRO API KEY (ENTERPRISE)</label>
            <input type="password" style={S.input} value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Sua chave Pro aqui..." />
        </div>

        <div style={{ background: "#7C3AED18", border: "1px solid #7C3AED33", borderRadius: 10, padding: "10px 14px", marginBottom: 22, fontSize: 12, color: "#A78BFA" }}>
          🚀 **Modo Pro Ativo:** Usando Gemini 1.5 Pro para máxima qualidade técnica.
        </div>

        <label style={S.label}>PARA QUEM?</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {Object.entries(PERSONAS).map(([key, p]) => (
            <button key={key} onClick={() => setPersona(key)} style={{ background: persona === key ? p.color : "#1A1A1A", border: `2px solid ${persona === key ? p.color : "#2A2A2A"}`, borderRadius: 12, padding: "14px 10px", cursor: "pointer", color: "#F5F5F5", textAlign: 'left' }}>
              <div style={{ fontSize: 18 }}>{p.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 12 }}>{p.name.split(" ")[0]}</div>
              <div style={{ fontSize: 10, opacity: 0.5 }}>{p.role.split('·')[0]}</div>
            </button>
          ))}
        </div>

        <label style={S.label}>EDITORIA DA SEMANA</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
          {Object.entries(EDITORIAS).map(([key, e]) => (
            <button key={key} onClick={() => setEditoria(key)} style={{ padding: "13px 10px", borderRadius: 11, border: `2px solid ${editoria === key ? e.cor : "#2A2A2A"}`, background: editoria === key ? e.cor + "22" : "#1A1A1A", color: editoria === key ? e.cor : "#555", cursor: "pointer" }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{e.label}</div>
              <div style={{ fontSize: 10 }}>{e.tag}</div>
            </button>
          ))}
        </div>

        <label style={S.label} mt={20}>TEMA OU INSTRUÇÃO</label>
        <textarea style={{ ...S.input, minHeight: 100, marginBottom: 20 }} value={tema} onChange={e => setTema(e.target.value)} placeholder="Ex: Go-Live da Garmin com foco em metaobjetos..." />

        <button onClick={gerarPost} disabled={generating} style={{ width: "100%", padding: "16px", borderRadius: 10, border: "none", background: PERSONAS[persona].color, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          {generating ? "Refinando texto..." : "Gerar Conteúdo Pro"}
        </button>

        {post && (
          <div style={{ ...S.card, marginTop: 26, border: `1px solid ${PERSONAS[persona].color}44` }}>
            <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.8 }}>{post}</div>
          </div>
        )}
      </div>
    </div>
  );
}
