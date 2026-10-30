# Squeekchain Genesis — 7 fazlık proje planı

> Durum: Faz 7 Preview hazırlığı tamam; Vercel yetkisi ve gerçek kullanım kanıtı beklemede · 30 Ekim 2026
> Amaç: Squeekchain'e gerçekten bağlı çalışan bir ürün geliştirmek, yayınlamak ve Genesis Code Lane başvurusuna hazırlanmak.
> `AGENTS.md` kalıcı çalışma kurallarıdır; bu dosya **hangi sırayla ne yapacağımızı** anlatır.

## Şu an bildiklerimiz

- Kullanıcı Genesis'e kayıtlı; ekran görüntüsünde 3 rozet, 382 Aura ve Silver seviyesi var. Bunlar **geçmiş bir anın bilgileri**.
- Kullanıcı geliştirmeyi **tarayıcı üzerinden Codex + GitHub** ile yapmak istiyor; yerel Codex kurulumu şart değil.
- Resmî Squeekchain geliştirici belgeleri ve agent skill'i mevcut.
- Squeekchain public API'si **okuma amaçlı**; gerçek zincir işlemleri ayrı güvenlik kuralları gerektiriyor.
- Code Lane yalnızca basit veri panelleri yerine işe yarayan, özgün uygulamaları destekliyor (kullanıcının gösterdiği sayfa). Kesin başvuru ayrıntıları tekrar kontrol edilmeli.
- Hedef rozetler: The Tester ve The Buildooooor; Early Buildooooor yalnızca koşulları hâlâ sağlanıyorsa. Hiçbiri garanti değil.
- **Seçilen ürün: Squeek Live Companion.** Kullanıcı, olaylara tepki veren yayın aracı ve React + TypeScript + Vite seçimini onayladı. Ayrıntılı kapsam Faz 3 bölümünde.
- Kullanıcının son yönlendirmesi: Faz 1 ağ engeli nedeniyle ertelendi; Faz 2 kısmen araştırıldı. Eksik başvuru doğrulamaları gönderimden önce kapanacak. Aynı ağ engelleri tekrar araştırılmayacak.
- `AGENTS.md` içindeki ürün/teknoloji aday ifadeleri önceki planlama durumunu yansıtır; kullanıcının son seçimi bu planda kayıtlıdır. Diğer güvenlik ve çalışma kuralları geçerlidir.

## Çalışma kuralı

Bir seferde **tek faz**. Her faz sonunda kullanıcı sonucu inceler, onay verir ve ancak sonra yeni faz başlar. Bir faz içinde de küçük görevler açılabilir. Faz numarasını takip et, ancak takvime/ödül tarihine dair garanti verme.

## Faz 1 — Tester rozetini araştır ve güvenli denemeyi hazırla

**Amaç:** Tester rozetinin güncel koşullarını anlayıp, mümkünse güvenli bir Sepolia işlemiyle denemek.

Yapılacaklar:
1. Rozet açıklamasını ve varsa güncel resmî açıklamaları kontrol et.
2. Resmî deployment kaydından uygun sözleşmeyi doğrula; **rastgele sözleşme adresi kullanma**.
3. İşlem yapmadan önce ağ, çağrı, sıfır/gerçek değer, tahmini gas ve beklenen sonucu açıkla.
4. Onchain işlem gerekiyorsa önce simülasyon yap. Kullanıcı kendi cüzdanıyla açıkça onaylayana kadar işlem gönderme.
5. İşlem sonucunu zincir üzerinde; rozet durumunu ise Genesis profilinde ayrı ayrı kontrol et.

**Bitti sayılma şartı:** Şartlar ve denenen işlem belgelendi; işlem yapılmışsa hash/sonuç doğrulandı. Rozet verilmediyse "alındı" deme.

**Durum:** Ertelendi — ağ engeli; işlem ve rozet sonucu doğrulanmadı. Kullanıcının yeni yönlendirmesi olmadan yeniden araştırılmayacak.

## Faz 2 — Code Lane başvuru kurallarını doğrula

**Amaç:** Yanlış ürüne zaman harcamadan gerçek kabul kriterlerini öğrenmek.

