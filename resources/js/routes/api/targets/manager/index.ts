import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:141
 * @route '/api/targets/manager'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/api/targets/manager',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:141
 * @route '/api/targets/manager'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:141
 * @route '/api/targets/manager'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:141
 * @route '/api/targets/manager'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:141
 * @route '/api/targets/manager'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
const manager = {
    update,
}

export default manager