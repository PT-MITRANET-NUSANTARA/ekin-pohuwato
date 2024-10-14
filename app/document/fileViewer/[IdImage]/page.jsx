 "use client"
import React, { useEffect, useState } from 'react'
import { getById } from '@/controller/DokumentController';
import { useParams } from 'next/navigation';
const page = () => {
  const { IdImage } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getById(IdImage);
        const imageBlob = await response.blob(); // Convert the response to a blob
        const img = URL.createObjectURL(imageBlob); // Return a URL that can be used as an image source
        setData(img);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  console.log(data);
  console.log(IdImage);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  

  return (
    <>
        <img src={ data} alt="" className='h-full w-full bg-no-repeat object-contain'/>
    </>
  )
}

export default page