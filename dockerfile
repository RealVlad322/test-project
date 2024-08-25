# Указываем базовый образ
FROM node:20

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json в рабочую директорию
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы в рабочую директорию
COPY . .

# Собираем проект, если необходимо (для TypeScript или других компилируемых языков)
RUN npm run build

# Указываем порт, который будет использовать контейнер
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]
