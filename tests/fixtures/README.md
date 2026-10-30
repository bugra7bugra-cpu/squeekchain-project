# Events yanıt örneği

`events.available.json`, kullanıcının 30 Ekim 2026 tarihinde tarayıcıda doğrulayarak aktardığı yanıt yapısının küçük test örneğidir; bu ortamda alınmış ham API kaydı değildir.

Kaynak sorgu: `https://api.squeekchain.com/v1/events?category=all&limit=40`.

`system.settlement_completed`, eventVersion 2 ve `2026-10-30T12:00:36.000Z` aktarılan gerçek örnektir. Olayın gerçek ID'si paylaşılmadığı için `fixture-settlement-1` kurgusal bir test ID'sidir. `activeEventTypes` dizisi yalnızca aktarılan bu örnek türü içerir; sunucunun tam listesinin kopyası değildir. Ek olaylar kullanan testlerde ID/tür/zaman değişiklikleri simülasyondur.

Doğrudan tarayıcı sekmesinde JSON açılması cross-origin JavaScript fetch, CORS ve ETag başlık görünürlüğünün kanıtı değildir.
