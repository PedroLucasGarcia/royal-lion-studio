# Royal Lion Studio

Site da Royal Lion Studio, uma barbearia em Lamego, aberta desde 2025, que atende homens e mulheres. Lema da casa: "O padrão que o teu estilo merece."

O site tem um objetivo: levar quem o visita a marcar um horário. O resto da página existe para apoiar essa ação.

## O que o site mostra

- **Início:** a palavra STUDIO com um efeito líquido, o retrato à frente dela, os serviços da casa e o botão para agendar.
- **Serviços:** corte, barba, coloração, tratamentos, próteses capilares, alisamentos, madeixas, lavar e secar, para homens e para mulheres.
- **Equipa:** Felipe Ferreira, Thaynara Lorrany e Luana Garcia.
- **Contactos e localização:** R. da Olaria 65, 5100-155 Lamego. O mapa só carrega quando o visitante o abre.
- **Horário:** de terça a sábado, das 09h às 12h e das 14h às 19h.
- **Rodapé:** o escudo da casa e o acesso ao Livro de Reclamações.

## Marcação

As marcações são feitas na Noona. A página `/marcacao` mostra a agenda da Noona dentro do site, e todos os botões de agendar levam para lá. O site em si não guarda marcações.

## Painel de edição

Os textos e as fotos do site podem ser alterados num painel próprio (`/admin`), sem precisar de programador. Esse painel funciona no computador onde o projeto corre.

## Identidade visual

- **Paleta:** #111110, #ECE4D6, #2F7A4B e #B8B1A5, com preto e branco.
- **Estilo:** minimalista, inspirado no sistema de design da Linear.
- **Exceção:** o início mantém um poster próprio, cujos elementos aparecem aos poucos.
- **Tipos de letra:** Inter, Roboto e Roboto Condensed.
- **Mais detalhe:** está em `DESIGN.md` e `PRODUCT.md`.

## Tecnologia

HTML, CSS e JavaScript sem frameworks, e um pequeno servidor em Node.js sem dependências. O conteúdo fica guardado em ficheiros JSON. Para publicar, o projeto gera uma versão estática do site, pronta para o Vercel.

## Estrutura

- `public/`: o site (páginas, estilos, scripts, imagens e tipos de letra) e o painel.
- `defaults/content.json`: o conteúdo de origem do site.
- `data/`: o que é alterado no painel (textos e fotos).
- `server.js`: servidor local e API do painel.
- `lib/render.js`: monta a página inicial com o conteúdo.
- `scripts/build.js` e `vercel.json`: versão estática para o Vercel.
