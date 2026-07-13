# GitHub Pages Setup Guide

## Configuration Complete ✅

Your repository is now configured for GitHub Pages deployment. Here's what was set up:

### Files Created/Updated:
1. **vite.config.ts** - Added GitHub Pages configuration
   - `base: '/'` - Set correct base path for GitHub Pages
   - `build.outDir: 'dist'` - Output directory for built files

2. **.github/workflows/deploy.yml** - Automated deployment workflow
   - Builds your React + Vite app on every push to `main`
   - Automatically deploys to GitHub Pages

### Next Steps:

1. **Merge this branch to `main`:**
   ```bash
   git checkout main
   git pull origin main
   git merge setup/github-pages
   git push origin main
   ```

2. **Enable GitHub Pages in repository settings:**
   - Go to: https://github.com/tolulopeige-cloud/Tolulope-igescentedcandles.github.io/settings/pages
   - Under "Build and deployment":
     - **Source:** GitHub Actions
   - Click **Save**

3. **Your site will be live at:**
   ```
   https://tolulopeige-cloud.github.io/
   ```

### How it works:
- Every time you push to `main`, the GitHub Actions workflow automatically:
  1. Installs dependencies
  2. Builds your React app with Vite
  3. Deploys the built files to GitHub Pages

### View deployment status:
- Go to: https://github.com/tolulopeige-cloud/Tolulope-igescentedcandles.github.io/actions
- You'll see the deployment workflow run and status updates

### Environment Variables:
If you need to add environment variables (like API keys), create a `.env` file locally and add secrets in repository settings:
- Go to Settings → Secrets and variables → Actions
- Add your secrets there (they'll be available as `${{ secrets.SECRET_NAME }}` in the workflow)

---

**Questions?** Check the workflow logs if deployment fails:
https://github.com/tolulopeige-cloud/Tolulope-igescentedcandles.github.io/actions
