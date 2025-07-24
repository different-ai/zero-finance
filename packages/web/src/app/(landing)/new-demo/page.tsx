"use client"

import { ConfigurableDemo } from "@/components/configurable-demo"
import { allPossibleMessages, demoScript, adhdValuePopups } from "@/lib/demo-data/adhd-demo"

export default function DemoPage() {
  return (
    <ConfigurableDemo
      messages={allPossibleMessages}
      demoScript={demoScript}
      showPlayer={true}
      showValuePopups={true}
      valuePopups={adhdValuePopups}
      autoPlay={false}
    />
  )
}