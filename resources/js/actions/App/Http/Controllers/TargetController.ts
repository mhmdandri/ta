import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TargetController::index
 * @see app/Http/Controllers/TargetController.php:27
 * @route '/targets'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/targets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TargetController::index
 * @see app/Http/Controllers/TargetController.php:27
 * @route '/targets'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::index
 * @see app/Http/Controllers/TargetController.php:27
 * @route '/targets'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TargetController::index
 * @see app/Http/Controllers/TargetController.php:27
 * @route '/targets'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TargetController::index
 * @see app/Http/Controllers/TargetController.php:27
 * @route '/targets'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TargetController::index
 * @see app/Http/Controllers/TargetController.php:27
 * @route '/targets'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TargetController::index
 * @see app/Http/Controllers/TargetController.php:27
 * @route '/targets'
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
* @see \App\Http\Controllers\TargetController::create
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/targets/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TargetController::create
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::create
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TargetController::create
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TargetController::create
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TargetController::create
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TargetController::create
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\TargetController::store
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/targets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TargetController::store
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::store
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TargetController::store
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TargetController::store
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TargetController::show
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
export const show = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/targets/{target}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TargetController::show
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
show.url = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { target: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    target: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        target: args.target,
                }

    return show.definition.url
            .replace('{target}', parsedArgs.target.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::show
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
show.get = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TargetController::show
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
show.head = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TargetController::show
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
    const showForm = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TargetController::show
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
        showForm.get = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TargetController::show
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
        showForm.head = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\TargetController::edit
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}/edit'
 */
export const edit = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/targets/{target}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TargetController::edit
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}/edit'
 */
edit.url = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { target: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    target: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        target: args.target,
                }

    return edit.definition.url
            .replace('{target}', parsedArgs.target.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::edit
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}/edit'
 */
edit.get = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TargetController::edit
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}/edit'
 */
edit.head = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TargetController::edit
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}/edit'
 */
    const editForm = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TargetController::edit
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}/edit'
 */
        editForm.get = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TargetController::edit
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}/edit'
 */
        editForm.head = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
export const update = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/targets/{target}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
update.url = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { target: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    target: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        target: args.target,
                }

    return update.definition.url
            .replace('{target}', parsedArgs.target.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
update.put = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
update.patch = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
    const updateForm = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
        updateForm.put = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\TargetController::update
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
        updateForm.patch = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\TargetController::destroy
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
export const destroy = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/targets/{target}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TargetController::destroy
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
destroy.url = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { target: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    target: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        target: args.target,
                }

    return destroy.definition.url
            .replace('{target}', parsedArgs.target.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::destroy
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
destroy.delete = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TargetController::destroy
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
    const destroyForm = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TargetController::destroy
 * @see app/Http/Controllers/TargetController.php:0
 * @route '/targets/{target}'
 */
        destroyForm.delete = (args: { target: string | number } | [target: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\TargetController::updateManagerTarget
 * @see app/Http/Controllers/TargetController.php:141
 * @route '/api/targets/manager'
 */
export const updateManagerTarget = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateManagerTarget.url(options),
    method: 'post',
})

updateManagerTarget.definition = {
    methods: ["post"],
    url: '/api/targets/manager',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TargetController::updateManagerTarget
 * @see app/Http/Controllers/TargetController.php:141
 * @route '/api/targets/manager'
 */
updateManagerTarget.url = (options?: RouteQueryOptions) => {
    return updateManagerTarget.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::updateManagerTarget
 * @see app/Http/Controllers/TargetController.php:141
 * @route '/api/targets/manager'
 */
updateManagerTarget.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateManagerTarget.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TargetController::updateManagerTarget
 * @see app/Http/Controllers/TargetController.php:141
 * @route '/api/targets/manager'
 */
    const updateManagerTargetForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateManagerTarget.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TargetController::updateManagerTarget
 * @see app/Http/Controllers/TargetController.php:141
 * @route '/api/targets/manager'
 */
        updateManagerTargetForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateManagerTarget.url(options),
            method: 'post',
        })
    
    updateManagerTarget.form = updateManagerTargetForm
/**
* @see \App\Http\Controllers\TargetController::updateSpvTarget
 * @see app/Http/Controllers/TargetController.php:181
 * @route '/api/targets/spv'
 */
export const updateSpvTarget = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSpvTarget.url(options),
    method: 'post',
})

updateSpvTarget.definition = {
    methods: ["post"],
    url: '/api/targets/spv',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TargetController::updateSpvTarget
 * @see app/Http/Controllers/TargetController.php:181
 * @route '/api/targets/spv'
 */
updateSpvTarget.url = (options?: RouteQueryOptions) => {
    return updateSpvTarget.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::updateSpvTarget
 * @see app/Http/Controllers/TargetController.php:181
 * @route '/api/targets/spv'
 */
updateSpvTarget.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSpvTarget.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TargetController::updateSpvTarget
 * @see app/Http/Controllers/TargetController.php:181
 * @route '/api/targets/spv'
 */
    const updateSpvTargetForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSpvTarget.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TargetController::updateSpvTarget
 * @see app/Http/Controllers/TargetController.php:181
 * @route '/api/targets/spv'
 */
        updateSpvTargetForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSpvTarget.url(options),
            method: 'post',
        })
    
    updateSpvTarget.form = updateSpvTargetForm
/**
* @see \App\Http\Controllers\TargetController::updateSalesTarget
 * @see app/Http/Controllers/TargetController.php:219
 * @route '/api/targets/sales'
 */
export const updateSalesTarget = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSalesTarget.url(options),
    method: 'post',
})

updateSalesTarget.definition = {
    methods: ["post"],
    url: '/api/targets/sales',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TargetController::updateSalesTarget
 * @see app/Http/Controllers/TargetController.php:219
 * @route '/api/targets/sales'
 */
updateSalesTarget.url = (options?: RouteQueryOptions) => {
    return updateSalesTarget.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TargetController::updateSalesTarget
 * @see app/Http/Controllers/TargetController.php:219
 * @route '/api/targets/sales'
 */
updateSalesTarget.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSalesTarget.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TargetController::updateSalesTarget
 * @see app/Http/Controllers/TargetController.php:219
 * @route '/api/targets/sales'
 */
    const updateSalesTargetForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSalesTarget.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TargetController::updateSalesTarget
 * @see app/Http/Controllers/TargetController.php:219
 * @route '/api/targets/sales'
 */
        updateSalesTargetForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSalesTarget.url(options),
            method: 'post',
        })
    
    updateSalesTarget.form = updateSalesTargetForm
const TargetController = { index, create, store, show, edit, update, destroy, updateManagerTarget, updateSpvTarget, updateSalesTarget }

export default TargetController