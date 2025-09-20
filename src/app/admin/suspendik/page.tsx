'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { schoolClasses, wasteTypes, months, years } from '@/lib/data/suspendik-mock';

interface WasteEntry {
  class: string;
  wasteType: string;
  amount: number;
  month: string;
  year: string;
}

const initialFormState = {
  class: '',
  wasteType: '',
  amount: 0,
  month: months[new Date().getMonth()],
  year: new Date().getFullYear().toString(),
};

export default function AdminSuspendikPage() {
  const { toast } = useToast();
  const [entries, setEntries] = React.useState<WasteEntry[]>([]);
  const [currentEntry, setCurrentEntry] = React.useState<WasteEntry>(initialFormState);

  const handleInputChange = (field: keyof WasteEntry, value: string | number) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEntry = () => {
    if (!currentEntry.class || !currentEntry.wasteType || currentEntry.amount <= 0) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Mohon isi semua field sebelum menambahkan data.',
        variant: 'destructive',
      });
      return;
    }
    setEntries(prev => [...prev, currentEntry]);
    toast({
      title: 'Data Ditambahkan',
      description: `Data untuk kelas ${currentEntry.class} berhasil ditambahkan.`,
    });
    // Reset for next entry, but keep month and year
    setCurrentEntry(prev => ({ ...initialFormState, month: prev.month, year: prev.year }));
  };

  const handleSaveAll = () => {
    if (entries.length === 0) {
      toast({
        title: 'Tidak ada data untuk disimpan',
        description: 'Silakan tambahkan data terlebih dahulu.',
        variant: 'destructive',
      });
      return;
    }
    console.log('Menyimpan semua data:', JSON.stringify(entries, null, 2));
    toast({
      title: 'Semua Data Disimpan!',
      description: `${entries.length} data telah disimpan (lihat console log).`,
    });
    setEntries([]);
  };

  const wasteTypeGroups = wasteTypes.reduce((acc, type) => {
    const category = type.category || 'Lainnya';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(type);
    return acc;
  }, {} as Record<string, typeof wasteTypes>); 

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Input Data Bank Sampah</CardTitle>
          <CardDescription>Masukkan data pengumpulan sampah per kelas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
            
            {/* Column 1 */}
            <div className="space-y-2">
              <Label htmlFor="month">Bulan</Label>
              <Select
                value={currentEntry.month}
                onValueChange={(value) => handleInputChange('month', value)}
              >
                <SelectTrigger id="month"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Tahun</Label>
              <Select
                value={currentEntry.year}
                onValueChange={(value) => handleInputChange('year', value)}
              >
                <SelectTrigger id="year"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Kelas</Label>
              <Select
                value={currentEntry.class}
                onValueChange={(value) => handleInputChange('class', value)}
              >
                <SelectTrigger id="class"><SelectValue placeholder="Pilih Kelas..." /></SelectTrigger>
                <SelectContent>
                  {schoolClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Column 2 */}
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label htmlFor="wasteType">Jenis Sampah</Label>
              <Select
                value={currentEntry.wasteType}
                onValueChange={(value) => handleInputChange('wasteType', value)}
              >
                <SelectTrigger id="wasteType"><SelectValue placeholder="Pilih Jenis Sampah..." /></SelectTrigger>
                <SelectContent>
                  {Object.entries(wasteTypeGroups).map(([category, types]) => (
                    <SelectGroup key={category}>
                      <SelectLabel>{category}</SelectLabel>
                      {types.map(type => (
                        <SelectItem key={type.value} value={type.label}>{type.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Column 3 */}
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah (kg)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="cth: 12.5"
                value={currentEntry.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleAddEntry}>Tambah Data Lagi</Button>
            <Button onClick={handleSaveAll}>Simpan Semua ({entries.length})</Button>
          </div>

          {entries.length > 0 && (
            <div className="pt-6">
              <h3 className="text-lg font-medium mb-2">Data yang Akan Disimpan</h3>
              <div className="rounded-md border">
                <pre className="p-4 text-sm overflow-x-auto">{JSON.stringify(entries, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
