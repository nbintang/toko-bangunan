import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const users = [
      {
        fullName: 'Administrator',
        email: 'admin@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Administrator Toko Bangunan',
        email: 'admin@tokobangunan.test',
        password: 'password',
      },
      {
        fullName: 'Andi Pratama',
        email: 'andi.pratama@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Budi Santoso',
        email: 'budi.santoso@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Citra Lestari',
        email: 'citra.lestari@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Dewi Anggraini',
        email: 'dewi.anggraini@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Eko Saputra',
        email: 'eko.saputra@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Fajar Nugroho',
        email: 'fajar.nugroho@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Gita Permata',
        email: 'gita.permata@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Hendra Wijaya',
        email: 'hendra.wijaya@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Intan Maharani',
        email: 'intan.maharani@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Joko Firmansyah',
        email: 'joko.firmansyah@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Kartika Sari',
        email: 'kartika.sari@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Lukman Hakim',
        email: 'lukman.hakim@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Maya Putri',
        email: 'maya.putri@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Nanda Ramadhan',
        email: 'nanda.ramadhan@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Olivia Nathania',
        email: 'olivia.nathania@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Prasetyo Adi',
        email: 'prasetyo.adi@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Qori Maulana',
        email: 'qori.maulana@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Ratna Puspita',
        email: 'ratna.puspita@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Satria Wibowo',
        email: 'satria.wibowo@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Tania Kusuma',
        email: 'tania.kusuma@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Umar Faruq',
        email: 'umar.faruq@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Vina Oktaviani',
        email: 'vina.oktaviani@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Wahyu Hidayat',
        email: 'wahyu.hidayat@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Yuni Astuti',
        email: 'yuni.astuti@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Zaki Alfarizi',
        email: 'zaki.alfarizi@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Alya Kirana',
        email: 'alya.kirana@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Bagas Mahendra',
        email: 'bagas.mahendra@tokolahraga.test',
        password: 'password',
      },
      {
        fullName: 'Clara Febriani',
        email: 'clara.febriani@tokolahraga.test',
        password: 'password',
      },
    ]

    for (const user of users) {
      await User.updateOrCreate(
        {
          email: user.email,
        },
        {
          fullName: user.fullName,
          password: user.password,
        }
      )
    }
  }
}
