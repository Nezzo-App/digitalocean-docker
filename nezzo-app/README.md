# ⚡ Nezzo App

Die ultimative All-in-One-Plattform für KI, Chat, Cloud, Hosting, Vokabeln, Code und Text.

## 🚀 Features

- **🧠 Nezzo AI** - Künstliche Intelligenz powered by Grok API
- **💬 Nezzo Chat** - Intelligente Konversationen mit KI
- **☁️ Nezzo Cloud** - Sichere Cloud-Speicherung
- **🌐 Nezzo Host** - Webhosting-Lösungen
- **📚 Nezzo Vocab** - Vokabeltrainer und Wörterbuch
- **💻 Nezzo Code** - Code-Editor und Snippet-Manager
- **📝 Nezzo Text** - Textverarbeitung und Analyse

## 👥 Leadership

- **CEO**: LobiGmbh
- **COO**: JoviGmbh

## 🛠️ Installation

### Docker (Empfohlen)

```bash
# Repository klonen
git clone https://github.com/nezzo-app/nezzo.git
cd nezzo-app/docker

# Umgebungsvariablen setzen
cp ../.env.example .env
# Bearbeite .env und füge deinen GROK_API_KEY ein

# Starten
docker-compose up -d

# Logs ansehen
docker-compose logs -f
```

Nezzo ist dann verfügbar unter: http://localhost:80

### Manuelle Installation

```bash
# Dependencies installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# GROK_API_KEY bearbeiten

# Entwicklungsserver starten
npm run dev

# Produktionsserver starten
npm start
```

## 🔑 API Key Setup

1. Registriere dich auf [x.ai](https://x.ai)
2. Erstelle einen API Key
3. Füge den Key in die `.env` Datei ein:
   ```
   GROK_API_KEY=dein_api_key_hier
   ```

## 📚 Dokumentation

Besuche das [Nezzo Wiki](/wiki) für umfassende Dokumentation.

## 🌐 URLs

- Startseite: http://localhost:80
- Nezzo AI: http://localhost:80/ai
- Nezzo Chat: http://localhost:80/chat
- Nezzo Cloud: http://localhost:80/cloud
- Nezzo Host: http://localhost:80/host
- Nezzo Vocab: http://localhost:80/vocab
- Nezzo Code: http://localhost:80/code
- Nezzo Text: http://localhost:80/text
- Wiki: http://localhost:80/wiki
- Download: http://localhost:80/download

## 📖 API Endpoints

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/health` | GET | Systemstatus |
| `/api/ai/generate` | POST | AI Text generieren |
| `/api/ai/chat` | POST | AI Chat |
| `/api/chat/session` | POST | Chat Session erstellen |
| `/api/cloud/upload` | POST | Datei hochladen |
| `/api/host/deploy` | POST | Website deployen |
| `/api/vocab/set` | POST | Vokabelset erstellen |
| `/api/code/snippet` | POST | Code Snippet erstellen |
| `/api/text/document` | POST | Dokument erstellen |

## 🧪 Testen

```bash
# Health Check
curl http://localhost:80/api/health

# AI Test
curl -X POST http://localhost:80/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hallo!"}'
```

## 📄 Lizenz

MIT License - Siehe LICENSE Datei.

## 🤝 Contributing

Beiträge sind willkommen! Bitte erstelle ein Issue oder Pull Request.

---

&copy; 2024 Nezzo App. Alle Rechte vorbehalten.
