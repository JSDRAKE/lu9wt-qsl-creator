import { useState, useCallback } from 'react'

export const INITIAL_FORM_STATE = {
  callsign: '',
  date: '',
  time: '',
  frequency: '',
  report: '',
  mode: '',
  qslTemplate: ''
}

export const useQSLForm = (initialState = INITIAL_FORM_STATE) => {
  const [formData, setFormData] = useState(initialState)
  const [generatedQSL, setGeneratedQSL] = useState(null)

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleTemplateChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, qslTemplate: value }))
  }, [])

  const generateQSL = useCallback(() => {
    setGeneratedQSL({
      ...formData,
      imageUrl: formData.qslTemplate
    })
  }, [formData])

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE)
    setGeneratedQSL(null)
  }, [])

  return {
    formData,
    generatedQSL,
    handleInputChange,
    handleTemplateChange,
    generateQSL,
    resetForm,
    setGeneratedQSL
  }
}
