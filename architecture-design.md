# Enhanced Tactical Training App - Architecture Design

## Overview
Transform the current 2-weapon training app into a comprehensive 3-category training system with visual simulation, voice commands, and responsive design.

## App Structure

### 1. Main Views
- **Category Selection View**: Choose training category before starting
- **Training View**: Active training session with visual simulation
- **Settings View**: Configure speed, audio, and other preferences

### 2. Training Categories

#### Category 1: Firearms Draw
- **Subcategories**: 
  - Gun (draw action)
  - Holster Gun (holster action)
  - Taser (draw action)
  - Holster Taser (holster action)
- **Voice Commands**: "Gun", "Holster", "Taser", "Holster"

#### Category 2: Handgun Ready Position
- **Subcategories**:
  - Holster Index (ready position)
  - Temple Index (ready position)
  - Low Ready (ready position)
  - Sul Position (ready position)
- **Voice Commands**: "Holster Index", "Temple Index", "Low Ready", "Sul Position"

#### Category 3: Flashlight/Handgun Techniques
- **Subcategories**:
  - Modified FBI Technique
  - Neck/Temple Index
  - Harries Technique
  - Ayoob/Reverse Harries Technique
- **Voice Commands**: "FBI Technique", "Temple Index", "Harries", "Reverse Harries"

## Component Architecture

### 1. Main App Component
```
App.jsx
├── CategorySelectionView
├── TrainingView
└── SettingsView
```

### 2. Category Selection Component
- Grid layout with 3 category cards
- Each card shows category name, description, and subcategory count
- Visual preview of training positions
- "Start Training" button for each category

### 3. Training View Component
```
TrainingView
├── TrainingHeader (category name, timer, current action)
├── VisualSimulation (position demonstration)
├── ControlPanel (start/pause/reset buttons)
├── ProgressStats (subcategory counts)
└── VoiceIndicator (current voice command)
```

### 4. Visual Simulation Component
- Large central area showing training position
- Animated transitions between positions
- Visual cues for timing
- Responsive design for mobile/desktop

## Data Structure

### Training Categories
```javascript
const trainingCategories = {
  firearms: {
    id: 'firearms',
    name: 'Firearms Draw',
    description: 'Practice drawing and holstering weapons',
    subcategories: [
      { id: 'gun', name: 'Gun', action: 'draw', voice: 'Gun' },
      { id: 'holster_gun', name: 'Holster Gun', action: 'holster', voice: 'Holster' },
      { id: 'taser', name: 'Taser', action: 'draw', voice: 'Taser' },
      { id: 'holster_taser', name: 'Holster Taser', action: 'holster', voice: 'Holster' }
    ]
  },
  ready_position: {
    id: 'ready_position',
    name: 'Handgun Ready Position',
    description: 'Practice various ready positions',
    subcategories: [
      { id: 'holster_index', name: 'Holster Index', action: 'position', voice: 'Holster Index' },
      { id: 'temple_index', name: 'Temple Index', action: 'position', voice: 'Temple Index' },
      { id: 'low_ready', name: 'Low Ready', action: 'position', voice: 'Low Ready' },
      { id: 'sul_position', name: 'Sul Position', action: 'position', voice: 'Sul Position' }
    ]
  },
  flashlight_techniques: {
    id: 'flashlight_techniques',
    name: 'Flashlight/Handgun Techniques',
    description: 'Practice flashlight and handgun combinations',
    subcategories: [
      { id: 'fbi_technique', name: 'Modified FBI Technique', action: 'technique', voice: 'FBI Technique' },
      { id: 'neck_temple', name: 'Neck/Temple Index', action: 'technique', voice: 'Temple Index' },
      { id: 'harries', name: 'Harries Technique', action: 'technique', voice: 'Harries' },
      { id: 'reverse_harries', name: 'Ayoob/Reverse Harries', action: 'technique', voice: 'Reverse Harries' }
    ]
  }
}
```

## Shuffling Logic
- Each category maintains its own shuffling queue
- Prevent immediate repetition of same subcategory
- Weighted randomization with enhanced unpredictability
- History tracking for better distribution

## Voice Integration
- Web Speech API for text-to-speech
- Configurable voice settings (male/female, speed, volume)
- Voice commands triggered on action change
- Visual indicator when voice is speaking

## Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly controls for mobile
- Optimized layouts for different screen sizes

## State Management
```javascript
const appState = {
  currentView: 'category-selection', // 'category-selection', 'training', 'settings'
  selectedCategory: null,
  isTraining: false,
  isPaused: false,
  currentSubcategory: null,
  timeLeft: 0,
  counts: {}, // subcategory counts
  settings: {
    speed: 'fast',
    voiceEnabled: true,
    voiceType: 'female',
    randomMode: true
  }
}
```

## Visual Assets Needed
- Position demonstration images/illustrations
- Category icons
- Action indicators
- Training position diagrams

This architecture provides a solid foundation for implementing the enhanced tactical training app with all requested features.

