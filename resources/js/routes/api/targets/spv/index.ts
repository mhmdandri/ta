import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:181
 * @route '/api/targets/spv'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/api/targets/spv',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:181
 * @route '/api/targets/spv'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:181
 * @route '/api/targets/spv'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:181
 * @route '/api/targets/spv'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:181
 * @route '/api/targets/spv'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
const spv = {
    update,
}

export default spv