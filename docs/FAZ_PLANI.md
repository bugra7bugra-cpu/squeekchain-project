# Squeekchain Genesis — 7 fazlık proje planı

> Durum: Taslak v1 · 30 Ekim 2026
> Amaç: Squeekchain'e gerçekten bağlı çalışan bir ürün geliştirmek, yayınlamak ve Genesis Code Lane başvurusuna hazırlanmak.
> `AGENTS.md` kalıcı çalışma kurallarıdır; bu dosya **hangi sırayla ne yapacağımızı** anlatır.

## Şu an bildiklerimiz

- Kullanıcı Genesis'e kayıtlı; ekran görüntüsünde 3 rozet, 382 Aura ve Silver seviyesi var. Bunlar **geçmiş bir anın bilgileri**.
- Kullanıcı geliştirmeyi **tarayıcı üzerinden Codex + GitHub** ile yapmak istiyor; yerel Codex kurulumu şart değil.
- Resmî Squeekchain geliştirici belgeleri ve agent skill'i mevcut.
- Squeekchain public API'si **okuma amaçlı**; gerçek zincir işlemleri ayrı güvenlik kuralları gerektiriyor.
- Code Lane yalnızca basit veri panelleri yerine işe yarayan, özgün uygulamaları destekliyor (kullanıcının gösterdiği sayfa). Kesin başvuru ayrıntıları tekrar kontrol edilmeli.
- Hedef rozetler: The Tester ve The Buildooooor; Early Buildooooor yalnızca koşulları hâlâ sağlanıyorsa. Hiçbiri garanti değil.
- **Ürün seçimi henüz yapılmadı**. İlk aday: Squeek Live Companion (olaylara tepki veren interaktif yayın/OBS aracı).

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

**Durum:** [ ] Başlanmadı

## Faz 2 — Code Lane başvuru kurallarını doğrula

**Amaç:** Yanlış ürüne zaman harcamadan gerçek kabul kriterlerini öğrenmek.

Yapılacaklar:
1. `https://squeekchain.com/genesis/code` içindeki **How Building Works**, SSS ve **Submit Project** ekranını kontrol et.
2. Kullanıcıya gerekiyorsa sayfa ekran görüntüsü iste: özellikle form alanları ve açık SSS yanıtları.
3. Şunları netleştir: canlı demo URL'si, kaynak kodu/GitHub zorunluluğu, alan adı sahipliği, DNS/TXT doğrulaması, yeniden doğrulama, birden fazla proje, Swarm Review, inceleme süresi.
4. Buildooooor ve Early Buildooooor şartlarını ve başvuru anındaki güncel sayıları kontrol et.
5. Kesin olanlar ile hâlâ belirsiz olanları ayrı yaz.

**Bitti sayılma şartı:** Kullanıcının onayladığı, kanıta dayalı bir **başvuru kontrol listesi** var.

**Durum:** [ ] Başlanmadı

## Faz 3 — Ürünü seç, MVP'yi kesinleştir

**Amaç:** Küçük ama gerçek işe yarayan tek bir ürün kararlaştırmak.

Öncelikli aday: **Squeek Live Companion** — Squeekchain'in canlı durumuna ve olaylarına tepki veren, özelleştirilebilir bir yayın/OBS aracı. Bu **taslak fikir**, seçilmiş ürün değil.

Alternatifler:
- Hamster hareketlerine bağlı mini oyun
- Sepolia'da doğrulanmış işlemleri kullanıcı onayıyla hazırlayan etkileşim aracı

Karar verirken:
1. Kullanıcı kim? Neyi gerçekten yapabilecek?
2. Squeekchain verisi ürünün işlevini **nasıl değiştiriyor**?
3. İlk sürümün en fazla 2–3 temel özelliği ne?
4. Ne **yapmayacağız**? (üye sistemi, ödeme, NFT mintleme, token çıkarma vb. gereksizse yok)
5. Seçilen teknoloji ne? Basit frontend için React + TypeScript + Vite başlangıç adayı.
6. Code Lane kriterlerine gerçekten uyuyor mu?

**Bitti sayılma şartı:** Kullanıcı tek bir proje fikrini, hedef kullanıcıyı, 2–3 MVP özelliğini ve teknoloji seçimini onayladı. Kısa bir MVP tanımı plana işlendi.

**Durum:** [ ] Başlanmadı

## Faz 4 — GitHub ve Codex çalışma ortamını kur

**Amaç:** Bulut Codex'in doğru dosyaları okuduğu, temiz bir başlangıç oluşturmak.

Yapılacaklar:
1. GitHub deposunu oluştur veya mevcut boş depoyu belirle.
2. `AGENTS.md` dosyasını **depo köküne**, bu planı `docs/FAZ_PLANI.md` konumuna koy.
3. Tarayıcıdaki Codex çalışma alanına doğru GitHub deposunu bağla.
4. Resmî Squeekchain skill'ini desteklenen ortamda kur (`npx skills add https://docs.squeekchain.com`); kurulamıyorsa resmî dokümanlarla ilerle.
5. Ürün seçimine göre asgari iskeleti, `.gitignore` ve gerekliyse `.env.example` dosyasını oluştur.
6. Basit geliştirme komutlarının çalıştığını kontrol et.

