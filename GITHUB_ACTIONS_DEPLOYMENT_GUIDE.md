# GitHub Actions Deployment Guide for Tactical Training App

This guide provides step-by-step instructions to set up automated deployment of your Tactical Training App using GitHub Actions.

## 📋 Prerequisites

- GitHub account
- Your tactical training app code in a GitHub repository
- Basic understanding of Git and GitHub

## 🚀 Step-by-Step Setup

### Step 1: Prepare Your Repository

1. **Create a new GitHub repository** or use an existing one
2. **Push your tactical training app code** to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Tactical Training App"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/tactical-training-app.git
   git push -u origin main
   ```

### Step 2: Create GitHub Actions Workflow

1. **Create the workflow directory** in your repository:
   ```bash
   mkdir -p .github/workflows
   ```

2. **Create the deployment workflow file**:
   ```bash
   touch .github/workflows/deploy.yml
   ```

3. **Add the following content** to `.github/workflows/deploy.yml`:

```yaml
name: Deploy Tactical Training App

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci --legacy-peer-deps
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Step 3: Configure GitHub Pages

1. **Go to your repository on GitHub**
2. **Click on "Settings"** tab
3. **Scroll down to "Pages"** section in the left sidebar
4. **Under "Source"**, select **"Deploy from a branch"**
5. **Select branch**: `gh-pages`
6. **Select folder**: `/ (root)`
7. **Click "Save"**

### Step 4: Enable GitHub Actions

1. **Go to the "Actions"** tab in your repository
2. **Click "I understand my workflows, go ahead and enable them"** if prompted
3. **Your workflow should appear** in the list

### Step 5: Configure Repository Permissions

1. **Go to "Settings" → "Actions" → "General"**
2. **Under "Workflow permissions"**, select:
   - ✅ **"Read and write permissions"**
   - ✅ **"Allow GitHub Actions to create and approve pull requests"**
3. **Click "Save"**

### Step 6: Trigger Your First Deployment

1. **Make a small change** to your code (e.g., update README.md)
2. **Commit and push** the change:
   ```bash
   git add .
   git commit -m "Trigger first deployment"
   git push origin main
   ```
3. **Go to the "Actions" tab** to watch the deployment process
4. **Once complete**, your app will be available at:
   ```
   https://YOUR_USERNAME.github.io/tactical-training-app/
   ```

## 🔧 Advanced Configuration Options

### Option 1: Deploy to Netlify

Replace the GitHub Pages deployment step with Netlify:

```yaml
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**Setup required:**
1. Create Netlify account
2. Get your Site ID and Auth Token
3. Add them as repository secrets

### Option 2: Deploy to Vercel

Replace the deployment step with Vercel:

```yaml
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./
```

### Option 3: Custom Domain with GitHub Pages

1. **Add a CNAME file** to your `public` folder:
   ```
   echo "yourdomain.com" > public/CNAME
   ```

2. **Configure DNS** at your domain provider:
   ```
   Type: CNAME
   Name: www (or @)
   Value: YOUR_USERNAME.github.io
   ```

## 🔐 Environment Variables and Secrets

### Adding Repository Secrets

1. **Go to "Settings" → "Secrets and variables" → "Actions"**
2. **Click "New repository secret"**
3. **Add the following secrets** as needed:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `NETLIFY_AUTH_TOKEN` | Netlify authentication token | `nfp_xxx...` |
| `NETLIFY_SITE_ID` | Netlify site identifier | `abc123...` |
| `VERCEL_TOKEN` | Vercel authentication token | `xxx...` |
| `ORG_ID` | Vercel organization ID | `team_xxx...` |
| `PROJECT_ID` | Vercel project ID | `prj_xxx...` |

### Using Environment Variables in Build

Add environment variables to your workflow:

```yaml
    - name: Build application
      run: npm run build
      env:
        REACT_APP_API_URL: ${{ secrets.API_URL }}
        REACT_APP_VERSION: ${{ github.sha }}
```

## 🔄 Workflow Triggers

### Deploy on Different Events

```yaml
on:
  # Deploy on push to main
  push:
    branches: [ main ]
  
  # Deploy on pull request
  pull_request:
    branches: [ main ]
  
  # Deploy on release
  release:
    types: [published]
  
  # Manual deployment
  workflow_dispatch:
  
  # Scheduled deployment (daily at 2 AM UTC)
  schedule:
    - cron: '0 2 * * *'
```

## 🧪 Testing and Quality Checks

### Enhanced Workflow with Testing

```yaml
name: Build, Test, and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm ci --legacy-peer-deps
    - run: npm run test
    - run: npm run lint
    
  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm ci --legacy-peer-deps
    - run: npm run build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 📊 Monitoring and Notifications

### Slack Notifications

Add Slack notifications for deployment status:

```yaml
    - name: Notify Slack on Success
      if: success()
      uses: 8398a7/action-slack@v3
      with:
        status: success
        text: '🚀 Tactical Training App deployed successfully!'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        
    - name: Notify Slack on Failure
      if: failure()
      uses: 8398a7/action-slack@v3
      with:
        status: failure
        text: '❌ Tactical Training App deployment failed!'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. **Build Fails with Dependency Issues**
```yaml
- run: npm ci --legacy-peer-deps --force
```

#### 2. **Permission Denied Errors**
- Check repository permissions in Settings → Actions → General
- Ensure "Read and write permissions" is enabled

#### 3. **GitHub Pages Not Updating**
- Check if `gh-pages` branch exists
- Verify GitHub Pages source is set to `gh-pages` branch
- Clear browser cache

#### 4. **Images Not Loading in Production**
- Ensure images are in `public/` folder
- Use relative paths: `/images/image.jpg`
- Check build output includes image files

#### 5. **Environment Variables Not Working**
- Prefix React env vars with `REACT_APP_`
- Add them to workflow environment section
- Rebuild after adding new variables

## 📝 Best Practices

### 1. **Branch Protection**
- Enable branch protection for `main`
- Require status checks to pass
- Require pull request reviews

### 2. **Semantic Versioning**
```yaml
    - name: Generate version
      run: echo "VERSION=$(date +'%Y.%m.%d')-${GITHUB_SHA::8}" >> $GITHUB_ENV
```

### 3. **Cache Dependencies**
```yaml
    - name: Cache node modules
      uses: actions/cache@v3
      with:
        path: ~/.npm
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### 4. **Parallel Jobs**
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20]
    runs-on: ubuntu-latest
```

## 🎯 Complete Example Workflow

Here's a complete, production-ready workflow:

```yaml
name: Tactical Training App CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

env:
  NODE_VERSION: '20'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci --legacy-peer-deps
      
    - name: Run tests
      run: npm run test -- --coverage --watchAll=false
      
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci --legacy-peer-deps
      
    - name: Build application
      run: npm run build
      env:
        REACT_APP_VERSION: ${{ github.sha }}
        
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/
        
  deploy:
    needs: [test, build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        cname: your-custom-domain.com
```

## 🎉 Conclusion

With this setup, your Tactical Training App will automatically:
- ✅ Run tests on every push and pull request
- ✅ Build the application
- ✅ Deploy to your chosen platform
- ✅ Notify you of deployment status
- ✅ Handle rollbacks if needed

Your app will be live and automatically updated whenever you push changes to the main branch!

## 📞 Support

If you encounter any issues:
1. Check the Actions tab for detailed error logs
2. Review the troubleshooting section above
3. Ensure all secrets and permissions are configured correctly
4. Test the build process locally first

Happy deploying! 🚀

