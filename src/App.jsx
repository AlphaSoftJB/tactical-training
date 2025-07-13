import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Play, Pause, RotateCcw, Info, Settings, Shuffle, Target, Flashlight, Shield } from 'lucide-react'
import './App.css'

// Training Categories Configuration with original training images
const trainingCategories = {
  firearms: {
    id: 'firearms',
    name: 'Firearms Draw',
    description: 'Practice drawing and holstering weapons',
    icon: Target,
    mainActions: [
      { id: 'gun', name: 'Gun', voice: 'Gun', image: '/images/gun.jpg' },
      { id: 'taser', name: 'Taser', voice: 'Taser', image: '/images/taser.jpg' },
    ],
    holsterAction: { id: 'holster', name: 'Holster', voice: 'Holster', image: '/images/holster_training.jpg' },
  },
  ready_position: {
    id: 'ready_position',
    name: 'Handgun Ready Position',
    description: 'Practice various ready positions',
    icon: Shield,
    mainActions: [
      { id: 'holster_index', name: 'Holster Index', voice: 'Holster Index', image: '/images/IMG_3248.jpeg' },
      { id: 'temple_index', name: 'Temple Index', voice: 'Temple Index', image: '/images/IMG_3249.jpeg' },
      { id: 'low_ready', name: 'Low Ready', voice: 'Low Ready', image: '/images/IMG_3250.jpeg' },
      { id: 'sul_position', name: 'Sul Position', voice: 'Sul Position', image: '/images/IMG_3251.jpeg' },
    ],
    holsterAction: { id: 'holster', name: 'Holster', voice: 'Holster', image: '/images/holster_training.jpg' },
  },
  flashlight_techniques: {
    id: 'flashlight_techniques',
    name: 'Flashlight/Handgun Techniques',
    description: 'Practice flashlight and handgun combinations',
    icon: Flashlight,
    mainActions: [
      { id: 'fbi_technique', name: 'Modified FBI Technique', voice: 'FBI Technique', image: '/images/IMG_3253.jpeg' },
      { id: 'neck_temple', name: 'Neck/Temple Index', voice: 'Temple Index', image: '/images/IMG_3282.jpeg' },
      { id: 'harries', name: 'Harries Technique', voice: 'Harries', image: '/images/IMG_3259.jpeg' },
      { id: 'reverse_harries', name: 'Ayoob/Reverse Harries', voice: 'Reverse Harries', image: '/images/IMG_3256.jpeg' },
    ],
    holsterAction: { id: 'holster', name: 'Holster', voice: 'Holster', image: '/images/holster_training.jpg' },
  },
}

const speedPresets = [
  { name: 'Very Slow', actionTime: 5, holsterTime: 3 },
  { name: 'Slow', actionTime: 3, holsterTime: 2 },
  { name: 'Normal', actionTime: 2, holsterTime: 1.5 },
  { name: 'Fast', actionTime: 1, holsterTime: 1 },
  { name: 'Very Fast', actionTime: 0.5, holsterTime: 0.5 }
]

