javascript sdk reference
screenpipe provides two sdk packages:

@screenpipe/js - for node.js environments (nextjs api routes, etc)
@screenpipe/browser - for browser environments
both sdks provide type-safe interfaces to interact with screenpipe's core functionality.

installation
node.js sdk
npm install @screenpipe/js

browser sdk
npm install @screenpipe/browser

basic usage
// node.js
import { pipe } from '@screenpipe/js'
 
// browser
import { pipe } from '@screenpipe/browser'
search api
const results = await pipe.queryScreenpipe({
  q: "meeting notes",
  contentType: "ocr", // "ocr" | "audio" | "ui" | "all" | "audio+ui" | "ocr+ui" | "audio+ocr"
  limit: 10,
  offset: 0,
  startTime: "2024-03-10T12:00:00Z",
  endTime: "2024-03-10T13:00:00Z",
  appName: "chrome",
  windowName: "meeting",
  includeFrames: true,
  minLength: 10,
  maxLength: 1000,
  speakerIds: [1, 2],
  frameName: "screenshot.png"
})
input control api
// type text
await pipe.input.type("hello world")
 
// press key
await pipe.input.press("enter")
 
// move mouse
await pipe.input.moveMouse(100, 200)
 
// click
await pipe.input.click("left") // "left" | "right" | "middle"
realtime streams
// stream transcriptions
for await (const chunk of pipe.streamTranscriptions()) {
  console.log(chunk.choices[0].text)
  console.log(chunk.metadata) // { timestamp, device, isInput }
}
 
// stream vision events
for await (const event of pipe.streamVision(true)) { // true to include images
  console.log(event.data.text)
  console.log(event.data.app_name)
  console.log(event.data.image) // base64 if includeImages=true
}
notifications (desktop)
await pipe.sendDesktopNotification({
  title: "meeting starting",
  body: "your standup begins in 5 minutes",
  actions: [
    {
      id: "join",
      label: "join meeting"
    }
  ],
  timeout: 5000,
  persistent: false
})
node.js specific features
the node sdk includes additional features not available in the browser:

// settings management
const settings = await pipe.settings.getAll()
await pipe.settings.update({ aiModel: "gpt-4" })
 
// inbox management (node only)
const messages = await pipe.inbox.getMessages()
await pipe.inbox.clearMessages()
typescript types
both sdks export comprehensive typescript types:

import type {
  ContentType,
  ScreenpipeQueryParams,
  ScreenpipeResponse,
  OCRContent,
  AudioContent,
  UiContent,
  Speaker,
  NotificationOptions,
  Settings,
  // ... and more
} from '@screenpipe/js' // or @screenpipe/browser
key types include:

type ContentType = "all" | "ocr" | "audio" | "ui" | "audio+ui" | "ocr+ui" | "audio+ocr"
 
interface ScreenpipeQueryParams {
  q?: string
  contentType?: ContentType
  limit?: number
  offset?: number
  startTime?: string
  endTime?: string
  appName?: string
  windowName?: string
  includeFrames?: boolean
  minLength?: number
  maxLength?: number
  speakerIds?: number[]
  frameName?: string
}
 
interface ScreenpipeResponse {
  data: ContentItem[] // OCR | Audio | UI content
  pagination: {
    limit: number
    offset: number
    total: number
  }
}
error handling
try {
  const results = await pipe.queryScreenpipe({
    q: "meeting",
    contentType: "ocr"
  })
} catch (error) {
  console.error("screenpipe api error:", error)
}
examples
check out our production pipe examples to see real-world usage of the sdk:

data visualization pipe
linkedin ai assistant
meeting summarizer
memories gallery
obsidian integration
search interface
these examples demonstrate best practices and common patterns when building with screenpipe's sdk.

