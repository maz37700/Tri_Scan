# 🌿 TriScan PWA — Scanner de Tri IA

Application mobile-first Progressive Web App pour identifier les déchets et obtenir les consignes de tri locales en France, propulsée par l'IA Claude.

## 🚀 Fonctionnalités

### MVP (v1.0)
- **📷 Scan par photo** — Appareil photo ou galerie → identification IA instantanée
- **📍 Consignes locales** — Règles de tri adaptées par code postal / département
- **🏆 Gamification** — XP, niveaux (1-10), streaks, 10 badges à débloquer
- **📋 Historique** — Stockage local des 50 derniers scans
- **📲 PWA installable** — Fonctionne comme une app native (iOS + Android)
- **🔌 Mode hors-ligne** — Interface et démo disponibles sans connexion
- **🎯 Mode démo** — 8 déchets pré-configurés pour tester sans IA

## 📁 Structure du projet

```
triscan-pwa/
├── index.html                 # Entry point HTML
├── vite.config.js             # Vite + PWA config
├── package.json
├── public/
│   ├── favicon.svg
│   └── icons/                 # Icônes PWA (à générer)
├── src/
│   ├── main.jsx               # Point d'entrée React
│   ├── App.jsx                # Router + layout
│   ├── styles/
│   │   └── global.css         # Variables CSS, animations
│   ├── components/
│   │   ├── BinBadge.jsx       # Badge coloré par type de bac
│   │   ├── NavBar.jsx         # Navigation bottom bar
│   │   ├── InstallBanner.jsx  # Bannière d'installation PWA
│   │   └── BadgeToast.jsx     # Notification badge débloqué
│   ├── pages/
│   │   ├── HomePage.jsx       # Accueil, scanner, démo
│   │   ├── ScanResultPage.jsx # Résultat d'analyse
│   │   ├── HistoryPage.jsx    # Historique des scans
│   │   └── ProfilePage.jsx    # Profil, badges, paramètres
│   ├── hooks/
│   │   └── useGamification.jsx # Contexte XP, niveaux, badges
│   ├── data/
│   │   └── sortingRules.js    # Base de données tri par département
│   └── utils/
│       ├── analyzeWaste.js    # Appel API Claude pour analyse
│       └── storage.js         # Persistance localStorage
└── scripts/
    └── generate-icons.js      # Génération icônes PWA
```

## 🛠️ Installation & Développement

### Prérequis
- Node.js 18+
- npm ou yarn

### Setup
```bash
# Cloner et installer
cd triscan-pwa
npm install

# Lancer en dev
npm run dev
# → http://localhost:3000
```

### Build production
```bash
npm run build
# → dossier dist/ prêt à déployer
```

### Preview du build
```bash
npm run preview
```

## 📲 Déploiement

### Option 1 : Digital Ocean (ton hébergement existant)
```bash
# Build
npm run build

# Upload le dossier dist/ via FileZilla
# sur ton serveur vers /var/www/triscan/
# ou comme sous-domaine de dlc37.fr

# Config Nginx (exemple)
server {
    listen 443 ssl;
    server_name triscan.dlc37.fr;
    root /var/www/triscan/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/triscan.dlc37.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/triscan.dlc37.fr/privkey.pem;
}
```

### Option 2 : Vercel (le plus simple)
```bash
npm install -g vercel
vercel
# Suivre les instructions — déployé en 30 secondes
```

### Option 3 : Netlify
```bash
npm run build
# Drag & drop le dossier dist/ sur app.netlify.com
```

## 🔑 Configuration API

### Mode Claude.ai (par défaut)
L'app fonctionne directement dans les artifacts Claude.ai sans clé API.

### Mode auto-hébergé
Pour utiliser l'app sur ton propre domaine, tu as besoin d'une clé API Anthropic :

1. Crée un compte sur [console.anthropic.com](https://console.anthropic.com)
2. Génère une clé API
3. **Option A** : L'utilisateur entre sa clé dans Paramètres > Clé API
4. **Option B** : Crée un proxy backend (recommandé pour la prod) :

```python
# proxy.py (Flask) — à mettre sur ton serveur
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)
API_KEY = "sk-ant-ton-api-key"

@app.route('/api/analyze', methods=['POST'])
def analyze():
    resp = requests.post(
        'https://api.anthropic.com/v1/messages',
        headers={
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
        },
        json=request.json
    )
    return jsonify(resp.json())
```

## 🎮 Système de Gamification

### Niveaux (1-10)
| Niveau | Titre | XP requis |
|--------|-------|-----------|
| 1 | Débutant | 0 |
| 2 | Apprenti Trieur | 100 |
| 3 | Trieur Confirmé | 300 |
| 4 | Éco-Citoyen | 600 |
| 5 | Expert du Tri | 1 000 |
| 6 | Maître Recycleur | 1 500 |
| 7 | Champion Vert | 2 500 |
| 8 | Héros Écologique | 4 000 |
| 9 | Légende du Tri | 6 000 |
| 10 | Gardien de la Planète | 10 000 |

### Badges
- 🔍 Premier Scan — 1er déchet scanné
- 🔥 Trieur Régulier — 3 jours de suite
- ⚡ Éco-Warrior — 7 jours de suite
- 👑 Maître du Tri — 30 jours de suite
- 🧐 Curieux — 10 scans
- 🎓 Expert — 50 scans
- 📚 Encyclopédie — 100 scans
- 🌈 Arc-en-ciel — Tous les types de bacs trouvés
- 🌱 Composteur — 5 biodéchets
- 🏅 Citoyen Responsable — 3 déchets spéciaux

## 📍 Consignes locales

La base de données couvre actuellement :
- **National** — Consignes par défaut (extension tri 2024)
- **75** — Paris
- **69** — Métropole de Lyon
- **13** — Marseille / Bouches-du-Rhône
- **36** — Indre (Châteauroux)

### Ajouter un département
Éditer `src/data/sortingRules.js` et ajouter une entrée :
```js
'XX': {
  name: 'Nom du département',
  region: 'Nom de la collectivité',
  overrides: {
    jaune: { tip: 'Consigne locale spécifique...' },
  },
},
```

### Roadmap : API CITEO
À terme, intégrer l'API du [Guide du Tri CITEO](https://www.triercestdonner.fr/) pour couvrir les 35 000+ communes automatiquement.

## 🏗️ Roadmap

- [x] MVP scan IA + résultats
- [x] Mode démo hors-ligne
- [x] PWA installable
- [x] Gamification (XP, niveaux, badges, streaks)
- [x] Consignes par code postal
- [ ] Intégration API CITEO
- [ ] Landing page B2G (collectivités)
- [ ] Notifications push (rappels tri)
- [ ] Leaderboard local / national
- [ ] Mode classe (pour TechnoCollège)
- [ ] Scan en temps réel (caméra live)
- [ ] Multi-langue

## 📄 Licence

MIT — Projet open source.

---

*Made with 🌿 by Maz — TriScan v1.0*
