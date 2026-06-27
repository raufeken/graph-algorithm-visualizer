//GLOBAL DURUM DEĞİŞKENLERİ

let mevcutAlgoritma = '';       // Seçili algoritma adı
let cizimModuAktif = false;     // Kullanıcı çizim modunda mı?
let secilenArac = 'dugum';      // Aktif çizim aracı

let dugumler = [];              // Graf düğümleri listesi
let kenarlar = [];              // Graf kenarları listesi
let seciliDugum1 = null;        // Kenar çizerken seçilen ilk düğüm

let animasyonCalisiyor = false; // Animasyon oynatılıyor mu?
let animasyonAdimi = 0;         // Şu anki adım indeksi
let animasyonAdimlar = [];      // Tüm hesaplanmış adımlar
let animasyonZamanlayici = null;// setTimeout referansı

let dugumSayaci = 0;            // Yeni düğümlere harf atamak için sayaç
let kanvas, cizici;             // Canvas ve 2D context referansları
let kanvasGenislik, kanvasYukseklik; // Canvas boyutları

// Kenar modal işlemleri için geçici değişkenler
let kenarModaliKaynak = null;
let kenarModaliHedef = null;
var arkaAnimasyonKimlik = null;  // Arka plan animasyonu ID

// Mesafe objesini basit for döngüsü ile kopyalar
function mesafeleriKopyala(obj) {
  var kopya = {};
  for (var anahtar in obj) {
    kopya[anahtar] = obj[anahtar];
  }
  return kopya;
}


//RENK PALETLERİ
// Her algoritmanın tema rengi
const ALGORITMA_RENKLERI = {
  dijkstra: '#4f8ef7',
  bellman: '#f7c94f',
  prim: '#36d9c4',
  kruskal: '#7c5ef9'
};

// Düğümlere sırayla atanan renkler
const DUGUM_RENK_PALETI = [
  '#4f8ef7', '#36d9c4', '#7c5ef9', '#f7c94f',
  '#f74f6a', '#4ff7a0', '#f78c4f', '#c94ff7'
];



//  PSEUDOKOD VERİSİ  :  Her algoritma için gösterilecek sözde kod satırları


const pseudokodVerisi = {
  dijkstra: [
    { metin: '<span class="fonksiyon-adi">dijkstra</span>(graf, baslangic):', girinti: 0 },
    { metin: '<span class="anahtar-kelime">mesafe</span> ← sonsuz tüm düğümler için', girinti: 1 },
    { metin: '<span class="anahtar-kelime">mesafe</span>[baslangic] ← <span class="sayi-degeri">0</span>', girinti: 1 },
    { metin: '<span class="anahtar-kelime">oncelikKuyrugu</span> ← {baslangic}', girinti: 1 },
    { metin: '<span class="anahtar-kelime">ziyaretEdildi</span> ← boş küme', girinti: 1 },
    { metin: '<span class="anahtar-kelime">while</span> oncelikKuyrugu boş değil:', girinti: 1 },
    { metin: 'u ← <span class="fonksiyon-adi">enKucukMesafe</span>(kuyruk)', girinti: 2 },
    { metin: 'ziyaretEdildi.ekle(u)', girinti: 2 },
    { metin: '<span class="anahtar-kelime">for</span> her komşu v of u:', girinti: 1 },
    { metin: 'yeniMesafe ← mesafe[u] + kenar(u,v)', girinti: 2 },
    { metin: '<span class="anahtar-kelime">if</span> yeniMesafe &lt; mesafe[v]:', girinti: 1 },
    { metin: 'mesafe[v] ← yeniMesafe', girinti: 2 },
    { metin: 'onceki[v] ← u', girinti: 2 },
    { metin: '<span class="anahtar-kelime">return</span> mesafe, onceki', girinti: 1 },
  ],
  bellman: [
    { metin: '<span class="fonksiyon-adi">bellmanFord</span>(graf, baslangic):', girinti: 0 },
    { metin: '<span class="anahtar-kelime">mesafe</span> ← sonsuz tüm düğümler', girinti: 1 },
    { metin: '<span class="anahtar-kelime">mesafe</span>[baslangic] ← <span class="sayi-degeri">0</span>', girinti: 1 },
    { metin: '<span class="anahtar-kelime">for</span> i = <span class="sayi-degeri">1</span> to |V|-1:', girinti: 1 },
    { metin: '<span class="anahtar-kelime">for</span> her kenar (u, v, w):', girinti: 1 },
    { metin: '<span class="anahtar-kelime">if</span> mesafe[u] + w &lt; mesafe[v]:', girinti: 1 },
    { metin: 'mesafe[v] ← mesafe[u] + w', girinti: 2 },
    { metin: 'onceki[v] ← u', girinti: 2 },
    { metin: '<span class="yorum-satiri"># Negatif döngü kontrolü</span>', girinti: 1 },
    { metin: '<span class="anahtar-kelime">for</span> her kenar (u, v, w):', girinti: 1 },
    { metin: '<span class="anahtar-kelime">if</span> mesafe[u] + w &lt; mesafe[v]:', girinti: 1 },
    { metin: '<span class="anahtar-kelime">raise</span> "Negatif döngü bulundu!"', girinti: 2 },
    { metin: '<span class="anahtar-kelime">return</span> mesafe', girinti: 1 },
  ],
  prim: [
    { metin: '<span class="fonksiyon-adi">prim</span>(graf, baslangic):', girinti: 0 },
    { metin: '<span class="anahtar-kelime">mstKenarlar</span> ← boş liste', girinti: 1 },
    { metin: '<span class="anahtar-kelime">ziyaretEdildi</span> ← {baslangic}', girinti: 1 },
    { metin: '<span class="anahtar-kelime">oncelikKuyrugu</span> ← baslangic komşuları', girinti: 1 },
    { metin: '<span class="anahtar-kelime">while</span> oncelikKuyrugu boş değil:', girinti: 1 },
    { metin: '(w, u, v) ← <span class="fonksiyon-adi">enKucukKenar</span>(kuyruk)', girinti: 2 },
    { metin: '<span class="anahtar-kelime">if</span> v ziyaret edilmediyse:', girinti: 1 },
    { metin: 'mstKenarlar.ekle(u, v, w)', girinti: 2 },
    { metin: 'ziyaretEdildi.ekle(v)', girinti: 2 },
    { metin: '<span class="anahtar-kelime">for</span> komşu k of v:', girinti: 1 },
    { metin: 'kuyruk.ekle(k.agirlik, v, k)', girinti: 2 },
    { metin: '<span class="anahtar-kelime">return</span> mstKenarlar', girinti: 1 },
  ],
  kruskal: [
    { metin: '<span class="fonksiyon-adi">kruskal</span>(graf):', girinti: 0 },
    { metin: '<span class="anahtar-kelime">kenarlar</span> ← artan ağırlığa göre sırala', girinti: 1 },
    { metin: '<span class="anahtar-kelime">mst</span> ← boş liste', girinti: 1 },
    { metin: '<span class="anahtar-kelime">unionFind</span> ← her düğüm için', girinti: 1 },
    { metin: '<span class="anahtar-kelime">for</span> her kenar (u, v, w) in kenarlar:', girinti: 1 },
    { metin: '<span class="anahtar-kelime">if</span> bul(u) ≠ bul(v):', girinti: 1 },
    { metin: 'mst.ekle(u, v, w)', girinti: 2 },
    { metin: 'birlestir(u, v)', girinti: 2 },
    { metin: '<span class="anahtar-kelime">if</span> |mst| == |V| - 1:', girinti: 1 },
    { metin: '<span class="anahtar-kelime">break</span>', girinti: 2 },
    { metin: '<span class="yorum-satiri"># MST tamamlandı</span>', girinti: 1 },
    { metin: '<span class="anahtar-kelime">return</span> mst', girinti: 1 },
  ],
};


