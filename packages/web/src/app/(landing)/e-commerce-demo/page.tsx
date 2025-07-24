"use client"

import { ConfigurableDemo } from "@/components/configurable-demo"
import { allPossibleMessages, demoScript, ecommerceValuePopups } from "@/lib/demo-data/ecommerce-demo"


export default function EcommerceDemoPage() {
  return (
    <ConfigurableDemo
      messages={allPossibleMessages}
      demoScript={demoScript}
      showPlayer={true}
      showValuePopups={true}
      valuePopups={ecommerceValuePopups}
      autoPlay={false}
    />
  )
}