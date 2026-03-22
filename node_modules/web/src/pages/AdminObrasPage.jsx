import React, { useMemo, useState } from 'react';
import { Lock, LogOut, Trash2, Upload, ImagePlus, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'nivel-obras-galeria';
const CATALOG_STORAGE_KEY = 'nivel-catalogo-galeria';
const PASSWORD = 'nivel123';

const AdminObrasPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [catalogTitle, setCatalogTitle] = useState('');
  const [catalogDescription, setCatalogDescription] = useState('');
  const [catalogItems, setCatalogItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const sortedImages = useMemo(() => [...images].reverse(), [images]);
  const sortedCatalogItems = useMemo(() => [...catalogItems].reverse(), [catalogItems]);

  const persistImages = (next) => {
    setImages(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const persistCatalog = (next) => {
    setCatalogItems(next);
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(next));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAuthenticated(true);
      setPassword('');
      return;
    }
    alert('Senha incorreta.');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const next = [
        ...images,
        {
          id: Date.now(),
          url: String(reader.result),
          title: title.trim() || 'Obra realizada',
          description: description.trim() || 'Projeto adicionado pelo cliente.',
        },
      ];
      persistImages(next);
      setTitle('');
      setDescription('');
      e.target.value = '';
      alert('Foto adicionada com sucesso.');
    };
    reader.readAsDataURL(file);
  };

  const handleCatalogFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const next = [
        ...catalogItems,
        {
          id: Date.now(),
          image: String(reader.result),
          title: catalogTitle.trim() || 'Material do catálogo',
          description: catalogDescription.trim() || 'Item adicionado no catálogo pelo cliente.',
        },
      ];
      persistCatalog(next);
      setCatalogTitle('');
      setCatalogDescription('');
      e.target.value = '';
      alert('Item do catálogo adicionado com sucesso.');
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id) => {
    const next = images.filter((item) => item.id !== id);
    persistImages(next);
  };

  const handleDeleteCatalog = (id) => {
    const next = catalogItems.filter((item) => item.id !== id);
    persistCatalog(next);
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-muted/40 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-border p-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-center text-foreground mb-2">Área do cliente</h1>
          <p className="text-center text-muted-foreground mb-8">
            Acesso restrito para envio e gerenciamento das fotos das obras e do catálogo.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 py-6 rounded-xl text-base">
              Entrar
            </Button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl border border-border p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gerenciar conteúdo do site</h1>
            <p className="text-muted-foreground mt-2">Atualize as fotos das obras e adicione novos materiais no catálogo.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setAuthenticated(false)}
            className="rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        <section className="bg-white rounded-3xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ImagePlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Adicionar nova obra</h2>
              <p className="text-muted-foreground">Envie apenas a foto ou, se quiser, complete com título e descrição.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Título da obra (opcional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="text"
              placeholder="Descrição curta (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-10 text-center cursor-pointer hover:bg-primary/10 transition-colors">
            <Upload className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold text-foreground">Clique para escolher a foto</span>
            <span className="text-sm text-muted-foreground">A imagem será adicionada à galeria pública automaticamente.</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </section>

        <section className="bg-white rounded-3xl border border-border p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-6">Fotos já enviadas</h2>
          {sortedImages.length === 0 ? (
            <div className="rounded-2xl bg-muted/60 p-8 text-center text-muted-foreground">
              Nenhuma foto adicionada ainda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedImages.map((item) => (
                <div key={item.id} className="border border-border rounded-2xl overflow-hidden bg-white shadow-sm">
                  <img src={item.url} alt={item.title} className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                      className="mt-4 w-full rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir foto
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Adicionar item no catálogo</h2>
              <p className="text-muted-foreground">Cadastre a foto da pedra, o nome e uma descrição para aparecer no carrossel do catálogo.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nome da pedra ou material"
              value={catalogTitle}
              onChange={(e) => setCatalogTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="text"
              placeholder="Descrição curta do material"
              value={catalogDescription}
              onChange={(e) => setCatalogDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-10 text-center cursor-pointer hover:bg-primary/10 transition-colors">
            <Upload className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold text-foreground">Clique para escolher a foto da pedra</span>
            <span className="text-sm text-muted-foreground">O item será adicionado automaticamente ao carrossel do catálogo.</span>
            <input type="file" accept="image/*" onChange={handleCatalogFileChange} className="hidden" />
          </label>
        </section>

        <section className="bg-white rounded-3xl border border-border p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-6">Itens já cadastrados no catálogo</h2>
          {sortedCatalogItems.length === 0 ? (
            <div className="rounded-2xl bg-muted/60 p-8 text-center text-muted-foreground">
              Nenhum item do catálogo adicionado ainda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCatalogItems.map((item) => (
                <div key={item.id} className="border border-border rounded-2xl overflow-hidden bg-white shadow-sm">
                  <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteCatalog(item.id)}
                      className="mt-4 w-full rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir item
                    </Button>
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
