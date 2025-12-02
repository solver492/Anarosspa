# Déploiement sur Render - Guide Complet

## ✅ Application Prête pour Render

L'application AnarosSpa est **100% compatible** avec Render. Voici la configuration complète :

## 📋 Prérequis

1. **Compte Render** : https://render.com/
2. **GitHub** : Le code doit être sur GitHub
3. **Base de données** : PostgreSQL inclus dans Render

## 🚀 Étapes de Déploiement (10 minutes)

### 1. Pousser sur GitHub

```bash
git init
git add .
git commit -m "Initial commit - AnarosSpa Ready for Render"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/anaros-spa.git
git push -u origin main
```

### 2. Créer les Services Render

#### A. Service Web
1. Connectez-vous à Render
2. **New → Web Service**
3. Connectez votre dépôt GitHub
4. **Configuration** :
   - **Name** : `anaros-spa`
   - **Environment** : `Node`
   - **Plan** : `Free` ou `Starter`
   - **Build Command** : `npm run build`
   - **Start Command** : `npm start`
   - **Node Version** : `20`

#### B. Base de Données
1. **New → PostgreSQL**
2. **Configuration** :
   - **Name** : `anaros-db`
   - **Database Name** : `anaros_spa`
   - **User** : `anaros_user`
   - **Plan** : `Free`

### 3. Configurer les Variables d'Environnement

Dans le service web `anaros-spa` :

```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://anaros_user:VOTRE_MOT_DE_PASSE@host:5432/anaros_spa
SESSION_SECRET=votre-cle-secrete-aleatoire
```

### 4. Lancer le Déploiement

Render va automatiquement :
1. Cloner le dépôt
2. Installer les dépendances (`npm install`)
3. Builder l'application (`npm run build`)
4. Démarrer le serveur (`npm start`)

## 🔧 Configuration Technique

### Build Process
- **Client** : Vite build → `/dist/public`
- **Server** : Esbuild → `/dist/index.cjs`
- **Taille totale** : ~1.5MB (optimisé)

### Base de Données
- **Type** : PostgreSQL
- **ORM** : Drizzle
- **Migrations** : `npm run db:push`

### Health Check
- **Endpoint** : `/api/health`
- **Monitoring** : Automatique

## 📊 Architecture de Déploiement

```
┌─────────────────┐
│   Render Web    │ ← https://anaros-spa.onrender.com
│   (Node.js)     │
│   Port: 10000   │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │ ← Render Database
│   (anaros_spa)  │
└─────────────────┘
```

## 🎯 Fonctionnalités Déployées

✅ **Calendrier intelligent** avec filtrage employés  
✅ **Gestion des rendez-vous** CRUD complet  
✅ **Dashboard** avec KPIs en temps réel  
✅ **Gestion clients/services**  
✅ **Authentification sécurisée**  
✅ **Interface responsive**  
✅ **100% Open Source**  

## 🔍 Vérification du Déploiement

### 1. Health Check
```bash
curl https://anaros-spa.onrender.com/api/health
```

### 2. Test de l'Application
- Visitez : https://anaros-spa.onrender.com
- Testez la navigation
- Vérifiez le calendrier
- Créez un rendez-vous test

### 3. Logs Render
- Dashboard → Services → anaros-spa → Logs
- Vérifiez les erreurs éventuelles

## 🛠️ Dépannage

### Problèmes Courants

#### 1. Build Failed
```bash
# Vérifier localement
npm run build
npm start
```

#### 2. Database Connection
- Vérifier `DATABASE_URL`
- Tester la connexion avec `psql`

#### 3. Port Incorrect
- `PORT` doit être `10000` sur Render
- Ne pas utiliser d'autres ports

### Solutions Rapides

1. **Redéploiement automatique** : Push sur GitHub
2. **Logs en temps réel** : Render Dashboard
3. **Rollback** : Retour à un commit précédent

## 💡 Optimisations

### Performance
- **Free Plan** : 512MB RAM, 0.3 CPU
- **Starter Plan** : 1GB RAM, 0.5 CPU
- **Cache** : Headers statiques configurés

### Sécurité
- **HTTPS** : Automatique sur Render
- **Variables** : Encrypted en production
- **CORS** : Configuré dans Express

## 📈 Monitoring

### Metrics Render
- **Uptime** : Monitoring 24/7
- **Response Time** : Graphiques en temps réel
- **Error Rate** : Alertes automatiques

### Logs Structurés
```javascript
// Format des logs
[timestamp] [express] GET /api/appointments 200 in 45ms
```

## 🔄 Mises à Jour

### Workflow
1. **Développement local** : `npm run dev`
2. **Tests** : Vérifier build et start
3. **Push** : `git push origin main`
4. **Déploiement** : Automatique sur Render

### Rollback
```bash
# Retour au commit précédent
git reset --hard HEAD~1
git push --force-with-lease origin main
```

## ✅ Checklist Finale

- [ ] GitHub repo créé et poussé
- [ ] Service web configuré sur Render
- [ ] Base de données PostgreSQL créée
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] Health check OK
- [ ] Application testée
- [ ] Logs vérifiés

## 🎉 Résultat Final

**URL Production** : https://anaros-spa.onrender.com  
**Stack** : React + Express + PostgreSQL  
**Coût** : Free (upgrade possible)  
**Performance** : Optimisée pour Render  

L'application est **prête pour la production** sur Render ! 🚀
