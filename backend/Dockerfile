FROM node:18-alpine
WORKDIR /usr/src/app

# add CA certificates if needed by AWS SDK (often included, but safe)
RUN apk add --no-cache ca-certificates

COPY package*.json ./
RUN npm ci --silent

COPY . .

EXPOSE 4000
CMD ["node","src/index.js"]