//  HAZIR GRAF VERİLERİ
//  Kullanıcı seçebileceği önceden tanımlı graflar

const hazirGraflar = {
  basit: {
    dugumler: [
      { id: 'A', x: 0.15, y: 0.45 }, { id: 'B', x: 0.35, y: 0.2 },
      { id: 'C', x: 0.35, y: 0.7 }, { id: 'D', x: 0.6, y: 0.2 },
      { id: 'E', x: 0.6, y: 0.7 }, { id: 'F', x: 0.82, y: 0.45 },
    ],
    kenarlar: [
      { kaynak: 'A', hedef: 'B', agirlik: 4 }, { kaynak: 'A', hedef: 'C', agirlik: 2 },
      { kaynak: 'B', hedef: 'D', agirlik: 3 }, { kaynak: 'B', hedef: 'C', agirlik: 1 },
      { kaynak: 'C', hedef: 'E', agirlik: 5 }, { kaynak: 'D', hedef: 'F', agirlik: 2 },
      { kaynak: 'D', hedef: 'E', agirlik: 4 }, { kaynak: 'E', hedef: 'F', agirlik: 1 },
    ]
  },
  negatif: {
    dugumler: [
      { id: 'S', x: 0.12, y: 0.5 }, { id: 'A', x: 0.35, y: 0.25 },
      { id: 'B', x: 0.35, y: 0.75 }, { id: 'C', x: 0.62, y: 0.35 },
      { id: 'D', x: 0.62, y: 0.65 }, { id: 'T', x: 0.85, y: 0.5 },
    ],
    kenarlar: [
      { kaynak: 'S', hedef: 'A', agirlik: 6 }, { kaynak: 'S', hedef: 'B', agirlik: 7 },
      { kaynak: 'A', hedef: 'C', agirlik: 5 }, { kaynak: 'A', hedef: 'B', agirlik: 8 },
      { kaynak: 'B', hedef: 'D', agirlik: -3 }, { kaynak: 'C', hedef: 'T', agirlik: -2 },
      { kaynak: 'D', hedef: 'C', agirlik: -2 }, { kaynak: 'D', hedef: 'T', agirlik: 9 },
    ]
  },
  karmasik: {
    dugumler: [
      { id: 'A', x: 0.12, y: 0.5 }, { id: 'B', x: 0.3, y: 0.2 },
      { id: 'C', x: 0.3, y: 0.8 }, { id: 'D', x: 0.5, y: 0.35 },
      { id: 'E', x: 0.5, y: 0.65 }, { id: 'F', x: 0.7, y: 0.2 },
      { id: 'G', x: 0.7, y: 0.8 }, { id: 'H', x: 0.88, y: 0.5 },
    ],
    kenarlar: [
      { kaynak: 'A', hedef: 'B', agirlik: 4 }, { kaynak: 'A', hedef: 'C', agirlik: 8 },
      { kaynak: 'B', hedef: 'D', agirlik: 8 }, { kaynak: 'B', hedef: 'C', agirlik: 11 },
      { kaynak: 'C', hedef: 'E', agirlik: 7 }, { kaynak: 'D', hedef: 'E', agirlik: 2 },
      { kaynak: 'D', hedef: 'F', agirlik: 1 }, { kaynak: 'E', hedef: 'G', agirlik: 6 },
      { kaynak: 'F', hedef: 'H', agirlik: 2 }, { kaynak: 'G', hedef: 'H', agirlik: 7 },
      { kaynak: 'F', hedef: 'G', agirlik: 6 }, { kaynak: 'C', hedef: 'D', agirlik: 2 },
    ]
  }
};



//  ARKA PLAN ANİMASYONU
//  Ana sayfada yüzen parçacıklar ve aralarındaki bağlantı çizgileri

function arkaAnimasyonuBaslat() {
  const arkaKanvas = document.getElementById('arkaKanvas');
  if (!arkaKanvas) return;
  const arkaCizici = arkaKanvas.getContext('2d');
  arkaKanvas.width = window.innerWidth;
  arkaKanvas.height = window.innerHeight;

  // 50 rastgele parçacık oluştur
  const partikuller = [];
  for (let i = 0; i < 50; i++) {
    partikuller.push({
      x: Math.random() * arkaKanvas.width,
      y: Math.random() * arkaKanvas.height,
      hizX: (Math.random() - 0.5) * 0.4,
      hizY: (Math.random() - 0.5) * 0.4,
      yaricap: Math.random() * 2 + 1,
      renk: DUGUM_RENK_PALETI[Math.floor(Math.random() * DUGUM_RENK_PALETI.length)]
    });
  }

  function animasyonDongusu() {
    arkaCizici.clearRect(0, 0, arkaKanvas.width, arkaKanvas.height);

    // Her parçacığı hareket ettir ve çiz
    for (let i = 0; i < partikuller.length; i++) {
      const p = partikuller[i];
      p.x += p.hizX;
      p.y += p.hizY;

      // Kenar sınırlarında geri döndür
      if (p.x < 0 || p.x > arkaKanvas.width) p.hizX *= -1;
      if (p.y < 0 || p.y > arkaKanvas.height) p.hizY *= -1;

      arkaCizici.beginPath();
      arkaCizici.arc(p.x, p.y, p.yaricap, 0, Math.PI * 2);
      arkaCizici.fillStyle = p.renk + '66'; // Yarı saydam
      arkaCizici.fill();
    }

    // Yakın parçacıklar arasına çizgi çiz (120px altı)
    for (let i = 0; i < partikuller.length; i++) {
      for (let j = i + 1; j < partikuller.length; j++) {
        const p1 = partikuller[i];
        const p2 = partikuller[j];
        const uzaklik = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        if (uzaklik < 120) {
          const saydamlik = 0.12 * (1 - uzaklik / 120);
          arkaCizici.beginPath();
          arkaCizici.moveTo(p1.x, p1.y);
          arkaCizici.lineTo(p2.x, p2.y);
          arkaCizici.strokeStyle = `rgba(79,142,247,${saydamlik})`;
          arkaCizici.lineWidth = 0.5;
          arkaCizici.stroke();
        }
      }
    }

    arkaAnimasyonKimlik = requestAnimationFrame(animasyonDongusu);
  }

  animasyonDongusu();
}

// Arka plan animasyonunu durdur
function arkaAnimasyonuDurdur() {
  if (arkaAnimasyonKimlik) {
    cancelAnimationFrame(arkaAnimasyonKimlik);
    arkaAnimasyonKimlik = null;
  }
}


//  SAYFA GEÇİŞLERİ


// Ana sayfadan algoritma çalışma alanına geç
function algoritmayiBaslat(algoritma) {
  mevcutAlgoritma = algoritma;
  arkaAnimasyonuDurdur();

  // Sayfa görünürlüklerini değiştir
  document.getElementById('anaSayfa').classList.remove('aktif');
  document.getElementById('calismaAlani').classList.add('aktif');

  // Üst başlığı güncelle
  const algoritmAdlari = {
    dijkstra: 'Dijkstra',
    bellman: 'Bellman-Ford',
    prim: 'Prim',
    kruskal: 'Kruskal'
  };
  const baslikElemani = document.getElementById('algoritmaBasligi');
  baslikElemani.innerHTML = `${algoritmAdlari[algoritma]} <span>Görselleştirici</span>`;
  baslikElemani.style.color = ALGORITMA_RENKLERI[algoritma];

  // Negatif graf seçeneği sadece Bellman-Ford için aktif
  const negatifSecenegi = document.querySelector('#hazirGrafSecici option[value="negatif"]');
  if (negatifSecenegi) {
    negatifSecenegi.disabled = (algoritma !== 'bellman');
  }

  // Çalışma alanını hazırla
  kanvasiHazirla();
  pseudokodGoster(algoritma);
  gunluguTemizle();
  hazirGrafYukle('basit');

  gunlukEkle('Algoritma yüklendi: ' + algoritmAdlari[algoritma], 'bilgi');
  gunlukEkle("Hazır graf yüklendi. '▶' düğmesine basın.", 'basari');
}