Yapılacaklar:
1. `https://squeekchain.com/genesis/code` içindeki **How Building Works**, SSS ve **Submit Project** ekranını kontrol et.
2. Kullanıcıya gerekiyorsa sayfa ekran görüntüsü iste: özellikle form alanları ve açık SSS yanıtları.
3. Şunları netleştir: canlı demo URL'si, kaynak kodu/GitHub zorunluluğu, alan adı sahipliği, DNS/TXT doğrulaması, yeniden doğrulama, birden fazla proje, Swarm Review, inceleme süresi.
4. Buildooooor ve Early Buildooooor şartlarını ve başvuru anındaki güncel sayıları kontrol et.
5. Kesin olanlar ile hâlâ belirsiz olanları ayrı yaz.

**Bitti sayılma şartı:** Kullanıcının onayladığı, kanıta dayalı bir **başvuru kontrol listesi** var.

**Durum:** Kısmen araştırıldı (kullanıcı beyanı). Kesin kabul, form, sahiplik ve başvuru ayrıntıları gönderimden önce doğrulanacak; tamamlandı sayılmadı.

## Faz 3 — Squeek Live Companion: kesinleşen MVP

**Durum:** Planlama tamamlandı. Kullanıcı ürün, üç temel özellik ve teknolojiyi seçti; uygulama geliştirmesine henüz başlanmadı. Sonraki faz için ayrıca kullanıcı onayı gerekir.

**Hedef kullanıcı:** Squeekchain temalı yayın yapan OBS kullanıcısı. Yayıncı olayları tek tek takip edip manuel efekt açmak yerine, seçtiği tetikleyicileri yayınının görsel tepkilerine dönüştürür.

**Teknoloji:** React + TypeScript + Vite; statik tarayıcı uygulaması, CSS animasyonları. Küçük kapsam için backend, durum yönetimi kütüphanesi veya animasyon paketi gerekmiyor. Cüzdan bağlantısı yok.

### Üç temel özellik ve kabul ölçütleri

1. **Olaya tepki veren animasyon ve bildirim:** Resmî API'nin doğrulanmış şemasının sunduğu en az bir gerçek olay/değişim, kısa görsel efekt ve metin bildirimi üretir. İlk sürüm en fazla iki tetikleyici türü içerir; hangileri olduğu Faz 5'te gerçek şemaya göre seçilir. Blok ilerlemesi veya hamster durum değişimi yalnızca adaydır; endpoint ve alan adları henüz doğrulanmadı. Aynı olay tekrar geldiğinde yeniden oynatılmaz. Kullanıcı tetikleyiciyi kapatabilir; bildirim süresi ve minimum aralığı ayarlanabilir. Ses ilk sürümde yok.
2. **Kontrol paneli ve önizleme:** Tema (açık/koyu), vurgu rengi, bildirim konumu (dört köşe), yazı boyutu, süre ve tetikleyici aç/kapat ayarları. Efekt biçimi ilk sürümde tek bir kısa animasyonla sınırlı. Demo test düğmesi, veri durumu ve son güncelleme zamanı görünür. Ayarlar yerel olarak saklanır; farklı cihazlara otomatik eşitleme yok.
3. **OBS overlay sayfası:** Şeffaf arka planlı, ayrı `/overlay` sayfası ve kopyalanabilir yapılandırılmış URL. 1920×1080 yayın alanı temel alınır; diğer boyutlarda taşma kontrol edilir. Kontrol paneli kapanınca overlay kendi veri akışıyla çalışır. Demo/bağlantı durumu yayına da görünür şekilde yansır; kaynağın durumu gizlenmez.

### Code Lane ile uyum: mevcut kanıt ve sınır

Mevcut plandaki, kullanıcının daha önce gösterdiği sayfaya dayanan bilgiye göre Code Lane işe yarayan özgün uygulamaları hedefler. Bu ürünün somut işi, olayları yayın efektine dönüştürmek ve OBS'ye kullanılabilir kaynak vermektir. Squeekchain verisi görünür davranışı belirlediği için bu hedefle uyumlu bir adaydır.

