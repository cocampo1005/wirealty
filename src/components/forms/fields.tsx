import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/** Shared control styling so every input, select and textarea matches. */
export const controlClass =
  'block w-full border bg-white px-4 text-[0.9375rem] text-ink placeholder:text-slate/70 transition-colors duration-200 focus:border-brand-blue focus:outline-2 focus:outline-offset-0 focus:outline-brand-blue/25 disabled:bg-mist disabled:text-slate'

interface FieldShellProps {
  id: string
  label: string
  required?: boolean
  optional?: boolean
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}

function FieldShell({ id, label, required, optional, hint, error, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.8125rem] font-semibold text-navy-deep">
        <span>
          {label}
          {required ? (
            <span aria-hidden className="ml-0.5 text-brand-red">
              *
            </span>
          ) : null}
        </span>
        {optional ? <span className="text-xs font-normal text-slate">Optional</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[0.8125rem] font-medium text-brand-red">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

type BaseProps = {
  id: string
  label: string
  optional?: boolean
  hint?: string
  error?: string
  wrapperClassName?: string
}

export function TextField({
  id,
  label,
  optional,
  hint,
  error,
  wrapperClassName,
  className,
  required,
  ...props
}: BaseProps & ComponentProps<'input'>) {
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} hint={hint} error={error} className={wrapperClassName}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass, 'h-12', error ? 'border-brand-red' : 'border-line', className)}
        {...props}
      />
    </FieldShell>
  )
}

export function TextAreaField({
  id,
  label,
  optional,
  hint,
  error,
  wrapperClassName,
  className,
  required,
  ...props
}: BaseProps & ComponentProps<'textarea'>) {
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} hint={hint} error={error} className={wrapperClassName}>
      <textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass, 'min-h-32 resize-y py-3 leading-relaxed', error ? 'border-brand-red' : 'border-line', className)}
        {...props}
      />
    </FieldShell>
  )
}

export function SelectField({
  id,
  label,
  optional,
  hint,
  error,
  wrapperClassName,
  className,
  required,
  children,
  ...props
}: BaseProps & ComponentProps<'select'>) {
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} hint={hint} error={error} className={wrapperClassName}>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass, 'select-chevron h-12 pr-10', error ? 'border-brand-red' : 'border-line', className)}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  )
}
