export const cekJabatan = (node, jabatan) => {
    if (node.namaJabatan.toLowerCase() === jabatan.toLowerCase()) return true;

  
    if (node.bawahan?.length) {
        for (let i = 0; i < node.bawahan.length; i++) {
            console.log('HERE',node.bawahan);
            
            if (cekJabatan(node.bawahan[i], jabatan)) return true;
        }
    }
    
    return false;
  };


export const cekJT = (node, jabatan) => {
    if (node.namaJabatan.toLowerCase() === jabatan.toLowerCase()) return true;
    return false;
}

export const getJT = (node, jabatan) => {
    if (node.namaJabatan.toLowerCase() === jabatan.toLowerCase()) return true;
    return false;
}