#!/bin/bash

# Supabase Auto-Setup Script
# This script guides you through the setup process

echo "🚀 Inner City - Supabase Auto-Setup"
echo "===================================="
echo ""

PROJECT_REF="gdsblffnkiswaweqokcm"
SUPABASE_URL="https://gdsblffnkiswaweqokcm.supabase.co"

echo "📋 Project Details:"
echo "   URL: $SUPABASE_URL"
echo "   Ref: $PROJECT_REF"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    brew install supabase/tap/supabase
fi

echo "✅ Supabase CLI installed"
echo ""

# Step 1: Login
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: Login to Supabase"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "You need to login to Supabase. This will open your browser."
echo "Press Enter to continue..."
read

supabase login

if [ $? -ne 0 ]; then
    echo "❌ Login failed. Please try again."
    exit 1
fi

echo "✅ Logged in successfully"
echo ""

# Step 2: Link project
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: Link Project"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

supabase link --project-ref $PROJECT_REF

if [ $? -ne 0 ]; then
    echo "❌ Failed to link project"
    exit 1
fi

echo "✅ Project linked"
echo ""

# Step 3: Run migration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: Run Database Migration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "supabase/migrations/001_initial_schema.sql" ]; then
    echo "Running migration..."
    supabase db push
    
    if [ $? -eq 0 ]; then
        echo "✅ Migration completed"
    else
        echo "⚠️  Migration may have failed. Check the output above."
        echo "   You can also run it manually via Supabase Dashboard:"
        echo "   https://app.supabase.com/project/$PROJECT_REF/sql/new"
    fi
else
    echo "❌ Migration file not found"
fi

echo ""

# Step 4: Deploy Edge Functions
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 4: Deploy Edge Functions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Deploying ticketmaster-proxy..."
supabase functions deploy ticketmaster-proxy

if [ $? -eq 0 ]; then
    echo "✅ ticketmaster-proxy deployed"
else
    echo "⚠️  Failed to deploy ticketmaster-proxy"
fi

echo ""

echo "Deploying eventbrite-proxy..."
supabase functions deploy eventbrite-proxy

if [ $? -eq 0 ]; then
    echo "✅ eventbrite-proxy deployed"
else
    echo "⚠️  Failed to deploy eventbrite-proxy"
fi

echo ""

# Step 5: Set secrets
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
echo "2. Check the browser console for '✅ Supabase connected'"
echo "3. Test the app - CORS errors should be gone!"
echo ""
