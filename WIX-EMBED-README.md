# Shoppraty — pacote para embed no Wix

Mesmo design do site, organizado em dois formatos:

## `src/` — projeto organizado (para editar)
- `index.html` — estrutura da página
- `style.css` — todo o CSS
- `script.js` — toda a lógica (intro cinematográfica, header on scroll, menu mobile, scroll-reveal, quick-add)
- `assets/images/` — as 9 fotos usadas no site, como arquivos separados

Edite aqui quando quiser mudar cor, texto, imagem ou timing da animação.

## `dist/wix-embed.html` — pronto para colar no Wix
Arquivo único e autocontido (CSS, JS e as 9 imagens embutidas como base64). É este
arquivo que vai no elemento **HTML iframe** do Wix, modo **"Enter Code"** — o Wix não
permite referenciar arquivos separados (`style.css`, `script.js`, imagens) dentro do
embed, só um bloco de código HTML.

**Sempre que editar algo em `src/`, gere novamente o `dist/wix-embed.html`** (inlinar
style.css e script.js de volta no HTML, converter as imagens de volta para base64)
antes de colar no Wix — os dois precisam ficar em sincronia manualmente, já que o Wix
só aceita a versão de arquivo único.

## Passo a passo no Wix
1. Editor Wix → `+ Adicionar` → `Incorporar` → `HTML iframe`.
2. Clique no elemento → `Inserir código` → cole todo o conteúdo de `dist/wix-embed.html`.
3. Redimensione a largura para 100% da página.
4. Ative o Velo (Dev Mode) e cole no código da página:
   ```javascript
   $w.onReady(function () {
     $w('#html1').onMessage((event) => {
       if (event.data && event.data.type === 'shoppratyHeight') {
         $w('#html1').height = event.data.height;
       }
     });
   });
   ```
   (troque `#html1` pelo ID real do elemento)
5. Página → Configurações → Layout → **Sem cabeçalho e rodapé** (evita duplicar com o header do Wix).
6. Páginas e Menu → página Home → **Definir como página inicial**.
7. Publicar.
