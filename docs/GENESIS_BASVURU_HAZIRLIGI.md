# Genesis Code Lane — başvuru hazırlığı

Durum: Taslak; başvuru gönderilmedi. Form alanlarının güncel zorunlulukları bağımsız doğrulanmış değildir. Bu liste hazırlık içindir, resmî kabul listesi değildir.

## Hazır bilgiler

- Ürün adı: Squeek Live Companion.
- Kısa açıklama: Squeekchain olaylarını yayıncı ayarlarına göre sıralı görsel bildirimlere dönüştüren, OBS Browser Source olarak kullanılan tarayıcı aracı.
- Kullanıcı: Squeekchain temalı OBS yayını yapan yayıncı.
- Temel işlev: iki olay tetikleyicisi, süre/ara ve görünüm kontrolü, ayrı şeffaf overlay; açık etiketli demo modu.
- Teknoloji: React + TypeScript + Vite; statik frontend. Backend, üyelik, cüzdan ve blockchain işlemi yok.
- Kaynak: https://github.com/bugra7bugra-cpu/squeekchain-project — çalışma dalı `feat/faz4-demo`, mevcut PR #1. Main'e birleştirilmedi.
- Salt okunur veri kaynağı: https://api.squeekchain.com/v1/events . Şema ve olay türleri başka ortamda resmî belgeden kullanıcı tarafından aktarıldı; gerçek API bağlantısı ve yeni olayın gösterimi bu ortamda doğrulanmadı.
- Preview/demo URL: henüz yok; Vercel bağlantı/yetkisi eksik. Yayın URL'si uydurulmayacak.
- Güvenlik: imza, token izni veya özel anahtar gerektirmez. Demo canlı veri gibi sunulmaz.

## Başvurudan önce kapanması gerekenler

| Konu | Durum / gerekli kanıt |
|---|---|
| Güncel Code Lane kabul şartları | https://squeekchain.com/genesis/code üzerinden How Building Works, SSS ve Submit Project alanları doğrulanmalı |
| Ürün uygunluğu | Mevcut aktarılmış bilgiye göre yalnızca dashboard yerine iş yapan özgün uygulama hedefiyle uyumlu aday; resmî kabul teyidi değil |
| Herkesçe açılabilen demo | Preview erişim koruması, oturumsuz erişim ve kalıcı URL gereksinimi doğrulanmalı; canlı URL yok |
| Kaynak kodu / lisans | Kaynak görünürlüğü ve lisans şartı formdan doğrulanmalı; kullanıcı adına lisans seçilmedi |
| Domain / sahiplik | DNS/TXT doğrulaması, özel domain gereksinimi ve yeniden doğrulama koşulları bilinmiyor; DNS değiştirilmedi |
| Başvuru sahibi / alanlar | İstenen hesap/cüzdan/sosyal bilgiler ve form zorunlulukları doğrulanmalı; gizli anahtar istenmez |
| Gerçek entegrasyon | Preview kökeninden CORS/HTTP/şema testi ve yeni gerçek olayın tek bildirim üretmesi kayıt altına alınmalı |
| OBS kanıtı | README listesini gerçek OBS ile uygulayıp şeffaflık, bağımsız akış ve okunabilirlik doğrulanmalı |
| Sunum | Gerekliyse ekran görüntüleri ve kısa kullanım videosu hazırlanmalı; sahte veriler demo olarak etiketlenmeli |
| İnceleme/rozet | Swarm Review, çoklu proje, inceleme süresi, Buildooooor/Early Buildooooor uygunluğu ve güncel sınırlar doğrulanmalı; garanti yok |

Gönderim kullanıcı tarafından ayrıca açıkça onaylanmalı. Production deployment, domain değişikliği ve form gönderimi bu çalışmanın yetkisine dahil değil.
