import React, { useEffect, useState } from 'react';
import { Trash2, Upload, ImagePlus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AdminObrasPage = () => {
  const [obras, setObras] = useState([]);
  const [catalogo, setCatalogo] = useState([]);

  const [obraFile, setObraFile] = useState(null);
  const [obraTitle, setObraTitle] = useState('');
  const [obraDescription, setObraDescription] = useState('');

  const [catalogoFile, setCatalogoFile] = useState(null);
  const [catalogoTitle, setCatalogoTitle] = useState('');
  const [catalogoDescription, setCatalogoDescription] = useState('');

  const [loadingObra, setLoadingObra] = useState(false);
  const [loadingCatalogo, setLoadingCatalogo] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchObras();
    fetchCatalogo();
  }, []);

  const fetchObras = async () => {
    const { data, error } = await supabase
      .from('obras')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar obras:', error);
      return;
    }

    setObras(data || []);
  };

  const fetchCatalogo = async () => {
    const { data, error } = await supabase
      .from('catalogo')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar catálogo:', error);
      return;
    }

    setCatalogo(data || []);
  };

  const sanitizeFileName = (name) => {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '');
  };

  const uploadImageToBucket = async (bucket, file) => {
    const safeName = sanitizeFileName(file.name);
    const filePath = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      imageUrl: data.publicUrl,
      storagePath: filePath,
    };
  };

  const handleUploadObra = async (e) => {
    e.preventDefault();

    if (!obraFile) {
      alert('Selecione uma imagem para a obra.');
      return;
    }

    try {
      setLoadingObra(true);

      const { imageUrl, storagePath } = await uploadImageToBucket('obras', obraFile);

      const { error: insertError } = await supabase.from('obras').insert([
        {
          title: obraTitle || 'Obra realizada',
          description: obraDescription || 'Projeto adicionado pelo cliente.',
          image_url: imageUrl,
          storage_path: storagePath,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setObraFile(null);
      setObraTitle('');
      setObraDescription('');
      await fetchObras();
      alert('Obra enviada com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar obra:', error);
      alert('Erro ao enviar obra.');
    } finally {
      setLoadingObra(false);
    }
  };

  const handleUploadCatalogo = async (e) => {
    e.preventDefault();

    if (!catalogoFile) {
      alert('Selecione uma imagem para o catálogo.');
      return;
    }

    try {
      setLoadingCatalogo(true);

      const { imageUrl, storagePath } = await uploadImageToBucket('catalogo', catalogoFile);

      const { error: insertError } = await supabase.from('catalogo').insert([
        {
          title: catalogoTitle || 'Material do catálogo',
          description: catalogoDescription || 'Item adicionado no catálogo pelo cliente.',
          image_url: imageUrl,
          storage_path: storagePath,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setCatalogoFile(null);
      setCatalogoTitle('');
      setCatalogoDescription('');
      await fetchCatalogo();
      alert('Item do catálogo enviado com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar item do catálogo:', error);
      alert('Erro ao enviar item do catálogo.');
    } finally {
      setLoadingCatalogo(false);
    }
  };

  const handleDeleteObra = async (item) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta obra?');
    if (!confirmar) return;

    try {
      setDeletingId(`obra-${item.id}`);

      if (item.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('obras')
          .remove([item.storage_path]);

        if (storageError) {
          throw storageError;
        }
      }

      const { error: deleteError } = await supabase.from('obras').delete().eq('id', item.id);

      if (deleteError) {
        throw deleteError;
      }

      setObras((prev) => prev.filter((obra) => obra.id !== item.id));
      alert('Obra excluída com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir obra:', error);
      alert('Erro ao excluir obra.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCatalogo = async (item) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este item do catálogo?');
    if (!confirmar) return;

    try {
      setDeletingId(`catalogo-${item.id}`);

      if (item.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('catalogo')
          .remove([item.storage_path]);

        if (storageError) {
          throw storageError;
        }
      }

      const { error: deleteError } = await supabase.from('catalogo').delete().eq('id', item.id);

      if (deleteError) {
        throw deleteError;
      }

      setCatalogo((prev) => prev.filter((catalogoItem) => catalogoItem.id !== item.id));
      alert('Item do catálogo excluído com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir item do catálogo:', error);
      alert('Erro ao excluir item do catálogo.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Painel do cliente</h1>
          <p className="text-slate-600 mt-2">
            Adicione e exclua imagens de Obras Realizadas e do Catálogo direto pelo site.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <ImagePlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Adicionar obra</h2>
                <p className="text-slate-500">Essa imagem aparecerá em Obras Realizadas.</p>
              </div>
            </div>

            <form onSubmit={handleUploadObra} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Título</label>
                <input
                  type="text"
                  value={obraTitle}
                  onChange={(e) => setObraTitle(e.target.value)}
                  placeholder="Ex: Bancada de cozinha em granito"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
                <textarea
                  value={obraDescription}
                  onChange={(e) => setObraDescription(e.target.value)}
                  placeholder="Descreva rapidamente a obra"
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setObraFile(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loadingObra}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-xl px-5 py-3 hover:opacity-90 transition disabled:opacity-60"
              >
                {loadingObra ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {loadingObra ? 'Enviando...' : 'Enviar obra'}
              </button>
            </form>
          </section>

          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <ImagePlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Adicionar item no catálogo</h2>
                <p className="text-slate-500">Essa imagem aparecerá na seção Catálogo.</p>
              </div>
            </div>

            <form onSubmit={handleUploadCatalogo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Título</label>
                <input
                  type="text"
                  value={catalogoTitle}
                  onChange={(e) => setCatalogoTitle(e.target.value)}
                  placeholder="Ex: Branco Prime"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
                <textarea
                  value={catalogoDescription}
                  onChange={(e) => setCatalogoDescription(e.target.value)}
                  placeholder="Descreva rapidamente o material"
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCatalogoFile(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loadingCatalogo}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-xl px-5 py-3 hover:opacity-90 transition disabled:opacity-60"
              >
                {loadingCatalogo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {loadingCatalogo ? 'Enviando...' : 'Enviar item do catálogo'}
              </button>
            </form>
          </section>
        </div>

        <section className="mt-10 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Obras cadastradas</h2>

          {obras.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-8 text-center text-slate-500">
              Nenhuma obra cadastrada ainda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {obras.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title || 'Obra'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-lg">
                      {item.title || 'Obra realizada'}
                    </h3>
                    <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                      {item.description || 'Projeto adicionado pelo cliente.'}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleDeleteObra(item)}
                      disabled={deletingId === `obra-${item.id}`}
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white font-semibold px-4 py-3 hover:bg-red-700 transition disabled:opacity-60"
                    >
                      {deletingId === `obra-${item.id}` ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                      {deletingId === `obra-${item.id}` ? 'Excluindo...' : 'Excluir obra'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Itens do catálogo</h2>

          {catalogo.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-8 text-center text-slate-500">
              Nenhum item de catálogo cadastrado ainda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {catalogo.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title || 'Catálogo'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-lg">
                      {item.title || 'Material do catálogo'}
                    </h3>
                    <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                      {item.description || 'Item adicionado no catálogo pelo cliente.'}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleDeleteCatalogo(item)}
                      disabled={deletingId === `catalogo-${item.id}`}
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white font-semibold px-4 py-3 hover:bg-red-700 transition disabled:opacity-60"
                    >
                      {deletingId === `catalogo-${item.id}` ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                      {deletingId === `catalogo-${item.id}` ? 'Excluindo...' : 'Excluir item'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminObrasPage;