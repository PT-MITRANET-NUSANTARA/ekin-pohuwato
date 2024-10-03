import dayjs from "dayjs";

export const dummyData = Array.from({ length: 100 }, (_, index) => ({
    key: (index + 1).toString(),
    name: 'John Brown',
    age: 32,
    address: `New York No. ${index + 1} Lake Park`,
    gender: 'male',
    country: 'indonesia',
    date_birth: dayjs('2022-01-01'),
}));
