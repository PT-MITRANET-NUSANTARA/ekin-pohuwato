import dayjs from "dayjs";

export const  dummyRenstra = Array.from({ length: 100 }, (_, index) => ({
    _id: (index + 1).toString(),
    name: 'dummy name',
    periode_start: (index + 1),
    periode_end: 12,
    programs: 'Dummy Program',
}));

export const dummyAtasan = Array.from({ length: 10 }, (_, index) => ({
    nip: (index + 197904012005011015),
    name: `atasan no ${index}`,
    jabatan: 'pendamping',
    golru: '3/C'
}));

export const dummyBawahan = Array.from({ length: 10 }, (_, index) => ({
    nip: (index + 197904012005011015),
    name: `atasan no ${index}`,
    jabatan: 'pendamping',
    golru: '3/C'
}));