# A/B Testimise Projekt

See projekt on mõeldud õpilastele A/B testimise põhimõtete õppimiseks.

## Mis on A/B test?

A/B test on meetod, kus võrreldakse kahte veebilehe või rakenduse versiooni, et näha, milline neist on efektiivsem. Antud projektis testime kahte erinevat nuppu disaini.

## Projekti struktuur

```
abtesting/
├── index.html          # Avaleht
├── test-a.html         # Testi variant A
├── test-b.html         # Testi variant B
├── style.css           # Stiilid
├── ab-test.js          # Testi loogika
├── server.js           # Node.js server
├── package.json        # Projektisõltuvused
└── README.md           # See fail
```

## Kuidas kasutada?

### 1. Paigalda Node.js

Veendu, et sul on paigaldatud Node.js (versioon 12 või uuem).

### 2. Käivita server

Ava terminal projektikaustas ja käivita:

```bash
npm start
```

Server käivitub aadressil `http://localhost:3000`.

### 3. Ava veebileht

Ava brauseris aadress `http://localhost:3000` või `http://localhost:3000/index.html`.

**Tähtis**: Kasuta serveri aadressi, mitte ava HTML faile otse brauseris (fail://), kuna see võib takistada andmete salvestamist.

### 4. Teosta test

1. Kliki "Alusta testi" nupul
2. Näed üht varianti (A või B) - variant valitakse juhuslikult
3. Kliki testnuppu mitu korda
4. Iga klikk salvestatakse automaatselt faili `testi-tulemused.txt`

### 5. Vaata tulemusi

Tulemused salvestatakse faili `testi-tulemused.txt`. Faili sisu näeb välja umbes selline:

```
A/B Testi Tulemused
==================

Variant: A, Klikkide arv: 1, Aeg: 2024-01-15T10:30:00.000Z
Variant: A, Klikkide arv: 2, Aeg: 2024-01-15T10:30:05.000Z
Variant: B, Klikkide arv: 1, Aeg: 2024-01-15T10:31:00.000Z
```

## Kuidas projekt töötab?

### Variantide valimine

- Esimesel korral, kui kasutaja avab testi, valitakse juhuslikult variant A või B
- Valitud variant salvestatakse brauseri localStorage'isse
- Sama kasutaja näeb alati sama varianti (kuni localStorage puhastatakse)

### Klikkide loendamine

- Iga klikk testnupul suurendab klikkide arvu
- Klikkide arv salvestatakse localStorage'isse
- Klikkide andmed saadetakse serverile ja kirjutatakse faili

### Andmete salvestamine

- Kliendipoolne JavaScript loeb klikkide andmed
- Andmed saadetakse Node.js serverile POST päringuga
- Server kirjutab andmed faili `testi-tulemused.txt`

## Ülesanded arendamiseks

1. **Lisa rohkem teste**: Loo rohkem variante (C, D jne)
2. **Paranda statistikat**: Lisa andmete analüüsi (keskmine klikkide arv, variantide võrdlus)
3. **Visualiseeri andmed**: Loo graafikud tulemuste kuvamiseks
4. **Lisa rohkem mõõdikuid**: Testi mitte ainult klikke, vaid ka aega lehel veedetud
5. **Tehke test keerukamaks**: Testi erinevaid lehtedisaine, tekste või värve

## Tehnilised detailid

### Kasutatud tehnoloogiad

- **HTML5**: Lehtede struktuur
- **CSS3**: Stiilid ja animatsioonid
- **JavaScript (ES6+)**: Testi loogika
- **Node.js**: Server andmete salvestamiseks
- **localStorage**: Kliendipoolne andmete salvestus

### Failid

- `index.html`: Avaleht testi alustamiseks
- `test-a.html`: Testi variant A (roosa nupp)
- `test-b.html`: Testi variant B (sinine nupp)
- `style.css`: Kõik stiilid
- `ab-test.js`: Testi loogika ja andmete kogumine
- `server.js`: Node.js server tulemuste salvestamiseks

## Probleemide lahendamine

### Server ei käivitu

- Veendu, et Node.js on paigaldatud: `node --version`
- Kontrolli, kas port 3000 on vaba

### Andmed ei salvestu

- Veendu, et server töötab
- Kontrolli brauseri konsooli vigu
- Veendu, et faili `testi-tulemused.txt` on kirjutamisõigus

### Variant ei muutu

- Puhasta brauseri localStorage
- Avalehel kasuta brauseri arendaja tööriistu: `localStorage.clear()`

## Lisainfo

See projekt on mõeldud õppimiseks. Võta vaba kasutada ja arendada edasi!

## Autor

Loodud A/B testimise õppetunniks.

