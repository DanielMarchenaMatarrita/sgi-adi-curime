import type { ReactNode } from 'react'
import { Icon } from './Icon'

export function StatusPanel({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <section className="status-panel" aria-labelledby="status-title">
      <span className="status-panel__icon"><Icon name="info" size={28} /></span>
      <h1 id="status-title">{title}</h1>
      <p>{message}</p>
      {action && <div className="status-panel__action">{action}</div>}
    </section>
  )
}
