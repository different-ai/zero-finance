import { Check, Circle } from 'lucide-react'

export function ProgressSidebar() {
  const steps = [
    { title: 'Your credentials', completed: true },
    { title: 'Billed to', completed: true },
    { title: 'Invoice Currency', completed: true },
    { title: 'Invoice Type', completed: true },
    { title: 'Amount Details', completed: false },
    { title: 'Memo & Attachments (Optional)', completed: false },
  ]

  return (
    <div className="w-72 p-6 border-l">
      <h2 className="font-semibold mb-4">Invoice #11</h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            {step.completed ? (
              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
            <span className={step.completed ? 'text-foreground' : 'text-muted-foreground'}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