**Bitti sayılma şartı:** Codex dosyaları okuyabiliyor; depo ve temel build/test akışı çalışıyor. Henüz özellik geliştirme yok.

**Durum:** [ ] Başlanmadı

## Faz 5 — Resmî Squeekchain verisini bağla

**Amaç:** Uygulamanın gerçek Squeekchain verisine güvenilir biçimde bağlanması.

Yapılacaklar:
1. Seçilen ürün için gereken en az sayıda `/v1` endpoint'ini belirle; tüm API'yi entegre etmeye çalışma.
2. Yayımlanmış yanıt şemasını kontrol ederek tipleri oluştur.
3. `loading`, `unavailable`, `error`, `stale` ve geçerli veri durumlarını ayır.
4. İstek sınırlarına, ETag/önbelleğe ve büyük tamsayı kurallarına uy.
5. Gerekiyorsa önce sahte veri ile arayüz test et; sonra gerçek veriye geç. Sahte veriyi gerçekmiş gibi gösterme.
6. Onchain işlem içeren özellik seçildiyse ayrı kullanıcı onayı, sözleşme doğrulaması ve simülasyon ekle.

**Bitti sayılma şartı:** En az bir gerekli resmî veri kaynağıyla çalışan, hata durumlarını düzgün yöneten doğrulanabilir entegrasyon var.

**Durum:** [ ] Başlanmadı

## Faz 6 — MVP'yi küçük parçalarla tamamla

**Amaç:** Sadece bilgi gösteren bir sayfa değil, kullanıcıya iş yaptıran çalışan ürün.

Alt görev önerisi (Faz 3'teki seçime göre uyarlanacak):
- **6A — Temel arayüz:** net başlangıç ekranı, kullanım amacı, mobil görünüm
- **6B — Asıl etkileşim:** ürünün gerçekten işe yarayan 1. özelliği
- **6C — İkinci özellik:** kullanıcıya kontrol/özelleştirme veya olaylara tepki verme
- **6D — Kullanım kolaylığı:** boş/yükleniyor/hata durumları, açıklamalar, erişilebilirlik
- **6E — Geliştirme testi:** örnek senaryolar, edge case'ler, gerekli hata düzeltmeleri

Squeek Live Companion seçilirse örnek MVP:
- Olay veya hamster durumunu tetikleyici olarak kullanan **canlı animasyon/bildirim**
- Kullanıcının renk/görünüm/bildirim türünü seçebildiği **kontrol ekranı**
- OBS'ye tarayıcı kaynağı olarak eklenebilen **ayrı overlay URL'si**

Bu örnek özellikler ürün seçilene kadar **bağlayıcı değil**.

**Bitti sayılma şartı:** Kullanıcı gerçek bir senaryoyu baştan sona deneyebiliyor; seçilen ürünün temel özelliği gerçek Squeekchain verisiyle çalışıyor; test/build sonuçları gösterildi.

**Durum:** [ ] Başlanmadı

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

**Durum:** [ ] Başlanmadı

---

## Önemli kararlar (henüz kapanmadı)

| Konu | Şu anki durum | Ne zaman karar verilecek? |
|---|---|---|
| Kesin proje fikri | Belirsiz; Live Companion ilk aday | Faz 3 |
| MVP özellikleri | Örnekler var, onaylanmadı | Faz 3 |
| Teknoloji | React + TypeScript + Vite aday | Faz 3 |
| Veritabanı / backend | Gerekli olduğu kanıtlanmadı | Faz 3–5 |
| Domain ve DNS doğrulama | Güncel formdan doğrulanmalı | Faz 2 |
| Squeekchain kontratları | Resmî deployment kaydından okunmalı | Faz 1 / 5 |
| Rozetler ve erken sıra | Garanti yok; canlı profilde bakılacak | Faz 1 / 7 |

## Resmî kaynaklar

- Genesis Code: https://squeekchain.com/genesis/code
- Geliştirici belgeleri: https://docs.squeekchain.com/developers/
- Agent skill: https://docs.squeekchain.com/developers/build-with-ai/
- API: https://docs.squeekchain.com/developers/api/
- Quickstart: https://docs.squeekchain.com/developers/quickstart/

## Codex'e verilecek ilk görev

Bu dosyaları GitHub deposuna koyduktan sonra şunu gönder:

> Depodaki AGENTS.md ve docs/FAZ_PLANI.md dosyalarını oku. Şimdilik kod yazma, paket kurma, commit/push yapma veya işlem gönderme. Sadece Faz 1'i salt-okunur araştırma olarak ele al: The Tester rozetinin güncel şartlarını ve resmî Squeekchain belgelerinden doğrulanabilir, güvenli işlem seçeneklerini araştır. Sözleşme adresi veya ABI uydurma. İşlem gerekiyorsa ne yapılacağını ve simülasyon adımlarını açıkla, ama benim açık onayım olmadan hiçbir işlem hazırlayıp imzalamaya veya göndermeye çalışma. Sonucu sade Türkçe anlat ve Faz 2'ye geçme.
