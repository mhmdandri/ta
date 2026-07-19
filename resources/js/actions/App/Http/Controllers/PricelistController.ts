import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PricelistController::show
 * @see app/Http/Controllers/PricelistController.php:9
 * @route '/pricelists/{productId}'
 */
export const show = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/pricelists/{productId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PricelistController::show
 * @see app/Http/Controllers/PricelistController.php:9
 * @route '/pricelists/{productId}'
 */
show.url = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { productId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    productId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        productId: args.productId,
                }

    return show.definition.url
            .replace('{productId}', parsedArgs.productId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PricelistController::show
 * @see app/Http/Controllers/PricelistController.php:9
 * @route '/pricelists/{productId}'
 */
show.get = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PricelistController::show
 * @see app/Http/Controllers/PricelistController.php:9
 * @route '/pricelists/{productId}'
 */
show.head = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PricelistController::show
 * @see app/Http/Controllers/PricelistController.php:9
 * @route '/pricelists/{productId}'
 */
    const showForm = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PricelistController::show
 * @see app/Http/Controllers/PricelistController.php:9
 * @route '/pricelists/{productId}'
 */
        showForm.get = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PricelistController::show
 * @see app/Http/Controllers/PricelistController.php:9
 * @route '/pricelists/{productId}'
 */
        showForm.head = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const PricelistController = { show }

export default PricelistController