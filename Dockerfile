# --- build du web ---
FROM node:20-bookworm AS webbuild
WORKDIR /src

COPY package*.json ./
RUN npm ci

COPY . .
# build dev avec sourcemaps (tu peux passer en build prod si tu préfères)
RUN npm run build:development

# --- image jellyfin finale ---
FROM jellyfin/jellyfin:latest

# remplace le webroot Jellyfin par ton build
# (chemin standard utilisé par la doc Jellyfin)
COPY --from=webbuild /src/dist/ /usr/share/jellyfin/web/