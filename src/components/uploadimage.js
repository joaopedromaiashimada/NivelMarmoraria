import { supabase } from '../supabase.js'

export async function uploadImage(file) {
  const fileName = `image-${Date.now()}`

  const { error } = await supabase
    .storage
    .from('site-images')
    .upload(fileName, file)

  if (error) {
    console.error(error)
    alert('Erro ao enviar imagem')
    return null
  }

  const { data } = supabase
    .storage
    .from('site-images')
    .getPublicUrl(fileName)

  return data.publicUrl
}