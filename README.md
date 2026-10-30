# Squeek Live Companion

Squeekchain temalı, OBS Browser Source için demo yayın aracı. **Bu sürüm yalnızca örnek veri kullanır; gerçek API, cüzdan veya blockchain işlemi içermez.**

## Geliştirme

Node.js 22.12+ veya 24 LTS ve npm gerekir (Node 24 ile doğrulandı).

```sh
npm ci
npm run dev
```

Terminalde verilen yerel adreste kontrol paneli, `/overlay` yolunda şeffaf overlay açılır.

```sh
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Kullanım

1. Tema, vurgu rengi, dört köşeden bildirim konumu ve 16–36 px yazı boyutunu seç.
2. **Demo olayını dene** ile örnek blok ve hamster bildirimlerini sırayla oynat. Bildirim 4,5 saniye görünür; yeni test öncekinin yerine geçer.
3. Overlay bağlantısını kopyala. Kopyalama izni yoksa bağlantı alanını seçip elle kopyala.
4. OBS'de Kaynaklar → + → Tarayıcı ekle. URL'yi yapıştır; genişlik 1920, yükseklik 1080 kullan.
5. Overlay kendi başına 8 saniyede bir örnek olay oynatır. **DEMO — örnek veri** etiketi yayında görünür kalır.

Ayarlar panelin tarayıcısında localStorage ile saklanır. OBS ayrı bir tarayıcı oturumudur: otomatik ayar eşitlemesi yoktur. Değişiklikten sonra yeni URL'yi OBS'ye yapıştır. Paneldeki test düğmesi OBS'ye komut göndermez. URL, yalnızca doğrulanan görünüm ayarlarını ve demo modunu fragment içinde taşır; gizli bilgi içermez. Desteklenmeyen veya bozuk URL ayarlarında overlay hata gösterir.

## Kontrol senaryoları

- Panelde demo düğmesine bas: örnek bildirim görünmeli ve sonra kaybolmalı.
- Ayarları değiştirip sayfayı yenile: seçimler korunmalı; URL değişmeli.
- Üretilen URL'yi ayrı tarayıcı oturumunda aç: panel kapalıyken örnek olaylar sürmeli; zemin şeffaf olmalı.
- 390 px mobil genişlikte panel yatay taşmamalı; tüm alanlar kullanılabilmeli.
- Bozuk fragment veya desteklenmeyen sürüm hata vermeli; bozuk yerel kayıt varsayılanlarla kurtarılmalı.
- Hareket azaltma tercihinde animasyon kapalı olmalı.

Faz 4'te Chromium ile panel, mobil, ayar saklama, kopyalama, bağımsız overlay, şeffaflık ve geçersiz ayar kurtarma kontrol edildi. Gerçek OBS uygulaması testi henüz yapılmadı. Canlı API davranışı test edilmedi; Faz 5 kapsamındadır.

## Yayınlama notu

Henüz deploy yapılmadı. Gelecekte statik sunucu, `/overlay` doğrudan açılışında `index.html` dosyasına SPA fallback sağlamalı. OBS'nin kullanacağı URL yayıncı bilgisayarından erişilebilir olmalı; bulut geliştirme ortamının localhost adresi yayıncının bilgisayarı değildir.

Faz kararları ve sonraki işler: [docs/FAZ_PLANI.md](docs/FAZ_PLANI.md).

## Faz 5 — canlı sağlayıcı

Panel ve bağımsız overlay aynı LiveDataProvider/hook akışını kullanır. Kullanıcının resmî API belgelerinden başka ortamda doğrulayarak aktardığı bilgilerle şu yapılandırma etkinleştirildi (burada bağımsız doğrulama yapılmadı):

- GET `https://api.squeekchain.com/v1/events`, sayısal `schemaVersion: 3`, `status: available | unavailable`.
- Olay alanları: string `id`, `type`, ISO 8601 `occurredAt`, sayısal tamsayı `eventVersion`.
- Tetikleyiciler: `system.settlement_completed` sürüm 2; `measurement.daily_distance_milestone` sürüm 1. Diğer tür/sürümler bildirim üretmez.
- Kaynak feed önbelleği 5 saniye; uygulama her tamamlanan isteğin ardından 15 saniye bekler. Bu, aktarılan 5 istek/saniye ve burst 20 sınırlarının altındadır (panel ve overlay ayrı tüketicidir).
- Uygulama tercihi olarak 45 saniye başarılı kontrol olmazsa stale gösterilir. Bu süre resmî API kuralı değildir.
- ETag/If-None-Match/304 desteklenir; 429 ve 503 durumlarında Retry-After (saniye veya HTTP tarihi) ve geri çekilme uygulanır. HTTP 200 unavailable boş olay listesi sayılmaz.
- İlk yanıt ve kesinti sonrası ilk başarılı yanıt başlangıç noktasıdır; geçmiş olaylar oynatılmaz. ID geçmişi en fazla 2.000 kayıt tutar. Silinen kayıtların zamanına veya öncesine ait olaylar tekrar oynatılmaz; bu bilinçli koruma çok geç gelen eski olayların da bastırılmasına neden olabilir.
- Canlı bağlantı hatasında otomatik demo açılmaz. Canlı modda demo test düğmesi devre dışıdır. Varsayılan mod demo olarak kalır.

`npm test` Node 24 ile 10 bağımlılıksız sağlayıcı testi çalıştırır. Yanıt örnekleri aktarılan API biçimini kullanır; olaylar kurgusaldır ve test süreleri kısaltılmıştır. Eşzamanlı gelen olayların sonuncusu mevcut tek bildirim alanında gösterilir; tam animasyon kuyruğu Faz 6 kapsamındadır.

API bağlantısı bu güncellemede **bir kez** denendi, HTTP 403 alındı. Gerçek API yanıtı, gerçek tarayıcı CORS bağlantısı ve canlı olayın uçtan uca gösterimi doğrulanamadı. Faz 5 canlı kabul kanıtı beklemededir. Sayfalama alanı doğrulanmadığından cursor/parametre uydurulmadı; yalnızca dönen feed sayfası işlenir.
