# Royal Lion Studio

Site da barbearia, com painel para atualizar textos e fotos. Não tem dependências: só precisa de Node 18 ou mais recente.

## Pôr a correr

```bash
node server.js
```

- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin/>

Na primeira visita ao painel, no próprio computador, crias a palavra-passe.

## Publicar no Vercel

O projeto já está preparado para o Vercel (`vercel.json`). O Vercel publica uma versão estática do site: o comando `npm run build` (`scripts/build.js`) junta `defaults/content.json` com `data/content.json`, mete o conteúdo já pronto no `index.html` e copia tudo para `dist/`, incluindo as fotos de `data/uploads/`.

1. Envia a pasta para um repositório no GitHub, ou corre `npx vercel` dentro dela.
2. No Vercel, importa o projeto. As definições vêm do `vercel.json`: não precisas de escolher framework nem de mudar nada.
3. Cada nova publicação no repositório volta a gerar o site.

O painel não funciona no Vercel, porque lá não há disco onde guardar alterações; `/admin` leva ao início. Para editar textos ou fotos, abre o painel no teu computador (`node server.js`, depois `http://localhost:3000/admin/`), guarda, e publica outra vez: as alterações ficam em `data/content.json` e `data/uploads/`, que vão com o projeto. Não envies `data/admin.json` (a palavra-passe do painel): já está no `.gitignore`.

## Publicar com servidor Node (alternativa)

Para teres o painel online, usa um alojamento que corra Node e tenha disco persistente (`npm start`). Variáveis do alojamento:

- `PORT`: porta do servidor (por omissão, 3000).
- `DATA_DIR`: pasta dos dados (por omissão, `data/`). Tem de sobreviver a reinícios e novas publicações.
- `ADMIN_PASSWORD`: define a primeira palavra-passe do painel. É obrigatória no alojamento, porque o ecrã de criação só funciona no próprio computador do servidor.
- `TRUST_PROXY`: define-a (por exemplo, `1`) se o alojamento estiver atrás de um proxy, para os limites de pedidos contarem por cliente. Sem proxy, não a definas.

Faz cópias de segurança da pasta de dados: é lá que ficam os textos e as fotos.

## Onde está cada coisa

- `defaults/content.json`: conteúdo de origem. O que mudas no painel fica em `data/content.json` e tem prioridade.
- `data/uploads/`: fotos enviadas pelo painel.
- `public/`: site e painel.
- `server.js`: servidor e API (versão local e alojamento Node).
- `lib/render.js`: monta a página inicial com o conteúdo; usado pelo servidor e pelo build.
- `scripts/build.js` e `vercel.json`: versão estática para o Vercel (gera `dist/`).

## Marcação

A página de marcação fica em `/marcacao` (`public/marcacao.html`) e mostra a agenda da Noona num iframe. O painel indica o endereço dela em Marcação (`booking.pageUrl`, a começar por `/` ou `https://`): todos os botões de agendar levam para lá. Se o campo ficar vazio, os botões levam ao cartão de marcação da própria página (`#agendar`). Para mudar de conta na Noona, altera o endereço do iframe em `marcacao.html`. Os textos dessa página também estão no ficheiro, não no painel. Este site não guarda marcações.

## A imagem do início

O início mostra o **Retrato** (`hero.portrait`) à frente da palavra STUDIO (`hero.image`), ambos editáveis no painel, em Início. O efeito líquido só funciona com a imagem original da palavra. Para o retrato, usa um PNG ou WebP com fundo transparente, com a pessoa a chegar ao fundo da imagem. Se removeres o retrato, fica só a palavra. Ao trocá-lo, atualiza também a **Descrição do retrato** (`hero.portraitAlt`), lida por quem usa leitor de ecrã.

## O mapa

O mapa do cartão de localização começa fechado e só carrega o Google Maps quando o visitante o abre. Usa a pesquisa em `contact.mapEmbed`, porque um link normal do Google não pode ser incorporado. O link da ficha da barbearia fica em `contact.mapsUrl` e serve só para o botão "Abrir no Google Maps". Os textos do cartão fechado estão em `contact.mapTitle`, `contact.mapPlace` e `contact.mapHint`.