Bu bir kabul doğrulaması değildir: güncel tam kriterler, özgünlük değerlendirmesi, form ve sahiplik gereklilikleri bağımsız doğrulanmış değil. Gönderimden önce Faz 2 eksikleri kapanmalı. Yalnızca demo verili sürüm gerçek entegrasyonun kanıtı sayılmaz; en az bir doğrulanmış canlı tetikleyici ve OBS'de çalışma kanıtı gerekir. Rozet veya kabul garantisi yok.

### Ekranlar ve sorumluluklar

| Ekran / bileşen | Görev |
|---|---|
| `/` — ControlPanel | Ayarlar, canlı/demo seçimi, önizleme ve OBS kurulum yönergesi |
| AppearanceControls / TriggerControls | Sınırları doğrulanan görünüm ve bildirim ayarları |
| ConnectionStatus | Yükleniyor, veri yok, unavailable, hata, gecikmiş ve güncel veri durumları |
| OverlayPreview / AlertRenderer | Gerçek overlay ile aynı çizim mantığı; önizlemede demo tetikleme |
| ObsSetup | Overlay URL'sini üretme/kopyalama; OBS Browser Source'a ekleme, boyut ve yenileme adımları |
| `/overlay` — OverlayPage | Şeffaf sahne, sınırlı bildirim kuyruğu, küçük veri kaynağı/durum etiketi |
| DataSource / EventEngine | Canlı veya demo sağlayıcı, normalleştirme, tekrar önleme ve tetikleyici kuralları |

### Veri ve ayar akışı

- Panel ayarları → doğrulanan, sürümlü yapılandırma → panel önizlemesi + localStorage. Gizli bilgi saklanmaz.
- OBS URL'sinin fragment kısmı yalnızca görünüm, tetikleyici ve veri modu yapılandırmasının anlık kopyasını taşır; RPC, anahtar, cüzdan adresi veya özel metin taşımaz. Alanlar izin listesi ve boyut sınırıyla doğrulanır; bilinmeyen sürümde anlaşılır hata gösterilir.
- OBS'nin tarayıcı depolaması panelden farklı olabilir. Bu yüzden localStorage/BroadcastChannel ile OBS'ye canlı eşitleme varsayılmaz. Ayar değişince yeni URL kopyalanıp OBS kaynağına yapıştırılır. Panel bunu açıkça anlatır.
- Canlı sağlayıcı → şema doğrulama → normalleştirilmiş olay/değişim → EventEngine → sınırlı kuyruk → ortak AlertRenderer. Veri kaynağı ve zaman damgası bu akışta korunur.
- İlk bağlantı anındaki veri başlangıç noktasıdır; eski olaylar topluca efekt üretmez. Poll sonuçları çakışmaz; tekrarlar resmî olay kimliğiyle, yoksa doğrulanmış kararlı alanlarla ayıklanır. Yeniden bağlantıda geçmiş bildirim yağmuru önlenir. Kuyruk en fazla 5 öğe tutar; taşan eski bildirimler düşürülür.
- Panel açıkken tek sağlayıcı önizlemeyi besler; bağımsız OBS sayfası kendi sağlayıcısını kullanır. Her tüketici belgelenmiş hız sınırlarına uyar. Poll aralığı ve gecikmiş sayılma eşiği Faz 5'te resmî güncelleme sıklığına göre belirlenir; uydurma canlılık iddiası yok.
- Canlı API için yayımlanan şema, schemaVersion, büyük tamsayılar, sayfalama ve ETag kuralları uygulanır. `429` durumunda Retry-After ve sınırlı geri çekilme kullanılır; sürekli hızlı tekrar yok. `unavailable` sıfır veri değildir. Son geçerli görüntü gecikmiş olarak işaretlenir ve yeni efekt üretimi durur.
- Tarayıcıdan CORS/kimlik doğrulama desteği Faz 5'in ön koşuludur. Destek yoksa demo geliştirmesi sürer; kullanıcı onayı olmadan proxy/backend veya ağ aşma yöntemi eklenmez. Mevcut ağ engelini tekrar araştırmak ayrı görev değildir.

### Açıkça etiketlenmiş demo modu

