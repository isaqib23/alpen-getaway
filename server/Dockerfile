FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Copy the wait script and make it executable
#COPY wait-for-postgres.sh .
#RUN chmod +x ./wait-for-postgres.sh
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Copy the wait script into the final image
#COPY --from=builder /app/wait-for-postgres.sh .

EXPOSE 3005
CMD ["node", "dist/main"]