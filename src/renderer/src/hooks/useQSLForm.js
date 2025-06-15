import { useCallback, useState } from 'react'

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
    (formDataToValidate = formData) => {
      const newErrors = {}

      if (!formDataToValidate.qslTemplate) {
        newErrors.qslTemplate = 'Por favor seleccione una plantilla QSL antes de generar'
      }

      setErrors(newErrors)

      if (Object.keys(newErrors).length === 0) {
        setGeneratedQSL({
          ...formDataToValidate,
          imageUrl: formDataToValidate.qslTemplate
        })
        return true
      }

      return false
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
