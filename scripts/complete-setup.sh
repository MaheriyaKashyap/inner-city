#!/bin/bash

# Complete Supabase Setup Script
# Run this script interactively to set up everything

set -e

PROJECT_REF="gdsblffnkiswaweqokcm"
SUPABASE_URL="https://gdsblffnkiswaweqokcm.supabase.co"

echo "🚀 Inner City - Complete Supabase Setup"
echo "======================================"
echo ""
echo "This script will:"
echo "  1. Login to Supabase"
echo "  2. Link your project"
echo "  3. Run database migration"
echo "  4. Deploy Edge Functions"
echo "  5. Set Edge Function secrets"
echo ""

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    brew install supabase/tap/supabase
fi

echo "✅ Supabase CLI ready"
echo ""

# Step 1: Login
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: Login to Supabase"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "This will open your browser for authentication..."
echo ""

supabase login

echo ""
echo "✅ Logged in"
echo ""

# Step 2: Link project
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: Link Project"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

supabase link --project-ref $PROJECT_REF

echo ""
echo "✅ Project linked"
echo ""

# Step 3: Initialize Supabase (if needed)
if [ ! -f "supabase/config.toml" ]; then
    echo "Initializing Supabase project..."
    supabase init
fi

# Step 4: Run migration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: Run Database Migration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "supabase/migrations/001_initial_schema.sql" ]; then
    echo "Pushing migration to database..."
    supabase db push
    
    if [ $? -eq 0 ]; then
        echo "✅ Migration completed successfully"
    else
        echo "⚠️  Migration push failed. Trying alternative method..."
        echo ""
        echo "Please run the migration manually:"
        echo "1. Go to: https://app.supabase.com/project/$PROJECT_REF/sql/new"
        echo "2. Copy contents from: supabase/migrations/001_initial_schema.sql"
        echo "3. Paste and run"
        echo ""
        read -p "Press Enter after you've run the migration manually..."
    fi
else
    echo "❌ Migration file not found"
    exit 1
fi

echo ""

# Step 5: Deploy Edge Functions
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 4: Deploy Edge Functions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Deploying ticketmaster-proxy..."
supabase functions deploy ticketmaster-proxy --no-verify-jwt

if [ $? -eq 0 ]; then
    echo "✅ ticketmaster-proxy deployed"
else
    echo "⚠️  Failed to deploy ticketmaster-proxy"
    echo "   You can deploy it manually via the Supabase Dashboard"
fi

echo ""

echo "Deploying eventbrite-proxy..."
supabase functions deploy eventbrite-proxy --no-verify-jwt

if [ $? -eq 0 ]; then
    echo "✅ eventbrite-proxy deployed"
else
    echo "⚠️  Failed to deploy eventbrite-proxy"
    echo "   You can deploy it manually via the Supabase Dashboard"
fi

echo ""

# Step 6: Set secrets
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 5: Set Edge Function Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Setting TICKETMASTER_API_KEY..."
supabase secrets set TICKETMASTER_API_KEY=KQn9TlNEODUds0G80guxp9SAHnYF9jYg

if [ $? -eq 0 ]; then
    echo "✅ TICKETMASTER_API_KEY set"
else
    echo "⚠️  Failed to set TICKETMASTER_API_KEY"
fi

echo ""

echo "Setting EVENTBRITE_API_TOKEN..."
supabase secrets set EVENTBRITE_API_TOKEN=XNQKAZVGU2ZB7AXITETR

if [ $? -eq 0 ]; then
    echo "✅ EVENTBRITE_API_TOKEN set"
else
    echo "⚠️  Failed to set EVENTBRITE_API_TOKEN"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Restart your dev server: npm run dev"
echo "2. Check browser console for '✅ Supabase connected'"
echo "3. Test the app - CORS errors should be gone!"
echo ""
echo "If any steps failed, you can complete them manually:"
echo "- Database: https://app.supabase.com/project/$PROJECT_REF/sql/new"
echo "- Functions: https://app.supabase.com/project/$PROJECT_REF/functions"
echo ""
