"use client"
import { Button, Result } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
  const router = useRouter()
  return (
    <div className='h-screen flex items-center justify-center'>
      <Result
        status="404"
        title="404"
        subTitle="Maaf, Halaman yang dituju tidak dapat diakses"
        extra={<Button type="primary" onClick={() => router.back()}>Kembali</Button>}
      />
    </div>

  )
}

export default page