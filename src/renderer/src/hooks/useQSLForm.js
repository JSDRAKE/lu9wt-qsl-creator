import { useCallback, useState } from 'react'
// Import QSL generation function
import { generateQSL as generateQSLImage } from '../utils/generateQSL'

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
  const [errors, setErrors] = useState({})

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleTemplateChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, qslTemplate: value }))
  }, [])

  const generateQSL = useCallback(
    async (formDataToValidate = formData) => {
      const newErrors = {}

      // Validate required fields
      if (!formDataToValidate.qslTemplate) {
        newErrors.qslTemplate = 'Please select a QSL template before generating'
      }
      if (!formDataToValidate.callsign) newErrors.callsign = 'Callsign is required'
      if (!formDataToValidate.date) newErrors.date = 'Date is required'
      if (!formDataToValidate.time) newErrors.time = 'Time is required'
      if (!formDataToValidate.frequency) newErrors.frequency = 'Frequency is required'
      if (!formDataToValidate.report) newErrors.report = 'Report is required'
      if (!formDataToValidate.mode) newErrors.mode = 'Mode is required'

      setErrors(newErrors)

      if (Object.keys(newErrors).length > 0) {
        return false
      }

      try {
        // Generate QSL image
        const imageUrl = await generateQSLImage(formDataToValidate.qslTemplate, formDataToValidate)

        if (!imageUrl) {
          throw new Error('Error generating QSL image')
        }

        setGeneratedQSL({
          ...formDataToValidate,
          imageUrl
        })
        return true
      } catch (error) {
        console.error('Error generating QSL:', error)
        setErrors((prev) => ({
          ...prev,
          general: 'Error generating QSL. Please try again.'
        }))
        return false
      }
    },
    [formData]
  )

  const resetForm = useCallback(() => {
    setFormData((prev) => ({
      ...INITIAL_FORM_STATE,
      qslTemplate: prev.qslTemplate // Keep the selected template
    }))
    setGeneratedQSL(null)
  }, [])

  return {
    formData,
    generatedQSL,
    handleInputChange,
    handleTemplateChange,
    generateQSL,
    resetForm,
    setGeneratedQSL,
    errors
  }
}
