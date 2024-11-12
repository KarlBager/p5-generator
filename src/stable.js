async function apiFetch(url, body) {
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_STABLE_API_KEY}`,
      Accept: 'application/json',
    },
    body: body,
  }

  try {
    const response = await fetch(url, fetchOptions)
    const json = await response.json()
    if (json.errors) {
      console.error(json)
    }
    return json
  } catch (error) {
    console.error(error)
  }
}

export async function textToImage(prompt) {
  const formData = new FormData()
  formData.append('prompt', prompt)

  const json = await apiFetch(
    'https://api.stability.ai/v2beta/stable-image/generate/core',
    formData,
  )

  return 'data:image/png;base64,' + json.image
}

export function saveBase64AsImageFile(base64String, fileName) {
  // Remove the prefix from the base64 string (data:image/png;base64,)
  const base64Image = base64String.split(';base64,').pop()

  // Convert base64 string to a byte array
  const byteCharacters = atob(base64Image)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)

  // Create a Blob from the byte array
  const blob = new Blob([byteArray], { type: 'image/png' })

  // Create a temporary URL for the Blob
  const blobURL = URL.createObjectURL(blob)

  // Create an anchor element to trigger the download
  const link = document.createElement('a')
  link.href = blobURL
  link.download = fileName

  // Append the link to the document body, trigger click, and remove it
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Revoke the Blob URL
  URL.revokeObjectURL(blobURL)
}

export async function base64FromImageFile(file) {
  // use async/await to read the file
  const reader = new FileReader()
  reader.readAsDataURL(file)
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

export function base64ToBlob(base64, mimeType) {
  // Decode the base64 string to binary data
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  // Create a Blob with the binary data and specify the MIME type
  return new Blob([byteArray], { type: mimeType })
}