// Çalışma alanından ana sayfaya dön
function anaSayfayaDon() {
  animasyonDurdur();
  document.getElementById('calismaAlani').classList.remove('aktif');
  document.getElementById('anaSayfa').classList.add('aktif');
  arkaAnimasyonuBaslat();

  // Çizim modunu sıfırla
  cizimModuAktif = false;
  document.getElementById('cizimModuButonu').classList.remove('aktif-mod');
  document.getElementById('cizimAraclari').classList.remove('gorunur');
  document.getElementById('mesafeTablosu').classList.remove('gorunur');
  document.getElementById('hazirGrafSecici').value = '';
}



//  KANVAS HAZIRLIĞI VE OLAY DİNLEYİCİLERİ

function kanvasiHazirla() {
  kanvas = document.getElementById('grafKanvasi');
  cizici = kanvas.getContext('2d');
  boyutlariGuncelle();
  kanvasOlaylariniEkle();
  window.removeEventListener('resize', boyutlariGuncelle);
  window.addEventListener('resize', boyutlariGuncelle);
}

function boyutlariGuncelle() {
  const kapsayici = kanvas.parentElement;
  kanvasGenislik = kapsayici.clientWidth;
  kanvasYukseklik = kapsayici.clientHeight;
  kanvas.width = kanvasGenislik;
  kanvas.height = kanvasYukseklik;
  grafiCiz();
}

function kanvasOlaylariniEkle() {
  kanvas.addEventListener('click', kanvaTiklama);
  kanvas.addEventListener('mousemove', fareyiTakipEt);
}

// Fare pozisyonunu takip et (çizim modu için)
let fareX = 0, fareY = 0;
function fareyiTakipEt(olay) {
  const cerceve = kanvas.getBoundingClientRect();
  fareX = olay.clientX - cerceve.left;
  fareY = olay.clientY - cerceve.top;
}

// Kanvasa tıklandığında ne yapılacağını belirle
function kanvaTiklama(olay) {
  if (!cizimModuAktif) return;

  const cerceve = kanvas.getBoundingClientRect();
  const x = olay.clientX - cerceve.left;
  const y = olay.clientY - cerceve.top;

  if (secilenArac === 'dugum') {
    // Yeni düğüm ekle
    yeniDugumEkle(x, y);

  } else if (secilenArac === 'kenar' || secilenArac === 'agirlik') {
    // İki düğüme sırayla tıklanarak kenar eklenir / güncellenir
    const tikladigiDugum = dugumBul(x, y);
    if (!tikladigiDugum) return;

    if (seciliDugum1 === null) {
      // İlk düğüm seçildi
      seciliDugum1 = tikladigiDugum;
      gunlukEkle(`"${tikladigiDugum.id}" seçildi, ikinci düğümü seçin.`);
    } else if (seciliDugum1.id !== tikladigiDugum.id) {
      // İkinci düğüm seçildi, modal aç
      kenarModaliniAc(seciliDugum1, tikladigiDugum);
    }
  }

  grafiCiz();
}



//  DÜĞÜM VE KENAR İŞLEMLERİ

function yeniDugumEkle(x, y) {
  // A, B, C ... Z, A1, B1 ... şeklinde harf ata
  const harf = String.fromCharCode(65 + (dugumSayaci % 26));
  const sonek = dugumSayaci >= 26 ? Math.floor(dugumSayaci / 26) : '';
  const kimlik = harf + sonek;
  dugumSayaci++;

  dugumler.push({
    id: kimlik,
    x: x,
    y: y,
    renk: DUGUM_RENK_PALETI[dugumler.length % DUGUM_RENK_PALETI.length],
    durum: 'normal'
  });

  bilgiPaneliniGuncelle();
  gunlukEkle(`"${kimlik}" düğümü eklendi (${Math.round(x)}, ${Math.round(y)})`, 'bilgi');
  grafiCiz();
}

// Verilen (x,y) noktasına yakın düğümü bul (22px yarıçap içinde)
function dugumBul(x, y) {
  for (let i = 0; i < dugumler.length; i++) {
    const d = dugumler[i];
    const uzaklik = Math.sqrt((d.x - x) ** 2 + (d.y - y) ** 2);
    if (uzaklik < 22) return d;
  }
  return null;
}

// Kenar ağırlığı modalını aç
function kenarModaliniAc(kaynak, hedef) {
  kenarModaliKaynak = kaynak;
  kenarModaliHedef = hedef;

  // Eğer bu kenar zaten varsa, mevcut ağırlığı göster
  const mevcutKenar = kenariBul(kaynak.id, hedef.id);
  document.getElementById('agirlikGirdisi').value = mevcutKenar ? mevcutKenar.agirlik : 1;
  document.getElementById('kenarModali').classList.add('aktif');
}

// Kenarları id ile bul (yönsüz)
function kenariBul(kaynakId, hedefId) {
  for (let i = 0; i < kenarlar.length; i++) {
    const k = kenarlar[i];
    if ((k.kaynak === kaynakId && k.hedef === hedefId) ||
      (k.kaynak === hedefId && k.hedef === kaynakId)) {
      return k;
    }
  }
  return null;
}

// Modal'dan ağırlığı al ve kenara uygula
function kenarAgirliginiOnayla() {
  const agirlik = parseInt(document.getElementById('agirlikGirdisi').value) || 1;
  const mevcutKenar = kenariBul(kenarModaliKaynak.id, kenarModaliHedef.id);

  if (mevcutKenar) {
    // Mevcut kenarın ağırlığını güncelle
    mevcutKenar.agirlik = agirlik;
    gunlukEkle(
      `Kenar "${kenarModaliKaynak.id}→${kenarModaliHedef.id}" güncellendi (ağırlık: ${agirlik}).`,
      'uyari'
    );
  } else {
    // Yeni kenar ekle
    kenarlar.push({
      kaynak: kenarModaliKaynak.id,
      hedef: kenarModaliHedef.id,
      agirlik: agirlik,
      durum: 'normal'
    });
    gunlukEkle(
      `"${kenarModaliKaynak.id}" → "${kenarModaliHedef.id}" kenarı eklendi (ağırlık: ${agirlik})`,
      'bilgi'
    );
  }

  seciliDugum1 = null;
  bilgiPaneliniGuncelle();
  modalKapat();
  grafiCiz();
}

function modalKapat() {
  document.getElementById('kenarModali').classList.remove('aktif');
  seciliDugum1 = null;
}


//  ÇİZİM MODU

function cizimModunuToggle() {
  cizimModuAktif = !cizimModuAktif;
  const buton = document.getElementById('cizimModuButonu');
  const araclari = document.getElementById('cizimAraclari');

  buton.classList.toggle('aktif-mod', cizimModuAktif);
  araclari.classList.toggle('gorunur', cizimModuAktif);
  kanvas.style.cursor = cizimModuAktif ? 'crosshair' : 'default';

  if (cizimModuAktif) {
    gunlukEkle('Çizim modu aktif. Kanvasa tıklayarak düğüm ekleyin.', 'bilgi');
  }
}

