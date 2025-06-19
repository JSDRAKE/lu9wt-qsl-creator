import { useCallback } from 'react'

export const useQSLDownload = () => {
  const downloadQSL = useCallback((generatedQSL) => {
    if (!generatedQSL?.imageUrl) return

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      // Create a canvas to ensure we get a clean JPG
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')

      // Draw the image with high quality settings
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, img.width, img.height)

      // Convert to JPG with high quality (0.92 is a good balance between quality and size)
      const jpgUrl = canvas.toDataURL('image/jpeg', 1.0)

      // Create download link
      const link = document.createElement('a')
      link.href = jpgUrl

      // Format filename with current date and callsign
      const date = generatedQSL.date?.replace(/\//g, '-') || new Date().toISOString().split('T')[0]
      const callsign = (generatedQSL.callsign || 'unknown').toUpperCase().replace(/\s+/g, '_')
      const mode = (generatedQSL.mode || '').toUpperCase()

      link.download = `QSL_${callsign}_${date}${mode ? `_${mode}` : ''}.jpg`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      URL.revokeObjectURL(jpgUrl)
    }

    // Handle loading errors
    img.onerror = () => {
      console.error('Error loading image for download')
    }

    // Start loading the image
    img.src = generatedQSL.imageUrl
  }, [])

  return { downloadQSL }
}

export default useQSLDownload
