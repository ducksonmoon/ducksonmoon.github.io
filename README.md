## Workflow
Going forward, you just need to:

1. Build the project:
```bash
npm run build
```

2. Switch to gh-pages and push the contents:
```bash
git checkout gh-pages
cp -r out/* .
git add .
git commit -m "Deploy updated site"
git push origin gh-pages
```