// app/projects/mutations/analyzeMusic.ts
import { Ctx } from "blitz"
import * as z from "zod"
import { ChatGroq } from "@langchain/groq"
import { ChatPromptTemplate } from "@langchain/core/prompts"

// Define the input schema
const AnalyzeMusic = z
  .object({
    name: z.string(),
  })
  .nonstrict()

// Initialize the ChatGroq model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
})

// Define the prompt template
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant"],
  ["human", "{input}"],
])

// Define the mutation function
export default async function analyzeMusic(input: z.infer<typeof AnalyzeMusic>, ctx: Ctx) {
  // Validate input - very important for security
  const data = AnalyzeMusic.parse(input)

  // Require user to be logged in
  ctx.session.$authorize()

  // Create a prompt and get a response from ChatGroq
  const chain = prompt.pipe(model)
  const response = await chain.invoke({
    input: `Analyze the following ${data.name} and provide details on word count, unique words, sentiment, and common themes. Please format the output as a JSON object with the following keys: "wordCount", "uniqueWords", "sentiment", and "commonThemes". Example response:
{
  "wordCount": 103,
  "uniqueWords": 61,
  "sentiment": "Positive",
  "commonThemes": [
    "Angel",
    "Baby",
    "Beautiful",
    "Love",
    "Heaven"
  ]
}`,
  })

  if (response !== null) {
    console.log("response", response)
  }

  // Extract content from response and parse the JSON string
  let parsedResponse
  try {
    const contentMatch = response.content.match(/{[\s\S]*}/) // Regex to find JSON object in the content
    if (contentMatch) {
      parsedResponse = JSON.parse(contentMatch[0])
    } else {
      throw new Error("No JSON object found in the response content")
    }
  } catch (error) {
    console.error("Error parsing JSON response:", error)
    throw new Error("Failed to parse the response from ChatGroq")
  }

  // Return the parsed response
  return parsedResponse
}
