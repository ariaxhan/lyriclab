"use client"

import Link from "next/link"
import { invoke } from "./blitz-server"
import { LogoutButton } from "./(auth)/components/LogoutButton"
import styles from "./styles/Home.module.css"
import getCurrentUser from "./users/queries/getCurrentUser"
import { useState } from "react"

interface AnalysisResults {
  wordCount: number
  uniqueWords: number
  sentiment: string
  commonThemes: string[]
}

type InputType = "artist" | "song" | "album"

const Home: React.FC = () => {
  const [inputType, setInputType] = useState<InputType>("song")
  const [input, setInput] = useState<string>("")
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)
  const [playlist, setPlaylist] = useState<string[] | null>(null)

  const handleAnalyze = async (): Promise<void> => {
    // Here you would call your API to perform the analysis
    // For now, let's just set some dummy data
    setAnalysisResults({
      wordCount: 100,
      uniqueWords: 50,
      sentiment: "Positive",
      commonThemes: ["Love", "Hope", "Dreams"],
    })
    setPlaylist(["Song 1", "Song 2", "Song 3"])
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>LyricLab</h1>
          <p className={styles.description}>AI-powered music analysis and playlist generation</p>
        </div>

        <div className={styles.inputForm}>
          <select
            className={styles.select}
            value={inputType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setInputType(e.target.value as InputType)
            }
          >
            <option value="artist">Artist</option>
            <option value="song">Song</option>
            <option value="album">Album</option>
          </select>
          <input
            type="text"
            placeholder={`Enter ${inputType} name...`}
            className={styles.input}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          />
          <button className={styles.button} onClick={handleAnalyze}>
            Analyze
          </button>
        </div>

        {analysisResults && (
          <div className={styles.results}>
            <h2>Analysis Results</h2>
            <div className={styles.resultsContent}>
              <p>Word Count: {analysisResults.wordCount}</p>
              <p>Unique Words: {analysisResults.uniqueWords}</p>
              <p>Sentiment: {analysisResults.sentiment}</p>
              <p>Common Themes: {analysisResults.commonThemes.join(", ")}</p>
            </div>
          </div>
        )}

        {playlist && (
          <div className={styles.playlist}>
            <h2>Generated Playlist</h2>
            <div className={styles.playlistContent}>
              <ul>
                {playlist.map((song, index) => (
                  <li key={index}>{song}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <span>Powered by LyricLab</span>
      </footer>
    </div>
  )
}

export default Home
