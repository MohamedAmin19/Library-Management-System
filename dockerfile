FROM node:20

WORKDIR /app

COPY package*.json ./

RUN cat package.json  # Print the contents of package.json for debugging

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
