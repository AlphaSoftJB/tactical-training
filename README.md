# Tactical Training Simulator - Local Development Setup

## 📋 **Project Overview**

This is a professional tactical training simulator created for Session 79 at-home training. The application provides three training categories with visual simulation, voice commands, and category-specific settings.

### **Training Categories:**
1. **Firearms Draw** - Gun and Taser drawing/holstering (2 main actions)
2. **Handgun Ready Position** - Holster Index, Temple Index, Low Ready, Sul Position (4 main actions)  
3. **Flashlight/Handgun Techniques** - FBI, Harries, Neck/Temple, Reverse Harries (4 main actions)

### **Key Features:**
- ✅ HD training position images with instructional details
- ✅ Category-specific speed and randomization settings
- ✅ Voice commands with male/female voice options
- ✅ Automatic holstering transitions between main actions
- ✅ Clean interface without timer pressure
- ✅ Professional Session 79 disclaimer
- ✅ Responsive design for mobile and desktop

---

## 🛠️ **Prerequisites**

### **Required Software:**
- **Node.js** (version 18.0.0 or higher)
- **npm** (comes with Node.js)
- **IntelliJ IDEA** (Ultimate or Community Edition)

### **Recommended IntelliJ Plugins:**
- **JavaScript and TypeScript** (usually pre-installed)
- **React** (for better JSX support)
- **Tailwind CSS** (for CSS class autocomplete)

---

## 🚀 **IntelliJ IDEA Setup Instructions**

### **Step 1: Open Project in IntelliJ**

1. **Launch IntelliJ IDEA**
2. **Open Project:**
   - Click `File` → `Open`
   - Navigate to the extracted `tactical-training-download` folder
   - Select the folder and click `Open`
3. **Trust the Project** when prompted

### **Step 2: Configure Node.js in IntelliJ**

1. **Open Settings:**
   - `File` → `Settings` (Windows/Linux)
   - `IntelliJ IDEA` → `Preferences` (macOS)

2. **Configure Node.js:**
   - Navigate to `Languages & Frameworks` → `Node.js`
   - Set **Node interpreter** to your Node.js installation path
   - IntelliJ should auto-detect it, or browse to:
     - **Windows:** `C:\Program Files\nodejs\node.exe`
     - **macOS:** `/usr/local/bin/node` or `/opt/homebrew/bin/node`
     - **Linux:** `/usr/bin/node` or `/usr/local/bin/node`

3. **Enable Coding Assistance:**
   - Check `Coding assistance for Node.js`
   - Click `Apply` and `OK`

### **Step 3: Install Dependencies**

1. **Open Terminal in IntelliJ:**
   - `View` → `Tool Windows` → `Terminal`
   - Or use shortcut: `Alt+F12` (Windows/Linux) or `Option+F12` (macOS)

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Wait for Installation:**
   - This will install all required packages including React, Vite, Tailwind CSS, and UI components
   - Installation typically takes 1-3 minutes

### **Step 4: Configure Run Configuration**

1. **Create Run Configuration:**
   - Click `Run` → `Edit Configurations`
   - Click `+` → `npm`
   - **Name:** `Tactical Training - Dev Server`
   - **Command:** `run`
   - **Scripts:** `dev`
   - **Node interpreter:** (should auto-fill)
   - **Package.json:** (should auto-fill with project path)

2. **Save Configuration:**
   - Click `Apply` and `OK`

---

## 🏃‍♂️ **Running the Application**

### **Method 1: Using IntelliJ Run Configuration**
1. **Select Configuration:** Choose `Tactical Training - Dev Server` from the run configuration dropdown
2. **Start Application:** Click the green play button or press `Shift+F10`
3. **Access Application:** Open browser to `http://localhost:5173`

### **Method 2: Using Terminal**
1. **Open Terminal in IntelliJ:** `Alt+F12` (Windows/Linux) or `Option+F12` (macOS)
2. **Start Development Server:**
   ```bash
   npm run dev
   ```
3. **Access Application:** Open browser to `http://localhost:5173`

### **Method 3: Using Package.json Scripts**
1. **Open package.json** in IntelliJ
2. **Click the green play button** next to `"dev": "vite"` script
3. **Access Application:** Open browser to `http://localhost:5173`

---

## 🧪 **Testing the Application**

### **Basic Functionality Test:**

1. **Category Selection:**
   - Verify all three training categories are displayed
   - Check category-specific settings (speed sliders, randomization)
   - Confirm each category shows correct main action count

2. **Training Flow Test:**
   - Start any training category
   - Verify automatic progression: Main Action → Holster → Next Main Action
   - Check that holstering is a transition (not counted as main action)
   - Confirm randomization works within each category

