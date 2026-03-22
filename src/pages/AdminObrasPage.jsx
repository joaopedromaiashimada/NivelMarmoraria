import React, { useEffect, useState } from 'react';
import { Trash2, Upload, ImagePlus, Loader2, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'nivel123';

const AdminObrasPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

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
    const savedAuth = sessionStorage.getItem('admin-obras-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchObras();
      fetchCatalogo();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-obras-auth', 'true');
      setLoginError('');
      return;
    }

    setLoginError('Senha incorreta.');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-obras-auth');
    setIsAuthenticated(false);
    setPasswordInput('');
    setLoginError('');
  };

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
    if (!file) {
      throw new Error('Nenhum arquivo selecionado.');
    }

    const safeName = sanitizeFileName(file.name || 'imagem');
    const filePath = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Erro no storage (${bucket}): ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error(`Não foi possível gerar a URL pública da imagem em ${bucket}.`);
    }

    return {
      imageUrl: data.publicUrl,
      storagePath: filePath,
    };
  };

  const resetObraForm = () => {
    setObraFile(null);
    setObraTitle('');
    setObraDescription('');
  };

  const resetCatalogoForm = () => {
    setCatalogoFile(null);
    setCatalogoTitle('');
    setCatalogoDescription('');
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
        throw new Error(`Erro ao salvar no banco (obras): ${insertError.message}`);
      }

      resetObraForm();
      await fetchObras();
      alert('Obra enviada com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar obra:', error);
      alert(error.message || 'Erro ao enviar obra.');
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
        throw new Error(`Erro ao salvar no banco (catálogo): ${insertError.message}`);
      }

      resetCatalogoForm();
      await fetchCatalogo();
      alert('Item do catálogo enviado com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar item do catálogo:', error);
      alert(error.message || 'Erro ao enviar item do catálogo.');
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
          throw new Error(`Erro ao excluir do storage (obras): ${storageError.message}`);
        }
      }

      const { error: deleteError } = await supabase
        .from('obras')
        .delete()
        .eq('id', item.id);

      if (deleteError) {
        throw new Error(`Erro ao excluir do banco (obras): ${deleteError.message}`);
      }

      setObras((prev) => prev.filter((obra) => obra.id !== item.id));
      await fetchObras();
      alert('Obra excluída com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir obra:', error);
      alert(error.message || 'Erro ao excluir obra.');
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
          throw new Error(`Erro ao excluir do storage (catálogo): ${storageError.message}`);
        }
      }

      const { error: deleteError } = await supabase
        .from('catalogo')
        .delete()
        .eq('id', item.id);

      if (deleteError) {
        throw new Error(`Erro ao excluir do banco (catálogo): ${deleteError.message}`);
      }

      setCatalogo((prev) => prev.filter((catalogoItem) => catalogoItem.id !== item.id));
      await fetchCatalogo();
      alert('Item do catálogo excluído com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir item do catálogo:', error);
      alert(error.message || 'Erro ao excluir item do catálogo.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Área do cliente</h1>
              <p className="text-slate-500">Digite a senha para continuar</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite a senha"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {loginError ? (
              <p className="text-sm text-red-600 font-medium">{loginError}</p>
            ) : null}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-xl px-5 py-3 hover:opacity-90 transition"
            >
              <Lock className="w-5 h-5" />
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Painel do cliente</h1>
            <p className="text-slate-600 mt-2">
              Adicione e exclua imagens de Obras Realizadas e do Catálogo direto pelo site.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Sair
          </button>
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