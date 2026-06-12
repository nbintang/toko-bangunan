import {
  AlertTriangleIcon,
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  BoxesIcon,
  PackageIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ChartConfig } from '@/components/ui/chart'
import type { InertiaProps } from '~/types'

type DashboardProduct = {
  id: number
  categoryId: number
  code: string
  name: string
  unit: string
  stock: number
  minimumStock: number
  description: string | null
  category: {
    id: number
    name: string
  } | null
}

type LatestTransaction = {
  id: number
  productId: number
  userId: number
  type: 'in' | 'out'
  quantity: number
  stockAfter: number
  transactionDate: string
  note: string | null
  product: DashboardProduct | null
  user: {
    id: number
    fullName: string | null
    email: string
  } | null
}

type ChartData = {
  date: string
  label: string
  stockIn: number
  stockOut: number
}

type PageProps = InertiaProps<{
  totalProducts: number
  totalStock: number
  totalStockIn: number
  totalStockOut: number
  lowStockCount: number
  lowStockProducts: DashboardProduct[]
  topMinProducts: DashboardProduct[]
  topMaxProducts: DashboardProduct[]
  latestTransactions: LatestTransaction[]
  chartData: ChartData[]
}>

const chartConfig = {
  stockIn: {
    label: 'Masuk',
    color: 'hsl(142 72% 35%)',
  },
  stockOut: {
    label: 'Keluar',
    color: 'hsl(0 72% 45%)',
  },
} satisfies ChartConfig

const stockChartConfig = {
  stock: {
    label: 'Stok',
    color: 'var(--chart-2)',
  },
  label: {
    color: 'var(--background)',
  },
} satisfies ChartConfig

const numberFormatter = new Intl.NumberFormat('id-ID')
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export default function Overview({
  user,
  totalProducts,
  totalStock,
  totalStockIn,
  totalStockOut,
  lowStockCount,
  lowStockProducts,
  topMinProducts,
  topMaxProducts,
  latestTransactions,
  chartData,
}: PageProps) {
  const displayName = user?.fullName ?? user?.email ?? 'User'

  return (
    <div className="flex max-w-full flex-col gap-4 overflow-hidden p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-normal">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang, {displayName}. Pantau stok barang dan aktivitas transaksi terbaru.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title="Total Barang"
          value={totalProducts}
          description="Jenis barang aktif"
          icon={<PackageIcon />}
        />
        <SummaryCard
          title="Total Stok"
          value={totalStock}
          description="Akumulasi stok"
          icon={<BoxesIcon />}
        />
        <SummaryCard
          title="Stok Masuk"
          value={totalStockIn}
          description="Total transaksi masuk"
          icon={<ArrowDownToLineIcon />}
        />
        <SummaryCard
          title="Stok Keluar"
          value={totalStockOut}
          description="Total transaksi keluar"
          icon={<ArrowUpFromLineIcon />}
        />
        <SummaryCard
          title="Stok Rendah"
          value={lowStockCount}
          description="Stok sama/di bawah minimum"
          icon={<AlertTriangleIcon />}
          warning
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Bulan Ini</CardTitle>
            <CardDescription>
              Perbandingan jumlah barang masuk dan keluar per tanggal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-72 w-full">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    interval="preserveStartEnd"
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="stockIn" fill="var(--color-stockIn)" radius={8} />
                  <Bar dataKey="stockOut" fill="var(--color-stockOut)" radius={8} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex min-h-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                Belum ada transaksi bulan ini.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Total stok masuk {numberFormatter.format(totalStockIn)} barang
            </div>
            <div className="leading-none text-muted-foreground">
              Total stok keluar {numberFormatter.format(totalStockOut)} barang bulan ini
            </div>
          </CardFooter>
        </Card>

        <ProductListCard
          title="Stok Perlu Dicek"
          description="Barang dengan stok sama atau di bawah batas minimum."
          products={lowStockProducts}
          emptyText="Tidak ada stok di bawah batas minimum."
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ProductStockChartCard
          title="Stok Terendah"
          description="Lima barang dengan stok paling rendah."
          products={topMinProducts}
          emptyText="Tidak ada data stok."
          tone="lowest"
        />
        <ProductStockChartCard
          title="Stok Tertinggi"
          description="Lima barang dengan stok paling banyak."
          products={topMaxProducts}
          emptyText="Tidak ada data stok tinggi."
          tone="highest"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
          <CardDescription>Lima aktivitas persediaan terakhir.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Barang</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Stok Akhir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestTransactions.length > 0 ? (
                latestTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.product?.name ?? '-'}</div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.product?.category?.name ?? 'Tanpa kategori'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === 'in' ? 'secondary' : 'destructive'}>
                        {transaction.type === 'in' ? 'Masuk' : 'Keluar'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {numberFormatter.format(transaction.quantity)}
                    </TableCell>
                    <TableCell className="text-right">
                      {numberFormatter.format(transaction.stockAfter)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Belum ada transaksi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  warning = false,
}: {
  title: string
  value: number
  description: string
  icon: ReactNode
  warning?: boolean
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{numberFormatter.format(value)}</CardTitle>
        <CardAction
          className={
            warning ? 'text-destructive [&>svg]:size-5' : 'text-muted-foreground [&>svg]:size-5'
          }
        >
          {icon}
        </CardAction>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{description}</CardContent>
    </Card>
  )
}

function ProductStockChartCard({
  title,
  description,
  products,
  emptyText,
  tone,
}: {
  title: string
  description: string
  products: DashboardProduct[]
  emptyText: string
  tone: 'highest' | 'lowest'
}) {
  const stocks = products.map((product) => product.stock)
  const minimumStock = Math.min(...stocks)
  const maximumStock = Math.max(...stocks)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <ChartContainer config={stockChartConfig} className="min-h-64 w-full">
            <BarChart accessibilityLayer data={products} layout="vertical" margin={{ right: 48 }}>
              <CartesianGrid horizontal={false} />
              <YAxis dataKey="name" type="category" hide />
              <XAxis dataKey="stock" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" hideLabel />}
              />
              <Bar dataKey="stock" fill="var(--color-stock)" radius={4}>
                {products.map((product) => (
                  <Cell
                    key={product.id}
                    fill={getStockBarColor(product.stock, minimumStock, maximumStock, tone)}
                  />
                ))}
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  className="fill-(--color-label)"
                  fontSize={12}
                />
                <LabelList
                  dataKey="stock"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value) => numberFormatter.format(Number(value ?? 0))}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            {emptyText}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getStockBarColor(
  stock: number,
  minimumStock: number,
  maximumStock: number,
  tone: 'highest' | 'lowest'
) {
  const range = maximumStock - minimumStock
  const ratio = range === 0 ? (tone === 'highest' ? 1 : 0) : (stock - minimumStock) / range
  const lightness = Math.round(26 + ratio * 28)

  return tone === 'highest' ? `hsl(142 72% ${lightness}%)` : `hsl(0 74% ${lightness}%)`
}

function ProductListCard({
  title,
  description,
  products,
  emptyText,
}: {
  title: string
  description: string
  products: DashboardProduct[]
  emptyText: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <div className="grid gap-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border p-3"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{product.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {product.code} · {product.category?.name ?? 'Tanpa kategori'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-semibold">
                    {numberFormatter.format(product.stock)}
                  </div>
                  <div className="text-xs text-muted-foreground">{product.unit}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            {emptyText}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatDate(value: string) {
  if (!value) {
    return '-'
  }

  return dateFormatter.format(new Date(value))
}
