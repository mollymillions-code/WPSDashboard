# WPS Dashboard

Fix Google OAuth issues by updating client ID and redirect URIs in Vercel environment variables.

## Required Configuration

1. Update the GOOGLE_CLIENT_ID in your Vercel environment variables
2. Update the GOOGLE_CLIENT_SECRET in your Vercel environment variables
3. Configure these authorized redirect URIs in Google Cloud Console:
   - https://wps-dashboard.vercel.app/api/auth/callback/google
   - https://wps-dashboard.vercel.app