// Araç seçimini değiştir (düğüm / kenar / ağırlık)
function aracSec(secilenAracAdi) {
  secilenArac = secilenAracAdi;
  seciliDugum1 = null;

  // Tüm araç butonlarından aktif sınıfı kaldır
  document.getElementById('dugumAraciButonu').classList.remove('aktif');
  document.getElementById('kenarAraciButonu').classList.remove('aktif');
  document.getElementById('agirlikAraciButonu').classList.remove('aktif');

  // Seçilen araca aktif sınıfı ekle
  const butonIdleri = {
    dugum: 'dugumAraciButonu',
    kenar: 'kenarAraciButonu',
    agirlik: 'agirlikAraciButonu'
  };
  document.getElementById(butonIdleri[secilenAracAdi]).classList.add('aktif');

  const mesajlar = {
    dugum: 'Düğüm ekleme modu aktif.',
    kenar: 'Kenar ekleme modu — iki düğüme sırayla tıklayın.',
    agirlik: 'Ağırlık güncelleme modu — iki düğüme tıklayın.'
  };
  gunlukEkle(mesajlar[secilenAracAdi]);
}

// Grafı tamamen temizle
function tumunuTemizle() {
  dugumler = [];
  kenarlar = [];
  dugumSayaci = 0;
  seciliDugum1 = null;
  animasyonAdimlar = [];
  animasyonAdimi = 0;
  animasyonDurdur();
  bilgiPaneliniGuncelle();
  mesafeTablosunuGuncelle({});
  document.getElementById('mesafeTablosu').classList.remove('gorunur');
  grafiCiz();
  gunluguTemizle();
  gunlukEkle('Graf temizlendi.', 'uyari');
}


//  HAZIR GRAF YÜKLEME

function hazirGrafYukle(tip) {
  if (!tip || !hazirGraflar[tip]) return;

  animasyonDurdur();
  const veri = hazirGraflar[tip];

  // Düğümleri kanvas boyutuna göre konumlandır
  dugumler = [];
  for (let i = 0; i < veri.dugumler.length; i++) {
    const d = veri.dugumler[i];
    dugumler.push({
      id: d.id,
      x: d.x * kanvasGenislik,
      y: d.y * kanvasYukseklik,
      renk: DUGUM_RENK_PALETI[i % DUGUM_RENK_PALETI.length],
      durum: 'normal'
    });
  }

  // Kenarları kopyala
  kenarlar = [];
  for (let i = 0; i < veri.kenarlar.length; i++) {
    const k = veri.kenarlar[i];
    kenarlar.push({ kaynak: k.kaynak, hedef: k.hedef, agirlik: k.agirlik, durum: 'normal' });
  }

  dugumSayaci = dugumler.length;
  animasyonAdimlar = [];
  animasyonAdimi = 0;

  // Arayüzü sıfırla
  document.getElementById('adimSayaci').textContent = '0 / 0';
  document.getElementById('oynatButonu').textContent = '▶';
  animasyonCalisiyor = false;
  document.getElementById('mesafeTablosu').classList.remove('gorunur');

  bilgiPaneliniGuncelle();
  grafiCiz();

  const grafAdlari = {
    basit: 'Basit Graf',
    negatif: 'Negatif Ağırlıklı Graf',
    karmasik: 'Karmaşık Ağ'
  };
  gunlukEkle(`"${grafAdlari[tip]}" yüklendi.`, 'basari');
}


//  GRAFİ ÇİZ 


function grafiCiz() {
  if (!cizici) return;
  cizici.clearRect(0, 0, kanvasGenislik, kanvasYukseklik);

  // Arka plan nokta deseni
  cizici.fillStyle = 'rgba(42,53,86,0.2)';
  for (let x = 0; x < kanvasGenislik; x += 28) {
    for (let y = 0; y < kanvasYukseklik; y += 28) {
      cizici.beginPath();
      cizici.arc(x, y, 0.8, 0, Math.PI * 2);
      cizici.fill();
    }
  }

  // Önce kenarları çiz (düğümlerin altında kalması için)
  for (let i = 0; i < kenarlar.length; i++) {
    kenarCiz(kenarlar[i]);
  }

  // Sonra düğümleri çiz
  for (let i = 0; i < dugumler.length; i++) {
    dugumCiz(dugumler[i]);
  }
}

// Tek bir kenarı canvas'a çiz
function kenarCiz(kenar) {
  const kaynakDugum = dugumler.find(function (d) { return d.id === kenar.kaynak; });
  const hedefDugum = dugumler.find(function (d) { return d.id === kenar.hedef; });
  if (!kaynakDugum || !hedefDugum) return;

  const aktifRenk = ALGORITMA_RENKLERI[mevcutAlgoritma] || '#4f8ef7';
  let cizgiRengi = '#2a3556';
  let cizgiKalinligi = 1.5;
  let parlakMi = false;

  // Duruma göre renk belirle
  if (kenar.durum === 'aktif') { cizgiRengi = aktifRenk; cizgiKalinligi = 3; parlakMi = true; }
  else if (kenar.durum === 'mst') { cizgiRengi = '#36d9c4'; cizgiKalinligi = 3; parlakMi = true; }
  else if (kenar.durum === 'yol') { cizgiRengi = '#f7c94f'; cizgiKalinligi = 3; parlakMi = true; }
  else if (kenar.durum === 'tamamlandi') { cizgiRengi = '#3a4870'; cizgiKalinligi = 1.5; }

  // Parlak kenarlar için glow efekti
  if (parlakMi) {
    cizici.shadowColor = cizgiRengi;
    cizici.shadowBlur = 8;
  }

  // Kenar çizgisi
  cizici.beginPath();
  cizici.moveTo(kaynakDugum.x, kaynakDugum.y);
  cizici.lineTo(hedefDugum.x, hedefDugum.y);
  cizici.strokeStyle = cizgiRengi;
  cizici.lineWidth = cizgiKalinligi;
  cizici.stroke();
  cizici.shadowBlur = 0;

  // Dijkstra ve Bellman-Ford yönlü graflar — ok başı ekle
  if (mevcutAlgoritma === 'bellman') {
    okBasiCiz(kaynakDugum.x, kaynakDugum.y, hedefDugum.x, hedefDugum.y, cizgiRengi, cizgiKalinligi);
  }

  // Kenar ortasına ağırlık etiketi yaz
  const ortaX = (kaynakDugum.x + hedefDugum.x) / 2;
  const ortaY = (kaynakDugum.y + hedefDugum.y) / 2;
  // Etiketi çizginin biraz üstüne kaydır
  const farkX = hedefDugum.y - kaynakDugum.y;
  const farkY = kaynakDugum.x - hedefDugum.x;
  const uzunluk = Math.sqrt(farkX * farkX + farkY * farkY) || 1;
  const ofsetX = (farkX / uzunluk) * 12;
  const ofsetY = (farkY / uzunluk) * 12;

  cizici.font = 'bold 11px JetBrains Mono, monospace';
  cizici.textAlign = 'center';
  cizici.textBaseline = 'middle';
  cizici.fillStyle = parlakMi ? cizgiRengi : '#5a6488';
  cizici.fillText(kenar.agirlik, ortaX + ofsetX, ortaY + ofsetY);
}

// Ok başı (yönlü kenarlar için)
function okBasiCiz(x1, y1, x2, y2, renk, kalinlik) {
  const dugumYaricap = 22;
  const aci = Math.atan2(y2 - y1, x2 - x1);
  // Ok ucunu düğüm sınırında bırak
  const ucX = x2 - Math.cos(aci) * dugumYaricap;
  const ucY = y2 - Math.sin(aci) * dugumYaricap;
  const okBoyutu = 8;
  const kanatAcisi = 0.4;

  cizici.beginPath();
  cizici.moveTo(ucX, ucY);
  cizici.lineTo(ucX - okBoyutu * Math.cos(aci - kanatAcisi), ucY - okBoyutu * Math.sin(aci - kanatAcisi));
  cizici.moveTo(ucX, ucY);
  cizici.lineTo(ucX - okBoyutu * Math.cos(aci + kanatAcisi), ucY - okBoyutu * Math.sin(aci + kanatAcisi));
  cizici.strokeStyle = renk;
  cizici.lineWidth = kalinlik * 0.8;
  cizici.stroke();
}

