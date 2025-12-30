# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh




**Şimdiye kadar yaptıklarım**
-İlk olarak solition frontend backend kurulumlarını yaptım .Her birini çalıştırdım ve veri geliyor mu diye baktım
- İkisi de çalışıyordu ama frontendde backedn verilerini göstermek içöni ikisini biribirine tanıtmam gerekiyordu. Bunun için axios kullandım.
- bu esnada ise axios ile frontendden backende istek atabildim ama backend frontend adresini tanımadığı için CORS korumasına takıldı.
- Bunun için CORS' ile izin verdim. Bunu yapmak için Program.cs dosyasında AddCors ile portu ekledim.
- Bu aşamada arayüzde backenddeki verileri göstermeyi başardım sırada arayüzde kendi backend verilerimizi göstermekti.
- Bunun için ilk olarak Db modelimizi oluşturmamız gerekiyordu o yüzden API klasöründe Models klasörü oluşturdum ve model dosyamı yazdım.
- Ardından DbContext servisimi oluşturmam gerekiyor bunun için ise Data klasörü oluşturup içerisine DbContext içeriğimi yazdım.
- Ardından DbContext servisimin olduğunu Program.cs ye söylemem gerekiyordu. Bunu için Program.cs de DbContext servisini ekledim.
- Bu aşamada Modelim C# kodumda vardı Ama MySQL de hala tablo oluturamamıştım. Tablo oluşturmak ve MySQL ile C# a birbirini tanıtmak için Migration kullandım.
