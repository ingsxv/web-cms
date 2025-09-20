'use client';

import * as React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { mockWasteTransactions, months, years, schoolClasses, wasteTypes, WasteTransaction } from '@/lib/data/suspendik-mock';

// --- Helper Types ---
type ChartData = {
  name: string;
  total: number;
};

type RankingData = {
  class: string;
  total: number;
  rank: number;
};

// --- Main Component ---
export default function SuspendikPage() {
  const [selectedMonth, setSelectedMonth] = React.useState<string>(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = React.useState<string>(new Date().getFullYear().toString());
  const [selectedClass, setSelectedClass] = React.useState<string>('all');

  const filteredData = React.useMemo(() => {
    return mockWasteTransactions.filter(t =>
      t.month === selectedMonth &&
      t.year.toString() === selectedYear &&
      (selectedClass === 'all' || t.class === selectedClass)
    );
  }, [selectedMonth, selectedYear, selectedClass]);

  const chartData = React.useMemo<ChartData[]>(() => {
    const dataByWasteType = filteredData.reduce((acc, curr) => {
      acc[curr.wasteType] = (acc[curr.wasteType] || 0) + curr.amount;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(dataByWasteType).map(([name, total]) => ({ name, total: parseFloat(total.toFixed(2)) }));
  }, [filteredData]);

  const classRanking = React.useMemo<RankingData[]>(() => {
    const dataByClass = mockWasteTransactions
      .filter(t => t.month === selectedMonth && t.year.toString() === selectedYear)
      .reduce((acc, curr) => {
        acc[curr.class] = (acc[curr.class] || 0) + curr.amount;
        return acc;
      }, {} as { [key: string]: number });

    return Object.entries(dataByClass)
      .map(([className, total]) => ({ class: className, total: parseFloat(total.toFixed(2)), rank: 0 }))
      .sort((a, b) => b.total - a.total)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [selectedMonth, selectedYear]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Suspendik Bank Sampah</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Analisis dan peringkat pengumpulan sampah di lingkungan sekolah.</p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Data</CardTitle>
          <CardDescription>Pilih periode dan kelas untuk melihat data spesifik.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger><SelectValue placeholder="Pilih Bulan" /></SelectTrigger>
              <SelectContent>
                {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger><SelectValue placeholder="Pilih Tahun" /></SelectTrigger>
              <SelectContent>
                {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {schoolClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Sampah per Jenis</CardTitle>
            <CardDescription>{`Data untuk ${selectedMonth} ${selectedYear}`}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              {chartData.length > 0 ? (
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} fontSize={12} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value} kg`} />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" name="Total Sampah (kg)" />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">Tidak ada data untuk ditampilkan.</div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peringkat Kelas</CardTitle>
            <CardDescription>{`Berdasarkan total sampah terkumpul (${selectedMonth} ${selectedYear})`}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Peringkat</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead className="text-right">Total (kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classRanking.length > 0 ? (
                  classRanking.map(item => (
                    <TableRow key={item.rank}>
                      <TableCell className="font-medium text-center">{item.rank}</TableCell>
                      <TableCell>{item.class}</TableCell>
                      <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Tidak ada data peringkat.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