function App() {
  const [currentView, setCurrentView] = useState('category-selection')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentAction, setCurrentAction] = useState(null)
  const [isHolstering, setIsHolstering] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1)
  const [counts, setCounts] = useState({})
  const [showSettings, setShowSettings] = useState(false)
  const [actionHistory, setActionHistory] = useState([])
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [voiceType, setVoiceType] = useState('female')
  
  // Category-specific settings
  const [categorySettings, setCategorySettings] = useState({
    firearms: { speedIndex: 3, randomMode: true },
    ready_position: { speedIndex: 2, randomMode: true },
    flashlight_techniques: { speedIndex: 1, randomMode: true }
  })
  
  const timerRef = useRef(null)
  const speechRef = useRef(null)

  const getCurrentSettings = () => {
    return selectedCategory ? categorySettings[selectedCategory] : { speedIndex: 3, randomMode: true }
  }

  const getCurrentSpeed = () => {
    const settings = getCurrentSettings()
    return speedPresets[settings.speedIndex]
  }

  // Initialize counts for selected category
  const initializeCounts = (categoryId) => {
    const category = trainingCategories[categoryId]
    const newCounts = {}
    category.mainActions.forEach(action => {
      newCounts[action.id] = 0
    })
    setCounts(newCounts)
  }

  // Enhanced random selection
  const getRandomMainAction = () => {
    if (!selectedCategory) return null
    
    const category = trainingCategories[selectedCategory]
    const settings = getCurrentSettings()
    
    if (!settings.randomMode) {
      // Sequential mode
      const lastAction = actionHistory[actionHistory.length - 1]
      if (!lastAction) return category.mainActions[0]
      
      const currentIndex = category.mainActions.findIndex(action => action.id === lastAction.id)
      const nextIndex = (currentIndex + 1) % category.mainActions.length
      return category.mainActions[nextIndex]
    } else {
      // True random mode
      const randomIndex = Math.floor(Math.random() * category.mainActions.length)
      return category.mainActions[randomIndex]
    }
  }

  // Text-to-speech function
  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return
    
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 0.8
    
    const voices = window.speechSynthesis.getVoices()
    const selectedVoice = voices.find(voice => 
      voiceType === 'female' ? 
        voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('zira') || voice.name.toLowerCase().includes('samantha') :
        voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('david') || voice.name.toLowerCase().includes('alex')
    )
    
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }
    
    speechRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  // Select a new main action
  const selectNewMainAction = () => {
    const action = getRandomMainAction()
    if (!action) return
    
    setCurrentAction(action)
    setIsHolstering(false)
    const speed = getCurrentSpeed()
    setTimeLeft(speed.actionTime)
    setCounts(prev => ({ ...prev, [action.id]: prev[action.id] + 1 }))
    
    setActionHistory(prev => [...prev.slice(-4), action])
    speakText(action.voice)
  }

  // Switch to holstering
  const switchToHolstering = () => {
    if (!selectedCategory) return
    
    const category = trainingCategories[selectedCategory]
    setCurrentAction(category.holsterAction)
    setIsHolstering(true)
    const speed = getCurrentSpeed()
    setTimeLeft(speed.holsterTime)
    speakText(category.holsterAction.voice)
  }

  // Start the timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    const speed = getCurrentSpeed()
    const interval = speed.actionTime < 1 ? 100 : 1000
    const decrement = speed.actionTime < 1 ? 0.1 : 1
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = Math.max(0, prev - decrement)
        
        if (newTime <= 0) {
          if (isHolstering) {
            // After holstering, select new main action
            selectNewMainAction()
            return getCurrentSpeed().actionTime
          } else {
            // After main action, switch to holstering
            switchToHolstering()
            return getCurrentSpeed().holsterTime
          }
        }
        return newTime
      })
    }, interval)
  }

  // Start training
  const startTraining = (categoryId) => {
    setSelectedCategory(categoryId)
    initializeCounts(categoryId)
    setIsRunning(true)
    setIsPaused(false)
    setActionHistory([])
    selectNewMainAction()
    setCurrentView('training')
  }

  // Pause/Resume training
  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // Reset training
  const resetTraining = () => {
    setIsRunning(false)
    setIsPaused(false)
    setSelectedCategory(null)
    setCurrentAction(null)
    setIsHolstering(false)
    setTimeLeft(1)
    setCounts({})
    setActionHistory([])
    if (timerRef.current) clearInterval(timerRef.current)
    if (speechRef.current) window.speechSynthesis.cancel()
    setCurrentView('category-selection')
  }

  // Update category settings
  const updateCategorySettings = (categoryId, newSettings) => {
    setCategorySettings(prev => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], ...newSettings }
    }))
  }

  // Effect to handle timer
  useEffect(() => {
    if (isRunning && !isPaused && selectedCategory) {
      startTimer()
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, isPaused, isHolstering, selectedCategory, categorySettings])

  // Disclaimer Component
  const DisclaimerFootnote = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 border-t border-gray-700 p-2 sm:p-3">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs sm:text-sm text-gray-400 text-center leading-relaxed">
          <strong className="text-gray-300">Disclaimer:</strong> This visual simulation web application was created exclusively for personal use in connection with Session 79 at-home training. It is not affiliated with, endorsed by, or representative of the Montgomery County Police Department (MCPD) or any related agencies. The content is intended solely for individual study and practice purposes. Sharing, distributing, or reproducing this application or its contents in any form is strictly prohibited and constitutes a violation of its intended use.
        </p>
      </div>
    </div>
  )

  // Category Selection View
  const CategorySelectionView = () => (
    <div className="tactical-container flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 pb-20">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-red-500 text-center mb-6 sm:mb-8">
          TACTICAL TRAINING SIMULATOR
        </h1>
        
        <p className="text-lg sm:text-xl text-white text-center mb-8 sm:mb-12">
          Select a training category to begin your session
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {Object.values(trainingCategories).map((category) => {
            const IconComponent = category.icon
            const settings = categorySettings[category.id]
            const speed = speedPresets[settings.speedIndex]
            
            return (
              <Card key={category.id} className="bg-gray-900 border-gray-700 hover:border-red-500 transition-all duration-300 cursor-pointer transform hover:scale-105">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <IconComponent className="h-12 w-12 sm:h-16 sm:w-16 text-red-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-red-500 mb-3 sm:mb-4">{category.name}</h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">{category.description}</p>
                  <div className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
                    {category.mainActions.length} Main Actions | Speed: {speed.name}
                  </div>
                  
                  {/* Category-specific settings */}
                  <div className="mb-4 space-y-2">
                    <div className="text-xs text-gray-400">Speed: {speed.name}</div>
                    <Slider
                      value={[settings.speedIndex]}
                      onValueChange={(value) => updateCategorySettings(category.id, { speedIndex: value[0] })}
                      max={speedPresets.length - 1}
                      step={1}
                      className="w-full h-2"
                    />
                    <div className="flex justify-center mt-2">
                      <Button
                        onClick={() => updateCategorySettings(category.id, { randomMode: !settings.randomMode })}
                        className={`text-xs px-3 py-1 ${settings.randomMode ? 'bg-red-600' : 'bg-gray-600'} hover:bg-red-700`}
                      >
                        {settings.randomMode ? 'Random' : 'Sequential'}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => startTraining(category.id)}
                    className="control-button w-full text-sm sm:text-base hover:bg-red-600 transition-colors"
                  >
                    <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    START TRAINING
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        {/* Global Settings Panel */}
        <div className="mb-8 lg:mb-12">
          <Button 
            onClick={() => setShowSettings(!showSettings)}
            className="control-button mb-4 text-sm sm:text-base"
          >
            <Settings className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {showSettings ? 'HIDE GLOBAL SETTINGS' : 'SHOW GLOBAL SETTINGS'}
          </Button>
          
          {showSettings && (
            <Card className="bg-gray-900 border-gray-700 p-4 sm:p-6">
              <CardContent className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-white text-sm sm:text-base font-bold mb-2">
                    Voice Commands
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
                    <Button
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={`control-button text-xs sm:text-sm ${voiceEnabled ? 'bg-red-600' : 'bg-gray-600'}`}
                    >
                      {voiceEnabled ? 'Voice ON' : 'Voice OFF'}
                    </Button>
                    <Button
                      onClick={() => setVoiceType(voiceType === 'female' ? 'male' : 'female')}
                      className="control-button text-xs sm:text-sm"
                      disabled={!voiceEnabled}
                    >
                      {voiceType === 'female' ? 'Female Voice' : 'Male Voice'}
                    </Button>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    Voice commands will announce each training action
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )

  // Training View
  const TrainingView = () => {
    if (!selectedCategory || !currentAction) return null
    
    const category = trainingCategories[selectedCategory]
    const settings = getCurrentSettings()
    const speed = getCurrentSpeed()
    
    return (
      <div className="tactical-container flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 pb-20">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500 mb-2 sm:mb-4">
            {category.name}
          </h1>
          
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
            {currentAction.name}
          </h2>
          
          <div className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-6 sm:mb-8 uppercase">
            {isHolstering ? 'HOLSTER' : 'ACTION'}
          </div>
          
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="relative">
              <img 
                src={currentAction.image} 
                alt={currentAction.name} 
                className="w-full max-w-sm sm:max-w-md lg:max-w-lg h-48 sm:h-64 lg:h-80 object-contain rounded-lg shadow-2xl border-2 border-gray-700 bg-white"
                onError={(e) => {
                  console.error('Image failed to load:', currentAction.image)
                  e.target.style.display = 'none'
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', currentAction.image)
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg pointer-events-none"></div>
            </div>
          </div>
          
          {/* Timer display removed - no more countdown visible */}
          
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
            <Button 
              onClick={togglePause}
              className="control-button text-sm sm:text-base hover:bg-red-600 transition-colors"
              disabled={!isRunning}
            >
              {isPaused ? <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> : <Pause className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />}
              {isPaused ? 'RESUME' : 'PAUSE'}
            </Button>
            
            <Button 
              onClick={resetTraining}
              className="control-button text-sm sm:text-base hover:bg-red-600 transition-colors"
            >
              <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              RESET
            </Button>
            
            <Button 
              onClick={() => setCurrentView('category-selection')}
              className="control-button text-sm sm:text-base hover:bg-red-600 transition-colors"
            >
              <Info className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              CATEGORIES
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {category.mainActions.map((action) => (
              <div key={action.id} className="text-center bg-gray-800 rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm lg:text-base text-gray-300 mb-1 sm:mb-2 truncate">
                  {action.name}
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {counts[action.id] || 0}
                </div>
              </div>
            ))}
          </div>
          
          {/* Status indicators */}
          <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-400">
            Speed: {speed.name} | Mode: {settings.randomMode ? 'Random' : 'Sequential'} | Voice: {voiceEnabled ? 'ON' : 'OFF'}
          </div>
          
          {/* Voice indicator */}
          {voiceEnabled && (
            <div className="mt-2 text-xs sm:text-sm text-green-400">
              🔊 Voice Command: "{currentAction.voice}"
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      {currentView === 'category-selection' ? <CategorySelectionView /> : <TrainingView />}
      <DisclaimerFootnote />
    </div>
  )
}

export default App

