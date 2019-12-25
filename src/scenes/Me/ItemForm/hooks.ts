import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    GetItemsDocument,
    GetItemsQuery,
    SearchItem,
    useCreateItemFromSearchMutation,
    useCreateItemFromUrlMutation,
    useSearchItemLazyQuery,
} from '../../../generated/types'

interface ItemsFormData {
    url: string
}

const useItemUrlForm = (
    collectionId: string,
    onStart?: () => void,
    onCompleted?: () => void
) => {
    const { register, handleSubmit, reset, errors } = useForm<ItemsFormData>()

    const [addItem, { loading }] = useCreateItemFromUrlMutation({
        onCompleted: _ => {
            if (onCompleted !== undefined) {
                onCompleted()
            }
        },
        update(cache, { data }) {
            if (data === undefined || data === null) {
                throw Error('Can not update cache because no data returned')
            }
            const cachedData = cache.readQuery<GetItemsQuery>({
                query: GetItemsDocument,
                variables: {
                    collectionId,
                },
            })

            if (cachedData !== null && cachedData.items) {
                cache.writeQuery({
                    query: GetItemsDocument,
                    variables: {
                        collectionId,
                    },
                    data: {
                        items: cachedData.items.concat(data.items),
                    },
                })
            }
            reset()
        },
    })

    const onSubmit = handleSubmit(({ url }) => {
        if (onStart !== undefined) {
            onStart()
        }
        addItem({
            variables: {
                url,
                collectionId,
            },
        })
    })

    return { register, onSubmit, loading, errors }
}

interface ItemsFormSearchData {
    title: string
}

const useItemFormSearch = (
    searchItemType: string,
    collectionId: string,
    onStart?: () => void,
    onCompleted?: () => void
) => {
    const { register, handleSubmit, reset, errors } = useForm<
        ItemsFormSearchData
    >()

    const [dataSource, setDataSource] = useState<SearchItem[]>()
    const [search] = useSearchItemLazyQuery({
        onCompleted: data => {
            setDataSource(data.search)
        },
    })

    const onChange = (q: string) => {
        search({ variables: { query: q, kind: searchItemType } })
    }

    const [addItem, { loading }] = useCreateItemFromSearchMutation({
        onCompleted: _ => {
            if (onCompleted !== undefined) {
                onCompleted()
            }
        },
        update(cache, { data }) {
            if (data === undefined || data === null) {
                throw Error('Can not update cache because no data returned')
            }
            const cachedData = cache.readQuery<GetItemsQuery>({
                query: GetItemsDocument,
                variables: {
                    collectionId,
                },
            })

            if (cachedData !== null && cachedData.items) {
                cache.writeQuery({
                    query: GetItemsDocument,
                    variables: {
                        collectionId,
                    },
                    data: {
                        items: cachedData.items.concat(data.items),
                    },
                })
            }
            reset()
        },
    })

    const onSubmit = handleSubmit(({ title }) => {
        if (dataSource === undefined) {
            throw Error('Datasource undefined')
        }
        if (onStart !== undefined) {
            onStart()
        }
        const value = dataSource.find(x => x.title === title)
        if (value === undefined) {
            throw Error('Unable to find the value')
        }

        addItem({
            variables: {
                id: value.id,
                kind: searchItemType,
                collectionId,
            },
        })
    })

    return { register, onSubmit, loading, errors, dataSource, onChange }
}

export { useItemUrlForm, useItemFormSearch }
