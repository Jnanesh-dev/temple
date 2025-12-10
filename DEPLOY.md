# Deployment Guide for Hostinger VPS

## Step 1: Clone the Repository

```bash
# Navigate to web directory
cd /var/www

# Clone the repository
git clone https://github.com/shaktiyogakendra-cloud/temple.git

# Navigate into the project directory
cd temple
```

## Step 2: Install Dependencies

```bash
# Install Node.js dependencies
npm install
```

If Node.js is not installed, install it first:

```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

## Step 3: Create Environment File

```bash
# Create .env.local file
cat > .env.local << 'EOF'
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=temple_db
POSTGRES_USER=temple_user
POSTGRES_PASSWORD=your_secure_password

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
MINIO_BUCKET_NAME=temple-assets

# Next.js
NEXT_PUBLIC_SITE_URL=https://your-temple-domain.com

# Payment Gateway (when integrating)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email Service (when integrating)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EOF

# Set proper permissions
chmod 600 .env.local
```

## Step 4: Run Database Migrations

```bash
# Run migrations to create database tables
npm run db:migrate
```

## Step 5: Build for Production

```bash
# Build the Next.js application
npm run build
```

## Step 6: Set Up PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
pm2 start npm --name "temple-website" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on system boot
pm2 startup
# Follow the instructions provided by the command above
```

## Step 7: Configure Nginx (Reverse Proxy)

```bash
# Install Nginx if not already installed
sudo apt update
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/temple
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-temple-domain.com www.your-temple-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/temple /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 8: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-temple-domain.com -d www.your-temple-domain.com

# Certbot will automatically configure Nginx and set up auto-renewal
```

## Step 9: Set Up Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Allow SSH (if not already allowed)
sudo ufw allow OpenSSH

# Enable firewall
sudo ufw enable
```

## Step 10: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs temple-website

# Check Nginx status
sudo systemctl status nginx
```

## Useful Commands

### PM2 Management
```bash
# View logs
pm2 logs temple-website

# Restart application
pm2 restart temple-website

# Stop application
pm2 stop temple-website

# View application info
pm2 info temple-website

# Monitor resources
pm2 monit
```

### Update Application
```bash
cd /var/www/temple
git pull origin main
npm install
npm run build
pm2 restart temple-website
```

### Database Backup
```bash
# Backup PostgreSQL database
pg_dump -U temple_user -d temple_db > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U temple_user -d temple_db < backup_20231210.sql
```

## Troubleshooting

### Application won't start
```bash
# Check Node.js version (should be 18.x or higher)
node --version

# Check if port 3000 is in use
sudo lsof -i :3000

# Check PM2 logs
pm2 logs temple-website --lines 50
```

### Database connection issues
```bash
# Test PostgreSQL connection
psql -U temple_user -d temple_db -h localhost

# Check PostgreSQL status
sudo systemctl status postgresql
```

### MinIO connection issues
```bash
# Check MinIO status
sudo systemctl status minio

# Test MinIO connection
curl http://localhost:9000/minio/health/live
```

### Nginx issues
```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

