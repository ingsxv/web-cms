
export const wasteTypes = [
  { value: "dedaunan", label: "Dedaunan", category: "Organik" },
  { value: "sisa-makanan", label: "Sisa Makanan", category: "Organik" },
  { value: "kresek", label: "Kresek (Kantong Plastik)", category: "Anorganik" },
  { value: "plastik-lainnya", label: "Plastik Lainnya", category: "Anorganik" },
  { value: "karah-warna", label: "Karah Warna (Plastik Keras)", category: "Anorganik" },
  { value: "botol-mineral-plastik", label: "Botol Mineral Plastik", category: "Anorganik" },
  { value: "gelas-mineral-plastik", label: "Gelas Mineral Plastik", category: "Anorganik" },
  { value: "botol-mineral-kaca", label: "Botol Mineral Kaca", category: "Anorganik" },
  { value: "kardus-karton", label: "Kardus / Karton", category: "Anorganik" },
  { value: "kaleng", label: "Kaleng", category: "Anorganik" },
  { value: "besi", label: "Besi", category: "Anorganik" },
  { value: "baja", label: "Baja", category: "Anorganik" },
  { value: "tembaga", label: "Tembaga", category: "Anorganik" },
  { value: "aluminium", label: "Aluminium", category: "Anorganik" },
  { value: "seng", label: "Seng", category: "Anorganik" },
  { value: "kain-bekas", label: "Kain Bekas", category: "Anorganik" },
  { value: "sandal-sepatu", label: "Sandal & Sepatu", category: "Anorganik" },
  { value: "lampu-bekas", label: "Lampu Bekas", category: "Residu / B3" },
];

export const schoolClasses = [
  "7A", "7B", "7C", "7D", "7E", "7F", "7G", "7H",
  "8A", "8B", "8C", "8D", "8E", "8F", "8G", "8H",
  "9A", "9B", "9C", "9D", "9E", "9F", "9G", "9H",
];

export const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export const years = [2023, 2024, 2025];

// Generate mock transactions
export type WasteTransaction = {
  id: number;
  class: string;
  wasteType: string;
  amount: number; // in kg
  month: string;
  year: number;
};

const generateMockData = (): WasteTransaction[] => {
  const data: WasteTransaction[] = [];
  let id = 1;
  for (const year of years) {
    for (const month of months) {
      for (const schoolClass of schoolClasses) {
        // Not every class will have a record for every waste type every month
        const numberOfEntries = Math.floor(Math.random() * 8);
        for (let i = 0; i < numberOfEntries; i++) {
          const randomWasteType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
          data.push({
            id: id++,
            class: schoolClass,
            wasteType: randomWasteType.label,
            amount: parseFloat((Math.random() * 50).toFixed(2)),
            month,
            year,
          });
        }
      }
    }
  }
  return data;
};

export const mockWasteTransactions = generateMockData();
