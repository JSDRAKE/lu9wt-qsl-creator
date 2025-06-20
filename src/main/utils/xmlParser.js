/**
 * Simple XML to JSON parser for QRZ API responses
 * This is a simplified implementation that works in the main process
 */

const { XMLParser } = require('fast-xml-parser')

/**
 * Parse XML string to JavaScript object using fast-xml-parser
 * @param {string} xmlString - XML string to parse
 * @returns {Object} Parsed JavaScript object
 */
export function parseXmlString(xmlString) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: () => false, // Don't force arrays for single elements
    textNodeName: '#text',
    trimValues: true,
    parseAttributeValue: true
  })

  try {
    const result = parser.parse(xmlString)
    return result
  } catch (error) {
    console.error('Error parsing XML:', error)
    throw new Error(`Error parsing XML: ${error.message}`)
  }
}

export default {
  parseXmlString
}
