'use client'

import { ChangeEvent, useEffect, useId, useState } from 'react'
import Image from 'next/image'
import { Image as ImageIcon, Loader2, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminImageUploadFieldProps {
  label: string
  value?: string | null
  onChange: (url: string) => void
  folder: string
  helpText?: string
  previewClassName?: string
  disabled?: boolean
  onUploadingChange?: (uploading: boolean) => void
}

export default function AdminImageUploadField({
  label,
  value,
  onChange,
  folder,
  helpText = 'Upload an image directly from your computer.',
  previewClassName,
  disabled = false,
  onUploadingChange,
}: AdminImageUploadFieldProps) {
  const inputId = useId()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    onUploadingChange?.(uploading)
  }, [onUploadingChange, uploading])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.error || 'Upload failed')
      }

      onChange(payload.url)
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : 'Failed to upload image'
      )
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const clearImage = () => {
    setError('')
    onChange('')
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50',
          previewClassName || 'aspect-video'
        )}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt={label}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow-lg"
              aria-label="Remove image"
              disabled={disabled || uploading}
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="px-4 text-center text-gray-500">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm">No image uploaded yet</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="flex items-center gap-2 text-sm font-medium text-temple-maroon">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={inputId}
          className={cn(
            'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-temple-maroon px-4 py-2 text-sm font-medium text-temple-maroon transition-colors hover:bg-temple-maroon hover:text-white',
            (disabled || uploading) && 'pointer-events-none opacity-50'
          )}
        >
          <Upload size={16} />
          <span>{value ? 'Replace Image' : 'Upload Image'}</span>
        </label>

        {value && (
          <button
            type="button"
            onClick={clearImage}
            className="text-sm font-medium text-red-600 hover:text-red-700"
            disabled={disabled || uploading}
          >
            Remove
          </button>
        )}
      </div>

      <input
        id={inputId}
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        className="sr-only"
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      <p className="text-xs text-gray-500">{helpText}</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
