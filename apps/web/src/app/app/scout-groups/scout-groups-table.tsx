'use client'

import Link from 'next/link'
import React from 'react'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'

import { columns, ScoutGroup } from './columns'

type IProps = {
  scoutGroups: ScoutGroup[]
}

export const ScoutGroupsTable: React.FC<IProps> = ({ scoutGroups }) => {
  const { data, refetch } = trpc.getScoutGroups.useQuery()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grupos escoteiros</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns({ refetch })}
          data={data?.scoutGroups || scoutGroups}
          addComponent={
            <>
              <Button variant="outline" asChild>
                <Link href="/api/scout-group/download/export-data">
                  Exportar xlsx
                </Link>
              </Button>
            </>
          }
        />
      </CardContent>
    </Card>
  )
}
