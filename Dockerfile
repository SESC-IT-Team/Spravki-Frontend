FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json *.tgz ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh
EXPOSE 80
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["serve", "-s", "dist", "-l", "80"]