// Tek bir düğümü canvas'a çiz
function dugumCiz(dugum) {
  const aktifRenk = ALGORITMA_RENKLERI[mevcutAlgoritma] || '#4f8ef7';
  let dolguRengi = '#161e35';
  let sinirRengi = dugum.renk || '#2a3556';
  let sinirKalinligi = 1.5;
  let parlakMi = false;
  let metinRengi = '#8a93b8';

  // Düğüm durumuna göre görünüm
  if (dugum.durum === 'baslangic') {
    dolguRengi = aktifRenk + '33'; sinirRengi = aktifRenk;
    sinirKalinligi = 2.5; parlakMi = true; metinRengi = aktifRenk;
  } else if (dugum.durum === 'ziyaret') {
    dolguRengi = aktifRenk + '22'; sinirRengi = aktifRenk;
    sinirKalinligi = 2; metinRengi = aktifRenk;
  } else if (dugum.durum === 'aktif') {
    dolguRengi = aktifRenk + '44'; sinirRengi = aktifRenk;
    sinirKalinligi = 3; parlakMi = true; metinRengi = '#fff';
  } else if (dugum.durum === 'tamamlandi') {
    dolguRengi = '#1d2540'; sinirRengi = '#3a4870'; metinRengi = '#5a6488';
  } else if (dugum.durum === 'mst') {
    dolguRengi = '#36d9c433'; sinirRengi = '#36d9c4';
    sinirKalinligi = 2.5; metinRengi = '#36d9c4';
  }

  // Kenar eklerken seçili olan düğümü sarıyla göster
  if (seciliDugum1 && dugum.id === seciliDugum1.id) {
    sinirRengi = '#f7c94f'; sinirKalinligi = 3;
    parlakMi = true; dolguRengi = '#f7c94f22';
  }

  if (parlakMi) {
    cizici.shadowColor = sinirRengi;
    cizici.shadowBlur = 16;
  }

  // Düğüm dairesi
  cizici.beginPath();
  cizici.arc(dugum.x, dugum.y, 22, 0, Math.PI * 2);
  cizici.fillStyle = dolguRengi;
  cizici.fill();
  cizici.strokeStyle = sinirRengi;
  cizici.lineWidth = sinirKalinligi;
  cizici.stroke();
  cizici.shadowBlur = 0;

  // Düğüm harfi
  cizici.font = 'bold 13px Syne, sans-serif';
  cizici.textAlign = 'center';
  cizici.textBaseline = 'middle';
  cizici.fillStyle = metinRengi;
  cizici.fillText(dugum.id, dugum.x, dugum.y);

  // Eğer mesafe hesaplandıysa, üstünde göster
  if (dugum.mesafe !== undefined) {
    const gosterilecek = (dugum.mesafe === Infinity) ? '∞' : dugum.mesafe;
    cizici.font = '10px JetBrains Mono, monospace';
    cizici.fillStyle = sinirRengi;
    cizici.fillText(gosterilecek, dugum.x, dugum.y - 32);
  }
}


//  PSEUDOKOD GÖSTERME

function pseudokodGoster(algoritma) {
  const alan = document.getElementById('pseudokodAlani');
  const satirlar = pseudokodVerisi[algoritma] || [];
  let html = '';

  for (let i = 0; i < satirlar.length; i++) {
    const s = satirlar[i];
    let girintiSinifi = '';
    if (s.girinti === 2) girintiSinifi = 'girintili-2';
    else if (s.girinti === 1) girintiSinifi = 'girintili-1';

    html += `<div class="kod-satiri ${girintiSinifi}" id="kodSatiri${i}">${s.metin}</div>`;
  }

  alan.innerHTML = html;
}