- API erişimi olmadan panel, önizleme ve OBS akışını geliştirmek için yerel, deterministik örnek olay dizisi kullanılacak. Bu, resmî API yanıtı olduğu iddia edilmeyen uygulama içi test verisidir.
- Panel ve overlay üzerinde kalıcı **“DEMO — örnek veri, canlı değil”** etiketi bulunur. OBS URL'si demo modunu açıkça taşır; yenilemede etiket kaybolmaz.
- Kullanıcı demo modunu seçer; canlı bağlantı hatasında sessizce demoya geçilmez. Hata ve “Demo modunu aç” seçeneği gösterilir.
- “Demo bildirimi dene” eylemi gerçek olay geçmişine eklenmez. Canlı moddaki önizleme testleri panelde kalır; OBS'ye gerçek olay gibi gönderilmez.
- Canlı/demo geçişinde başlangıç noktası, kuyruk ve tekrar kayıtları temizlenir; örnek veri gerçek olaylarla karışmaz. Demo doğrulaması Faz 5 canlı entegrasyonunu tamamlamaz.

### Kapsam dışında

Üyelik, veritabanı/backend, ücretli servis, cüzdan bağlantısı, blockchain işlemi, token/NFT/ödeme, rozet claim işlemi, sohbet botu, OBS eklentisi/WebSocket kontrolü, çok kullanıcılı eşitleme, özel HTML/JS/CSS yükleme, ses dosyası yükleme, sınırsız efekt editörü ve veri dashboard/explorer özellikleri yok. OBS'ye URL'yi yayıncı elle ekler. Deploy ve başvuru Faz 7 kapsamındadır.

## Faz 4 — Asgari geliştirme iskeleti

**Durum:** Kullanıcı onayıyla demo sürüm uygulandı. React + TypeScript + Vite; panel, bağımsız overlay, ayar saklama/URL ve manuel demo tetikleyici mevcut. Canlı API yok. TypeScript, ESLint ve build geçti; Chromium masaüstü/mobil ve bağımsız overlay kontrolleri yapıldı. Gerçek OBS testi bekliyor.

1. Mevcut checkout ve kullanıcı değişikliklerini koruyarak React + TypeScript + Vite iskeletini ve kilitli bağımlılıkları oluştur; `.gitignore` ekle. Mevcut izole ortamı kullan, ayrıca worktree oluşturma.
2. `/` ve `/overlay` ekran kabuklarını, ortak yapılandırma tipini ve doğrulama sınırlarını hazırla. Statik barındırmada overlay yolunun açılması için yayınlama gereksinimini kaydet.
3. API'den bağımsız, açık etiketli deterministik demo sağlayıcı ve en küçük önizleme akışını kur. Bu aşamada canlı endpoint uydurma.
4. Geliştirme, lint, tür kontrolü ve build komutlarını belgele ve çalıştır. Gerekli ayar yoksa `.env.example` veya yeni paket ekleme. Resmî skill kurulumu bu görevin ön koşulu değil; yeni ağ araştırması yapılmaz.

**Bitiş kanıtı:** İki ekran yerelde açıldı; demo etiketi, elle tetikleme, ayar kalıcılığı, kopyalama, ayrı tarayıcıda şeffaf overlay, geçersiz ayar kurtarma ve mobil taşma kontrol edildi. İlk mobil taşma hatası düzeltildi. TypeScript, ESLint ve üretim build başarılı. Yerel kullanım adımları README.md içinde. Henüz canlı entegrasyon veya gerçek OBS testi iddiası yok. Faz 5 başlamadı.

## Faz 5 — Doğrulanmış veri sağlayıcı ve tetikleyici

**Durum:** Canlı yapılandırma kullanıcının başka ortamda resmî API belgesinden doğrulayarak aktardığı bilgilerle etkinleştirildi; bağımsız kaynak doğrulaması iddia edilmiyor. schemaVersion=3 (number), available/unavailable, eventVersion kontrolü ve iki tetikleyici: system.settlement_completed v2 / measurement.daily_distance_milestone v1. Polling 15 saniye; feed cache 5 saniye, limit 5 istek/s burst 20. Stale eşiği uygulama tercihi olarak 45 saniye. ETag/304, 429 ve 503 Retry-After, hata geri çekilmesi, başlangıç/kesinti sonrası geçmişi atlama korunuyor. ID geçmişi 2.000 ile sınırlı; silinen zaman aralığındaki eski olaylar tekrar oynatılmaz. Demo modu korunuyor. On kurgusal API yanıtlı sağlayıcı testi, TypeScript, lint ve build geçti. Tek canlı API isteği HTTP 403 verdi; gerçek bağlantı/CORS ve olayın uçtan uca gösterimi doğrulanamadı. Bu nedenle Faz 5'in canlı kabul kanıtı beklemede; Faz 5 kod tarafı kullanıcı tarafından onaylandı; gerçek API kabul kanıtı hâlâ beklemede. Sayfalama alanları bilinmediği için uydurulmadı.

