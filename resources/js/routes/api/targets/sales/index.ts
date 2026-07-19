import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:219
 * @route '/api/targets/sales'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/api/targets/sales',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:219
 * @route '/api/targets/sales'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:219
 * @route '/api/targets/sales'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:219
 * @route '/api/targets/sales'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:219
 * @route '/api/targets/sales'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
const sales = {
    update,
}

export default sales