// Belirli bir satırı aktif olarak vurgula
function pseudokodSatiriVurgula(satirIndex) {
  const tumSatirlar = document.querySelectorAll('.kod-satiri');
  for (let i = 0; i < tumSatirlar.length; i++) {
    tumSatirlar[i].classList.remove('aktif');
    if (i < satirIndex) {
      tumSatirlar[i].classList.add('tamamlandi');
    }
  }

  const aktifSatir = document.getElementById(`kodSatiri${satirIndex}`);
  if (aktifSatir) {
    aktifSatir.classList.add('aktif');
    aktifSatir.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}


//  İŞLEM GÜNLÜĞÜ (Log)

function gunlukEkle(mesaj, tur = '') {
  const gunluk = document.getElementById('islemGunlugu');
  const simdi = new Date().toLocaleTimeString('tr-TR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  const satir = document.createElement('div');
  satir.className = `gunluk-satiri ${tur}`;
  satir.innerHTML = `<span class="gunluk-zamani">${simdi}</span>${mesaj}`;
  gunluk.appendChild(satir);
  gunluk.scrollTop = gunluk.scrollHeight;
}

function gunluguTemizle() {
  document.getElementById('islemGunlugu').innerHTML = '';
}

//  BİLGİ PANELİ VE MESAFE TABLOSU

function bilgiPaneliniGuncelle() {
  document.getElementById('dugumSayisiGosterge').textContent = dugumler.length;
  document.getElementById('kenarSayisiGosterge').textContent = kenarlar.length;
}

function mesafeTablosunuGuncelle(mesafeler) {
  const icerik = document.getElementById('mesafeIcerigi');
  const anahtarlar = Object.keys(mesafeler);
  if (anahtarlar.length === 0) { icerik.innerHTML = ''; return; }

  let html = '';
  for (let i = 0; i < anahtarlar.length; i++) {
    const dugumId = anahtarlar[i];
    const mesafe = mesafeler[dugumId];
    const d = dugumler.find(function (x) { return x.id === dugumId; });
    const renk = d ? d.renk : '#4f8ef7';
    const sonsuzMu = (mesafe === Infinity);

    html += `<div class="mesafe-satiri">
      <span class="mesafe-dugum-adi">
        <span class="mesafe-dugum-rengi" style="background:${renk}"></span>${dugumId}
      </span>
      <span class="mesafe-degeri ${sonsuzMu ? 'sonsuz' : ''}">${sonsuzMu ? '∞' : mesafe}</span>
    </div>`;
  }
  icerik.innerHTML = html;
}



//  ANİMASYON KONTROLÜ


// Oynat veya durdur
function oynatDurdur() {
  if (animasyonAdimlar.length === 0) {
    // Adım yoksa başlangıç düğümü seçtir
    baslangicModaliniGoster();
    return;
  }
  if (animasyonCalisiyor) {
    animasyonDurdur();
  } else {
    animasyonBaslat();
  }
}

function animasyonBaslat() {
  // Sona gelinmişse başa dön
  if (animasyonAdimi >= animasyonAdimlar.length) {
    animasyonAdimi = 0;
  }
  animasyonCalisiyor = true;
  document.getElementById('oynatButonu').textContent = '⏸';
  sonrakiAdimaSec();
}

function animasyonDurdur() {
  animasyonCalisiyor = false;
  if (animasyonZamanlayici) {
    clearTimeout(animasyonZamanlayici);
    animasyonZamanlayici = null;
  }
  document.getElementById('oynatButonu').textContent = '▶';
}

// Sıradaki adımı işle ve bir sonrakini planla
function sonrakiAdimaSec() {
  if (!animasyonCalisiyor || animasyonAdimi >= animasyonAdimlar.length) {
    animasyonDurdur();
    if (animasyonAdimi >= animasyonAdimlar.length && animasyonAdimlar.length > 0) {
      gunlukEkle('✅ Algoritma tamamlandı!', 'basari');
    }
    return;
  }

  adimUygula(animasyonAdimi);
  animasyonAdimi++;

  // Hız cetvelinden gecikme hesapla (1=yavaş, 10=hızlı)
  const hiz = document.getElementById('hizCetveli').value;
  const gecikme = Math.round(1200 / hiz);
  animasyonZamanlayici = setTimeout(sonrakiAdimaSec, gecikme);
}

// Bir adım ileri git
function adimIleri() {
  if (animasyonAdimlar.length === 0) { baslangicModaliniGoster(); return; }
  animasyonDurdur();
  if (animasyonAdimi < animasyonAdimlar.length) {
    adimUygula(animasyonAdimi);
    animasyonAdimi++;
  }
}

// Bir adım geri git (tüm adımları baştan tekrar uygulayarak)
function adimGeri() {
  animasyonDurdur();
  if (animasyonAdimi > 0) {
    animasyonAdimi--;
    grafDurumunuSifirla();
    // Önceki adıma kadar sessiz olarak uygula
    for (let i = 0; i < animasyonAdimi; i++) {
      adimUygula(i, true);
    }
    grafiCiz();
    document.getElementById('adimSayaci').textContent = `${animasyonAdimi} / ${animasyonAdimlar.length}`;
  }
}

// Bir adımın içeriğini alarak graf durumunu güncelle
function adimUygula(index, sessiz) {
  if (index >= animasyonAdimlar.length) return;
  const adim = animasyonAdimlar[index];

  // Sayaçları güncelle
  document.getElementById('adimSayaci').textContent = `${index + 1} / ${animasyonAdimlar.length}`;
  document.getElementById('adimGosterge').textContent = `${index + 1}/${animasyonAdimlar.length}`;

  // Pseudokod satırını vurgula
  if (adim.pseudokodSatiri !== undefined) {
    pseudokodSatiriVurgula(adim.pseudokodSatiri);
  }

  // Mesafe tablosunu güncelle
  if (adim.mesafeler) {
    mesafeTablosunuGuncelle(adim.mesafeler);
    document.getElementById('mesafeTablosu').classList.add('gorunur');
  }

  // Düğüm durumlarını güncelle
  if (adim.dugumDurumlari) {
    for (let i = 0; i < adim.dugumDurumlari.length; i++) {
      const degisim = adim.dugumDurumlari[i];
      const d = dugumler.find(function (x) { return x.id === degisim.id; });
      if (d) {
        d.durum = degisim.durum;
        if (degisim.mesafe !== undefined) d.mesafe = degisim.mesafe;
      }
    }
  }

  // Kenar durumlarını güncelle
  if (adim.kenarDurumlari) {
    for (let i = 0; i < adim.kenarDurumlari.length; i++) {
      const degisim = adim.kenarDurumlari[i];
      const k = kenariBul(degisim.kaynak, degisim.hedef);
      if (k) k.durum = degisim.durum;
    }
  }

  // Log mesajı yaz (geri adımda sessiz)
  if (!sessiz && adim.logMesaj) {
    gunlukEkle(adim.logMesaj, adim.logTur || '');
  }

  grafiCiz();
}

// Graf ve animasyonu başlangıç durumuna sıfırla
function grafDurumunuSifirla() {
  for (let i = 0; i < dugumler.length; i++) {
    dugumler[i].durum = 'normal';
    delete dugumler[i].mesafe;
  }
  for (let i = 0; i < kenarlar.length; i++) {
    kenarlar[i].durum = 'normal';
  }
  mesafeTablosunuGuncelle({});
  document.getElementById('mesafeTablosu').classList.remove('gorunur');
  var tumKodSatirlari = document.querySelectorAll('.kod-satiri');
  for (var i = 0; i < tumKodSatirlari.length; i++) {
    tumKodSatirlari[i].classList.remove('aktif', 'tamamlandi');
  }
}

function algoritmayiSifirla() {
  animasyonDurdur();
  animasyonAdimlar = [];
  animasyonAdimi = 0;
  grafDurumunuSifirla();
  grafiCiz();
  document.getElementById('adimSayaci').textContent = '0 / 0';
  document.getElementById('adimGosterge').textContent = '—';
  gunluguTemizle();
  gunlukEkle('Graf sıfırlandı. Başlatmak için ▶ tuşuna basın.', 'bilgi');
}



//  BAŞLANGIÇ DÜĞÜMÜ MODALI

function baslangicModaliniGoster() {
  if (dugumler.length === 0) {
    bildirimGoster('Önce bir graf yükleyin veya çizin!');
    return;
  }
  // Dropdown'ı doldur
  const secim = document.getElementById('baslangicSecimi');
  let secimHtml = '';
  for (let i = 0; i < dugumler.length; i++) {
    secimHtml += `<option value="${dugumler[i].id}">${dugumler[i].id}</option>`;
  }
  secim.innerHTML = secimHtml;
  document.getElementById('baslangicModali').classList.add('aktif');
}

function baslangicModaliniKapat() {
  document.getElementById('baslangicModali').classList.remove('aktif');
}

// Başlangıç düğümü seçildi, algoritmayı hesapla ve başlat
function algoritmayiCalistir() {
  const baslangicId = document.getElementById('baslangicSecimi').value;
  baslangicModaliniKapat();
  grafDurumunuSifirla();
  animasyonAdimlar = [];
  animasyonAdimi = 0;

  // Seçili algoritmayı hesapla
  animasyonAdimlar = algoritmayiHesapla(mevcutAlgoritma, baslangicId);
  gunluguTemizle();
  gunlukEkle(`Başlangıç düğümü: "${baslangicId}" → Algoritma hazır.`, 'bilgi');
  grafiCiz();
  animasyonBaslat();
}


//  ALGORİTMA SEÇİCİ


function algoritmayiHesapla(algoritma, baslangicId) {
  if (algoritma === 'dijkstra') return dijkstraHesapla(baslangicId);
  if (algoritma === 'bellman') return bellmanFordHesapla(baslangicId);
  if (algoritma === 'prim') return primHesapla(baslangicId);
  if (algoritma === 'kruskal') return kruskalHesapla();
  return [];
}



//  DİJKSTRA ALGORİTMASI
//  Açıklama: Başlangıç düğümünden tüm diğer düğümlere en kısa
//  yolları greedy yaklaşımla (öncelik kuyruğu ile) bulur.
//  Negatif ağırlıklı kenarlarda doğru çalışmaz!


function dijkstraHesapla(baslangicId) {
  const adimlar = [];
  const mesafeler = {};
  const ziyaretEdildi = {};

  // Tüm mesafeleri sonsuz yap
  for (let i = 0; i < dugumler.length; i++) {
    mesafeler[dugumler[i].id] = Infinity;
    ziyaretEdildi[dugumler[i].id] = false;
  }
  mesafeler[baslangicId] = 0;

  adimlar.push({
    pseudokodSatiri: 0,
    logMesaj: `Dijkstra başlatıldı. Başlangıç: "${baslangicId}"`, logTur: 'bilgi',
    dugumDurumlari: [{ id: baslangicId, durum: 'baslangic', mesafe: 0 }],
    mesafeler: mesafeleriKopyala(mesafeler)
  });
  adimlar.push({ pseudokodSatiri: 2, logMesaj: 'Tüm mesafeler sonsuz ayarlandı.', mesafeler: mesafeleriKopyala(mesafeler) });
  adimlar.push({ pseudokodSatiri: 3, logMesaj: `"${baslangicId}" mesafesi 0 yapıldı.`, mesafeler: mesafeleriKopyala(mesafeler) });

  // V kadar tur (her turda en küçük mesafeli ziyaret edilmemiş düğüm seç)
  for (let tur = 0; tur < dugumler.length; tur++) {
    // En küçük mesafeli ziyaret edilmemiş düğümü bul
    let enKucukMesafe = Infinity;
    let enKucukId = null;
    for (let i = 0; i < dugumler.length; i++) {
      const d = dugumler[i];
      if (!ziyaretEdildi[d.id] && mesafeler[d.id] < enKucukMesafe) {
        enKucukMesafe = mesafeler[d.id];
        enKucukId = d.id;
      }
    }
    if (enKucukId === null) break; // Kalan ulaşılabilir düğüm yok

    ziyaretEdildi[enKucukId] = true;

    adimlar.push({
      pseudokodSatiri: 6,
      logMesaj: `"${enKucukId}" kuyruktan alındı (mesafe: ${enKucukMesafe}).`, logTur: 'bilgi',
      dugumDurumlari: [{ id: enKucukId, durum: 'aktif', mesafe: enKucukMesafe }],
      mesafeler: mesafeleriKopyala(mesafeler)
    });

    // Bu düğümün tüm komşularını incele
    for (let i = 0; i < kenarlar.length; i++) {
      const kenar = kenarlar[i];
      // Yönsüz: her iki yönü de kontrol et
      if (kenar.kaynak !== enKucukId && kenar.hedef !== enKucukId) continue;
      const komsuId = (kenar.kaynak === enKucukId) ? kenar.hedef : kenar.kaynak;
      if (ziyaretEdildi[komsuId]) continue;

      const yeniMesafe = mesafeler[enKucukId] + kenar.agirlik;

      adimlar.push({
        pseudokodSatiri: 9,
        logMesaj: `"${enKucukId}" → "${komsuId}" inceleniyor (ağırlık: ${kenar.agirlik}).`,
        kenarDurumlari: [{ kaynak: kenar.kaynak, hedef: kenar.hedef, durum: 'aktif' }],
        mesafeler: mesafeleriKopyala(mesafeler)
      });

      if (yeniMesafe < mesafeler[komsuId]) {
        // Daha iyi bir yol bulundu!
        mesafeler[komsuId] = yeniMesafe;
        adimlar.push({
          pseudokodSatiri: 11,
          logMesaj: `✓ Mesafe güncellendi: "${komsuId}" = ${yeniMesafe}`, logTur: 'basari',
          dugumDurumlari: [{ id: komsuId, durum: 'ziyaret', mesafe: yeniMesafe }],
          kenarDurumlari: [{ kaynak: kenar.kaynak, hedef: kenar.hedef, durum: 'yol' }],
          mesafeler: mesafeleriKopyala(mesafeler)
        });
      } else {
        // Bu yol daha uzun, atla
        adimlar.push({
          pseudokodSatiri: 10,
          logMesaj: `Mesafe güncellenmedi (${yeniMesafe} ≥ ${mesafeler[komsuId]}).`,
          kenarDurumlari: [{ kaynak: kenar.kaynak, hedef: kenar.hedef, durum: 'tamamlandi' }],
          mesafeler: mesafeleriKopyala(mesafeler)
        });
      }
    }

    adimlar.push({
      pseudokodSatiri: 7,
      logMesaj: `"${enKucukId}" ziyaret edildi ve sonuçlandı.`,
      dugumDurumlari: [{ id: enKucukId, durum: 'tamamlandi', mesafe: enKucukMesafe }],
      mesafeler: mesafeleriKopyala(mesafeler)
    });
  }

  adimlar.push({
    pseudokodSatiri: 13,
    logMesaj: '🏁 Dijkstra tamamlandı!', logTur: 'basari',
    mesafeler: mesafeleriKopyala(mesafeler)
  });
  return adimlar;
}



//  BELLMAN-FORD ALGORİTMASI
//  Açıklama: V-1 kez tüm kenarları gevşeterek (relaxation)
//  en kısa yolları bulur. Negatif kenarları destekler.
//  Negatif döngüleri tespit edebilir.


function bellmanFordHesapla(baslangicId) {
  const adimlar = [];
  const mesafeler = {};

  for (let i = 0; i < dugumler.length; i++) {
    mesafeler[dugumler[i].id] = Infinity;
  }
  mesafeler[baslangicId] = 0;

  adimlar.push({
    pseudokodSatiri: 0,
    logMesaj: `Bellman-Ford başlatıldı. Başlangıç: "${baslangicId}"`, logTur: 'bilgi',
    dugumDurumlari: [{ id: baslangicId, durum: 'baslangic', mesafe: 0 }],
    mesafeler: mesafeleriKopyala(mesafeler)
  });
  adimlar.push({ pseudokodSatiri: 2, logMesaj: 'Tüm mesafeler sonsuz ayarlandı.', mesafeler: mesafeleriKopyala(mesafeler) });

  const dugumSayisi = dugumler.length;

  // V-1 iterasyon: her kenarı gevşet
  for (let tur = 1; tur < dugumSayisi; tur++) {
    adimlar.push({
      pseudokodSatiri: 3,
      logMesaj: `İterasyon ${tur} / ${dugumSayisi - 1} başlıyor.`, logTur: 'bilgi',
      mesafeler: mesafeleriKopyala(mesafeler)
    });

    for (let i = 0; i < kenarlar.length; i++) {
      const kenar = kenarlar[i];
      var kaynak = kenar.kaynak;
      var hedef = kenar.hedef;
      var agirlik = kenar.agirlik;

      if (mesafeler[kaynak] === Infinity) continue; // Kaynak henüz ulaşılmadıysa atla

      const yeniMesafe = mesafeler[kaynak] + agirlik;

      adimlar.push({
        pseudokodSatiri: 5,
        logMesaj: `Kenar "${kaynak}→${hedef}" inceleniyor (ağırlık: ${agirlik}).`,
        kenarDurumlari: [{ kaynak, hedef, durum: 'aktif' }],
        mesafeler: mesafeleriKopyala(mesafeler)
      });

      if (yeniMesafe < mesafeler[hedef]) {
        mesafeler[hedef] = yeniMesafe;
        adimlar.push({
          pseudokodSatiri: 6,
          logMesaj: `✓ Mesafe güncellendi: "${hedef}" = ${yeniMesafe}`, logTur: 'basari',
          dugumDurumlari: [{ id: hedef, durum: 'ziyaret', mesafe: yeniMesafe }],
          kenarDurumlari: [{ kaynak, hedef, durum: 'yol' }],
          mesafeler: mesafeleriKopyala(mesafeler)
        });
      }
    }
  }

  // Negatif döngü kontrolü
  var negatifDongu = false;
  for (var i = 0; i < kenarlar.length; i++) {
    var k = kenarlar[i];
    if (mesafeler[k.kaynak] !== Infinity && mesafeler[k.kaynak] + k.agirlik < mesafeler[k.hedef]) {
      negatifDongu = true;
      adimlar.push({
        pseudokodSatiri: 10,
        logMesaj: '⚠ Negatif döngü tespit edildi! (' + k.kaynak + '→' + k.hedef + ')', logTur: 'uyari',
        kenarDurumlari: [{ kaynak: k.kaynak, hedef: k.hedef, durum: 'aktif' }],
        mesafeler: mesafeleriKopyala(mesafeler)
      });
      break;
    }
  }

  adimlar.push({
    pseudokodSatiri: 12,
    logMesaj: negatifDongu ? '⚠ Bellman-Ford: Negatif döngü var!' : '🏁 Bellman-Ford tamamlandı!',
    logTur: negatifDongu ? 'uyari' : 'basari',
    mesafeler: mesafeleriKopyala(mesafeler)
  });
  return adimlar;
}



//  PRİM ALGORİTMASI
//  Açıklama: Başlangıç düğümünden itibaren her adımda MST'ye
//  en ucuz kenarı ekleyerek minimum yayılan ağacı oluşturur.


function primHesapla(baslangicId) {
  const adimlar = [];
  const mstDugumleri = {}; // MST'ye alınan düğümler

  mstDugumleri[baslangicId] = true;
  let mstDugumSayisi = 1;

  adimlar.push({
    pseudokodSatiri: 0,
    logMesaj: `Prim başlatıldı. Başlangıç: "${baslangicId}"`, logTur: 'bilgi',
    dugumDurumlari: [{ id: baslangicId, durum: 'mst' }]
  });

  // Tüm düğümler MST'ye alınana kadar devam et
  while (mstDugumSayisi < dugumler.length) {
    let enKucukAgirlik = Infinity;
    let enKucukKenar = null;

    // MST içinden dışına giden en ucuz kenarı bul
    for (let i = 0; i < kenarlar.length; i++) {
      const kenar = kenarlar[i];
      const kaynakIcinde = mstDugumleri[kenar.kaynak] === true;
      const hedefIcinde = mstDugumleri[kenar.hedef] === true;

      // Bir ucu içeride, diğeri dışarıda olan kenar
      if (kaynakIcinde !== hedefIcinde && kenar.agirlik < enKucukAgirlik) {
        enKucukAgirlik = kenar.agirlik;
        enKucukKenar = kenar;
      }
    }

    if (!enKucukKenar) break; // Graf bağlantısız

    // Yeni düğümü belirle (dışarıda olan taraf)
    const yeniDugumId = mstDugumleri[enKucukKenar.kaynak] ? enKucukKenar.hedef : enKucukKenar.kaynak;
    mstDugumleri[yeniDugumId] = true;
    mstDugumSayisi++;

    adimlar.push({
      pseudokodSatiri: 5,
      logMesaj: `Kenar "${enKucukKenar.kaynak}→${enKucukKenar.hedef}" inceleniyor (ağırlık: ${enKucukAgirlik}).`,
      kenarDurumlari: [{ kaynak: enKucukKenar.kaynak, hedef: enKucukKenar.hedef, durum: 'aktif' }]
    });

    adimlar.push({
      pseudokodSatiri: 7,
      logMesaj: `✓ "${yeniDugumId}" MST'ye eklendi.`, logTur: 'basari',
      dugumDurumlari: [{ id: yeniDugumId, durum: 'mst' }],
      kenarDurumlari: [{ kaynak: enKucukKenar.kaynak, hedef: enKucukKenar.hedef, durum: 'mst' }]
    });
  }

  adimlar.push({ pseudokodSatiri: 11, logMesaj: '🌳 Prim MST tamamlandı!', logTur: 'basari' });
  return adimlar;
}



//  KRUSKAL ALGORİTMASI
//  Açıklama: Kenarları artan ağırlık sırasına dizer, döngü
//  oluşturmayan her kenarı MST'ye ekler. Union-Find kullanır.
function kruskalHesapla() {
  const adimlar = [];

  // Union-Find veri yapısı — her düğümün "temsilcisi" (kök) tutulur
  const ust = {};
  const derinlik = {};
  for (let i = 0; i < dugumler.length; i++) {
    ust[dugumler[i].id] = dugumler[i].id; // Başlangıçta her düğüm kendinin temsilcisi
    derinlik[dugumler[i].id] = 0;
  }

  // Kök bul (yol sıkıştırma ile)
  function bul(x) {
    if (ust[x] !== x) {
      ust[x] = bul(ust[x]); // Sıkıştırma: doğrudan köke bağla
    }
    return ust[x];
  }

  // İki kümeyi birleştir (sıralı birleşim)
  function birlestir(x, y) {
    const kokX = bul(x);
    const kokY = bul(y);
    if (kokX === kokY) return false; // Aynı kümede, döngü oluşur
    if (derinlik[kokX] < derinlik[kokY]) ust[kokX] = kokY;
    else if (derinlik[kokX] > derinlik[kokY]) ust[kokY] = kokX;
    else { ust[kokY] = kokX; derinlik[kokX]++; }
    return true;
  }

  // Kenarları ağırlığa göre sırala (küçükten büyüğe)
  const siraliKenarlar = [];
  for (let i = 0; i < kenarlar.length; i++) {
    siraliKenarlar.push(kenarlar[i]);
  }
  siraliKenarlar.sort(function (a, b) { return a.agirlik - b.agirlik; });

  adimlar.push({
    pseudokodSatiri: 0,
    logMesaj: `Kruskal başlatıldı. ${siraliKenarlar.length} kenar sıralandı.`, logTur: 'bilgi'
  });
  var agirlikListesi = '';
  for (var j = 0; j < siraliKenarlar.length; j++) {
    if (j > 0) agirlikListesi += ', ';
    agirlikListesi += siraliKenarlar[j].agirlik;
  }
  adimlar.push({
    pseudokodSatiri: 1,
    logMesaj: 'Sıralama: ' + agirlikListesi
  });

  let mstKenarSayisi = 0;

  for (let i = 0; i < siraliKenarlar.length; i++) {
    const kenar = siraliKenarlar[i];

    adimlar.push({
      pseudokodSatiri: 4,
      logMesaj: `Kenar "${kenar.kaynak}→${kenar.hedef}" inceleniyor (ağırlık: ${kenar.agirlik}).`,
      kenarDurumlari: [{ kaynak: kenar.kaynak, hedef: kenar.hedef, durum: 'aktif' }]
    });

    if (birlestir(kenar.kaynak, kenar.hedef)) {
      // Döngü oluşturmaz, MST'ye ekle
      mstKenarSayisi++;
      adimlar.push({
        pseudokodSatiri: 6,
        logMesaj: `✓ MST'ye eklendi. (${mstKenarSayisi}. kenar)`, logTur: 'basari',
        kenarDurumlari: [{ kaynak: kenar.kaynak, hedef: kenar.hedef, durum: 'mst' }],
        dugumDurumlari: [
          { id: kenar.kaynak, durum: 'mst' },
          { id: kenar.hedef, durum: 'mst' }
        ]
      });

      // V-1 kenar bulununca MST tamamdır
      if (mstKenarSayisi === dugumler.length - 1) {
        adimlar.push({
          pseudokodSatiri: 8,
          logMesaj: 'MST tamamlandı! Yeterli kenar sayısına ulaşıldı.', logTur: 'basari'
        });
      }
    } else {
      // Döngü oluşturur, bu kenarı atla
      adimlar.push({
        pseudokodSatiri: 5,
        logMesaj: 'Döngü oluşur, kenar atlandı.', logTur: 'uyari',
        kenarDurumlari: [{ kaynak: kenar.kaynak, hedef: kenar.hedef, durum: 'tamamlandi' }]
      });
    }
  }

  adimlar.push({ pseudokodSatiri: 11, logMesaj: '🌳 Kruskal MST tamamlandı!', logTur: 'basari' });
  return adimlar;
}


//  BİLDİRİM 
function bildirimGoster(mesaj) {
  const kapsayici = document.getElementById('bildirimKapsayici');
  const el = document.createElement('div');
  el.className = 'bildirim-mesaji';
  el.textContent = mesaj;
  kapsayici.appendChild(el);
  // 3 saniye sonra kaldır
  setTimeout(function () { el.remove(); }, 3000);
}



//  UYGULAMA BAŞLATMA
//  Sayfa yüklendiğinde çalışan başlangıç işlemleri

window.addEventListener('DOMContentLoaded', function () {

  // Ana sayfadaki arka plan animasyonunu başlat
  arkaAnimasyonuBaslat();

  // Hız cetveli kaydırıldığında dolgu rengini güncelle
  const hizCetveli = document.getElementById('hizCetveli');
  if (hizCetveli) {
    hizCetveli.addEventListener('input', function () {
      const deger = this.value;
      const yuzde = ((deger - 1) / 9) * 100;
      this.style.background =
        `linear-gradient(to right, var(--vurgu-mavi) 0%, var(--vurgu-mavi) ${yuzde}%, var(--sinir2) ${yuzde}%)`;
    });
  }

});
