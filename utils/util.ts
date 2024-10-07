export const formatDateToDayMonthYear = (dateString: string) => {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const date = new Date(dateString);

    // Validasi tanggal
    if (isNaN(date.getTime())) {
        return 'Invalid Date'; // Jika input bukan tanggal yang valid
    }

    const day = date.getDate().toString().padStart(2, '0'); // Menambahkan nol di depan jika tanggal < 10
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}
