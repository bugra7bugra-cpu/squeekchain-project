# Events invalid_query — sunucu ekibine iletilebilecek rapor

## Gözlem ve kapsam

30 Ekim 2026. Kullanıcı aynı URL için adres çubuğunda schemaVersion=3/status=available JSON, uygulama GET isteğinde ise HTTP 400 ve `{"error":"invalid_query"}` bildirdi. 400 yanıtında `Access-Control-Allow-Origin: *` var. Bunlar kullanıcıdan aktarılan kanıttır; bu ortamda uzaktaki davranış bağımsız yeniden üretilemedi.

İstek URL'si: `https://api.squeekchain.com/v1/events?category=all&limit=40`

Beklenti: Aktarılan resmî belgeye göre geçerli category=all ve limit=40 değerleri aynı uç noktada aynı biçimde değerlendirilmelidir. HTTP 400'ün hangi doğrulama kuralına takıldığı açıklanmalı.

## Uygulama incelemesi

- Sağlayıcı sabit yukarıdaki URL'yi kullanıyor. URL/searchParams testi tam olarak `category=all` ve `limit=40` üretildiğini doğruluyor; amp;limit, çift encode veya birleştirme sorunu yok.
- GET, credentials=omit. İlk istekte özel header yok; geçerli ETag alındıysa sonraki istekte If-None-Match ekleniyor.
- Uygulama Origin/Sec-Fetch başlıklarını elle yazmıyor. Proxy, no-cors, header taklidi veya rastgele query değişikliği eklenmedi.
- 400 ağdan geldiyse yerel şema doğrulamasından kaynaklanmaz: şema doğrulaması HTTP başarı yanıtından sonra çalışır.

## Navigasyon ve fetch farkları

İzole yerel Chromium testinde gerçek API'ye gitmeden kesilen iki istek karşılaştırıldı (sahte 200 yanıtı kullanıldı; bu uzak API başarı testi değildir):

| Başlık | Navigasyon | JavaScript fetch |
|---|---|---|
| Origin | Yok | Uygulama kökeni; yerel testte http://127.0.0.1:5180 |
| Accept | text/html, application/xhtml+xml ve diğer tarayıcı tercihlerinden oluşan liste | */* |
| Sec-Fetch-Mode | Ağ üzerinde normalde navigate | Cross-origin fetch için normalde cors |
| Sec-Fetch-Dest | Normalde document | Normalde empty |
| Sec-Fetch-Site | Adres çubuğu açılışında genellikle none | Preview → API için cross-site |
| Sec-Fetch-User | Kullanıcı navigasyonunda bulunabilir | Normalde yok |

Sec-Fetch değerleri bu yerel interception noktasında henüz görünmedi; tablodaki Sec-Fetch satırları beklenen tarayıcı davranışıdır, gerçek uzak isteğin yakalanmış başlıkları değildir. Bunlar tarayıcı tarafından yönetilir, frontend'den değiştirilmeye çalışılmamalı. Accept uygulama tarafından ayarlanabilir ancak application/json yapmanın sorunu çözdüğüne dair kanıt yok; bu nedenle değiştirilmedi.

Navigasyon API kökenine ait mevcut cookie'leri gönderebilir; uygulama credentials=omit ile cookie göndermez. Değerleri incelenmedi veya kaydedilmedi. Salt okunur anonim API'nin bu farkı gerektirmemesi beklenir, ancak edge yönlendirmesi açısından sunucu tarafında kontrol edilebilir.

Origin/Accept/Fetch Metadata'ya göre ayrılan sunucu/edge middleware, query validator veya önbellek davranışı olası açıklamalardır; **kök neden olarak doğrulanmadılar**. Gerçek isteğin aynı deployment/commit'ten geldiği, service worker/eklenti etkisi ve sunucu logları kontrol edilmeli. If-None-Match'li isteklerde ayrıca CORS preflight oluşabilir; ilk koşulsuz GET ve sonraki koşullu GET ayrı incelenmeli.

## CORS ayrımı

ACAO:* ve credentials=omit, yanıt okunabilirliği açısından uyumludur. HTTP 400 kendi başına CORS hatası değildir. JavaScript status=400 ve error=invalid_query değerlerini gerçekten okuyabiliyorsa o yanıtın CORS okuması başarılı olmuştur. Yalnızca Network sekmesinde header/body görülmesi JavaScript erişimini tek başına kanıtlamaz. JSON navigasyonunun çalışması da fetch CORS/preflight başarısı değildir. ETag ve Retry-After başlıklarının JS'ye açılması ayrıca incelenmeli; eksik expose headers doğrudan query bozukluğunu kanıtlamaz.

## Bu ortamda yapılan kontrollü uzak test

Tek istek: parametreli GET; Preview kökenli Origin ve Accept:*/* ile. Sonuç: ağ vekilinde `CONNECT tunnel failed, response 403`. Hedef API'ye ulaşılamadı; bu sonuç API'nin 400/invalid_query yanıtı değildir. Başlık varyasyonları ve parametresiz karşılaştırma hedefe ulaşmayacağı için tekrarlanmadı. Proxy ile dolaşılmadı.

## Sunucu ekibi için sonraki kontrol

1. Aynı istemci ve yakın zaman aralığında başarılı navigasyon ile başarısız uygulama GET'inin hassas bilgilerden arındırılmış HAR/Copy as cURL kayıtlarını karşılaştırın. Cookie, Authorization, token ve kişisel verileri paylaşmayın.
2. Gerçek Request URL, method, Origin, Accept, Sec-Fetch-* ve varsa If-None-Match değerlerini; HTTP durumunu, Date, request/trace ID ve cache/Vary başlıklarını kaydedin. Request ID varsa sunucu loguyla eşleştirin.
3. Aynı category/limit korunarak Origin/Accept varlığının query doğrulamasını veya edge yönlendirmesini değiştirip değiştirmediğini sunucu tarafında inceleyin. Navigasyon, ilk fetch ve ETag'li tekrar ayrı örnekler olsun.
4. API ekibinden invalid_query'yi üreten doğrulama kuralının adını ve aynı URL'nin niçin farklı ele alındığını isteyin. Kanıt olmadan client parametrelerini değiştirmeyin veya proxy eklemeyin.

## Uygulamadaki doğrulanmış iyileştirme

HTTP hata durumunda kısa makine hata kodu güvenli biçimde okunur; `HTTP 400 / invalid_query` gösterilir. HTML/keyfi sunucu metni gösterilmez; error body 4096 byte, kod 64 karakter ve izin verilen karakterlerle sınırlandırılır. JSON yoksa HTTP kodu korunur. 429/503 Retry-After, baseline, tekrar önleme ve demo ayrımı korunur. Bu **tanı görünürlüğü düzeltmesidir**, canlı API hatasının çözüldüğü iddiası değildir.

## 30 Ekim 2026 — ayrı istemci bulgusu

Arena Chromium doğrulamasında native fetch fonksiyonunun `this.request(...)` ile provider nesnesine bağlanması, isteği ağ katmanından önce kesebilen bir çağrı hatası olarak yeniden üretildi. İstek artık receiver bağlamını taşımayan sarmalayıcıdan çağrılıyor; sahte HTTP 400/invalid_query yanıtı tarayıcıda doğru gösterildi. Bu yerel istemci düzeltmesi, daha önce kullanıcı tarafından bildirilen uzak HTTP 400'ün nedeni veya çözümü olarak sunulamaz. Gerçek endpoint yeniden denenmedi; sunucu log karşılaştırması gereksinimi sürüyor.
