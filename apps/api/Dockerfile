FROM node:20-alpine
WORKDIR /app
COPY package.json /app/package.json
COPY apps/api/package.json /app/apps/api/package.json
RUN npm install --workspace @jarvis/api
COPY apps/api /app/apps/api
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["npm", "run", "start"]
