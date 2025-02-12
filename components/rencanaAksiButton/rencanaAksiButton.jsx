"use client"

import { Button, List } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { destroy, getByRhkId, update } from "@/controller/RencanaAksiController";

const rencanaAksiButton = ({ item, setModal, rencanaAksiFields, IdPeriode, getByIdPenilaian, store }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getByRhkId(item._id, IdPeriode);
      console.log(data);
      setData(data.data)
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="flex flex-col gap-y-2 p-2">
      <div className="flex flex-col gap-y-2 p-4">
        <List
        // isi dalam data source sumber data yang ingin ditampilkan
          dataSource={data}
          className="px-4"
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    setModal({
                      formFields: rencanaAksiFields,
                      modalData: item,
                      onSubmit: async (values) => {
                        console.log(values);
                        const data = {
                          rhk: item.rhk,
                          periodePenilaian: item.periodePenilaian,
                          isi: values.isi,
                          target: values.target,
                        };
                        console.log(data);
                        
                        const res = await update(item._id,data);
        
                        if (res.ok) {
                          fetchData();
                        }
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
                      modalData: item,
                      onSubmit: async (values) => {
                        console.log(values);
        
                        const res = await destroy(item._id);
        
                        if (res.ok) {
                          fetchData();
                        }
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
              {item.isi}

              Target: {item.target}
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

                const data = {
                  rhk: item._id,
                  isi: values.isi,
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