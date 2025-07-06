# ExamBook Production Deployment Guide

This guide covers multiple deployment options for the ExamBook application in production.

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended for VPS/Server)

#### Prerequisites
- Docker and Docker Compose installed
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)

#### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd exambook

# Copy environment files
cp env.example .env
cp backend/env.example backend/.env

# Edit environment files with your production settings
# See Environment Configuration section below

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Environment Configuration
Edit `.env` files with your production settings:

**Frontend (.env)**
```env
VITE_API_URL=https://your-domain.com/api
VITE_APP_NAME=ExamBook
VITE_APP_VERSION=1.0.0
```

**Backend (.env)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:password@mongodb:27017/exambook?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://your-domain.com
```

#### SSL/HTTPS Setup
1. Obtain SSL certificate (Let's Encrypt recommended)
2. Update nginx configuration
3. Restart services

### Option 2: Manual Deployment

#### Backend Deployment

**Using PM2 (Recommended)**
```bash
# Install PM2 globally
npm install -g pm2

# Navigate to backend
cd backend

# Install dependencies
npm install --production

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'exambook-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Using Systemd**
```bash
# Create service file
sudo tee /etc/systemd/system/exambook-backend.service << EOF
[Unit]
Description=ExamBook Backend API
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/var/www/exambook/backend
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable exambook-backend
sudo systemctl start exambook-backend
```

#### Frontend Deployment

**Using Nginx**
```bash
# Build the application
npm run build

# Copy to nginx directory
sudo cp -r dist/* /var/www/html/

# Create nginx configuration
sudo tee /etc/nginx/sites-available/exambook << EOF
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # Handle React Router
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/exambook /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Option 3: Cloud Platform Deployment

#### Heroku Deployment

**Backend**
```bash
# Create Heroku app
heroku create exambook-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password

# Deploy
git push heroku main
```

**Frontend**
```bash
# Create Heroku app
heroku create exambook-frontend

# Set buildpack
heroku buildpacks:set mars/create-react-app

# Set environment variables
heroku config:set VITE_API_URL=https://exambook-backend.herokuapp.com/api

# Deploy
git push heroku main
```

#### Railway Deployment

**Backend**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Frontend**
```bash
# Deploy frontend
railway up --service frontend
```

#### Vercel Deployment

**Frontend Only**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 4: AWS Deployment

#### Using AWS EC2
```bash
# Launch EC2 instance
# Install Node.js, MongoDB, Nginx

# Clone repository
git clone <your-repo-url>
cd exambook

# Setup backend
cd backend
npm install --production
pm2 start ecosystem.config.js

# Setup frontend
cd ..
npm install
npm run build
sudo cp -r dist/* /var/www/html/

# Configure nginx and start services
```

#### Using AWS ECS
```bash
# Build and push Docker images
docker build -t exambook-backend ./backend
docker build -t exambook-frontend .
docker push your-registry/exambook-backend
docker push your-registry/exambook-frontend

# Create ECS cluster and services
# Use AWS CLI or console to create ECS resources
```

## 🔒 Security Checklist

### Before Going Live
- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Configure HTTPS/SSL
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Configure email verification
- [ ] Set up password reset functionality
- [ ] Enable security headers
- [ ] Configure backup strategy
- [ ] Set up monitoring and logging

### Environment Variables
```bash
# Required for production
NODE_ENV=production
JWT_SECRET=<strong-random-string>
MONGODB_URI=<your-mongodb-connection-string>
EMAIL_HOST=<smtp-host>
EMAIL_USER=<email-username>
EMAIL_PASS=<email-password>
FRONTEND_URL=<your-frontend-url>

# Optional but recommended
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=5242880
```

## 📊 Monitoring and Maintenance

### Health Checks
```bash
# Backend health check
curl https://your-domain.com/api/health

# Frontend health check
curl https://your-domain.com/health
```

### Logs
```bash
# Docker logs
docker-compose logs -f

# PM2 logs
pm2 logs

# System logs
sudo journalctl -u exambook-backend -f
```

### Backup Strategy
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/exambook" --out=/backup/$(date +%Y%m%d)

# File uploads backup
tar -czf /backup/uploads-$(date +%Y%m%d).tar.gz /var/www/exambook/backend/uploads/
```

### Performance Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Monitor database performance
- Use load balancing for high traffic

## 🚨 Troubleshooting

### Common Issues

**Backend won't start**
```bash
# Check logs
docker-compose logs backend
pm2 logs

# Check environment variables
echo $NODE_ENV
echo $MONGODB_URI

# Check database connection
mongo --eval "db.adminCommand('ping')"
```

**Frontend not loading**
```bash
# Check build
npm run build

# Check nginx configuration
sudo nginx -t

# Check file permissions
sudo chown -R www-data:www-data /var/www/html/
```

**Database connection issues**
```bash
# Test MongoDB connection
mongo "mongodb://localhost:27017/exambook"

# Check MongoDB status
sudo systemctl status mongod

# Check firewall
sudo ufw status
```

## 📞 Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Test database connectivity
4. Check network/firewall settings
5. Review security configuration

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or for manual deployment
pm2 restart all
npm run build
```

### Database Migrations
```bash
# Backup before migration
mongodump --uri="mongodb://localhost:27017/exambook"

# Run migrations (if any)
# Check backend documentation for migration scripts
```

This deployment guide covers the most common scenarios. Choose the option that best fits your infrastructure and requirements. 