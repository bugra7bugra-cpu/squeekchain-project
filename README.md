# Squeek Live Companion

OBS yayınları için Squeekchain olaylarına tepki veren tarayıcı overlay'i ve kontrol paneli. React + TypeScript + Vite; backend, üyelik, cüzdan veya blockchain işlemi yok.

**Demo ve API modları ayrıdır.** Demo örnek olaylar üretir; API modu gerçek `/v1/events` yanıtlarını doğrular. Bu bulut ortamında önceki tek bağlantı denemesi 403 verdi; gerçek API/CORS ve gerçek OBS uygulaması henüz doğrulanmadı. API hatasında demo açılmaz veya bağlantı aktifmiş gibi gösterilmez.

## Kurulum ve kontroller

Node 24 LTS ve npm kullanın (testlerde Node'un TypeScript strip desteği gerekir).

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

Panel `/`, şeffaf overlay `/overlay` yolundadır. Statik barındırmada `/overlay` doğrudan açılışı için `index.html` SPA fallback gereklidir. Vercel Preview kullanıcı tarafından açıldı; URL ve bağımsız doğrulama sınırları aşağıdaki alfa regresyonu bölümünde.

## Yayıncı iş akışı

1. Tema, renk, dört köşeden konum ve 16–36 px yazı boyutunu seç.
2. Bildirim süresini **3–10 saniye**, bildirimler arasındaki sessiz beklemeyi **0–30 saniye** ayarla. Bekleme önceki bildirim kapandıktan sonra başlar. Süre değişikliği bir sonraki bildirimde uygulanır.
3. **Hesaplaşma tamamlandı** ve **Günlük mesafe kilometre taşı** tetikleyicilerini ayrı ayrı aç/kapat. Demo da aynı filtreleri ve kuyruğu kullanır. Kapatılan tür aktifse kaldırılır; bekleyenler de temizlenir.
4. Demo test butonu sırayla iki örnek olay üretir. Sık basarak kuyruğu deneyebilirsin. Kuyruk en fazla **5 bekleyen olay + ekrandaki olay** tutar; taşmada en eski bekleyen olay düşer, ekrandaki yarıda kesilmez. Aynı ID yeniden sıraya alınmaz.
5. Bağlantıyı kopyala; kopyalama izni yoksa URL alanını seçip elle kopyala. Ayarlar yerel saklanır; eski v1 URL/kayıtları yeni alanlara varsayılanlar eklenerek okunur. Bozuk ayarlar veya desteklenmeyen sürüm açıklayıcı hata verir.
6. OBS'de Kaynaklar → + → Tarayıcı ekle; URL'yi yapıştır, **1920×1080** kullan. Overlay demo modunda bağımsız olarak 8 saniyede bir örnek olay üretir; API modunda kendi salt okunur sağlayıcısını çalıştırır.
7. Ayar değiştirince **yeni URL'yi OBS'ye yapıştır**. OBS ile panelin localStorage alanı veya oturumu ortak varsayılmaz. Panel kapatılabilir; paneldeki test düğmesi OBS'ye komut yollamaz.

URL fragment'ı yalnızca izin verilen görünüm, süre, tetikleyici ve veri modu ayarlarını taşır. Gizli bilgi içermez. Demo etiketi panel ve overlay'de kalıcıdır. API seçimi bağlantı başarısı değildir: son doğrulanmış kontrol ve hata durumu görünür. Bildirimlerin HTML olarak yorumlanması, özel CSS/JS yükleme ve ses yok. Klavye odağı görünür; hareket azaltma tercihinde animasyon kapanır.

## API sözleşmesi ve sınırlar

Kaynak: https://docs.squeekchain.com/developers/api/ — aşağıdaki bilgiler kullanıcı tarafından başka ortamda doğrulanarak aktarıldı; bağımsız doğrulama iddiası yok.

- GET `https://api.squeekchain.com/v1/events?category=all&limit=40`; sayısal `schemaVersion: 3`, `status: available | unavailable`.
- Available yanıtı: `category: "all"`, string dizisi `activeEventTypes` ve `events` dizisi. Olaylar: string `id/type`, ISO 8601 `occurredAt`, tamsayı `eventVersion`.
- Tetikleyiciler: `system.settlement_completed` v2; `measurement.daily_distance_milestone` v1. Diğer tür/sürümler bildirim üretmez.
- Feed cache 5 saniye; her tamamlanan isteğin ardından 15 saniye polling beklemesi. Limit 5 istek/s, burst 20. Panel/overlay bağımsız tüketicidir.
- ETag/If-None-Match/304, 429/503 Retry-After ve hata geri çekilmesi desteklenir. HTTP 200 unavailable sıfır veri değildir. Son başarılı kontrolün 45 saniye geride kalması uygulama tercihi olarak stale sayılır.
- İlk yanıt ve kesinti sonrası ilk başarılı yanıt başlangıç noktasıdır; geçmiş olaylar topluca oynatılmaz. Hatalarda aktif/bekleyen canlı bildirimler temizlenir.
- Sağlayıcı ID geçmişi 2.000 kayıtla sınırlıdır; silinen kayıt zamanından eski olaylar tekrar oynatılmaz. Bu, çok geç gelen eski olayları da bastırabilir. Sayfalama alanları doğrulanmadığından parametre uydurulmadı; dönen feed sayfası işlenir.

## OBS'de kullanıcı tarafından yapılacak gerçek kullanım testi

Gerçek OBS bu ortamda kurulu değil. Chromium testleri OBS testi sayılmaz.

- Overlay'i OBS Browser Source olarak 1920×1080 ekle; altına renkli görüntü koy. Boş alanlarda alttaki görüntü görünmeli; demo etiketi görünür kalmalı.
- Panelden demo URL'si üret; iki tetikleyici, 3 ve 10 saniye süre, 0 ve 5 saniye bekleme, dört köşe ve yazı boyutunu dene. Her değişiklikte OBS URL'sini yenile.
- Paneli kapat; overlay örnek olayları üretmeye devam etmeli. Kaynağı yenile ve sahneyi değiştirip geri dön; OBS'nin kaynak kapatma/yenileme ayarına göre akışın yeniden başladığını kontrol et.
- Demo etiketi kayıt/çıktıda okunmalı; arka plan şeffaf, bildirimler kenarlardan taşmadan görünmeli. 1080p dışında kullandığın çözünürlükte de dene.
- API modunda bağlantı yokken hata görünmeli, örnek olay oynatılmamalı. Erişim olan ortamda ilk yanıt geçmişi oynatmamalı; yeni gerçek olay tek bildirim üretmeli. Bu son kontrol henüz yapılmadı.

## Vercel Preview hazırlığı (Faz 7)

`vercel.json`: Vite, `npm ci`, `dist` çıktısı; `/overlay` ve `/overlay/` → `/index.html` rewrite. Asset URL'leri rewrite edilmez. CSP yalnızca yerel scriptlere ve Squeekchain API bağlantısına izin verir; satır içi stiller React görünüm ayarları için açıktır. Referrer gönderilmez; kamera/mikrofon/konum kapalıdır. Bunlar gerçek Vercel'de henüz doğrulanmadı.

Git otomatik yayınları yalnızca `feat/faz4-demo` dalı için açıktır. Ek build koruması hem `VERCEL_ENV=preview` hem `VERCEL_GIT_COMMIT_REF=feat/faz4-demo` gerektirir; Production veya başka dal derlemesi bilinçli olarak başarısız olur. Gelecekte Production ancak ayrı kullanıcı onayıyla bu koruma değiştirilerek hazırlanabilir.

İlk hazırlık oturumunda Vercel aracı/CLI, token, CLI oturumu veya `.vercel/project.json` yoktu. Preview sonradan kullanıcı tarafından açıldı; bu ortamdan yönetim bağlantısı hâlâ mevcut değil. Vercel yetkisi güvenli bağlantı üzerinden sağlanmalı; token chat'e veya repoya yazılmamalı. `.vercel/` Git dışında tutulur.

Yetkili Vercel hesabında depoyu bağlayıp mevcut dal için hedefi **Preview** seçin; framework Vite, install `npm ci`, output `dist` olsun. Ücretli plan/servis açmayın. Oluşan Preview erişim korumasının OBS ve ayrı tarayıcı oturumunu engelleyip engellemediğini kontrol edin; otomatik olarak hesap güvenliği ayarlarını değiştirmeyin. Production veya Genesis gönderimi yapmayın.

Preview URL oluştuğunda `/`, doğrudan `/overlay`, `/overlay/` ve yenileme; URL'deki ayarların ayrı oturuma taşınması; arka plan şeffaflığı; mobil/masaüstü; CSP ve tarayıcı konsolu test edilmeli. API modu Preview kökeninden denenmeli: gerçek HTTP durumu, CORS, ETag erişimi ve doğrulanmış JSON sonucu ayrı kaydedilmeli. Yeni gerçek olay oluşmadıysa bildirim akışı doğrulanmış sayılmamalı.

Son güvenlik incelemesi: uygulama yalnızca GET API çağırıyor; dinamik HTML/JS yürütme, cüzdan, gizli anahtar, backend veya ödeme yok. Üretim bağımlılıklarında `npm audit --omit=dev` 0 zafiyet bildirdi. Yerel üretim çıktısı, Vercel rewrite/başlıklarını uygulayan test sunucusunda Chromium ile sınandı; bu Vercel deployment veya gerçek API/OBS testi değildir.

Genesis başvuru taslağı ve açık şartlar: [docs/GENESIS_BASVURU_HAZIRLIGI.md](docs/GENESIS_BASVURU_HAZIRLIGI.md).
Faz planı: [docs/FAZ_PLANI.md](docs/FAZ_PLANI.md). Production ve Genesis başvurusu gönderilmedi.


## Overlay alfa regresyonu

Kullanıcı tarafından açıldığı bildirilen Preview: https://squeek-live-companion-bo6p31a7w-bugra7bugra-4437s-projects.vercel.app/ . Bu ortamdan bağlantı 403 ile engellendi; yayımlanmış sürüm bağımsız doğrulanamadı.

Önceki CSS kontrolleri body/sahne şeffaflığını kontrol etmiş, `:root` koyu arka planını kaçırmıştı. Gerçek Chromium PNG'sinde hata önce **alpha=255** olarak yeniden üretildi. Düzeltme overlay modunda `html` öğesine `overlay-root` sınıfı ekler ve html/body/#root/sahne yüzeylerini şeffaf yapar; normal panelin kök arka planı korunur.

`tests/overlay.browser.mjs` ekran görüntüsünü `omitBackground:true` ile alıp PNG'yi çözerek gerçek piksel alfa kanalını kontrol eder; yalnızca computed CSS okumaz. Boş bölgelerde demo öncesi/sırası, yenileme, `/overlay/` ve sahte API hatasında **alpha=0**; panelde **alpha=255** doğrulandı. Bildirim kartının görünür piksel ürettiği, panodan alınan URL'nin tüm ayarları ayrı oturuma taşıdığı ve panel kapalıyken demo çalıştığı kontrol edildi. Bunlar yerel üretim çıktısı testleridir; gerçek OBS/Vercel/API kanıtı değildir.

Tarayıcı regresyonunu yeniden çalıştırmak için üretim build'ini `npm run preview -- --port 5180` ile açın. Playwright yalnızca test aracıdır; uygulama bağımlılığı değildir. Mevcut Playwright/Chromium kurulumunu kullanın veya testi checkout dışındaki geçici klasöre kurun:

```sh
npm install --prefix /tmp/squeek-browser playwright
SQUEEK_PLAYWRIGHT_MODULE=/tmp/squeek-browser/node_modules/playwright/index.mjs SQUEEK_CHROMIUM=/usr/bin/chromium node tests/overlay.browser.mjs
```

Chromium farklı konumdaysa `SQUEEK_CHROMIUM` değişkenini uyarlayın. `SQUEEK_TEST_URL` yerel test adresini değiştirir. Test, uygulamadaki ayarları değiştireceği için mevcut kullanıcı tarayıcısı yerine izole oturum açar ve API hata senaryosunda sahte 403 yanıtı kullanır.


## Parametreli events sorgusu düzeltmesi

Kullanıcı parametresiz endpoint'in `invalid_query`, `category=all&limit=40` sorgusunun ise geçerli JSON döndürdüğünü kendi tarayıcısında doğruladı. Sağlayıcı bu sabit parametreli adresi kullanır; testler ilk ve ETag'li isteklerin aynı URL'ye gitmesini kontrol eder. Available yanıtında category ve activeEventTypes alanları da doğrulanır; ek alanlar olay gösterimine aktarılmaz. Unavailable yanıtı boş feed olarak yorumlanmaz.

Fixture ve kaynak sınırı: [tests/fixtures/README.md](tests/fixtures/README.md). Şema, başlangıç, tekrar önleme, 304, 429, 503 ve kesinti sonrası toparlanma dahil 24 test geçti. Fixture'lı testler gerçek API erişimi değildir. Preview bu ortamdan tek denemede 403 verdi; sorun tekrar araştırılmadı. Kullanıcının doğrudan JSON erişimi doğrulaması, Preview kökeninden JavaScript fetch/CORS başarısı sayılmaz; o kontrol hâlâ bekliyor.


## HTTP 400 / invalid_query tanısı

Parametreli sorgunun uygulamada hâlâ 400 döndüğü kullanıcı tarafından bildirildi; URL kodlamasında hata bulunmadı. Navigasyon/fetch başlık farkının sunucuda neden olduğu henüz kanıtlanmadı; CORS kaynaklı olduğu varsayılmıyor. Uygulama artık HTTP kodunu ve güvenli kısa API hata kodunu gösterir (örneğin `HTTP 400 / invalid_query`). Bu, tanı iyileştirmesidir; gerçek API bağlantısını düzelttiği iddia edilmez. İnceleme ve sunucu ekibi için rapor: [docs/API_INVALID_QUERY_RAPORU.md](docs/API_INVALID_QUERY_RAPORU.md).

## Hamster Event Arena

`/arena` (ve `/arena/`) bağımsız, isteğe bağlı 60 saniyelik oyundur. Başlat/devam et, duraklat ve yeniden başlat düğmelerini kullanın. Ok tuşları/WASD ile hareket edin veya yön düğmelerine tıklayın. Her tohum 10 puan verir. Odak kaybolunca tur duraklar.

Varsayılan DEMO modunda örnek olay düğmeleri açıkça etiketlidir. Settlement 8 saniye çift puan, günlük mesafe olayı 8 saniye hız verir; aynı tür tekrar gelirse süre 8 saniyeye yenilenir. Canlı mod mevcut doğrulanmış sağlayıcıyı kullanır: başlangıç/geçmiş olaylar bonus üretmez. API hatası oyunu engellemez ve demo bonuslarına otomatik geçilmez. HTTP 400 / invalid_query çözülmedi. Tur duraklatıldığında oyun ve bonus süreleri donar; tur dışında gelen olaylar uygulanmaz.

OBS Browser Source URL'sine `/arena` adresini ekleyin, 1280×900 kullanın. Kaynağa sağ tıklayıp Interact/Etkileşim açın; oyun alanına odaklanıp klavye veya düğmelerle oynayın. Arena kendi opak sahnesini içerir. Gerçek OBS testi ve gerçek canlı olay etkisi doğrulanmadı.

Arena geliştirmesi için otomatik Vercel dal deployment'ı kapatıldı; bu commit için Preview/Production yayını yetkilendirilmedi.
