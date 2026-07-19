import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::exportMethod
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:0
 * @route '/report/commisions/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/report/commisions/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::exportMethod
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:0
 * @route '/report/commisions/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::exportMethod
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:0
 * @route '/report/commisions/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::exportMethod
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:0
 * @route '/report/commisions/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::exportMethod
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:0
 * @route '/report/commisions/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::exportMethod
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:0
 * @route '/report/commisions/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Report\Komisi\ComissionController::exportMethod
 * @see app/Http/Controllers/Report/Komisi/ComissionController.php:0
 * @route '/report/commisions/export'
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
const commissions = {
    export: exportMethod,
}

export default commissions