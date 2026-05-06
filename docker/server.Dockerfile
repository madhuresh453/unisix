FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
COPY server/package.json server/package.json
RUN npm install --workspace server --include-workspace-root --omit=dev
COPY server ./server
WORKDIR /app/server
EXPOSE 5000
CMD ["npm", "run", "start"]