1. Erişilebilir resmî belgeler veya açıkça aktarılmış kaynak kaydı üzerinden gereken en az endpoint, şema, olay kimliği, veri tazeliği ve tarayıcı erişim gerekliliklerini belirle. Bilinmeyenleri engel olarak kaydet; aynı ağ engelini tekrar araştırma.
2. Canlı sağlayıcıyı demo sağlayıcıyla ortak arayüze bağla; çalışma zamanı şema doğrulaması, büyük tamsayılar, önbellek ve hız sınırlarını uygula.
3. En az bir doğrulanmış gerçek tetikleyiciyi bağla; başlangıç, tekrar, yeniden bağlantı, gecikmiş/unavailable ve hata durumlarını uygula.
4. Erişim varsa temsilî canlı istek ve olay akışını doğrula. Yoksa demo ile geliştirmeyi sürdür, canlı kontrolü **çalıştırılmadı/bloke** olarak kaydet; Faz 5'i tamamlandı sayma.

**Bitiş kanıtı:** Gerçek veriyle en az bir tetikleyici, şema ve hata testleri; canlı kontrol sonucu ayrı kayıtlı.

## Faz 6 — Yayıncı iş akışını tamamla

**Durum:** Kullanıcı onayıyla uygulandı. Beş bekleyen olay + aktif bildirim kuyruğu, taşmada en eski bekleyeni düşürme, 3–10 sn süre ve 0–30 sn sessiz aralık, iki bağımsız tetikleyici filtresi eklendi. Aynı ayarlar demo, önizleme ve bağımsız overlay üzerinde ortak kuyruk/çizim mantığıyla uygulanır. Mod değişimi ve canlı hatası kuyruğu temizler. API seçimi bağlantı başarısı sayılmaz; doğrulanmayan bağlantıda “API bağlantısı doğrulanmadı” gösterilir. Arayüz, piksel animasyonu, klavye odağı, reduced-motion ve mobil görünüm iyileştirildi; yeni kütüphane eklenmedi. Eski v1 URL/kayıtları yeni varsayılanlarla taşınır; geçersiz alanlar reddedilir.

**Kontrol kanıtı:** 17 birim testi (10 sağlayıcı + 7 kuyruk/ayar), TypeScript, ESLint ve build başarılı. Chromium masaüstü/mobil: süre/aralık, kuyruk, tetikleyiciler, mod geçişi, sahte API hatası, saklama, URL, klavye, reduced-motion, şeffaflık ve panel kapalı bağımsız demo doğrulandı. Sahte API yanıtı gerçek bağlantı kanıtı değildir. 403 tekrar araştırılmadı. Gerçek OBS kurulu değil; README'de yayıncı test listesi var. Gerçek API olayı ve gerçek OBS yayını doğrulanmadığı için uçtan uca kabul beklemede. Faz 6 kod tarafı kullanıcı tarafından onaylandı; Faz 7 hazırlığına geçildi.

1. **6A:** Kontrol paneli, tema/renk/konum/boyut ayarları ve ortak önizlemeyi tamamla; ayarları sürümlü sakla.
2. **6B:** Efekt, bildirim kuyruğu, süre/minimum aralık ve tetikleyici aç/kapat davranışını tamamla. Hareket azaltma tercihini destekle; hızlı yanıp sönen efekt kullanma.
3. **6C:** Güvenli fragment yapılandırmalı overlay URL'sini, kopyalama ve OBS yönergelerini tamamla; ayrı tarayıcı oturumunda açılmasını doğrula.
4. **6D:** Mobil panel, klavye erişimi, şeffaf sahne, veri kaynağı/durum etiketleri ve demo/canlı geçişlerini kontrol et. Dış kaynaklı metinleri HTML olarak çalıştırma.
5. **6E:** Tekrarlanan olay, kuyruk taşması, geçersiz URL ayarı, yenileme, API kesintisi/429 ve mod değişimi için anlamlı testler; lint/tür kontrolü/build. Gerçek OBS Browser Source testi kullanıcı ortamında yapılacak; tarayıcı önizlemesi OBS testi diye raporlanmayacak.

