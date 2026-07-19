import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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
const revenue = {
    export: exportMethod,
}

export default revenue