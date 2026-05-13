import React, { useState, useEffect } from "react";

// Estilos rápidos via CSS-in-JS para manter o padrão Disco
const styles = {
  app: { fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#0F0F0F", color: "#F5F5F5", padding: "24px 16px" },
  wrap: { maxWidth: 680, margin: "0 auto" },
  card: { background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 12, padding: 16, marginBottom: 12 },
  input: { width: "100%", background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 9, color: "#F5F5F5", padding: "12px", marginBottom: 10, outline: "none" },
  button: { width: "100%", padding: "14px", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", transition: "0.2s" }
};

const PERSONAS = {
  bruno: {
    name: "Bruno Berezaga", role: "CXO · Arquiteto Visionário", emoji: "🛸", color: "#7C3AED",
    prompt: "Você é o ghostwriter do Bruno Berezaga, CXO da Agência Disco. TOM: Provocador, técnico. Emojis: 🛸 ✨. Termina com 'Bora? 👽'. Regras: Varie o início, evite clichês de IA, frases com ritmo humano."
  },
  vini: {
    name: "Vinicius Ramos", role: "Sales · Relacional", emoji: "🤝", color: "#0891B2",
    prompt: "Você é o ghostwriter do Vinicius Ramos. TOM: Humano, relacional. Termina com 'Bora bater um papo?'. Regras: Fuja de fórmulas fixas, conte histórias reais, seja direto."
  },
  disco: {
    name: "Agência Disco", role: "Institucional", emoji: "✨", color: "#D97706",
    prompt: "Você é a voz institucional da Agência Disco. TOM: Autoridade técnica, sofisticado. Foco em resultados e engenharia. Use bullets para dados técnicos."
  }
};

export default function DiscoHub() {
  const [apiKey, setApiKey] = useState("");
  const [persona, setPersona] = useState("bruno");
  const [tema, setTema] = useState("");
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [banco, setBanco] = useState([]);

  // Carregar do LocalStorage (Banco de dados do navegador)
  useEffect(() => {
    const saved = localStorage.getItem("disco_banco");
    if (saved) setBanco(JSON.parse(saved));
  }, []);

  const gerarConteudo = async () => {
    if (!apiKey) return alert("Insira sua Chave da API da Anthropic");
    setLoading(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "dangerously-allow-browser": "true" // Apenas para uso interno/sandbox
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1024,
          system: PERSONAS[persona].prompt,
          messages: [{ role: "user", content: `Tema: ${tema}. Use o seguinte banco de dados se relevante: ${JSON.stringify(banco)}` }]
        })
      });

      const data = await response.json();
      setPost(data.content[0].text);
    } catch (error) {
      alert("Erro na geração. Verifique sua chave ou conexão.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.app}>
      <div style={styles.wrap}>
        <header style={{ textAlign: "center", marginBottom: 30 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Disco Hub 🛸</h1>
          <p style={{ color: "#666" }}>Ghostwriter de Elite · Agência Disco</p>
        </header>

        {/* Configuração de API */}
        <div style={styles.card}>
          <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 5 }}>ANTHROPIC API KEY</label>
          <input 
            type="password" 
            style={styles.input} 
            placeholder="sk-ant-..." 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
          />
        </div>

        {/* Seleção de Persona */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {Object.entries(PERSONAS).map(([key, p]) => (
            <button 
              key={key} 
              onClick={() => setPersona(key)}
              style={{
                flex: 1, padding: "15px", borderRadius: 12, border: "none",
                background: persona === key ? p.color : "#1A1A1A",
                color: "#FFF", cursor: "pointer", fontWeight: 700
              }}
            >
              {p.emoji} {p.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Input de Tema */}
        <textarea 
          style={{ ...styles.input, minHeight: 120, marginBottom: 20 }} 
          placeholder="Sobre o que vamos escrever hoje?"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
        />

        <button 
          onClick={gerarConteudo}
          disabled={loading}
          style={{ ...styles.button, background: PERSONAS[persona].color, color: "#FFF" }}
        >
          {loading ? "Engenharia em progresso..." : "Gerar Conteúdo de Elite"}
        </button>

        {/* Resultado */}
        {post && (
          <div style={{ ...styles.card, marginTop: 30, border: `1px solid ${PERSONAS[persona].color}55` }}>
            <h3 style={{ color: PERSONAS[persona].color, marginBottom: 15 }}>{PERSONAS[persona].name} ✨</h3>
            <div style={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{post}</div>
            <button 
                onClick={() => navigator.clipboard.writeText(post)}
                style={{ marginTop: 20, background: "#2A2A2A", color: "#FFF", padding: "10px", width: "100%", borderRadius: 8, border: "none", cursor: "pointer" }}
            >
                Copiar Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
