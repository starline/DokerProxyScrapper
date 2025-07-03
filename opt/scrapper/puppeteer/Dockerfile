FROM node:20-slim

# Установим зависимости, необходимые для запуска Chromium
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    libdrm2 \
    libgbm1 \
    libxshmfence1 \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Рабочая директория
WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm install

# Копируем основной код
COPY server.js .

# Указываем переменную окружения для Puppeteer (хранение Chromium)
ENV PUPPETEER_CACHE_DIR=/app/.cache
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["node", "server.js"]