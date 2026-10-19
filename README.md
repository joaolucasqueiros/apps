# English Path — Downloads

Esta branch contém apenas os pacotes para download. A branch `main` foi preservada.

## Baixar

- [Projeto completo: código, documentação, testes e build](english-path.zip)
- [Site compilado para hospedagem no Cloudflare Pages](english-path-site.zip)

Abra o arquivo desejado e use **Download raw file** (ícone de download) no GitHub.
Se o repositório for privado, entre com uma conta que tenha acesso.

O pacote completo contém `README.md` e `LEIA-ME-DOWNLOAD.txt` com as instruções.
Para desenvolver, use Node.js 20.20.2, execute `npm ci` e depois `npm run dev`.
O pacote de site deve ser servido por uma hospedagem web; não abra o index.html por file://.

Os ZIPs não incluem node_modules, arquivos .env privados ou sessões do bot original.

## Verificação

Os hashes SHA-256 estão em [SHA256SUMS.txt](SHA256SUMS.txt).

```bash
sha256sum -c SHA256SUMS.txt
```

## Limitações documentadas

O núcleo local foi validado com build, 14 testes unitários e 10 testes de navegador.
A curadoria de vídeos, validação do Supabase remoto e publicação no Cloudflare
permanecem pendentes. B2 e C1 têm cobertura inicial. Consulte STATUS.md no ZIP.

Esta branch foi criada para distribuir os pacotes; não é necessário mesclá-la à main.