**Bitiş kanıtı:** Yayıncı ayarı yapar, önizler, URL'yi OBS'ye ekler ve doğrulanmış gerçek olayın efektini görür. Canlı veri veya OBS testi eksikse ilgili kanıt beklemede kalır. Sonraki faza otomatik geçilmez.

## Faz 7 — Son test, yayın, doğrulama ve başvuru

**Amaç:** Ürünü gerçek kullanıcıların açabileceği şekilde sunmak ve rozet başvurusunu tamamlamak.

Yapılacaklar:
1. Mobil/masaüstü ve temel hata senaryolarını test et; gerekli düzeltmeleri yap.
2. README'ye ürünün ne yaptığını, nasıl kullanılacağını ve kurulum adımlarını yaz.
3. Kullanıcı onayıyla GitHub'a gönder ve uygun barındırma hizmetinde yayınla (ör. Vercel).
4. Canlı URL'nin çalıştığını, erişilebilir olduğunu ve Squeekchain bağlantısının gerçek olduğunu kontrol et.
5. Faz 2'de doğrulanan koşullara göre alan adı/proje sahipliğini kullanıcıyla birlikte doğrula.
6. Kullanıcının açık onayından sonra Code Lane üzerinden başvur; varsa başvuru sonucu/ID'yi kaydet.
7. Rozet ve olası Swarm Review sonucunu **canlı profilden** kontrol et. Gecikme veya ret varsa gerekçeyi kaydet, garanti verme.

**Bitti sayılma şartı:** Canlı uygulama URL'si ve temel test kanıtları mevcut; başvuru kullanıcı tarafından onaylanmış ve gönderilmiş (veya açıkça bloke olarak raporlanmış). Rozet sonucu ayrı takip edilir.

**Durum:** Kullanıcı yalnızca Preview yayını ve test hazırlığına izin verdi. Vercel rewrite, güvenlik başlıkları ve Preview/dal build koruması hazır; AGENTS.md ürün/teknoloji ifadeleri güncellendi. README ve docs/GENESIS_BASVURU_HAZIRLIGI.md başvuru taslağı/açık şartları içeriyor. Vercel aracı/token/oturum/proje bağlantısı bulunmadığından Preview oluşturulamadı. 20 test, TypeScript, ESLint ve build geçti; üretim bağımlılıkları audit sonucu 0 zafiyet. Yerel üretim çıktısı Vercel rewrite/başlık simülasyonuyla Chromium masaüstü/mobilde sınandı; /, /overlay ve /overlay/ doğrudan açılış ve yenilemeleri, URL ayarları ve şeffaflık geçti. Preview dalı build komutu başarılı; Production/başka dal koruması test edildi. Bunlar yayımlanmış uygulama testi değildir. Gerçek API testi yayımlanmış köken olmadan yapılamadı; eski 403 kanıtı geçerli, tekrar araştırılmadı. Gerçek OBS testi bekliyor. Merge, Production, DNS ve Genesis başvurusu yapılmadı; Faz 7 tamamlandı sayılmaz.

---

## Karar kaydı ve kalan doğrulamalar

