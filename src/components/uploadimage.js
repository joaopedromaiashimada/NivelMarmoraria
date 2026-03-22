import { supabase } from '../supabase.js'

export async function uploadImage(file, bucket = 'obras') {
  const safeFileName = file.name
    ? file.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9._-]/g, '')
    : 'imagem';

  const fileName = `image-${Date.now()}-${safeFileName}`;

  const { error } = await supabase
    .storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    console.error(error);
    alert('Erro ao enviar imagem');
    return null;
  }

  const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(fileName);

  return {
    image_url: data.publicUrl,
    storage_path: fileName,
  };
}