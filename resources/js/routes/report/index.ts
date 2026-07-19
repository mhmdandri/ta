import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import rekap from './rekap'
import revenue from './revenue'
import commissions from './commissions'
/**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::revenue
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
export const revenue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: revenue.url(options),
    method: 'get',
})

revenue.definition = {
    methods: ["get","head"],
    url: '/report/revenue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::revenue
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
revenue.url = (options?: RouteQueryOptions) => {
    return revenue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::revenue
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
revenue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: revenue.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::revenue
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
revenue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: revenue.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::revenue
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
    const revenueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: revenue.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::revenue
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
        revenueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: revenue.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::revenue
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
        revenueForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: revenue.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    revenue.form = revenueForm
/**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::commissions
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:24
 * @route '/report/commisions'
 */
export const commissions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: commissions.url(options),
    method: 'get',
})

commissions.definition = {
    methods: ["get","head"],
    url: '/report/commisions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::commissions
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:24
 * @route '/report/commisions'
 */
commissions.url = (options?: RouteQueryOptions) => {
    return commissions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::commissions
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:24
 * @route '/report/commisions'
 */
commissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: commissions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::commissions
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:24
 * @route '/report/commisions'
 */
commissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: commissions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::commissions
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:24
 * @route '/report/commisions'
 */
    const commissionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: commissions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::commissions
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:24
 * @route '/report/commisions'
 */
        commissionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: commissions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::commissions
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:24
 * @route '/report/commisions'
 */
        commissionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: commissions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    commissions.form = commissionsForm
const report = {
    rekap,
revenue,
commissions,
}

export default report