| Konu | Karar / kalan iş | Faz |
|---|---|---|
| Ürün ve hedef kullanıcı | Squeek Live Companion; OBS kullanan yayıncı | 3 — kesinleşti |
| MVP | Olaya tepki, ayar/önizleme paneli, bağımsız OBS overlay | 3 — kesinleşti |
| Teknoloji | React + TypeScript + Vite; statik frontend | 3 — kesinleşti |
| Veri saklama / eşitleme | Yerel ayarlar + OBS URL yapılandırma kopyası; backend yok | 3 — kesinleşti |
| Gerçek tetikleyiciler | Aktarılan şemaya göre iki tür/sürüm bağlı; gerçek API yanıtıyla doğrulama bekliyor | 5 — kullanım kanıtı açık |
| Code Lane kabul / form / domain / DNS | Kısmi bilgi; gönderimden önce doğrulanmalı | 2 / 7 — açık |
| Tester / sözleşmeler | Ağ engeli nedeniyle ertelendi; MVP blockchain işlemi içermiyor | 1 — ertelendi |
| Rozetler ve erken sıra | Garanti yok; güncel profil ve koşullar gerekli | 7 — açık |

## Resmî kaynaklar

- Genesis Code: https://squeekchain.com/genesis/code
- Geliştirici belgeleri: https://docs.squeekchain.com/developers/
- Agent skill: https://docs.squeekchain.com/developers/build-with-ai/
- API: https://docs.squeekchain.com/developers/api/
- Quickstart: https://docs.squeekchain.com/developers/quickstart/

## Codex'e verilecek ilk görev

Bu dosyaları GitHub deposuna koyduktan sonra şunu gönder:

> Depodaki AGENTS.md ve docs/FAZ_PLANI.md dosyalarını oku. Şimdilik kod yazma, paket kurma, commit/push yapma veya işlem gönderme. Sadece Faz 1'i salt-okunur araştırma olarak ele al: The Tester rozetinin güncel şartlarını ve resmî Squeekchain belgelerinden doğrulanabilir, güvenli işlem seçeneklerini araştır. Sözleşme adresi veya ABI uydurma. İşlem gerekiyorsa ne yapılacağını ve simülasyon adımlarını açıkla, ama benim açık onayım olmadan hiçbir işlem hazırlayıp imzalamaya veya göndermeye çalışma. Sonucu sade Türkçe anlat ve Faz 2'ye geçme.


## Faz 7 — Preview sonrası overlay düzeltmesi

Kullanıcı Preview yayınının açıldığını, panel ve demoların çalıştığını bildirdi. Verilen Preview URL README içinde kayıtlı; bu ortamın erişimi HTTP 403 ile engellendi. Gerçek API tek kez sorgulandı, yine 403 verdi; tekrar denenmedi.

Önceki şeffaflık kanıtı yalnızca CSS yüzeylerini kapsıyordu ve html/:root arka planını kaçırmıştı. Chromium PNG piksel testinde opaklık alpha=255 olarak yeniden üretildi. `html.overlay-root` sınıfı ve kök yüzey stilleriyle düzeltildi. Boş overlay bölgelerinde alpha=0, normal panelde alpha=255; görünür bildirim, özelleştirilmiş URL'nin ayrı oturumda açılması ve panel kapalı demo akışı gerçek PNG/tarayıcı üzerinden doğrulandı. Regresyon: tests/overlay.browser.mjs. Gerçek OBS ve yeni Vercel deployment doğrulaması erişim gerektiriyor; production/merge/Genesis gönderimi yapılmadı.


## Faz 7 — Parametreli events sorgusu düzeltmesi

Kullanıcının kendi tarayıcısında doğruladığı `GET /v1/events?category=all&limit=40` adresi sağlayıcıda kullanılıyor; parametresiz çağrı kaldırıldı; bu değişikliğin uzaktaki invalid_query sorununu çözdüğü bağımsız doğrulanmadı. Available yanıtında category=all ve activeEventTypes:string[] doğrulaması eklendi. schemaVersion=3, gerekli olay alanları, başlangıç/baseline, ID tekrar önleme, ETag/304, 429/503 Retry-After ve hata toparlanması korunuyor.

Aktarılan gerçek örnek yapısının minimal fixture'ı eklendi; paylaşılmayan ID kurgusal test ID'si olarak açıkça belgelendi. 24 test, TypeScript, lint ve build geçti. Preview erişimi bir kez denendi, ağ vekilinde 403 verdi; yayımlanan kökenden gerçek API isteği yapılamadı. Doğrudan JSON erişimi ile JavaScript fetch/CORS doğrulaması ayrı tutuluyor; gerçek yeni olayın gösterimi henüz doğrulanmış değil. Yeni özellik, merge, production veya başvuru yok.


