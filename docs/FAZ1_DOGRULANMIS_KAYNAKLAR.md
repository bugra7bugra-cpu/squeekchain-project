# Faz 1 — The Tester: doğrulanmış kaynak notları

> Hazırlanma tarihi: 30 Ekim 2026
> Bu dosya, Codex bulut ortamının `docs.squeekchain.com` ve `squeekchain.com` sitelerinden HTTP 403 alması nedeniyle hazırlanmış bir **kaynak özeti**dir. Bu içerik Codex tarafından bağımsız doğrulama yapılmış gibi sunulmamalıdır. Resmî bağlantılar değişebilir; gerçek işlem öncesinde yeniden doğrulama gerekir.

## 1. Resmî rozet koşulu

Genesis Aura sayfasındaki The Tester açıklaması: **“Send a transaction to any Squeekchain contract.”**

Kaynak: https://squeekchain.com/genesis/aura

Bu ifade herhangi bir Squeekchain sözleşmesine zincir işlemini işaret eder, ancak **başarılı bir `approve(spender, 0)` işleminin Genesis tarafından kesin olarak sayılacağına dair ayrı bir teyit yoktur**. Rozet sonucunu işlemden sonra Genesis profilinde kontrol etmek gerekir.

## 2. Resmî Sepolia deployment bilgisi

Kaynak: https://docs.squeekchain.com/assets/deployments/sepolia.json

- Ağ: Ethereum Sepolia
- Chain ID: `11155111`
- Deployment release: `squeeks-sepolia-core3-mining6-001`
- SqueekToken adresi: `0x6872bfa5ccc3e9e440c6c16e5ffdabb8dba4cc76`
- SqueekToken türü: immutable (proxy değil)
- SqueekToken ABI: https://docs.squeekchain.com/assets/abi/SqueekToken.json

Resmî geliştirici sayfası: https://docs.squeekchain.com/developers/

## 3. ABI üzerinden doğrulanan fonksiyonlar

Kaynak: https://docs.squeekchain.com/assets/abi/SqueekToken.json

- `allowance(address owner, address spender) -> uint256`: salt okunur (`view`)
- `approve(address spender, uint256 value) -> bool`: zincir durumunu değiştiren (`nonpayable`) ERC-20 işlemi

Token rehberi: https://docs.squeekchain.com/developers/token/

`approve(spender, 0)` seçilen spender adresine verilen token harcama iznini sıfıra ayarlar; **sıfır ETH ücreti demek değildir**. Gerçek işlem için SepoliaETH gas gerekecektir. Mevcut allowance sıfır değilse o izni değiştirir. Sıfır olmayan bir allowance'ı yanlışlıkla sıfırlamamak için aynı cüzdan ve spender için önce `allowance(owner, spender)` okunmalıdır. `spender=0x000...000` seçmeyin; ERC-20 sözleşmesi sıfır adresini reddedebilir.

## 4. Codex'in bir sonraki görevi — salt okunur kontrol

1. GitHub `main` dalındaki `AGENTS.md` ve `docs/FAZ_PLANI.md` dosyalarını oku.
2. Bu kaynak notunu erişemediğin resmî sayfaların **aktarılmış özeti** olarak kullan. Linklerin canlı hâlini okuyamadıysan bunu açıkça belirt.
3. `approve(spender, 0)` işleminin güvenlik etkilerini değerlendir; uygun aday olarak kendi adresini `spender` seçmenin avantajlarını ve sakıncalarını açıkla. Gerçek cüzdan adresini sadece simülasyon veya `allowance` okuması gerektiğinde kullanıcıdan iste. Özel anahtar/seed phrase isteme.
4. Sadece read-only RPC varsa ağ chain ID'sini, kodun hedef adreste varlığını, mevcut allowance'ı ve uygun simülasyon/gas tahminini **gerçek cüzdan adresi olmadan yapamadıklarını da belirterek** planla.
5. RPC yoksa simülasyon yapıldı diye yazma. Farklı üçüncü taraf RPC veya ağ izinleri gerekiyorsa önce açıklayıp kullanıcı onayı iste.
6. Herhangi bir blockchain işlemi imzalama, gönderme, otomatik tekrar deneme veya dosya değiştirme.
7. İşlem göndermenin rozet kazandıracağını garanti etme. Faz 2'ye geçme.

## 5. Durum

- [x] Resmî rozet açıklaması ve Sepolia token adresi harici ortamda incelendi
- [x] Resmî ABI'de `approve` / `allowance` fonksiyonları incelendi
- [ ] Codex bulut ortamından kaynaklara erişim (403 nedeniyle mevcut değil)
- [ ] Cüzdan-adrese özel read-only allowance ve simülasyon
- [ ] Gas tahmini
- [ ] Kullanıcı onayıyla gerçek işlem
- [ ] Zincirde işlem sonucu + Genesis rozet sonucunun ayrı doğrulanması
