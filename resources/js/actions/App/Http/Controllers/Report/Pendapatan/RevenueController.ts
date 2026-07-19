import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::index
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/report/revenue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::index
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::index
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::index
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::index
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::index
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::index
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:22
 * @route '/report/revenue'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::exportMethod
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:159
 * @route '/report/revenue/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/report/revenue/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::exportMethod
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:159
 * @route '/report/revenue/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::exportMethod
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:159
 * @route '/report/revenue/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::exportMethod
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:159
 * @route '/report/revenue/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::exportMethod
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:159
 * @route '/report/revenue/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::exportMethod
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:159
 * @route '/report/revenue/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Report\Pendapatan\RevenueController::exportMethod
 * @see app/Http/Controllers/Report/Pendapatan/RevenueController.php:159
 * @route '/report/revenue/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
const RevenueController = { index, exportMethod, export: exportMethod }

export default RevenueController