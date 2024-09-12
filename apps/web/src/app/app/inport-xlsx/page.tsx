'use client'

import React, { useState } from 'react'
import * as XLSX from 'xlsx'

import { ShowJson } from '@/components/show-json'

type Item = {
  visionId: string
  name: string
  sessionName: string
  register: string
}

export default function MyNextJsExcelSheet() {
  const [items, setItems] = useState<Item[]>([])

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      fileReader.onload = (e) => {
        if (!e.target) {
          return
        }
        const bufferArray = e.target.result
        const wb = XLSX.read(bufferArray, {
          type: 'buffer',
        })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)
        resolve(data)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
    promise.then((d) => {
      setItems((d as Item[]).filter((i) => i.name && i.name !== '#N/A')) // eslint-disable-line @typescript-eslint/no-explicit-any
    })
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          if (!e.target.files) {
            return
          }

          const file = e.target.files[0]
          readExcel(file)
        }}
      />

      <div>
        <h1>Items</h1>
        <ul>
          <li>
            <span>Total de registros: </span> {items.length}
          </li>
          <li>
            <span>Total de registros sem visionId: </span>{' '}
            {items.filter((i) => !i.visionId).length}
          </li>
          <li>
            <span>Total de registros sem registro: </span>{' '}
            {items.filter((i) => !i.register).length}
          </li>
          <li>
            <span>Total de registros sem registro e visionId: </span>{' '}
            {items.filter((i) => !i.register && !i.visionId).length}
          </li>
        </ul>
        <ul>
          {items.map((item, i) => (
            <li key={i}>
              {item.visionId} - {item.name} - {item.sessionName} -{' '}
              {item.register}
            </li>
          ))}
        </ul>
      </div>
      <ShowJson data={items} />
    </div>
  )
}
