#!/bin/bash
#
# YAMADA TOOLS - BLOG SYSTEM DEPLOYMENT SCRIPT
# Version: 1.0
# Date: 2025-12-08
#

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$HOME/projects/3websitepassive_income/yamada-tools/frontend"
BACKUP_DIR="$HOME/backups/yamada-tools-blog-working"
LOG_FILE="$PROJECT_DIR/deployment.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}" | tee -a "$LOG_FILE"
}

# Pre-flight checks
preflight_checks() {
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "STARTING PRE-FLIGHT CHECKS"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Check if in correct directory
    if [ ! -f "package.json" ]; then
        error "Not in project directory. Run from: $PROJECT_DIR"
    fi
    log "✅ In correct directory"
    
    # Check critical files
    local critical_files=(
        "src/app/blog/[slug]/page.tsx"
        "src/app/api/admin/blog/route.ts"
        "src/data/dynamicBlogs.json"
        "src/app/blog.css"
        ".env.local"
    )
    
    for file in "${critical_files[@]}"; do
        if [ ! -f "$file" ]; then
            error "Critical file missing: $file"
        fi
    done
    log "✅ All critical files present"
    
    # Check Node/npm
    if ! command -v node &> /dev/null; then
        error "Node.js not installed"
    fi
    log "✅ Node.js $(node --version)"
    
    if ! command -v npm &> /dev/null; then
        error "npm not installed"
    fi
    log "✅ npm $(npm --version)"
    
    # Check PM2
    if ! command -v pm2 &> /dev/null; then
        error "PM2 not installed"
    fi
    log "✅ PM2 installed"
    
    # Check disk space (need at least 1GB free)
    local free_space=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
    if [ "$free_space" -lt 1 ]; then
        error "Insufficient disk space. Need at least 1GB free"
    fi
    log "✅ Sufficient disk space: ${free_space}GB free"
    
    # Check backend health
    if ! curl -s http://localhost:8000/health | grep -q "healthy"; then
        warn "Backend health check failed, but continuing..."
    else
        log "✅ Backend is healthy"
    fi
    
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "PRE-FLIGHT CHECKS PASSED"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Create backup
create_backup() {
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "CREATING BACKUP"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    local backup_path="$BACKUP_DIR/$TIMESTAMP"
    mkdir -p "$backup_path"
    
    # Backup critical files
    cp -r src/app/blog "$backup_path/"
    cp -r src/app/admin/blog "$backup_path/" 2>/dev/null || true
    cp -r src/app/api/admin/blog "$backup_path/"
    cp src/data/dynamicBlogs.json "$backup_path/"
    cp src/data/staticBlogs.json "$backup_path/" 2>/dev/null || true
    cp src/app/blog.css "$backup_path/"
    cp package.json "$backup_path/"
    cp .env.local "$backup_path/" 2>/dev/null || true
    
    # Create backup info
    cat > "$backup_path/BACKUP_INFO.txt" << EOF
YAMADA TOOLS - BLOG SYSTEM BACKUP
==================================
Timestamp: $TIMESTAMP
Date: $(date)
Node Version: $(node --version)
npm Version: $(npm --version)

Blog Count: $(cat src/data/dynamicBlogs.json | grep '"title"' | wc -l)

System Status:
- Backend: $(curl -s http://localhost:8000/health 2>&1 || echo "unavailable")
- Frontend PM2: $(pm2 list | grep yamada-frontend | awk '{print $10}')

To restore this backup:
cp -r $backup_path/* $PROJECT_DIR/
cd $PROJECT_DIR
npm run build
pm2 restart yamada-frontend
EOF
    
    log "✅ Backup created: $backup_path"
    
    # Keep only last 5 backups
    local backup_count=$(ls -1 "$BACKUP_DIR" | wc -l)
    if [ "$backup_count" -gt 5 ]; then
        log "Cleaning old backups (keeping last 5)..."
        cd "$BACKUP_DIR"
        ls -t | tail -n +6 | xargs rm -rf
        cd "$PROJECT_DIR"
    fi
    
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Build application
build_app() {
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "BUILDING APPLICATION"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Clean previous build
    if [ -d ".next" ]; then
        log "Removing old build..."
        rm -rf .next
    fi
    
    # Install dependencies (if needed)
    if [ ! -d "node_modules" ]; then
        log "Installing dependencies..."
        npm install || error "npm install failed"
    fi
    
    # Build
    log "Running production build..."
    if npm run build 2>&1 | tee -a "$LOG_FILE"; then
        log "✅ Build successful"
    else
        error "Build failed. Check logs: $LOG_FILE"
    fi
    
    # Verify build
    if [ ! -f ".next/BUILD_ID" ]; then
        error "Build verification failed: BUILD_ID not found"
    fi
    log "✅ Build verified (BUILD_ID: $(cat .next/BUILD_ID))"
    
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Deploy
deploy() {
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "DEPLOYING APPLICATION"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Restart PM2
    log "Restarting PM2 process..."
    if pm2 restart yamada-frontend 2>&1 | tee -a "$LOG_FILE"; then
        log "✅ PM2 restarted"
    else
        error "PM2 restart failed"
    fi
    
    # Save PM2 state
    pm2 save &> /dev/null
    
    # Wait for application to start
    log "Waiting for application to start..."
    sleep 3
    
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Health check
health_check() {
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "RUNNING HEALTH CHECKS"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Check PM2 status
    if pm2 list | grep yamada-frontend | grep -q "online"; then
        log "✅ Frontend process is online"
    else
        error "Frontend process is not online"
    fi
    
    # Check if port 3002 responds
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:3002 > /dev/null; then
            log "✅ Frontend responding on port 3002"
            break
        else
            if [ $attempt -eq $max_attempts ]; then
                error "Frontend not responding after $max_attempts attempts"
            fi
            warn "Attempt $attempt/$max_attempts: Frontend not responding yet..."
            sleep 2
            ((attempt++))
        fi
    done
    
    # Check blog page
    if curl -s http://localhost:3002/blog > /dev/null; then
        log "✅ Blog page accessible"
    else
        warn "Blog page not accessible"
    fi
    
    # Check admin page
    if curl -s http://localhost:3002/admin/blog > /dev/null; then
        log "✅ Admin blog page accessible"
    else
        warn "Admin blog page not accessible"
    fi
    
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Rollback function
rollback() {
    error "Deployment failed. Initiating rollback..."
    
    # Find latest backup
    local latest_backup=$(ls -t "$BACKUP_DIR" | head -1)
    
    if [ -z "$latest_backup" ]; then
        error "No backup found for rollback"
    fi
    
    warn "Rolling back to: $latest_backup"
    
    # Restore backup
    cp -r "$BACKUP_DIR/$latest_backup"/* "$PROJECT_DIR/"
    
    # Rebuild
    cd "$PROJECT_DIR"
    npm run build || error "Rollback build failed"
    
    # Restart
    pm2 restart yamada-frontend
    
    error "Rollback completed. Check the application."
}

# Main deployment flow
main() {
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "YAMADA TOOLS - BLOG SYSTEM DEPLOYMENT"
    log "Starting deployment at: $(date)"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    cd "$PROJECT_DIR" || error "Cannot change to project directory"
    
    # Set error trap for rollback
    trap rollback ERR
    
    # Run deployment steps
    preflight_checks
    create_backup
    build_app
    deploy
    health_check
    
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "🎉 DEPLOYMENT SUCCESSFUL!"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log ""
    log "Summary:"
    log "  • Backup: $BACKUP_DIR/$TIMESTAMP"
    log "  • Build ID: $(cat .next/BUILD_ID)"
    log "  • Blog Count: $(cat src/data/dynamicBlogs.json | grep '"title"' | wc -l)"
    log "  • Website: https://yamada-tools.jp"
    log "  • Admin: https://yamada-tools.jp/admin/blog"
    log ""
    log "Log file: $LOG_FILE"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Run main function
main "$@"
