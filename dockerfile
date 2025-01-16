# Sử dụng image Node.js chính thức
FROM node:last
# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Biên dịch ứng dụng Next.js
RUN npm run build

# Mở cổng mà ứng dụng sẽ chạy
EXPOSE 3000

CMD ["npm", "start"]