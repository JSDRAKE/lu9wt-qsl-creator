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
        newErrors.qslTemplate = 'Por favor seleccione una plantilla QSL antes de generar'
      }
      if (!formDataToValidate.callsign) newErrors.callsign = 'El indicativo es requerido'
      if (!formDataToValidate.date) newErrors.date = 'La fecha es requerida'
      if (!formDataToValidate.time) newErrors.time = 'La hora es requerida'
      if (!formDataToValidate.frequency) newErrors.frequency = 'La frecuencia es requerida'
      if (!formDataToValidate.report) newErrors.report = 'El reporte es requerido'
      if (!formDataToValidate.mode) newErrors.mode = 'El modo es requerido'

      setErrors(newErrors)

      if (Object.keys(newErrors).length > 0) {
        return false
      }

      try {
        // Generar la imagen QSL
        const imageUrl = await generateQSLImage(formDataToValidate.qslTemplate, formDataToValidate)

        if (!imageUrl) {
          throw new Error('Error al generar la imagen QSL')
        }

        setGeneratedQSL({
          ...formDataToValidate,
          imageUrl
        })
        return true
      } catch (error) {
        console.error('Error al generar QSL:', error)
        setErrors((prev) => ({
          ...prev,
          general: 'Error al generar la QSL. Por favor, intente nuevamente.'
        }))
        return false
      }
    },
    [formData]
  )

  const resetForm = useCallback(() => {
    setFormData((prev) => ({
      ...INITIAL_FORM_STATE,
      qslTemplate: prev.qslTemplate // Mantener el template seleccionado
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