## Faz 7 — HTTP 400 invalid_query teşhisi

Kullanıcı parametreli GET için de HTTP 400/error=invalid_query, aynı URL navigasyonu için başarılı JSON bildirdi. Kod ve URL testleri query bozukluğu bulmadı. Tek kontrollü uzak istek API'ye ulaşmadan ağ vekilinde 403 aldı; daha fazla header/query denemesi yapılmadı. Yerel Chromium karşılaştırması Origin ve Accept farkını gösterdi; bunun uzak sunucudaki neden olduğu doğrulanmadı. CORS kök neden olarak varsayılmadı; no-cors/proxy/header taklidi eklenmedi.

Uygulamada HTTP durum kodu ve kısa API hata kodu görünürlüğü iyileştirildi; sunucu metni güvenli sınırlarla okunuyor. 28 test, TypeScript, lint, build ve Chromium alfa/URL/demo/hata regresyonu geçti. Sunucu ekibi raporu docs/API_INVALID_QUERY_RAPORU.md içinde. Canlı API sorunu çözülmüş sayılmaz; sonraki adım hassas bilgilerden arındırılmış başarılı navigasyon/başarısız fetch kayıtlarının sunucu loglarıyla karşılaştırılmasıdır. Merge, production ve başvuru yok.

## Onaylı ek görev — Hamster Event Arena

Kullanıcı /arena mini oyununu, testlerini ve mevcut dalda commit/push işlemini onayladı. 60 saniyelik puan toplama, klavye/ekran kontrolleri, duraklatma/sıfırlama ve iki olayın 8 saniyelik puan/hız etkisi bağımsız mod olarak eklendi. Demo açık etiketlidir; canlı API sorunu çözülmüş sayılmaz. Deploy yasaklandığı için dalın otomatik Vercel deployment ayarı kapatıldı. Gerçek OBS ve gerçek API kabul kanıtı bekliyor.

Kontrol: 32 test geçti (Windows Bash testi sandbox dışında); TypeScript, lint ve build başarılı. Chromium etkileşim testi bu oturumda çalıştırılmadı. Gerçek API/OBS doğrulaması bekliyor.

## Arena son doğrulama — 30 Ekim 2026

Kullanıcının onayladığı tamamlayıcı görev: panelden Arena bağlantısı, mobil basılı yön kontrolü, kontrol düğmelerinin zamanı fazladan azaltması hatasının giderilmesi, klavye odağı, sekme gizlenmesi/blur ile duraklama, canlı hata halinde bonus temizliği. Chromium gerçek fetch çağrısının provider nesnesine bağlanması nedeniyle ağdan önce hata verdiğini ortaya çıkardı; istek sarmalayıcısıyla düzeltildi. Bu, uzaktaki HTTP 400/invalid_query hatasının çözümü değildir.

Yerel üretim çıktısında Playwright + Chrome: panelden Arena erişimi, klavye/puan, tam 60 sn (sanal saat), duraklat/sıfırla, demo bonus/sona erme, sahte HTTP 400 ile oynanabilirlik, odak kaybı, 390 px mobil basılı yön/bırakma/taşma ve /arena/ yenileme geçti. Mevcut overlay regresyonu: PNG alfa, bağımsız demo, URL ayarları ve sahte API hatası geçti. Gerçek API/OBS/Vercel kanıtı değildir. Tarayıcı test aracı checkout dışında; uygulama bağımlılığı eklenmedi.

Preview hazırlığı mevcut; bu ortamda Vercel CLI/oturum/proje bağlantısı veya VERCEL değişkeni yok. Otomatik deployment kapalı ve Production build koruması korunuyor. Kullanıcı mevcut projeye yetkili hesapla yalnızca Preview yayınlayabilir; README yönergesi var. Gerçek OBS Interact ve canlı olay etkisi, sunucu hata incelemesi, güncel başvuru koşulları açık. Main merge, Production ve Genesis gönderimi yapılmadı.

Son kalite kapısı: 35/35 birim testi, TypeScript, ESLint, üretim build ve diff kontrolü başarılı. npm audit --omit=dev: 0 zafiyet. Arena + overlay Chromium etkileşim/regresyon testleri başarılı.
