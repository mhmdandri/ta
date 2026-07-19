import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:104
 * @route '/customer/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/customer/search',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:104
 * @route '/customer/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:104
 * @route '/customer/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:104
 * @route '/customer/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:104
 * @route '/customer/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:104
 * @route '/customer/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:104
 * @route '/customer/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
const customer = {
    search,
}

export default customer