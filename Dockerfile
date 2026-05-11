FROM alpine:latest

# Instalar Git y dependencias necesarias
RUN apk add --no-cache git

# Crear directorio de trabajo
WORKDIR /workspace

# Configurar Git
RUN git config --global init.defaultBranch main

# Establecer el comando por defecto
CMD ["git"]