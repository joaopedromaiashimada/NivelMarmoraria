import { supabase } from '../supabase.js'

export async function uploadImage(file) {
  const fileName = `image-${Date.now()}`

  const { error } = await supabase
    .storage
    .from('Site-Images')
    .upload(fileName, file)

  if (error) {
    console.error(error)
    alert('Erro ao enviar imagem')
    return null
  }

  const { data } = supabase
    .storage
    .from('Site-Images')
    .getPublicUrl(fileName)

  return data.publicUrl
}