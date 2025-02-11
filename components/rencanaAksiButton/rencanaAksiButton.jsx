"use client"

import { Button, List } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const rencanaAksiButton = ({ item, setModal, rencanaAksiFields, IdPeriode, getByIdPenilaian, store, fetchData }) => {
  return (
    <div className="flex flex-col gap-y-2 p-2">
      <div className="flex flex-col gap-y-2 p-4">
        <List
        // isi dalam data source sumber data yang ingin ditampilkan
          dataSource={item}
          className="px-4"
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    setModal({
                      formFields: rencanaAksiFields,
                      modalData: {},
                      onSubmit: (values) => {
                        console.log('seharusnya ini mengedit lampiran');
                      },
                      title: 'Edit Dukungan Sumber Daya',
                      trigger: true,
                      type: 'edit'
                    })
                  }
                />,
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    setModal({
                      formFields: rencanaAksiFields,
                      modalData: {},
                      onSubmit: (values) => {
                        console.log('seharusnya ini menghapus lampiran');
                      },
                      title: 'Delete Dukungan Sumber Daya',
                      trigger: true,
                      type: 'delete'
                    })
                  }
                />
              ]}
            >
              {item.isi_lampiran}
            </List.Item>
          )}
        />
        <Button
          className="w-fit"
          type="primary"
          onClick={() =>
            setModal({
              formFields: rencanaAksiFields,
              onSubmit: async (values) => {
                const periode = await getByIdPenilaian(IdPeriode);

                const data = {
                  rhk: item._id,
                  isi: values.rencana_aksi,
                  target: values.target,
                  periodePenilaian: IdPeriode
                };

                const res = await store(data);

                if (res.ok) {
                  fetchData();
                }
              },
              title: 'Tambah Rencana Aksi',
              trigger: true,
              type: 'create',
              modalData: {}
            })
          }
        >
          Tambah
        </Button>
      </div>
    </div>
  )
}

export default rencanaAksiButton