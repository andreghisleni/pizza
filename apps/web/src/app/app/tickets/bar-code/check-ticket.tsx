'use client'

import { useEffect, useRef, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

export function CheckTicket() {
  const { toast } = useToast()

  const [data, setData] = useState()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // async function getSaleItemByShotId(id: string) {
  //   if (!id) {
  //     setData(undefined)
  //     return
  //   }
  //   try {
  //     const d =
  //       await client.query<GetSaleItemByShortIdProductPostiteCheckQuery>({
  //         query: GetSaleItemByShortIdProductPostiteCheckDocument,
  //         variables: {
  //           shortId: id,
  //         },
  //       })

  //     if (d.data && d.data.saleItemByShortId) {
  //       const { saleItemByShortId } = d.data

  //       setData(saleItemByShortId)
  //     } else {
  //       setData(undefined)
  //     }
  //   } catch (error: any) {
  //     setData(undefined)
  //     toast({
  //       title: 'Erro',
  //       description: error.message,
  //       variant: 'destructive',
  //     })
  //   }
  // }

  async function handleKeyDown(event) {
    if (event.key === 'Enter') {
      // console.log('Enter pressionado! Valor:', event.target.value);

      // await getSaleItemByShotId(event.target.value)
      event.target.value = ''; // eslint-disable-line
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Código da do item da venda</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            className={cn(
              'focus-visible:outline-hidden flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[type=date]:block dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-800',
            )}
            placeholder="Digite o código do produto da venda"
          />
        </CardContent>
      </Card>
      {data && (
        <div className="mt-4 flex w-full justify-center">
          {/* <Card className="w-[960px]">
            <CardHeader>
              <CardTitle>Produto: {data?.product?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <UploadList
                    productId={data.product.id || ''}
                    pictures={data.product?.pictures || []}
                    disabled
                  />
                  {data.product?.pictures.length > 0 && <Separator />}

                  <NameAndCodeInputs />
                  <Separator />
                  <div className="grid grid-cols-3 gap-8">
                    {variationTypes &&
                      variationTypes.map((variationType) => (
                        <VariationInput
                          variationType={variationType}
                          key={variationType.id}
                        />
                      ))}
                  </div>

                  <Separator />

                  <div className="flex w-full flex-row gap-8">
                    <FormField
                      control={form.control}
                      name="client.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do cliente</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="client.code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código do cliente</FormLabel>
                          <FormControl>
                            <Input placeholder="Código" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="flex w-full flex-row gap-8">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Quantidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço</FormLabel>
                          <FormControl>
                            <Input placeholder="Preço" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex w-full flex-row gap-8">
                    <FormField
                      control={form.control}
                      name="addedAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da venda</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                  disabled={field.disabled}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP', {
                                      locale: ptBR,
                                    })
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seller.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do vendedor</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex w-full flex-row gap-8">
                    <FormField
                      control={form.control}
                      name="sale.code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código da venda</FormLabel>
                          <FormControl>
                            <Input placeholder="Código" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Origem</FormLabel>
                          <FormControl>
                            <Input placeholder="Origem" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex w-full flex-row gap-8">
                    <FormField
                      control={form.control}
                      name="sale.notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas</FormLabel>
                          <FormControl>
                            <Input placeholder="Notas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card> */}
        </div>
      )}
    </div>
  )
}
