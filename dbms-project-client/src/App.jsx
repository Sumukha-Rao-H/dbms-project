import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black text-center text-gray-800 dark:text-gray-100 flex flex-col items-center justify-center gap-6 p-6">
      <div className="gap-10 items-center">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} alt="Vite logo" className="w-24 hover:scale-110 transition-transform" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} alt="React logo" className="w-24 hover:scale-110 transition-transform" />
        </a>
      </div>

      <h1 className="text-4xl font-bold">Vite + React</h1>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md flex flex-col items-center gap-4">
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="text-gray-600 dark:text-gray-300">
          Edit <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">src/App.jsx</code> and save to test HMR
        </p>

        <button
          className="text-sm mt-4 px-4 py-2 border rounded-lg border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          onClick={() => setDarkMode(prev => !prev)}
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <p className="text-sm text-gray-500 italic dark:text-gray-400">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
