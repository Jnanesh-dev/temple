# Setup Guide for MinIO and PostgreSQL on Hostinger VPS

This guide will help you set up MinIO object storage and PostgreSQL database on your Hostinger VPS.

## Prerequisites

- Hostinger VPS with SSH access
- Root or sudo access
- Basic knowledge of Linux commands

## Part 1: PostgreSQL Setup

### 1. Install PostgreSQL

```bash
# Update system packages
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Configure PostgreSQL

```bash
# Switch to postgres user
sudo -i -u postgres

# Create a new database and user
psql

# In PostgreSQL prompt:
CREATE DATABASE temple_db;
CREATE USER temple_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE temple_db TO temple_user;
\q

# Exit postgres user
exit
```

### 3. Configure PostgreSQL for Remote Access (Optional)

Edit PostgreSQL config files:

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/*/main/postgresql.conf

# Find and uncomment:
listen_addresses = '*'

# Edit pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Add this line (replace with your VPS IP or use 0.0.0.0/0 for all):
host    all             all             0.0.0.0/0               md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 4. Configure Firewall

```bash
# Allow PostgreSQL port (default 5432)
sudo ufw allow 5432/tcp
sudo ufw reload
```

## Part 2: MinIO Setup

### 1. Download and Install MinIO

```bash
# Download MinIO binary
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/

# Create MinIO user
sudo useradd -r -s /bin/false minio-user

# Create data directory
sudo mkdir -p /opt/minio/data
sudo chown minio-user:minio-user /opt/minio/data
```

### 2. Create MinIO Service

```bash
# Create service file
sudo nano /etc/systemd/system/minio.service
```

Add this content:

```ini
[Unit]
Description=MinIO Object Storage
After=network.target

[Service]
Type=simple
User=minio-user
Environment="MINIO_ROOT_USER=your_minio_access_key"
Environment="MINIO_ROOT_PASSWORD=your_minio_secret_key"
ExecStart=/usr/local/bin/minio server /opt/minio/data --console-address ":9001"
Restart=always

[Install]
WantedBy=multi-user.target
```

Replace `your_minio_access_key` and `your_minio_secret_key` with secure credentials.

### 3. Start MinIO Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Start MinIO
sudo systemctl start minio
sudo systemctl enable minio

# Check status
sudo systemctl status minio
```

### 4. Configure Firewall for MinIO

```bash
# Allow MinIO ports (9000 for API, 9001 for console)
sudo ufw allow 9000/tcp
sudo ufw allow 9001/tcp
sudo ufw reload
```

### 5. Access MinIO Console

Open your browser and go to: `http://your-vps-ip:9001`

Login with the credentials you set in the service file.

### 6. Create Bucket

1. Login to MinIO Console
2. Click "Create Bucket"
3. Name it: `temple-assets`
4. Set it to public if needed for image access

## Part 3: Application Configuration

### 1. Update Environment Variables

Create `.env.local` file in your project root:

```env
# Database Configuration
POSTGRES_HOST=your-vps-ip
POSTGRES_PORT=5432
POSTGRES_DB=temple_db
POSTGRES_USER=temple_user
POSTGRES_PASSWORD=your_secure_password

# MinIO Configuration
MINIO_ENDPOINT=your-vps-ip
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
MINIO_BUCKET_NAME=temple-assets

# Next.js
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Database Migrations

```bash
# Run migrations to create tables
npm run db:migrate
```

Or manually:

```bash
# Connect to database
psql -h your-vps-ip -U temple_user -d temple_db

# Run schema.sql
\i src/lib/db/schema.sql
```

### 4. Test Connections

Create a test script `test-connections.ts`:

```typescript
import pool from './src/lib/db'
import { ensureBucketExists } from './src/lib/minio'

async function test() {
  try {
    // Test PostgreSQL
    const result = await pool.query('SELECT NOW()')
    console.log('✅ PostgreSQL connected:', result.rows[0])
    
    // Test MinIO
    await ensureBucketExists()
    console.log('✅ MinIO connected')
  } catch (error) {
    console.error('❌ Connection error:', error)
  } finally {
    await pool.end()
  }
}

test()
```

## Part 4: Security Recommendations

1. **Use SSL/TLS**: Set up SSL certificates for both PostgreSQL and MinIO in production
2. **Firewall Rules**: Only allow necessary IPs to access database ports
3. **Strong Passwords**: Use strong, unique passwords for all services
4. **Regular Backups**: Set up automated backups for PostgreSQL
5. **MinIO Access**: Use IAM policies to restrict bucket access

## Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log

# Test connection locally
psql -U temple_user -d temple_db
```

### MinIO Connection Issues

```bash
# Check if MinIO is running
sudo systemctl status minio

# Check MinIO logs
sudo journalctl -u minio -f

# Test MinIO API
curl http://your-vps-ip:9000/minio/health/live
```

## Next Steps

1. Set up SSL certificates (Let's Encrypt)
2. Configure automated backups
3. Set up monitoring and alerts
4. Configure CDN for MinIO if needed
5. Set up email notifications for form submissions

