import { useCallback } from 'react'

export const useQSLDownload = () => {
  const downloadQSL = useCallback((generatedQSL) => {
    if (!generatedQSL?.imageUrl) return

    const link = document.createElement('a')
    link.href = generatedQSL.imageUrl
    const date = new Date().toISOString().split('T')[0]
    link.download = `QSL-${generatedQSL.callsign || 'unknown'}-${generatedQSL.mode}-${date}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  return { downloadQSL }
}

export default useQSLDownload
