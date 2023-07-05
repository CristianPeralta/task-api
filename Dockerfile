# Utiliza una imagen base con Node.js
FROM node:20-alpine

# Instala MongoDB y sus dependencias
RUN apk add --no-cache mongodb-tools

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código fuente al contenedor
COPY . .

# Exponer los puertos necesarios para Node.js y MongoDB
EXPOSE 3000
EXPOSE 27017

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:dev"]