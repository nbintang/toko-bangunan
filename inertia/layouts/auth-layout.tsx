import { DumbbellIcon } from 'lucide-react'
import React from 'react'

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden rounded-r-2xl shadow lg:block">
        <img
          src="/images/gedungf4.jpg"
          alt="Gedung F4"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <a
          href="#"
          className="absolute top-10 left-10 flex items-center gap-2 font-medium text-white"
        >
          <div className="flex size-7 items-center justify-center rounded-md bg-white text-black">
            <DumbbellIcon className="size-4" />
          </div>
          Toko Olahraga
        </a>
        <div className="absolute right-10 bottom-10 left-10 text-white">
          <h2 className="max-w-lg text-3xl font-semibold">
            Persediaan Barang Toko Perlengkapan Olahraga
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/75">
            Pantau stok dan kelola kebutuhan perlengkapan olahraga dalam satu sistem.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10 ">
        <div className="flex justify-center lg:hidden">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <DumbbellIcon className="size-4" />
            </div>
            Toko Olahraga
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs ">{children}</div>
        </div>
      </div>
    </div>
  )
}