3. **Visual Elements Test:**
   - Verify HD training images load correctly
   - Check that original training images display with instructional text
   - Confirm images are clear and properly sized

4. **Voice Commands Test:**
   - Enable voice in settings
   - Verify text-to-speech announces each action
   - Test both male and female voice options

5. **Responsive Design Test:**
   - Test on different browser window sizes
   - Verify mobile responsiveness using browser dev tools
   - Check that disclaimer appears as footnote on all views

### **Advanced Testing:**

1. **Settings Persistence:**
   - Change speed and randomization settings
   - Refresh page and verify settings are maintained
   - Test global settings vs category-specific settings

2. **Statistics Tracking:**
   - Run training sessions and verify counters increment correctly
   - Check that statistics are tracked per subcategory
   - Verify reset functionality works

3. **Browser Compatibility:**
   - Test in Chrome, Firefox, Safari, Edge
   - Verify voice commands work across browsers
   - Check image loading in different browsers

---

## 🔧 **Development Commands**

### **Available Scripts:**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install

# Update dependencies
npm update
```

### **Development Server Features:**
- **Hot Module Replacement (HMR)** - Changes reflect instantly
- **Fast Refresh** - React components update without losing state
- **Error Overlay** - Development errors shown in browser
- **Source Maps** - Debug with original source code

---

## 📁 **Project Structure**

```
tactical-training-download/
├── public/
│   └── images/                 # Training position images
│       ├── IMG_3248.jpeg      # Holster Index
│       ├── IMG_3249.jpeg      # Temple Index
│       ├── IMG_3250.jpeg      # Low Ready
│       ├── IMG_3251.jpeg      # Sul Position
│       ├── IMG_3253.jpeg      # FBI Technique
│       ├── IMG_3256.jpeg      # Reverse Harries
│       ├── IMG_3259.jpeg      # Harries Technique
│       └── IMG_3282.jpeg      # Neck/Temple Index
├── src/
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   ├── App.jsx                # Main application component
│   └── main.jsx               # Application entry point
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── index.html                # HTML template
└── README.md                 # This file
```

---

## 🎯 **Key Implementation Details**

### **Training Flow Logic:**
- Each category has main actions and automatic holstering
- Holstering serves as transition between main actions
- Randomization occurs within each category's main actions
- Statistics track both main actions and holstering separately

### **Image Management:**
- Original training images stored in `public/images/`
- Images loaded dynamically based on current action
- HD quality preserved for instructional clarity
- Fallback handling for missing images

### **Voice Implementation:**
- Uses Web Speech API (text-to-speech)
- Configurable male/female voices
- Action names announced clearly
- Browser compatibility handled gracefully

### **Responsive Design:**
- Tailwind CSS for responsive utilities
- Mobile-first design approach
- Touch-friendly interface elements
- Flexible image sizing

---

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **Port 5173 Already in Use:**
   ```bash
   # Kill existing process
   npx kill-port 5173
   # Or use different port
   npm run dev -- --port 3000
   ```

2. **Node.js Version Issues:**
   ```bash
   # Check Node.js version
   node --version
   # Should be 18.0.0 or higher
   ```

3. **Dependencies Not Installing:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Images Not Loading:**
   - Verify images exist in `public/images/` folder
   - Check browser console for 404 errors
   - Ensure image paths in code match actual filenames

5. **Voice Commands Not Working:**
   - Check browser permissions for speech synthesis
   - Verify browser supports Web Speech API
   - Test with different browsers

### **IntelliJ-Specific Issues:**

1. **JavaScript/JSX Not Recognized:**
   - Enable JavaScript and TypeScript plugin
   - Mark `src` folder as Sources Root
   - Configure JavaScript language version to ES6+

2. **Import Statements Not Resolved:**
   - Ensure Node.js is properly configured
   - Check that `node_modules` folder exists
   - Restart IntelliJ after installing dependencies

3. **Hot Reload Not Working:**
   - Check that Vite dev server is running
   - Verify no firewall blocking localhost:5173
   - Try restarting the development server

---

## 📞 **Support**

### **For Development Issues:**
- Check browser console for error messages
- Verify all dependencies are installed correctly
- Ensure Node.js version compatibility
- Test in different browsers

### **For Training Content:**
- All training materials are for Session 79 personal use only
- Images and content are not affiliated with MCPD
- Sharing or distribution is prohibited

---

## 🎉 **Ready to Start!**

Your tactical training simulator is now ready for local development and testing in IntelliJ IDEA. The application provides a professional training experience with authentic instructional materials and modern web technologies.

**Happy Training!** 🎯

