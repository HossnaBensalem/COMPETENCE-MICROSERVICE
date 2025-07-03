# Utiliser l'image Node.js officielle basée sur Alpine Linux
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le code source de l'application
COPY . .

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Changer la propriété des fichiers à l'utilisateur nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exposer le port sur lequel l'application s\'exécute
EXPOSE 5000

# Définir les variables d'environnement de production
ENV NODE_ENV=production

# Commande de santé pour Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Commande pour démarrer l'application
CMD ["node", "server.js"]