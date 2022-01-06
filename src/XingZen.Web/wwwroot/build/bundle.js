
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    var e=function(t,n){return (e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);})(t,n)};function t(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function r(){this.constructor=t;}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r);}var n=function(){return (n=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function r(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);}return n}function o(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e));}catch(e){i(e);}}function c(e){try{s(r.throw(e));}catch(e){i(e);}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t);}))).then(a,c);}s((r=r.apply(e,t||[])).next());}))}function i(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=a.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a);}catch(e){i=[6,e],r=0;}finally{n=o=0;}if(5&i[0])throw i[1];return {value:i[0]?i[1]:void 0,done:!0}}([i,c])}}}function a(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,i=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=i.next()).done;)a.push(r.value);}catch(e){o={error:e};}finally{try{r&&!r.done&&(n=i.return)&&n.call(i);}finally{if(o)throw o.error}}return a}function c(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))}var s="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function u(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function l(e,t){return e(t={exports:{}},t.exports),t.exports}var f,d,h=function(e){return e&&e.Math==Math&&e},p=h("object"==typeof globalThis&&globalThis)||h("object"==typeof window&&window)||h("object"==typeof self&&self)||h("object"==typeof s&&s)||function(){return this}()||Function("return this")(),y=function(e){try{return !!e()}catch(e){return !0}},v=!y((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),m=Function.prototype.call,g=m.bind?m.bind(m):function(){return m.apply(m,arguments)},b={}.propertyIsEnumerable,w=Object.getOwnPropertyDescriptor,S={f:w&&!b.call({1:2},1)?function(e){var t=w(this,e);return !!t&&t.enumerable}:b},_=function(e,t){return {enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}},k=Function.prototype,I=k.bind,T=k.call,O=I&&I.bind(T),E=I?function(e){return e&&O(T,e)}:function(e){return e&&function(){return T.apply(e,arguments)}},x=E({}.toString),C=E("".slice),R=function(e){return C(x(e),8,-1)},F=p.Object,A=E("".split),j=y((function(){return !F("z").propertyIsEnumerable(0)}))?function(e){return "String"==R(e)?A(e,""):F(e)}:F,U=p.TypeError,K=function(e){if(null==e)throw U("Can't call method on "+e);return e},P=function(e){return j(K(e))},L=function(e){return "function"==typeof e},W=function(e){return "object"==typeof e?null!==e:L(e)},Z=function(e){return L(e)?e:void 0},V=function(e,t){return arguments.length<2?Z(p[e]):p[e]&&p[e][t]},N=E({}.isPrototypeOf),X=V("navigator","userAgent")||"",D=p.process,z=p.Deno,Y=D&&D.versions||z&&z.version,J=Y&&Y.v8;J&&(d=(f=J.split("."))[0]>0&&f[0]<4?1:+(f[0]+f[1])),!d&&X&&(!(f=X.match(/Edge\/(\d+)/))||f[1]>=74)&&(f=X.match(/Chrome\/(\d+)/))&&(d=+f[1]);var B=d,G=!!Object.getOwnPropertySymbols&&!y((function(){var e=Symbol();return !String(e)||!(Object(e)instanceof Symbol)||!Symbol.sham&&B&&B<41})),M=G&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,H=p.Object,q=M?function(e){return "symbol"==typeof e}:function(e){var t=V("Symbol");return L(t)&&N(t.prototype,H(e))},Q=p.String,$=function(e){try{return Q(e)}catch(e){return "Object"}},ee=p.TypeError,te=function(e){if(L(e))return e;throw ee($(e)+" is not a function")},ne=function(e,t){var n=e[t];return null==n?void 0:te(n)},re=p.TypeError,oe=Object.defineProperty,ie=function(e,t){try{oe(p,e,{value:t,configurable:!0,writable:!0});}catch(n){p[e]=t;}return t},ae=p["__core-js_shared__"]||ie("__core-js_shared__",{}),ce=l((function(e){(e.exports=function(e,t){return ae[e]||(ae[e]=void 0!==t?t:{})})("versions",[]).push({version:"3.19.1",mode:"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"});})),se=p.Object,ue=function(e){return se(K(e))},le=E({}.hasOwnProperty),fe=Object.hasOwn||function(e,t){return le(ue(e),t)},de=0,he=Math.random(),pe=E(1..toString),ye=function(e){return "Symbol("+(void 0===e?"":e)+")_"+pe(++de+he,36)},ve=ce("wks"),me=p.Symbol,ge=me&&me.for,be=M?me:me&&me.withoutSetter||ye,we=function(e){if(!fe(ve,e)||!G&&"string"!=typeof ve[e]){var t="Symbol."+e;G&&fe(me,e)?ve[e]=me[e]:ve[e]=M&&ge?ge(t):be(t);}return ve[e]},Se=p.TypeError,_e=we("toPrimitive"),ke=function(e,t){if(!W(e)||q(e))return e;var n,r=ne(e,_e);if(r){if(void 0===t&&(t="default"),n=g(r,e,t),!W(n)||q(n))return n;throw Se("Can't convert object to primitive value")}return void 0===t&&(t="number"),function(e,t){var n,r;if("string"===t&&L(n=e.toString)&&!W(r=g(n,e)))return r;if(L(n=e.valueOf)&&!W(r=g(n,e)))return r;if("string"!==t&&L(n=e.toString)&&!W(r=g(n,e)))return r;throw re("Can't convert object to primitive value")}(e,t)},Ie=function(e){var t=ke(e,"string");return q(t)?t:t+""},Te=p.document,Oe=W(Te)&&W(Te.createElement),Ee=function(e){return Oe?Te.createElement(e):{}},xe=!v&&!y((function(){return 7!=Object.defineProperty(Ee("div"),"a",{get:function(){return 7}}).a})),Ce=Object.getOwnPropertyDescriptor,Re={f:v?Ce:function(e,t){if(e=P(e),t=Ie(t),xe)try{return Ce(e,t)}catch(e){}if(fe(e,t))return _(!g(S.f,e,t),e[t])}},Fe=p.String,Ae=p.TypeError,je=function(e){if(W(e))return e;throw Ae(Fe(e)+" is not an object")},Ue=p.TypeError,Ke=Object.defineProperty,Pe={f:v?Ke:function(e,t,n){if(je(e),t=Ie(t),je(n),xe)try{return Ke(e,t,n)}catch(e){}if("get"in n||"set"in n)throw Ue("Accessors not supported");return "value"in n&&(e[t]=n.value),e}},Le=v?function(e,t,n){return Pe.f(e,t,_(1,n))}:function(e,t,n){return e[t]=n,e},We=E(Function.toString);L(ae.inspectSource)||(ae.inspectSource=function(e){return We(e)});var Ze,Ve,Ne,Xe=ae.inspectSource,De=p.WeakMap,ze=L(De)&&/native code/.test(Xe(De)),Ye=ce("keys"),Je=function(e){return Ye[e]||(Ye[e]=ye(e))},Be={},Ge=p.TypeError,Me=p.WeakMap;if(ze||ae.state){var He=ae.state||(ae.state=new Me),qe=E(He.get),Qe=E(He.has),$e=E(He.set);Ze=function(e,t){if(Qe(He,e))throw new Ge("Object already initialized");return t.facade=e,$e(He,e,t),t},Ve=function(e){return qe(He,e)||{}},Ne=function(e){return Qe(He,e)};}else {var et=Je("state");Be[et]=!0,Ze=function(e,t){if(fe(e,et))throw new Ge("Object already initialized");return t.facade=e,Le(e,et,t),t},Ve=function(e){return fe(e,et)?e[et]:{}},Ne=function(e){return fe(e,et)};}var tt={set:Ze,get:Ve,has:Ne,enforce:function(e){return Ne(e)?Ve(e):Ze(e,{})},getterFor:function(e){return function(t){var n;if(!W(t)||(n=Ve(t)).type!==e)throw Ge("Incompatible receiver, "+e+" required");return n}}},nt=Function.prototype,rt=v&&Object.getOwnPropertyDescriptor,ot=fe(nt,"name"),it={EXISTS:ot,PROPER:ot&&"something"===function(){}.name,CONFIGURABLE:ot&&(!v||v&&rt(nt,"name").configurable)},at=l((function(e){var t=it.CONFIGURABLE,n=tt.get,r=tt.enforce,o=String(String).split("String");(e.exports=function(e,n,i,a){var c,s=!!a&&!!a.unsafe,u=!!a&&!!a.enumerable,l=!!a&&!!a.noTargetGet,f=a&&void 0!==a.name?a.name:n;L(i)&&("Symbol("===String(f).slice(0,7)&&(f="["+String(f).replace(/^Symbol\(([^)]*)\)/,"$1")+"]"),(!fe(i,"name")||t&&i.name!==f)&&Le(i,"name",f),(c=r(i)).source||(c.source=o.join("string"==typeof f?f:""))),e!==p?(s?!l&&e[n]&&(u=!0):delete e[n],u?e[n]=i:Le(e,n,i)):u?e[n]=i:ie(n,i);})(Function.prototype,"toString",(function(){return L(this)&&n(this).source||Xe(this)}));})),ct=Math.ceil,st=Math.floor,ut=function(e){var t=+e;return t!=t||0===t?0:(t>0?st:ct)(t)},lt=Math.max,ft=Math.min,dt=Math.min,ht=function(e){return e>0?dt(ut(e),9007199254740991):0},pt=function(e){return ht(e.length)},yt=function(e){return function(t,n,r){var o,i=P(t),a=pt(i),c=function(e,t){var n=ut(e);return n<0?lt(n+t,0):ft(n,t)}(r,a);if(e&&n!=n){for(;a>c;)if((o=i[c++])!=o)return !0}else for(;a>c;c++)if((e||c in i)&&i[c]===n)return e||c||0;return !e&&-1}},vt={includes:yt(!0),indexOf:yt(!1)},mt=vt.indexOf,gt=E([].push),bt=function(e,t){var n,r=P(e),o=0,i=[];for(n in r)!fe(Be,n)&&fe(r,n)&&gt(i,n);for(;t.length>o;)fe(r,n=t[o++])&&(~mt(i,n)||gt(i,n));return i},wt=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],St=wt.concat("length","prototype"),_t={f:Object.getOwnPropertyNames||function(e){return bt(e,St)}},kt={f:Object.getOwnPropertySymbols},It=E([].concat),Tt=V("Reflect","ownKeys")||function(e){var t=_t.f(je(e)),n=kt.f;return n?It(t,n(e)):t},Ot=function(e,t){for(var n=Tt(t),r=Pe.f,o=Re.f,i=0;i<n.length;i++){var a=n[i];fe(e,a)||r(e,a,o(t,a));}},Et=/#|\.prototype\./,xt=function(e,t){var n=Rt[Ct(e)];return n==At||n!=Ft&&(L(t)?y(t):!!t)},Ct=xt.normalize=function(e){return String(e).replace(Et,".").toLowerCase()},Rt=xt.data={},Ft=xt.NATIVE="N",At=xt.POLYFILL="P",jt=xt,Ut=Re.f,Kt=function(e,t){var n,r,o,i,a,c=e.target,s=e.global,u=e.stat;if(n=s?p:u?p[c]||ie(c,{}):(p[c]||{}).prototype)for(r in t){if(i=t[r],o=e.noTargetGet?(a=Ut(n,r))&&a.value:n[r],!jt(s?r:c+(u?".":"#")+r,e.forced)&&void 0!==o){if(typeof i==typeof o)continue;Ot(i,o);}(e.sham||o&&o.sham)&&Le(i,"sham",!0),at(n,r,i,e);}},Pt={};Pt[we("toStringTag")]="z";var Lt,Wt="[object z]"===String(Pt),Zt=we("toStringTag"),Vt=p.Object,Nt="Arguments"==R(function(){return arguments}()),Xt=Wt?R:function(e){var t,n,r;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=function(e,t){try{return e[t]}catch(e){}}(t=Vt(e),Zt))?n:Nt?R(t):"Object"==(r=R(t))&&L(t.callee)?"Arguments":r},Dt=p.String,zt=function(e){if("Symbol"===Xt(e))throw TypeError("Cannot convert a Symbol value to a string");return Dt(e)},Yt=we("match"),Jt=p.TypeError,Bt=function(e){if(function(e){var t;return W(e)&&(void 0!==(t=e[Yt])?!!t:"RegExp"==R(e))}(e))throw Jt("The method doesn't accept regular expressions");return e},Gt=we("match"),Mt=function(e){var t=/./;try{"/./"[e](t);}catch(n){try{return t[Gt]=!1,"/./"[e](t)}catch(e){}}return !1},Ht=Re.f,qt=E("".startsWith),Qt=E("".slice),$t=Math.min,en=Mt("startsWith"),tn=!(en||(Lt=Ht(String.prototype,"startsWith"),!Lt||Lt.writable));Kt({target:"String",proto:!0,forced:!tn&&!en},{startsWith:function(e){var t=zt(K(this));Bt(e);var n=ht($t(arguments.length>1?arguments[1]:void 0,t.length)),r=zt(e);return qt?qt(t,r,n):Qt(t,n,n+r.length)===r}});var nn=function(e,t){return E(p[e].prototype[t])};nn("String","startsWith");var rn,on=Array.isArray||function(e){return "Array"==R(e)},an=function(e,t,n){var r=Ie(t);r in e?Pe.f(e,r,_(0,n)):e[r]=n;},cn=function(){},sn=[],un=V("Reflect","construct"),ln=/^\s*(?:class|function)\b/,fn=E(ln.exec),dn=!ln.exec(cn),hn=function(e){if(!L(e))return !1;try{return un(cn,sn,e),!0}catch(e){return !1}},pn=!un||y((function(){var e;return hn(hn.call)||!hn(Object)||!hn((function(){e=!0;}))||e}))?function(e){if(!L(e))return !1;switch(Xt(e)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return !1}return dn||!!fn(ln,Xe(e))}:hn,yn=we("species"),vn=p.Array,mn=function(e,t){return new(function(e){var t;return on(e)&&(t=e.constructor,(pn(t)&&(t===vn||on(t.prototype))||W(t)&&null===(t=t[yn]))&&(t=void 0)),void 0===t?vn:t}(e))(0===t?0:t)},gn=we("species"),bn=we("isConcatSpreadable"),wn=p.TypeError,Sn=B>=51||!y((function(){var e=[];return e[bn]=!1,e.concat()[0]!==e})),_n=(rn="concat",B>=51||!y((function(){var e=[];return (e.constructor={})[gn]=function(){return {foo:1}},1!==e[rn](Boolean).foo}))),kn=function(e){if(!W(e))return !1;var t=e[bn];return void 0!==t?!!t:on(e)};Kt({target:"Array",proto:!0,forced:!Sn||!_n},{concat:function(e){var t,n,r,o,i,a=ue(this),c=mn(a,0),s=0;for(t=-1,r=arguments.length;t<r;t++)if(kn(i=-1===t?a:arguments[t])){if(s+(o=pt(i))>9007199254740991)throw wn("Maximum allowed index exceeded");for(n=0;n<o;n++,s++)n in i&&an(c,s,i[n]);}else {if(s>=9007199254740991)throw wn("Maximum allowed index exceeded");an(c,s++,i);}return c.length=s,c}});var In=Wt?{}.toString:function(){return "[object "+Xt(this)+"]"};Wt||at(Object.prototype,"toString",In,{unsafe:!0});var Tn,On=Function.prototype,En=On.apply,xn=On.bind,Cn=On.call,Rn="object"==typeof Reflect&&Reflect.apply||(xn?Cn.bind(En):function(){return Cn.apply(En,arguments)}),Fn=Object.keys||function(e){return bt(e,wt)},An=v?Object.defineProperties:function(e,t){je(e);for(var n,r=P(t),o=Fn(t),i=o.length,a=0;i>a;)Pe.f(e,n=o[a++],r[n]);return e},jn=V("document","documentElement"),Un=Je("IE_PROTO"),Kn=function(){},Pn=function(e){return "<script>"+e+"<\/script>"},Ln=function(e){e.write(Pn("")),e.close();var t=e.parentWindow.Object;return e=null,t},Wn=function(){try{Tn=new ActiveXObject("htmlfile");}catch(e){}var e,t;Wn="undefined"!=typeof document?document.domain&&Tn?Ln(Tn):((t=Ee("iframe")).style.display="none",jn.appendChild(t),t.src=String("javascript:"),(e=t.contentWindow.document).open(),e.write(Pn("document.F=Object")),e.close(),e.F):Ln(Tn);for(var n=wt.length;n--;)delete Wn.prototype[wt[n]];return Wn()};Be[Un]=!0;var Zn=Object.create||function(e,t){var n;return null!==e?(Kn.prototype=je(e),n=new Kn,Kn.prototype=null,n[Un]=e):n=Wn(),void 0===t?n:An(n,t)},Vn=E([].slice),Nn=_t.f,Xn="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],Dn={f:function(e){return Xn&&"Window"==R(e)?function(e){try{return Nn(e)}catch(e){return Vn(Xn)}}(e):Nn(P(e))}},zn={f:we},Yn=p,Jn=Pe.f,Bn=function(e){var t=Yn.Symbol||(Yn.Symbol={});fe(t,e)||Jn(t,e,{value:zn.f(e)});},Gn=Pe.f,Mn=we("toStringTag"),Hn=function(e,t,n){e&&!fe(e=n?e:e.prototype,Mn)&&Gn(e,Mn,{configurable:!0,value:t});},qn=E(E.bind),Qn=function(e,t){return te(e),void 0===t?e:qn?qn(e,t):function(){return e.apply(t,arguments)}},$n=E([].push),er=function(e){var t=1==e,n=2==e,r=3==e,o=4==e,i=6==e,a=7==e,c=5==e||i;return function(s,u,l,f){for(var d,h,p=ue(s),y=j(p),v=Qn(u,l),m=pt(y),g=0,b=f||mn,w=t?b(s,m):n||a?b(s,0):void 0;m>g;g++)if((c||g in y)&&(h=v(d=y[g],g,p),e))if(t)w[g]=h;else if(h)switch(e){case 3:return !0;case 5:return d;case 6:return g;case 2:$n(w,d);}else switch(e){case 4:return !1;case 7:$n(w,d);}return i?-1:r||o?o:w}},tr={forEach:er(0),map:er(1),filter:er(2),some:er(3),every:er(4),find:er(5),findIndex:er(6),filterReject:er(7)}.forEach,nr=Je("hidden"),rr=we("toPrimitive"),or=tt.set,ir=tt.getterFor("Symbol"),ar=Object.prototype,cr=p.Symbol,sr=cr&&cr.prototype,ur=p.TypeError,lr=p.QObject,fr=V("JSON","stringify"),dr=Re.f,hr=Pe.f,pr=Dn.f,yr=S.f,vr=E([].push),mr=ce("symbols"),gr=ce("op-symbols"),br=ce("string-to-symbol-registry"),wr=ce("symbol-to-string-registry"),Sr=ce("wks"),_r=!lr||!lr.prototype||!lr.prototype.findChild,kr=v&&y((function(){return 7!=Zn(hr({},"a",{get:function(){return hr(this,"a",{value:7}).a}})).a}))?function(e,t,n){var r=dr(ar,t);r&&delete ar[t],hr(e,t,n),r&&e!==ar&&hr(ar,t,r);}:hr,Ir=function(e,t){var n=mr[e]=Zn(sr);return or(n,{type:"Symbol",tag:e,description:t}),v||(n.description=t),n},Tr=function(e,t,n){e===ar&&Tr(gr,t,n),je(e);var r=Ie(t);return je(n),fe(mr,r)?(n.enumerable?(fe(e,nr)&&e[nr][r]&&(e[nr][r]=!1),n=Zn(n,{enumerable:_(0,!1)})):(fe(e,nr)||hr(e,nr,_(1,{})),e[nr][r]=!0),kr(e,r,n)):hr(e,r,n)},Or=function(e,t){je(e);var n=P(t),r=Fn(n).concat(Rr(n));return tr(r,(function(t){v&&!g(Er,n,t)||Tr(e,t,n[t]);})),e},Er=function(e){var t=Ie(e),n=g(yr,this,t);return !(this===ar&&fe(mr,t)&&!fe(gr,t))&&(!(n||!fe(this,t)||!fe(mr,t)||fe(this,nr)&&this[nr][t])||n)},xr=function(e,t){var n=P(e),r=Ie(t);if(n!==ar||!fe(mr,r)||fe(gr,r)){var o=dr(n,r);return !o||!fe(mr,r)||fe(n,nr)&&n[nr][r]||(o.enumerable=!0),o}},Cr=function(e){var t=pr(P(e)),n=[];return tr(t,(function(e){fe(mr,e)||fe(Be,e)||vr(n,e);})),n},Rr=function(e){var t=e===ar,n=pr(t?gr:P(e)),r=[];return tr(n,(function(e){!fe(mr,e)||t&&!fe(ar,e)||vr(r,mr[e]);})),r};if(G||(sr=(cr=function(){if(N(sr,this))throw ur("Symbol is not a constructor");var e=arguments.length&&void 0!==arguments[0]?zt(arguments[0]):void 0,t=ye(e),n=function(e){this===ar&&g(n,gr,e),fe(this,nr)&&fe(this[nr],t)&&(this[nr][t]=!1),kr(this,t,_(1,e));};return v&&_r&&kr(ar,t,{configurable:!0,set:n}),Ir(t,e)}).prototype,at(sr,"toString",(function(){return ir(this).tag})),at(cr,"withoutSetter",(function(e){return Ir(ye(e),e)})),S.f=Er,Pe.f=Tr,Re.f=xr,_t.f=Dn.f=Cr,kt.f=Rr,zn.f=function(e){return Ir(we(e),e)},v&&(hr(sr,"description",{configurable:!0,get:function(){return ir(this).description}}),at(ar,"propertyIsEnumerable",Er,{unsafe:!0}))),Kt({global:!0,wrap:!0,forced:!G,sham:!G},{Symbol:cr}),tr(Fn(Sr),(function(e){Bn(e);})),Kt({target:"Symbol",stat:!0,forced:!G},{for:function(e){var t=zt(e);if(fe(br,t))return br[t];var n=cr(t);return br[t]=n,wr[n]=t,n},keyFor:function(e){if(!q(e))throw ur(e+" is not a symbol");if(fe(wr,e))return wr[e]},useSetter:function(){_r=!0;},useSimple:function(){_r=!1;}}),Kt({target:"Object",stat:!0,forced:!G,sham:!v},{create:function(e,t){return void 0===t?Zn(e):Or(Zn(e),t)},defineProperty:Tr,defineProperties:Or,getOwnPropertyDescriptor:xr}),Kt({target:"Object",stat:!0,forced:!G},{getOwnPropertyNames:Cr,getOwnPropertySymbols:Rr}),Kt({target:"Object",stat:!0,forced:y((function(){kt.f(1);}))},{getOwnPropertySymbols:function(e){return kt.f(ue(e))}}),fr){var Fr=!G||y((function(){var e=cr();return "[null]"!=fr([e])||"{}"!=fr({a:e})||"{}"!=fr(Object(e))}));Kt({target:"JSON",stat:!0,forced:Fr},{stringify:function(e,t,n){var r=Vn(arguments),o=t;if((W(t)||void 0!==e)&&!q(e))return on(t)||(t=function(e,t){if(L(o)&&(t=g(o,this,e,t)),!q(t))return t}),r[1]=t,Rn(fr,null,r)}});}if(!sr[rr]){var Ar=sr.valueOf;at(sr,rr,(function(e){return g(Ar,this)}));}Hn(cr,"Symbol"),Be[nr]=!0,Bn("asyncIterator");var jr=Pe.f,Ur=p.Symbol,Kr=Ur&&Ur.prototype;if(v&&L(Ur)&&(!("description"in Kr)||void 0!==Ur().description)){var Pr={},Lr=function(){var e=arguments.length<1||void 0===arguments[0]?void 0:zt(arguments[0]),t=N(Kr,this)?new Ur(e):void 0===e?Ur():Ur(e);return ""===e&&(Pr[t]=!0),t};Ot(Lr,Ur),Lr.prototype=Kr,Kr.constructor=Lr;var Wr="Symbol(test)"==String(Ur("test")),Zr=E(Kr.toString),Vr=E(Kr.valueOf),Nr=/^Symbol\((.*)\)[^)]+$/,Xr=E("".replace),Dr=E("".slice);jr(Kr,"description",{configurable:!0,get:function(){var e=Vr(this),t=Zr(e);if(fe(Pr,e))return "";var n=Wr?Dr(t,7,-1):Xr(t,Nr,"$1");return ""===n?void 0:n}}),Kt({global:!0,forced:!0},{Symbol:Lr});}Bn("hasInstance"),Bn("isConcatSpreadable"),Bn("iterator"),Bn("match"),Bn("matchAll"),Bn("replace"),Bn("search"),Bn("species"),Bn("split"),Bn("toPrimitive"),Bn("toStringTag"),Bn("unscopables"),Hn(p.JSON,"JSON",!0),Hn(Math,"Math",!0),Kt({global:!0},{Reflect:{}}),Hn(p.Reflect,"Reflect",!0),Yn.Symbol;var zr,Yr,Jr,Br=E("".charAt),Gr=E("".charCodeAt),Mr=E("".slice),Hr=function(e){return function(t,n){var r,o,i=zt(K(t)),a=ut(n),c=i.length;return a<0||a>=c?e?"":void 0:(r=Gr(i,a))<55296||r>56319||a+1===c||(o=Gr(i,a+1))<56320||o>57343?e?Br(i,a):r:e?Mr(i,a,a+2):o-56320+(r-55296<<10)+65536}},qr={codeAt:Hr(!1),charAt:Hr(!0)},Qr=!y((function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype})),$r=Je("IE_PROTO"),eo=p.Object,to=eo.prototype,no=Qr?eo.getPrototypeOf:function(e){var t=ue(e);if(fe(t,$r))return t[$r];var n=t.constructor;return L(n)&&t instanceof n?n.prototype:t instanceof eo?to:null},ro=we("iterator"),oo=!1;[].keys&&("next"in(Jr=[].keys())?(Yr=no(no(Jr)))!==Object.prototype&&(zr=Yr):oo=!0),(null==zr||y((function(){var e={};return zr[ro].call(e)!==e})))&&(zr={}),L(zr[ro])||at(zr,ro,(function(){return this}));var io={IteratorPrototype:zr,BUGGY_SAFARI_ITERATORS:oo},ao={},co=io.IteratorPrototype,so=function(){return this},uo=p.String,lo=p.TypeError,fo=Object.setPrototypeOf||("__proto__"in{}?function(){var e,t=!1,n={};try{(e=E(Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set))(n,[]),t=n instanceof Array;}catch(e){}return function(n,r){return je(n),function(e){if("object"==typeof e||L(e))return e;throw lo("Can't set "+uo(e)+" as a prototype")}(r),t?e(n,r):n.__proto__=r,n}}():void 0),ho=it.PROPER,po=it.CONFIGURABLE,yo=io.IteratorPrototype,vo=io.BUGGY_SAFARI_ITERATORS,mo=we("iterator"),go=function(){return this},bo=function(e,t,n,r,o,i,a){!function(e,t,n){var r=t+" Iterator";e.prototype=Zn(co,{next:_(1,n)}),Hn(e,r,!1),ao[r]=so;}(n,t,r);var c,s,u,l=function(e){if(e===o&&y)return y;if(!vo&&e in h)return h[e];switch(e){case"keys":case"values":case"entries":return function(){return new n(this,e)}}return function(){return new n(this)}},f=t+" Iterator",d=!1,h=e.prototype,p=h[mo]||h["@@iterator"]||o&&h[o],y=!vo&&p||l(o),v="Array"==t&&h.entries||p;if(v&&(c=no(v.call(new e)))!==Object.prototype&&c.next&&(no(c)!==yo&&(fo?fo(c,yo):L(c[mo])||at(c,mo,go)),Hn(c,f,!0)),ho&&"values"==o&&p&&"values"!==p.name&&(po?Le(h,"name","values"):(d=!0,y=function(){return g(p,this)})),o)if(s={values:l("values"),keys:i?y:l("keys"),entries:l("entries")},a)for(u in s)(vo||d||!(u in h))&&at(h,u,s[u]);else Kt({target:t,proto:!0,forced:vo||d},s);return h[mo]!==y&&at(h,mo,y,{name:o}),ao[t]=y,s},wo=qr.charAt,So=tt.set,_o=tt.getterFor("String Iterator");bo(String,"String",(function(e){So(this,{type:"String Iterator",string:zt(e),index:0});}),(function(){var e,t=_o(this),n=t.string,r=t.index;return r>=n.length?{value:void 0,done:!0}:(e=wo(n,r),t.index+=e.length,{value:e,done:!1})}));var ko=function(e,t,n){var r,o;je(e);try{if(!(r=ne(e,"return"))){if("throw"===t)throw n;return n}r=g(r,e);}catch(e){o=!0,r=e;}if("throw"===t)throw n;if(o)throw r;return je(r),n},Io=function(e,t,n,r){try{return r?t(je(n)[0],n[1]):t(n)}catch(t){ko(e,"throw",t);}},To=we("iterator"),Oo=Array.prototype,Eo=function(e){return void 0!==e&&(ao.Array===e||Oo[To]===e)},xo=we("iterator"),Co=function(e){if(null!=e)return ne(e,xo)||ne(e,"@@iterator")||ao[Xt(e)]},Ro=p.TypeError,Fo=function(e,t){var n=arguments.length<2?Co(e):t;if(te(n))return je(g(n,e));throw Ro($(e)+" is not iterable")},Ao=p.Array,jo=we("iterator"),Uo=!1;try{var Ko=0,Po={next:function(){return {done:!!Ko++}},return:function(){Uo=!0;}};Po[jo]=function(){return this},Array.from(Po,(function(){throw 2}));}catch(e){}var Lo=function(e,t){if(!t&&!Uo)return !1;var n=!1;try{var r={};r[jo]=function(){return {next:function(){return {done:n=!0}}}},e(r);}catch(e){}return n},Wo=!Lo((function(e){Array.from(e);}));Kt({target:"Array",stat:!0,forced:Wo},{from:function(e){var t=ue(e),n=pn(this),r=arguments.length,o=r>1?arguments[1]:void 0,i=void 0!==o;i&&(o=Qn(o,r>2?arguments[2]:void 0));var a,c,s,u,l,f,d=Co(t),h=0;if(!d||this==Ao&&Eo(d))for(a=pt(t),c=n?new this(a):Ao(a);a>h;h++)f=i?o(t[h],h):t[h],an(c,h,f);else for(l=(u=Fo(t,d)).next,c=n?new this:[];!(s=g(l,u)).done;h++)f=i?Io(u,o,[s.value,h],!0):s.value,an(c,h,f);return c.length=h,c}}),Yn.Array.from;var Zo,Vo,No,Xo="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof DataView,Do=Pe.f,zo=p.Int8Array,Yo=zo&&zo.prototype,Jo=p.Uint8ClampedArray,Bo=Jo&&Jo.prototype,Go=zo&&no(zo),Mo=Yo&&no(Yo),Ho=Object.prototype,qo=p.TypeError,Qo=we("toStringTag"),$o=ye("TYPED_ARRAY_TAG"),ei=ye("TYPED_ARRAY_CONSTRUCTOR"),ti=Xo&&!!fo&&"Opera"!==Xt(p.opera),ni=!1,ri={Int8Array:1,Uint8Array:1,Uint8ClampedArray:1,Int16Array:2,Uint16Array:2,Int32Array:4,Uint32Array:4,Float32Array:4,Float64Array:8},oi={BigInt64Array:8,BigUint64Array:8},ii=function(e){if(!W(e))return !1;var t=Xt(e);return fe(ri,t)||fe(oi,t)};for(Zo in ri)(No=(Vo=p[Zo])&&Vo.prototype)?Le(No,ei,Vo):ti=!1;for(Zo in oi)(No=(Vo=p[Zo])&&Vo.prototype)&&Le(No,ei,Vo);if((!ti||!L(Go)||Go===Function.prototype)&&(Go=function(){throw qo("Incorrect invocation")},ti))for(Zo in ri)p[Zo]&&fo(p[Zo],Go);if((!ti||!Mo||Mo===Ho)&&(Mo=Go.prototype,ti))for(Zo in ri)p[Zo]&&fo(p[Zo].prototype,Mo);if(ti&&no(Bo)!==Mo&&fo(Bo,Mo),v&&!fe(Mo,Qo))for(Zo in ni=!0,Do(Mo,Qo,{get:function(){return W(this)?this[$o]:void 0}}),ri)p[Zo]&&Le(p[Zo],$o,Zo);var ai={NATIVE_ARRAY_BUFFER_VIEWS:ti,TYPED_ARRAY_CONSTRUCTOR:ei,TYPED_ARRAY_TAG:ni&&$o,aTypedArray:function(e){if(ii(e))return e;throw qo("Target is not a typed array")},aTypedArrayConstructor:function(e){if(L(e)&&(!fo||N(Go,e)))return e;throw qo($(e)+" is not a typed array constructor")},exportTypedArrayMethod:function(e,t,n){if(v){if(n)for(var r in ri){var o=p[r];if(o&&fe(o.prototype,e))try{delete o.prototype[e];}catch(e){}}Mo[e]&&!n||at(Mo,e,n?t:ti&&Yo[e]||t);}},exportTypedArrayStaticMethod:function(e,t,n){var r,o;if(v){if(fo){if(n)for(r in ri)if((o=p[r])&&fe(o,e))try{delete o[e];}catch(e){}if(Go[e]&&!n)return;try{return at(Go,e,n?t:ti&&Go[e]||t)}catch(e){}}for(r in ri)!(o=p[r])||o[e]&&!n||at(o,e,t);}},isView:function(e){if(!W(e))return !1;var t=Xt(e);return "DataView"===t||fe(ri,t)||fe(oi,t)},isTypedArray:ii,TypedArray:Go,TypedArrayPrototype:Mo},ci=p.TypeError,si=we("species"),ui=function(e,t){var n,r=je(e).constructor;return void 0===r||null==(n=je(r)[si])?t:function(e){if(pn(e))return e;throw ci($(e)+" is not a constructor")}(n)},li=ai.TYPED_ARRAY_CONSTRUCTOR,fi=ai.aTypedArrayConstructor,di=ai.aTypedArray;(0, ai.exportTypedArrayMethod)("slice",(function(e,t){for(var n,r=Vn(di(this),e,t),o=fi(ui(n=this,n[li])),i=0,a=r.length,c=new o(a);a>i;)c[i]=r[i++];return c}),y((function(){new Int8Array(1).slice();})));var hi=we("unscopables"),pi=Array.prototype;null==pi[hi]&&Pe.f(pi,hi,{configurable:!0,value:Zn(null)});var yi=function(e){pi[hi][e]=!0;},vi=vt.includes;Kt({target:"Array",proto:!0},{includes:function(e){return vi(this,e,arguments.length>1?arguments[1]:void 0)}}),yi("includes"),nn("Array","includes");var mi=E("".indexOf);Kt({target:"String",proto:!0,forced:!Mt("includes")},{includes:function(e){return !!~mi(zt(K(this)),zt(Bt(e)),arguments.length>1?arguments[1]:void 0)}}),nn("String","includes");var gi=tt.set,bi=tt.getterFor("Array Iterator");bo(Array,"Array",(function(e,t){gi(this,{type:"Array Iterator",target:P(e),index:0,kind:t});}),(function(){var e=bi(this),t=e.target,n=e.kind,r=e.index++;return !t||r>=t.length?(e.target=void 0,{value:void 0,done:!0}):"keys"==n?{value:r,done:!1}:"values"==n?{value:t[r],done:!1}:{value:[r,t[r]],done:!1}}),"values"),ao.Arguments=ao.Array,yi("keys"),yi("values"),yi("entries");var wi=y((function(){if("function"==typeof ArrayBuffer){var e=new ArrayBuffer(8);Object.isExtensible(e)&&Object.defineProperty(e,"a",{value:8});}})),Si=Object.isExtensible,_i=y((function(){Si(1);}))||wi?function(e){return !!W(e)&&((!wi||"ArrayBuffer"!=R(e))&&(!Si||Si(e)))}:Si,ki=!y((function(){return Object.isExtensible(Object.preventExtensions({}))})),Ii=l((function(e){var t=Pe.f,n=!1,r=ye("meta"),o=0,i=function(e){t(e,r,{value:{objectID:"O"+o++,weakData:{}}});},a=e.exports={enable:function(){a.enable=function(){},n=!0;var e=_t.f,t=E([].splice),o={};o[r]=1,e(o).length&&(_t.f=function(n){for(var o=e(n),i=0,a=o.length;i<a;i++)if(o[i]===r){t(o,i,1);break}return o},Kt({target:"Object",stat:!0,forced:!0},{getOwnPropertyNames:Dn.f}));},fastKey:function(e,t){if(!W(e))return "symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!fe(e,r)){if(!_i(e))return "F";if(!t)return "E";i(e);}return e[r].objectID},getWeakData:function(e,t){if(!fe(e,r)){if(!_i(e))return !0;if(!t)return !1;i(e);}return e[r].weakData},onFreeze:function(e){return ki&&n&&_i(e)&&!fe(e,r)&&i(e),e}};Be[r]=!0;}));Ii.enable,Ii.fastKey,Ii.getWeakData,Ii.onFreeze;var Ti=p.TypeError,Oi=function(e,t){this.stopped=e,this.result=t;},Ei=Oi.prototype,xi=function(e,t,n){var r,o,i,a,c,s,u,l=n&&n.that,f=!(!n||!n.AS_ENTRIES),d=!(!n||!n.IS_ITERATOR),h=!(!n||!n.INTERRUPTED),p=Qn(t,l),y=function(e){return r&&ko(r,"normal",e),new Oi(!0,e)},v=function(e){return f?(je(e),h?p(e[0],e[1],y):p(e[0],e[1])):h?p(e,y):p(e)};if(d)r=e;else {if(!(o=Co(e)))throw Ti($(e)+" is not iterable");if(Eo(o)){for(i=0,a=pt(e);a>i;i++)if((c=v(e[i]))&&N(Ei,c))return c;return new Oi(!1)}r=Fo(e,o);}for(s=r.next;!(u=g(s,r)).done;){try{c=v(u.value);}catch(e){ko(r,"throw",e);}if("object"==typeof c&&c&&N(Ei,c))return c}return new Oi(!1)},Ci=p.TypeError,Ri=function(e,t){if(N(t,e))return e;throw Ci("Incorrect invocation")},Fi=function(e,t,n){for(var r in t)at(e,r,t[r],n);return e},Ai=we("species"),ji=Pe.f,Ui=Ii.fastKey,Ki=tt.set,Pi=tt.getterFor,Li={getConstructor:function(e,t,n,r){var o=e((function(e,o){Ri(e,i),Ki(e,{type:t,index:Zn(null),first:void 0,last:void 0,size:0}),v||(e.size=0),null!=o&&xi(o,e[r],{that:e,AS_ENTRIES:n});})),i=o.prototype,a=Pi(t),c=function(e,t,n){var r,o,i=a(e),c=s(e,t);return c?c.value=n:(i.last=c={index:o=Ui(t,!0),key:t,value:n,previous:r=i.last,next:void 0,removed:!1},i.first||(i.first=c),r&&(r.next=c),v?i.size++:e.size++,"F"!==o&&(i.index[o]=c)),e},s=function(e,t){var n,r=a(e),o=Ui(t);if("F"!==o)return r.index[o];for(n=r.first;n;n=n.next)if(n.key==t)return n};return Fi(i,{clear:function(){for(var e=a(this),t=e.index,n=e.first;n;)n.removed=!0,n.previous&&(n.previous=n.previous.next=void 0),delete t[n.index],n=n.next;e.first=e.last=void 0,v?e.size=0:this.size=0;},delete:function(e){var t=this,n=a(t),r=s(t,e);if(r){var o=r.next,i=r.previous;delete n.index[r.index],r.removed=!0,i&&(i.next=o),o&&(o.previous=i),n.first==r&&(n.first=o),n.last==r&&(n.last=i),v?n.size--:t.size--;}return !!r},forEach:function(e){for(var t,n=a(this),r=Qn(e,arguments.length>1?arguments[1]:void 0);t=t?t.next:n.first;)for(r(t.value,t.key,this);t&&t.removed;)t=t.previous;},has:function(e){return !!s(this,e)}}),Fi(i,n?{get:function(e){var t=s(this,e);return t&&t.value},set:function(e,t){return c(this,0===e?0:e,t)}}:{add:function(e){return c(this,e=0===e?0:e,e)}}),v&&ji(i,"size",{get:function(){return a(this).size}}),o},setStrong:function(e,t,n){var r=t+" Iterator",o=Pi(t),i=Pi(r);bo(e,t,(function(e,t){Ki(this,{type:r,target:e,state:o(e),kind:t,last:void 0});}),(function(){for(var e=i(this),t=e.kind,n=e.last;n&&n.removed;)n=n.previous;return e.target&&(e.last=n=n?n.next:e.state.first)?"keys"==t?{value:n.key,done:!1}:"values"==t?{value:n.value,done:!1}:{value:[n.key,n.value],done:!1}:(e.target=void 0,{value:void 0,done:!0})}),n?"entries":"values",!n,!0),function(e){var t=V(e),n=Pe.f;v&&t&&!t[Ai]&&n(t,Ai,{configurable:!0,get:function(){return this}});}(t);}};function Wi(e){var t=this.constructor;return this.then((function(n){return t.resolve(e()).then((function(){return n}))}),(function(n){return t.resolve(e()).then((function(){return t.reject(n)}))}))}function Zi(e){return new this((function(t,n){if(!e||void 0===e.length)return n(new TypeError(typeof e+" "+e+" is not iterable(cannot read property Symbol(Symbol.iterator))"));var r=Array.prototype.slice.call(e);if(0===r.length)return t([]);var o=r.length;function i(e,n){if(n&&("object"==typeof n||"function"==typeof n)){var a=n.then;if("function"==typeof a)return void a.call(n,(function(t){i(e,t);}),(function(n){r[e]={status:"rejected",reason:n},0==--o&&t(r);}))}r[e]={status:"fulfilled",value:n},0==--o&&t(r);}for(var a=0;a<r.length;a++)i(a,r[a]);}))}!function(e,t,n){var r=-1!==e.indexOf("Map"),o=-1!==e.indexOf("Weak"),i=r?"set":"add",a=p[e],c=a&&a.prototype,s=a,u={},l=function(e){var t=E(c[e]);at(c,e,"add"==e?function(e){return t(this,0===e?0:e),this}:"delete"==e?function(e){return !(o&&!W(e))&&t(this,0===e?0:e)}:"get"==e?function(e){return o&&!W(e)?void 0:t(this,0===e?0:e)}:"has"==e?function(e){return !(o&&!W(e))&&t(this,0===e?0:e)}:function(e,n){return t(this,0===e?0:e,n),this});};if(jt(e,!L(a)||!(o||c.forEach&&!y((function(){(new a).entries().next();})))))s=n.getConstructor(t,e,r,i),Ii.enable();else if(jt(e,!0)){var f=new s,d=f[i](o?{}:-0,1)!=f,h=y((function(){f.has(1);})),v=Lo((function(e){new a(e);})),m=!o&&y((function(){for(var e=new a,t=5;t--;)e[i](t,t);return !e.has(-0)}));v||((s=t((function(e,t){Ri(e,c);var n=function(e,t,n){var r,o;return fo&&L(r=t.constructor)&&r!==n&&W(o=r.prototype)&&o!==n.prototype&&fo(e,o),e}(new a,e,s);return null!=t&&xi(t,n[i],{that:n,AS_ENTRIES:r}),n}))).prototype=c,c.constructor=s),(h||m)&&(l("delete"),l("has"),r&&l("get")),(m||d)&&l(i),o&&c.clear&&delete c.clear;}u[e]=s,Kt({global:!0,forced:s!=a},u),Hn(s,e),o||n.setStrong(s,e,r);}("Set",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),Li),Yn.Set;var Vi=setTimeout,Ni="undefined"!=typeof setImmediate?setImmediate:null;function Xi(e){return Boolean(e&&void 0!==e.length)}function Di(){}function zi(e){if(!(this instanceof zi))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],Hi(e,this);}function Yi(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,zi._immediateFn((function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null!==n){var r;try{r=n(e._value);}catch(e){return void Bi(t.promise,e)}Ji(t.promise,r);}else (1===e._state?Ji:Bi)(t.promise,e._value);}))):e._deferreds.push(t);}function Ji(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof zi)return e._state=3,e._value=t,void Gi(e);if("function"==typeof n)return void Hi((r=n,o=t,function(){r.apply(o,arguments);}),e)}e._state=1,e._value=t,Gi(e);}catch(t){Bi(e,t);}var r,o;}function Bi(e,t){e._state=2,e._value=t,Gi(e);}function Gi(e){2===e._state&&0===e._deferreds.length&&zi._immediateFn((function(){e._handled||zi._unhandledRejectionFn(e._value);}));for(var t=0,n=e._deferreds.length;t<n;t++)Yi(e,e._deferreds[t]);e._deferreds=null;}function Mi(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n;}function Hi(e,t){var n=!1;try{e((function(e){n||(n=!0,Ji(t,e));}),(function(e){n||(n=!0,Bi(t,e));}));}catch(e){if(n)return;n=!0,Bi(t,e);}}zi.prototype.catch=function(e){return this.then(null,e)},zi.prototype.then=function(e,t){var n=new this.constructor(Di);return Yi(this,new Mi(e,t,n)),n},zi.prototype.finally=Wi,zi.all=function(e){return new zi((function(t,n){if(!Xi(e))return n(new TypeError("Promise.all accepts an array"));var r=Array.prototype.slice.call(e);if(0===r.length)return t([]);var o=r.length;function i(e,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var c=a.then;if("function"==typeof c)return void c.call(a,(function(t){i(e,t);}),n)}r[e]=a,0==--o&&t(r);}catch(e){n(e);}}for(var a=0;a<r.length;a++)i(a,r[a]);}))},zi.allSettled=Zi,zi.resolve=function(e){return e&&"object"==typeof e&&e.constructor===zi?e:new zi((function(t){t(e);}))},zi.reject=function(e){return new zi((function(t,n){n(e);}))},zi.race=function(e){return new zi((function(t,n){if(!Xi(e))return n(new TypeError("Promise.race accepts an array"));for(var r=0,o=e.length;r<o;r++)zi.resolve(e[r]).then(t,n);}))},zi._immediateFn="function"==typeof Ni&&function(e){Ni(e);}||function(e){Vi(e,0);},zi._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e);};var qi=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("unable to locate global object")}();"function"!=typeof qi.Promise?qi.Promise=zi:(qi.Promise.prototype.finally||(qi.Promise.prototype.finally=Wi),qi.Promise.allSettled||(qi.Promise.allSettled=Zi)),function(e){function t(){}function n(e,t){if(e=void 0===e?"utf-8":e,t=void 0===t?{fatal:!1}:t,-1===o.indexOf(e.toLowerCase()))throw new RangeError("Failed to construct 'TextDecoder': The encoding label provided ('"+e+"') is invalid.");if(t.fatal)throw Error("Failed to construct 'TextDecoder': the 'fatal' option is unsupported.")}function r(e){for(var t=0,n=Math.min(65536,e.length+1),r=new Uint16Array(n),o=[],i=0;;){var a=t<e.length;if(!a||i>=n-1){if(o.push(String.fromCharCode.apply(null,r.subarray(0,i))),!a)return o.join("");e=e.subarray(t),i=t=0;}if(0==(128&(a=e[t++])))r[i++]=a;else if(192==(224&a)){var c=63&e[t++];r[i++]=(31&a)<<6|c;}else if(224==(240&a)){c=63&e[t++];var s=63&e[t++];r[i++]=(31&a)<<12|c<<6|s;}else if(240==(248&a)){65535<(a=(7&a)<<18|(c=63&e[t++])<<12|(s=63&e[t++])<<6|63&e[t++])&&(a-=65536,r[i++]=a>>>10&1023|55296,a=56320|1023&a),r[i++]=a;}}}if(e.TextEncoder&&e.TextDecoder)return !1;var o=["utf-8","utf8","unicode-1-1-utf-8"];Object.defineProperty(t.prototype,"encoding",{value:"utf-8"}),t.prototype.encode=function(e,t){if((t=void 0===t?{stream:!1}:t).stream)throw Error("Failed to encode: the 'stream' option is unsupported.");t=0;for(var n=e.length,r=0,o=Math.max(32,n+(n>>>1)+7),i=new Uint8Array(o>>>3<<3);t<n;){var a=e.charCodeAt(t++);if(55296<=a&&56319>=a){if(t<n){var c=e.charCodeAt(t);56320==(64512&c)&&(++t,a=((1023&a)<<10)+(1023&c)+65536);}if(55296<=a&&56319>=a)continue}if(r+4>i.length&&(o+=8,o=(o*=1+t/e.length*2)>>>3<<3,(c=new Uint8Array(o)).set(i),i=c),0==(4294967168&a))i[r++]=a;else {if(0==(4294965248&a))i[r++]=a>>>6&31|192;else if(0==(4294901760&a))i[r++]=a>>>12&15|224,i[r++]=a>>>6&63|128;else {if(0!=(4292870144&a))continue;i[r++]=a>>>18&7|240,i[r++]=a>>>12&63|128,i[r++]=a>>>6&63|128;}i[r++]=63&a|128;}}return i.slice?i.slice(0,r):i.subarray(0,r)},Object.defineProperty(n.prototype,"encoding",{value:"utf-8"}),Object.defineProperty(n.prototype,"fatal",{value:!1}),Object.defineProperty(n.prototype,"ignoreBOM",{value:!1});var i=r;"function"==typeof Buffer&&Buffer.from?i=function(e){return Buffer.from(e.buffer,e.byteOffset,e.byteLength).toString("utf-8")}:"function"==typeof Blob&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&(i=function(e){var t=URL.createObjectURL(new Blob([e],{type:"text/plain;charset=UTF-8"}));try{var n=new XMLHttpRequest;return n.open("GET",t,!1),n.send(),n.responseText}catch(t){return r(e)}finally{URL.revokeObjectURL(t);}}),n.prototype.decode=function(e,t){if((t=void 0===t?{stream:!1}:t).stream)throw Error("Failed to decode: the 'stream' option is unsupported.");return e=e instanceof Uint8Array?e:e.buffer instanceof ArrayBuffer?new Uint8Array(e.buffer):new Uint8Array(e),i(e)},e.TextEncoder=t,e.TextDecoder=n;}("undefined"!=typeof window?window:s),function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r);}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&i(e,t);}function o(e){return (o=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function i(e,t){return (i=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function a(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return !1}}function c(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function u(e,t){return !t||"object"!=typeof t&&"function"!=typeof t?c(e):t}function l(e){var t=a();return function(){var n,r=o(e);if(t){var i=o(this).constructor;n=Reflect.construct(r,arguments,i);}else n=r.apply(this,arguments);return u(this,n)}}function f(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=o(e)););return e}function d(e,t,n){return (d="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,n){var r=f(e,t);if(r){var o=Object.getOwnPropertyDescriptor(r,t);return o.get?o.get.call(n):o.value}})(e,t,n||e)}var h=function(){function t(){e(this,t),Object.defineProperty(this,"listeners",{value:{},writable:!0,configurable:!0});}return n(t,[{key:"addEventListener",value:function(e,t,n){e in this.listeners||(this.listeners[e]=[]),this.listeners[e].push({callback:t,options:n});}},{key:"removeEventListener",value:function(e,t){if(e in this.listeners)for(var n=this.listeners[e],r=0,o=n.length;r<o;r++)if(n[r].callback===t)return void n.splice(r,1)}},{key:"dispatchEvent",value:function(e){if(e.type in this.listeners){for(var t=this.listeners[e.type].slice(),n=0,r=t.length;n<r;n++){var o=t[n];try{o.callback.call(this,e);}catch(e){Promise.resolve().then((function(){throw e}));}o.options&&o.options.once&&this.removeEventListener(e.type,o.callback);}return !e.defaultPrevented}}}]),t}(),p=function(t){r(a,t);var i=l(a);function a(){var t;return e(this,a),(t=i.call(this)).listeners||h.call(c(t)),Object.defineProperty(c(t),"aborted",{value:!1,writable:!0,configurable:!0}),Object.defineProperty(c(t),"onabort",{value:null,writable:!0,configurable:!0}),t}return n(a,[{key:"toString",value:function(){return "[object AbortSignal]"}},{key:"dispatchEvent",value:function(e){"abort"===e.type&&(this.aborted=!0,"function"==typeof this.onabort&&this.onabort.call(this,e)),d(o(a.prototype),"dispatchEvent",this).call(this,e);}}]),a}(h),y=function(){function t(){e(this,t),Object.defineProperty(this,"signal",{value:new p,writable:!0,configurable:!0});}return n(t,[{key:"abort",value:function(){var e;try{e=new Event("abort");}catch(t){"undefined"!=typeof document?document.createEvent?(e=document.createEvent("Event")).initEvent("abort",!1,!1):(e=document.createEventObject()).type="abort":e={type:"abort",bubbles:!1,cancelable:!1};}this.signal.dispatchEvent(e);}},{key:"toString",value:function(){return "[object AbortController]"}}]),t}();function v(e){return e.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL?(console.log("__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill"),!0):"function"==typeof e.Request&&!e.Request.prototype.hasOwnProperty("signal")||!e.AbortController}"undefined"!=typeof Symbol&&Symbol.toStringTag&&(y.prototype[Symbol.toStringTag]="AbortController",p.prototype[Symbol.toStringTag]="AbortSignal"),function(e){v(e)&&(e.AbortController=y,e.AbortSignal=p);}("undefined"!=typeof self?self:s);}();var Qi=l((function(e,t){Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){var e=this;this.locked=new Map,this.addToLocked=function(t,n){var r=e.locked.get(t);void 0===r?void 0===n?e.locked.set(t,[]):e.locked.set(t,[n]):void 0!==n&&(r.unshift(n),e.locked.set(t,r));},this.isLocked=function(t){return e.locked.has(t)},this.lock=function(t){return new Promise((function(n,r){e.isLocked(t)?e.addToLocked(t,n):(e.addToLocked(t),n());}))},this.unlock=function(t){var n=e.locked.get(t);if(void 0!==n&&0!==n.length){var r=n.pop();e.locked.set(t,n),void 0!==r&&setTimeout(r,0);}else e.locked.delete(t);};}return e.getInstance=function(){return void 0===e.instance&&(e.instance=new e),e.instance},e}();t.default=function(){return n.getInstance()};}));u(Qi);var $i=u(l((function(e,t){var n=s&&s.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e));}catch(e){i(e);}}function c(e){try{s(r.throw(e));}catch(e){i(e);}}function s(e){e.done?o(e.value):new n((function(t){t(e.value);})).then(a,c);}s((r=r.apply(e,t||[])).next());}))},r=s&&s.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=a.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a);}catch(e){i=[6,e],r=0;}finally{n=o=0;}if(5&i[0])throw i[1];return {value:i[0]?i[1]:void 0,done:!0}}([i,c])}}};Object.defineProperty(t,"__esModule",{value:!0});var o="browser-tabs-lock-key";function i(e){return new Promise((function(t){return setTimeout(t,e)}))}function a(e){for(var t="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",n="",r=0;r<e;r++){n+=t[Math.floor(Math.random()*t.length)];}return n}var c=function(){function e(){this.acquiredIatSet=new Set,this.id=Date.now().toString()+a(15),this.acquireLock=this.acquireLock.bind(this),this.releaseLock=this.releaseLock.bind(this),this.releaseLock__private__=this.releaseLock__private__.bind(this),this.waitForSomethingToChange=this.waitForSomethingToChange.bind(this),this.refreshLockWhileAcquired=this.refreshLockWhileAcquired.bind(this),void 0===e.waiters&&(e.waiters=[]);}return e.prototype.acquireLock=function(t,c){return void 0===c&&(c=5e3),n(this,void 0,void 0,(function(){var n,s,u,l,f,d;return r(this,(function(r){switch(r.label){case 0:n=Date.now()+a(4),s=Date.now()+c,u=o+"-"+t,l=window.localStorage,r.label=1;case 1:return Date.now()<s?[4,i(30)]:[3,8];case 2:return r.sent(),null!==l.getItem(u)?[3,5]:(f=this.id+"-"+t+"-"+n,[4,i(Math.floor(25*Math.random()))]);case 3:return r.sent(),l.setItem(u,JSON.stringify({id:this.id,iat:n,timeoutKey:f,timeAcquired:Date.now(),timeRefreshed:Date.now()})),[4,i(30)];case 4:return r.sent(),null!==(d=l.getItem(u))&&(d=JSON.parse(d)).id===this.id&&d.iat===n?(this.acquiredIatSet.add(n),this.refreshLockWhileAcquired(u,n),[2,!0]):[3,7];case 5:return e.lockCorrector(),[4,this.waitForSomethingToChange(s)];case 6:r.sent(),r.label=7;case 7:return n=Date.now()+a(4),[3,1];case 8:return [2,!1]}}))}))},e.prototype.refreshLockWhileAcquired=function(e,t){return n(this,void 0,void 0,(function(){var o=this;return r(this,(function(i){return setTimeout((function(){return n(o,void 0,void 0,(function(){var n,o;return r(this,(function(r){switch(r.label){case 0:return [4,Qi.default().lock(t)];case 1:return r.sent(),this.acquiredIatSet.has(t)?(n=window.localStorage,null===(o=n.getItem(e))?(Qi.default().unlock(t),[2]):((o=JSON.parse(o)).timeRefreshed=Date.now(),n.setItem(e,JSON.stringify(o)),Qi.default().unlock(t),this.refreshLockWhileAcquired(e,t),[2])):(Qi.default().unlock(t),[2])}}))}))}),1e3),[2]}))}))},e.prototype.waitForSomethingToChange=function(t){return n(this,void 0,void 0,(function(){return r(this,(function(n){switch(n.label){case 0:return [4,new Promise((function(n){var r=!1,o=Date.now(),i=!1;function a(){if(i||(window.removeEventListener("storage",a),e.removeFromWaiting(a),clearTimeout(c),i=!0),!r){r=!0;var t=50-(Date.now()-o);t>0?setTimeout(n,t):n();}}window.addEventListener("storage",a),e.addToWaiting(a);var c=setTimeout(a,Math.max(0,t-Date.now()));}))];case 1:return n.sent(),[2]}}))}))},e.addToWaiting=function(t){this.removeFromWaiting(t),void 0!==e.waiters&&e.waiters.push(t);},e.removeFromWaiting=function(t){void 0!==e.waiters&&(e.waiters=e.waiters.filter((function(e){return e!==t})));},e.notifyWaiters=function(){void 0!==e.waiters&&e.waiters.slice().forEach((function(e){return e()}));},e.prototype.releaseLock=function(e){return n(this,void 0,void 0,(function(){return r(this,(function(t){switch(t.label){case 0:return [4,this.releaseLock__private__(e)];case 1:return [2,t.sent()]}}))}))},e.prototype.releaseLock__private__=function(t){return n(this,void 0,void 0,(function(){var n,i,a;return r(this,(function(r){switch(r.label){case 0:return n=window.localStorage,i=o+"-"+t,null===(a=n.getItem(i))?[2]:(a=JSON.parse(a)).id!==this.id?[3,2]:[4,Qi.default().lock(a.iat)];case 1:r.sent(),this.acquiredIatSet.delete(a.iat),n.removeItem(i),Qi.default().unlock(a.iat),e.notifyWaiters(),r.label=2;case 2:return [2]}}))}))},e.lockCorrector=function(){for(var t=Date.now()-5e3,n=window.localStorage,r=Object.keys(n),i=!1,a=0;a<r.length;a++){var c=r[a];if(c.includes(o)){var s=n.getItem(c);null!==s&&(void 0===(s=JSON.parse(s)).timeRefreshed&&s.timeAcquired<t||void 0!==s.timeRefreshed&&s.timeRefreshed<t)&&(n.removeItem(c),i=!0);}}i&&e.notifyWaiters();},e.waiters=void 0,e}();t.default=c;}))),ea={timeoutInSeconds:60},ta=["login_required","consent_required","interaction_required","account_selection_required","access_denied"],na={name:"auth0-spa-js",version:"1.19.3"},ra=function(){return Date.now()},oa=function(e){function n(t,r){var o=e.call(this,r)||this;return o.error=t,o.error_description=r,Object.setPrototypeOf(o,n.prototype),o}return t(n,e),n.fromPayload=function(e){return new n(e.error,e.error_description)},n}(Error),ia=function(e){function n(t,r,o,i){void 0===i&&(i=null);var a=e.call(this,t,r)||this;return a.state=o,a.appState=i,Object.setPrototypeOf(a,n.prototype),a}return t(n,e),n}(oa),aa=function(e){function n(){var t=e.call(this,"timeout","Timeout")||this;return Object.setPrototypeOf(t,n.prototype),t}return t(n,e),n}(oa),ca=function(e){function n(t){var r=e.call(this)||this;return r.popup=t,Object.setPrototypeOf(r,n.prototype),r}return t(n,e),n}(aa),sa=function(e){function n(t){var r=e.call(this,"cancelled","Popup closed")||this;return r.popup=t,Object.setPrototypeOf(r,n.prototype),r}return t(n,e),n}(oa),ua=function(e){function n(t,r,o){var i=e.call(this,t,r)||this;return i.mfa_token=o,Object.setPrototypeOf(i,n.prototype),i}return t(n,e),n}(oa),la=function(e){return new Promise((function(t,n){var r,o=setInterval((function(){e.popup&&e.popup.closed&&(clearInterval(o),clearTimeout(i),window.removeEventListener("message",r,!1),n(new sa(e.popup)));}),1e3),i=setTimeout((function(){clearInterval(o),n(new ca(e.popup)),window.removeEventListener("message",r,!1);}),1e3*(e.timeoutInSeconds||60));r=function(a){if(a.data&&"authorization_response"===a.data.type){if(clearTimeout(i),clearInterval(o),window.removeEventListener("message",r,!1),e.popup.close(),a.data.response.error)return n(oa.fromPayload(a.data.response));t(a.data.response);}},window.addEventListener("message",r);}))},fa=function(){return window.crypto||window.msCrypto},da=function(){var e=fa();return e.subtle||e.webkitSubtle},ha=function(){var e="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.",t="";return Array.from(fa().getRandomValues(new Uint8Array(43))).forEach((function(n){return t+=e[n%e.length]})),t},pa=function(e){return btoa(e)},ya=function(e){return Object.keys(e).filter((function(t){return void 0!==e[t]})).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])})).join("&")},va=function(e){return o(void 0,void 0,void 0,(function(){var t;return i(this,(function(n){switch(n.label){case 0:return t=da().digest({name:"SHA-256"},(new TextEncoder).encode(e)),window.msCrypto?[2,new Promise((function(e,n){t.oncomplete=function(t){e(t.target.result);},t.onerror=function(e){n(e.error);},t.onabort=function(){n("The digest operation was aborted");};}))]:[4,t];case 1:return [2,n.sent()]}}))}))},ma=function(e){return function(e){return decodeURIComponent(atob(e).split("").map((function(e){return "%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)})).join(""))}(e.replace(/_/g,"/").replace(/-/g,"+"))},ga=function(e){var t=new Uint8Array(e);return function(e){var t={"+":"-","/":"_","=":""};return e.replace(/[+/=]/g,(function(e){return t[e]}))}(window.btoa(String.fromCharCode.apply(String,c([],a(Array.from(t)),!1))))};var ba=function(e,t){return o(void 0,void 0,void 0,(function(){var n,r;return i(this,(function(o){switch(o.label){case 0:return [4,(i=e,a=t,a=a||{},new Promise((function(e,t){var n=new XMLHttpRequest,r=[],o=[],c={},s=function(){return {ok:2==(n.status/100|0),statusText:n.statusText,status:n.status,url:n.responseURL,text:function(){return Promise.resolve(n.responseText)},json:function(){return Promise.resolve(n.responseText).then(JSON.parse)},blob:function(){return Promise.resolve(new Blob([n.response]))},clone:s,headers:{keys:function(){return r},entries:function(){return o},get:function(e){return c[e.toLowerCase()]},has:function(e){return e.toLowerCase()in c}}}};for(var u in n.open(a.method||"get",i,!0),n.onload=function(){n.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,(function(e,t,n){r.push(t=t.toLowerCase()),o.push([t,n]),c[t]=c[t]?c[t]+","+n:n;})),e(s());},n.onerror=t,n.withCredentials="include"==a.credentials,a.headers)n.setRequestHeader(u,a.headers[u]);n.send(a.body||null);})))];case 1:return n=o.sent(),r={ok:n.ok},[4,n.json()];case 2:return [2,(r.json=o.sent(),r)]}var i,a;}))}))},wa=function(e,t,n){return o(void 0,void 0,void 0,(function(){var r,o;return i(this,(function(i){return r=new AbortController,t.signal=r.signal,[2,Promise.race([ba(e,t),new Promise((function(e,t){o=setTimeout((function(){r.abort(),t(new Error("Timeout when executing 'fetch'"));}),n);}))]).finally((function(){clearTimeout(o);}))]}))}))},Sa=function(e,t,n,r,a,c,s){return o(void 0,void 0,void 0,(function(){return i(this,(function(o){return [2,(i={auth:{audience:t,scope:n},timeout:a,fetchUrl:e,fetchOptions:r,useFormData:s},u=c,new Promise((function(e,t){var n=new MessageChannel;n.port1.onmessage=function(n){n.data.error?t(new Error(n.data.error)):e(n.data);},u.postMessage(i,[n.port2]);})))];var i,u;}))}))},_a=function(e,t,n,r,a,c,s){return void 0===s&&(s=1e4),o(void 0,void 0,void 0,(function(){return i(this,(function(o){return a?[2,Sa(e,t,n,r,s,a,c)]:[2,wa(e,r,s)]}))}))};function ka(e,t,n,a,c,s,u){return o(this,void 0,void 0,(function(){var o,l,f,d,h,p,y,v,m;return i(this,(function(i){switch(i.label){case 0:o=null,f=0,i.label=1;case 1:if(!(f<3))return [3,6];i.label=2;case 2:return i.trys.push([2,4,,5]),[4,_a(e,n,a,c,s,u,t)];case 3:return l=i.sent(),o=null,[3,6];case 4:return d=i.sent(),o=d,[3,5];case 5:return f++,[3,1];case 6:if(o)throw o.message=o.message||"Failed to fetch",o;if(h=l.json,p=h.error,y=h.error_description,v=r(h,["error","error_description"]),!l.ok){if(m=y||"HTTP error. Unable to fetch "+e,"mfa_required"===p)throw new ua(p,m,v.mfa_token);throw new oa(p||"request_error",m)}return [2,v]}}))}))}function Ia(e,t){var n=e.baseUrl,a=e.timeout,c=e.audience,s=e.scope,u=e.auth0Client,l=e.useFormData,f=r(e,["baseUrl","timeout","audience","scope","auth0Client","useFormData"]);return o(this,void 0,void 0,(function(){var e;return i(this,(function(r){switch(r.label){case 0:return e=l?ya(f):JSON.stringify(f),[4,ka(n+"/oauth/token",a,c||"default",s,{method:"POST",body:e,headers:{"Content-Type":l?"application/x-www-form-urlencoded":"application/json","Auth0-Client":btoa(JSON.stringify(u||na))}},t,l)];case 1:return [2,r.sent()]}}))}))}var Ta=function(e){return Array.from(new Set(e))},Oa=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return Ta(e.join(" ").trim().split(/\s+/)).join(" ")},Ea=function(){function e(e,t){void 0===t&&(t="@@auth0spajs@@"),this.prefix=t,this.client_id=e.client_id,this.scope=e.scope,this.audience=e.audience;}return e.prototype.toKey=function(){return this.prefix+"::"+this.client_id+"::"+this.audience+"::"+this.scope},e.fromKey=function(t){var n=a(t.split("::"),4),r=n[0],o=n[1],i=n[2];return new e({client_id:o,scope:n[3],audience:i},r)},e.fromCacheEntry=function(t){return new e({scope:t.scope,audience:t.audience,client_id:t.client_id})},e}(),xa=function(){function e(){}return e.prototype.set=function(e,t){localStorage.setItem(e,JSON.stringify(t));},e.prototype.get=function(e){var t=window.localStorage.getItem(e);if(t)try{return JSON.parse(t)}catch(e){return}},e.prototype.remove=function(e){localStorage.removeItem(e);},e.prototype.allKeys=function(){return Object.keys(window.localStorage).filter((function(e){return e.startsWith("@@auth0spajs@@")}))},e}(),Ca=function(){var e;this.enclosedCache=(e={},{set:function(t,n){e[t]=n;},get:function(t){var n=e[t];if(n)return n},remove:function(t){delete e[t];},allKeys:function(){return Object.keys(e)}});},Ra=function(){function e(e,t,n){this.cache=e,this.keyManifest=t,this.nowProvider=n,this.nowProvider=this.nowProvider||ra;}return e.prototype.get=function(e,t){var n;return void 0===t&&(t=0),o(this,void 0,void 0,(function(){var r,o,a,c,s;return i(this,(function(i){switch(i.label){case 0:return [4,this.cache.get(e.toKey())];case 1:return (r=i.sent())?[3,4]:[4,this.getCacheKeys()];case 2:return (o=i.sent())?(a=this.matchExistingCacheKey(e,o),[4,this.cache.get(a)]):[2];case 3:r=i.sent(),i.label=4;case 4:return r?[4,this.nowProvider()]:[2];case 5:return c=i.sent(),s=Math.floor(c/1e3),r.expiresAt-t<s?r.body.refresh_token?(r.body={refresh_token:r.body.refresh_token},[4,this.cache.set(e.toKey(),r)]):[3,7]:[3,10];case 6:return i.sent(),[2,r.body];case 7:return [4,this.cache.remove(e.toKey())];case 8:return i.sent(),[4,null===(n=this.keyManifest)||void 0===n?void 0:n.remove(e.toKey())];case 9:return i.sent(),[2];case 10:return [2,r.body]}}))}))},e.prototype.set=function(e){var t;return o(this,void 0,void 0,(function(){var n,r;return i(this,(function(o){switch(o.label){case 0:return n=new Ea({client_id:e.client_id,scope:e.scope,audience:e.audience}),[4,this.wrapCacheEntry(e)];case 1:return r=o.sent(),[4,this.cache.set(n.toKey(),r)];case 2:return o.sent(),[4,null===(t=this.keyManifest)||void 0===t?void 0:t.add(n.toKey())];case 3:return o.sent(),[2]}}))}))},e.prototype.clear=function(e){var t;return o(this,void 0,void 0,(function(){var n,r=this;return i(this,(function(a){switch(a.label){case 0:return [4,this.getCacheKeys()];case 1:return (n=a.sent())?[4,n.filter((function(t){return !e||t.includes(e)})).reduce((function(e,t){return o(r,void 0,void 0,(function(){return i(this,(function(n){switch(n.label){case 0:return [4,e];case 1:return n.sent(),[4,this.cache.remove(t)];case 2:return n.sent(),[2]}}))}))}),Promise.resolve())]:[2];case 2:return a.sent(),[4,null===(t=this.keyManifest)||void 0===t?void 0:t.clear()];case 3:return a.sent(),[2]}}))}))},e.prototype.clearSync=function(e){var t=this,n=this.cache.allKeys();n&&n.filter((function(t){return !e||t.includes(e)})).forEach((function(e){t.cache.remove(e);}));},e.prototype.wrapCacheEntry=function(e){return o(this,void 0,void 0,(function(){var t,n,r;return i(this,(function(o){switch(o.label){case 0:return [4,this.nowProvider()];case 1:return t=o.sent(),n=Math.floor(t/1e3)+e.expires_in,r=Math.min(n,e.decodedToken.claims.exp),[2,{body:e,expiresAt:r}]}}))}))},e.prototype.getCacheKeys=function(){var e;return o(this,void 0,void 0,(function(){var t;return i(this,(function(n){switch(n.label){case 0:return this.keyManifest?[4,this.keyManifest.get()]:[3,2];case 1:return t=null===(e=n.sent())||void 0===e?void 0:e.keys,[3,4];case 2:return [4,this.cache.allKeys()];case 3:t=n.sent(),n.label=4;case 4:return [2,t]}}))}))},e.prototype.matchExistingCacheKey=function(e,t){return t.filter((function(t){var n=Ea.fromKey(t),r=new Set(n.scope&&n.scope.split(" ")),o=e.scope.split(" "),i=n.scope&&o.reduce((function(e,t){return e&&r.has(t)}),!0);return "@@auth0spajs@@"===n.prefix&&n.client_id===e.client_id&&n.audience===e.audience&&i}))[0]},e}(),Fa=function(){function e(e,t){this.storage=e,this.clientId=t,this.storageKey="a0.spajs.txs."+this.clientId,this.transaction=this.storage.get(this.storageKey);}return e.prototype.create=function(e){this.transaction=e,this.storage.save(this.storageKey,e,{daysUntilExpire:1});},e.prototype.get=function(){return this.transaction},e.prototype.remove=function(){delete this.transaction,this.storage.remove(this.storageKey);},e}(),Aa=function(e){return "number"==typeof e},ja=["iss","aud","exp","nbf","iat","jti","azp","nonce","auth_time","at_hash","c_hash","acr","amr","sub_jwk","cnf","sip_from_tag","sip_date","sip_callid","sip_cseq_num","sip_via_branch","orig","dest","mky","events","toe","txn","rph","sid","vot","vtm"],Ua=function(e){if(!e.id_token)throw new Error("ID token is required but missing");var t=function(e){var t=e.split("."),n=a(t,3),r=n[0],o=n[1],i=n[2];if(3!==t.length||!r||!o||!i)throw new Error("ID token could not be decoded");var c=JSON.parse(ma(o)),s={__raw:e},u={};return Object.keys(c).forEach((function(e){s[e]=c[e],ja.includes(e)||(u[e]=c[e]);})),{encoded:{header:r,payload:o,signature:i},header:JSON.parse(ma(r)),claims:s,user:u}}(e.id_token);if(!t.claims.iss)throw new Error("Issuer (iss) claim must be a string present in the ID token");if(t.claims.iss!==e.iss)throw new Error('Issuer (iss) claim mismatch in the ID token; expected "'+e.iss+'", found "'+t.claims.iss+'"');if(!t.user.sub)throw new Error("Subject (sub) claim must be a string present in the ID token");if("RS256"!==t.header.alg)throw new Error('Signature algorithm of "'+t.header.alg+'" is not supported. Expected the ID token to be signed with "RS256".');if(!t.claims.aud||"string"!=typeof t.claims.aud&&!Array.isArray(t.claims.aud))throw new Error("Audience (aud) claim must be a string or array of strings present in the ID token");if(Array.isArray(t.claims.aud)){if(!t.claims.aud.includes(e.aud))throw new Error('Audience (aud) claim mismatch in the ID token; expected "'+e.aud+'" but was not one of "'+t.claims.aud.join(", ")+'"');if(t.claims.aud.length>1){if(!t.claims.azp)throw new Error("Authorized Party (azp) claim must be a string present in the ID token when Audience (aud) claim has multiple values");if(t.claims.azp!==e.aud)throw new Error('Authorized Party (azp) claim mismatch in the ID token; expected "'+e.aud+'", found "'+t.claims.azp+'"')}}else if(t.claims.aud!==e.aud)throw new Error('Audience (aud) claim mismatch in the ID token; expected "'+e.aud+'" but found "'+t.claims.aud+'"');if(e.nonce){if(!t.claims.nonce)throw new Error("Nonce (nonce) claim must be a string present in the ID token");if(t.claims.nonce!==e.nonce)throw new Error('Nonce (nonce) claim mismatch in the ID token; expected "'+e.nonce+'", found "'+t.claims.nonce+'"')}if(e.max_age&&!Aa(t.claims.auth_time))throw new Error("Authentication Time (auth_time) claim must be a number present in the ID token when Max Age (max_age) is specified");if(!Aa(t.claims.exp))throw new Error("Expiration Time (exp) claim must be a number present in the ID token");if(!Aa(t.claims.iat))throw new Error("Issued At (iat) claim must be a number present in the ID token");var n=e.leeway||60,r=new Date(e.now||Date.now()),o=new Date(0),i=new Date(0),c=new Date(0);if(c.setUTCSeconds(parseInt(t.claims.auth_time)+e.max_age+n),o.setUTCSeconds(t.claims.exp+n),i.setUTCSeconds(t.claims.nbf-n),r>o)throw new Error("Expiration Time (exp) claim error in the ID token; current time ("+r+") is after expiration time ("+o+")");if(Aa(t.claims.nbf)&&r<i)throw new Error("Not Before time (nbf) claim in the ID token indicates that this token can't be used just yet. Currrent time ("+r+") is before "+i);if(Aa(t.claims.auth_time)&&r>c)throw new Error("Authentication Time (auth_time) claim in the ID token indicates that too much time has passed since the last end-user authentication. Currrent time ("+r+") is after last auth at "+c);if(e.organizationId){if(!t.claims.org_id)throw new Error("Organization ID (org_id) claim must be a string present in the ID token");if(e.organizationId!==t.claims.org_id)throw new Error('Organization ID (org_id) claim mismatch in the ID token; expected "'+e.organizationId+'", found "'+t.claims.org_id+'"')}return t},Ka=l((function(e,t){var n=s&&s.__assign||function(){return (n=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function r(e,t){if(!t)return "";var n="; "+e;return !0===t?n:n+"="+t}function o(e,t,n){return encodeURIComponent(e).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/\(/g,"%28").replace(/\)/g,"%29")+"="+encodeURIComponent(t).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent)+function(e){if("number"==typeof e.expires){var t=new Date;t.setMilliseconds(t.getMilliseconds()+864e5*e.expires),e.expires=t;}return r("Expires",e.expires?e.expires.toUTCString():"")+r("Domain",e.domain)+r("Path",e.path)+r("Secure",e.secure)+r("SameSite",e.sameSite)}(n)}function i(e){for(var t={},n=e?e.split("; "):[],r=/(%[\dA-F]{2})+/gi,o=0;o<n.length;o++){var i=n[o].split("="),a=i.slice(1).join("=");'"'===a.charAt(0)&&(a=a.slice(1,-1));try{t[i[0].replace(r,decodeURIComponent)]=a.replace(r,decodeURIComponent);}catch(e){}}return t}function a(){return i(document.cookie)}function c(e,t,r){document.cookie=o(e,t,n({path:"/"},r));}t.__esModule=!0,t.encode=o,t.parse=i,t.getAll=a,t.get=function(e){return a()[e]},t.set=c,t.remove=function(e,t){c(e,"",n(n({},t),{expires:-1}));};}));u(Ka),Ka.encode,Ka.parse,Ka.getAll;var Pa=Ka.get,La=Ka.set,Wa=Ka.remove,Za={get:function(e){var t=Pa(e);if(void 0!==t)return JSON.parse(t)},save:function(e,t,n){var r={};"https:"===window.location.protocol&&(r={secure:!0,sameSite:"none"}),(null==n?void 0:n.daysUntilExpire)&&(r.expires=n.daysUntilExpire),La(e,JSON.stringify(t),r);},remove:function(e){Wa(e);}},Va={get:function(e){var t=Za.get(e);return t||Za.get("_legacy_"+e)},save:function(e,t,n){var r={};"https:"===window.location.protocol&&(r={secure:!0}),(null==n?void 0:n.daysUntilExpire)&&(r.expires=n.daysUntilExpire),La("_legacy_"+e,JSON.stringify(t),r),Za.save(e,t,n);},remove:function(e){Za.remove(e),Za.remove("_legacy_"+e);}},Na={get:function(e){if("undefined"!=typeof sessionStorage){var t=sessionStorage.getItem(e);if(void 0!==t)return JSON.parse(t)}},save:function(e,t){sessionStorage.setItem(e,JSON.stringify(t));},remove:function(e){sessionStorage.removeItem(e);}};function Xa(e,t,n){var r=void 0===t?null:t,o=function(e,t){var n=atob(e);if(t){for(var r=new Uint8Array(n.length),o=0,i=n.length;o<i;++o)r[o]=n.charCodeAt(o);return String.fromCharCode.apply(null,new Uint16Array(r.buffer))}return n}(e,void 0!==n&&n),i=o.indexOf("\n",10)+1,a=o.substring(i)+(r?"//# sourceMappingURL="+r:""),c=new Blob([a],{type:"application/javascript"});return URL.createObjectURL(c)}var Da,za,Ya,Ja,Ba=(Da="Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwohZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7Ci8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKgogICAgQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uCgogICAgUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55CiAgICBwdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuCgogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICJBUyBJUyIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEgKICAgIFJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWQogICAgQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULAogICAgSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NCiAgICBMT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUgogICAgT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUgogICAgUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS4KICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovdmFyIGU9ZnVuY3Rpb24oKXtyZXR1cm4oZT1PYmplY3QuYXNzaWdufHxmdW5jdGlvbihlKXtmb3IodmFyIHIsdD0xLG49YXJndW1lbnRzLmxlbmd0aDt0PG47dCsrKWZvcih2YXIgbyBpbiByPWFyZ3VtZW50c1t0XSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocixvKSYmKGVbb109cltvXSk7cmV0dXJuIGV9KS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O2Z1bmN0aW9uIHIoZSxyLHQsbil7cmV0dXJuIG5ldyh0fHwodD1Qcm9taXNlKSkoKGZ1bmN0aW9uKG8sYSl7ZnVuY3Rpb24gcyhlKXt0cnl7dShuLm5leHQoZSkpfWNhdGNoKGUpe2EoZSl9fWZ1bmN0aW9uIGkoZSl7dHJ5e3Uobi50aHJvdyhlKSl9Y2F0Y2goZSl7YShlKX19ZnVuY3Rpb24gdShlKXt2YXIgcjtlLmRvbmU/byhlLnZhbHVlKToocj1lLnZhbHVlLHIgaW5zdGFuY2VvZiB0P3I6bmV3IHQoKGZ1bmN0aW9uKGUpe2Uocil9KSkpLnRoZW4ocyxpKX11KChuPW4uYXBwbHkoZSxyfHxbXSkpLm5leHQoKSl9KSl9ZnVuY3Rpb24gdChlLHIpe3ZhciB0LG4sbyxhLHM9e2xhYmVsOjAsc2VudDpmdW5jdGlvbigpe2lmKDEmb1swXSl0aHJvdyBvWzFdO3JldHVybiBvWzFdfSx0cnlzOltdLG9wczpbXX07cmV0dXJuIGE9e25leHQ6aSgwKSx0aHJvdzppKDEpLHJldHVybjppKDIpfSwiZnVuY3Rpb24iPT10eXBlb2YgU3ltYm9sJiYoYVtTeW1ib2wuaXRlcmF0b3JdPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KSxhO2Z1bmN0aW9uIGkoYSl7cmV0dXJuIGZ1bmN0aW9uKGkpe3JldHVybiBmdW5jdGlvbihhKXtpZih0KXRocm93IG5ldyBUeXBlRXJyb3IoIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy4iKTtmb3IoO3M7KXRyeXtpZih0PTEsbiYmKG89MiZhWzBdP24ucmV0dXJuOmFbMF0/bi50aHJvd3x8KChvPW4ucmV0dXJuKSYmby5jYWxsKG4pLDApOm4ubmV4dCkmJiEobz1vLmNhbGwobixhWzFdKSkuZG9uZSlyZXR1cm4gbztzd2l0Y2gobj0wLG8mJihhPVsyJmFbMF0sby52YWx1ZV0pLGFbMF0pe2Nhc2UgMDpjYXNlIDE6bz1hO2JyZWFrO2Nhc2UgNDpyZXR1cm4gcy5sYWJlbCsrLHt2YWx1ZTphWzFdLGRvbmU6ITF9O2Nhc2UgNTpzLmxhYmVsKyssbj1hWzFdLGE9WzBdO2NvbnRpbnVlO2Nhc2UgNzphPXMub3BzLnBvcCgpLHMudHJ5cy5wb3AoKTtjb250aW51ZTtkZWZhdWx0OmlmKCEobz1zLnRyeXMsKG89by5sZW5ndGg+MCYmb1tvLmxlbmd0aC0xXSl8fDYhPT1hWzBdJiYyIT09YVswXSkpe3M9MDtjb250aW51ZX1pZigzPT09YVswXSYmKCFvfHxhWzFdPm9bMF0mJmFbMV08b1szXSkpe3MubGFiZWw9YVsxXTticmVha31pZig2PT09YVswXSYmcy5sYWJlbDxvWzFdKXtzLmxhYmVsPW9bMV0sbz1hO2JyZWFrfWlmKG8mJnMubGFiZWw8b1syXSl7cy5sYWJlbD1vWzJdLHMub3BzLnB1c2goYSk7YnJlYWt9b1syXSYmcy5vcHMucG9wKCkscy50cnlzLnBvcCgpO2NvbnRpbnVlfWE9ci5jYWxsKGUscyl9Y2F0Y2goZSl7YT1bNixlXSxuPTB9ZmluYWxseXt0PW89MH1pZig1JmFbMF0pdGhyb3cgYVsxXTtyZXR1cm57dmFsdWU6YVswXT9hWzFdOnZvaWQgMCxkb25lOiEwfX0oW2EsaV0pfX19dmFyIG49e30sbz1mdW5jdGlvbihlLHIpe3JldHVybiBlKyJ8IityfTthZGRFdmVudExpc3RlbmVyKCJtZXNzYWdlIiwoZnVuY3Rpb24oYSl7dmFyIHM9YS5kYXRhLGk9cy50aW1lb3V0LHU9cy5hdXRoLGM9cy5mZXRjaFVybCxmPXMuZmV0Y2hPcHRpb25zLGw9cy51c2VGb3JtRGF0YSxoPWZ1bmN0aW9uKGUscil7dmFyIHQ9ImZ1bmN0aW9uIj09dHlwZW9mIFN5bWJvbCYmZVtTeW1ib2wuaXRlcmF0b3JdO2lmKCF0KXJldHVybiBlO3ZhciBuLG8sYT10LmNhbGwoZSkscz1bXTt0cnl7Zm9yKDsodm9pZCAwPT09cnx8ci0tID4wKSYmIShuPWEubmV4dCgpKS5kb25lOylzLnB1c2gobi52YWx1ZSl9Y2F0Y2goZSl7bz17ZXJyb3I6ZX19ZmluYWxseXt0cnl7biYmIW4uZG9uZSYmKHQ9YS5yZXR1cm4pJiZ0LmNhbGwoYSl9ZmluYWxseXtpZihvKXRocm93IG8uZXJyb3J9fXJldHVybiBzfShhLnBvcnRzLDEpWzBdO3JldHVybiByKHZvaWQgMCx2b2lkIDAsdm9pZCAwLChmdW5jdGlvbigpe3ZhciByLGEscyxwLHksYixkLHYsdyxnO3JldHVybiB0KHRoaXMsKGZ1bmN0aW9uKHQpe3N3aXRjaCh0LmxhYmVsKXtjYXNlIDA6cz0oYT11fHx7fSkuYXVkaWVuY2UscD1hLnNjb3BlLHQubGFiZWw9MTtjYXNlIDE6aWYodC50cnlzLnB1c2goWzEsNywsOF0pLCEoeT1sPyhrPWYuYm9keSxTPW5ldyBVUkxTZWFyY2hQYXJhbXMoayksXz17fSxTLmZvckVhY2goKGZ1bmN0aW9uKGUscil7X1tyXT1lfSkpLF8pOkpTT04ucGFyc2UoZi5ib2R5KSkucmVmcmVzaF90b2tlbiYmInJlZnJlc2hfdG9rZW4iPT09eS5ncmFudF90eXBlKXtpZighKGI9ZnVuY3Rpb24oZSxyKXtyZXR1cm4gbltvKGUscildfShzLHApKSl0aHJvdyBuZXcgRXJyb3IoIlRoZSB3ZWIgd29ya2VyIGlzIG1pc3NpbmcgdGhlIHJlZnJlc2ggdG9rZW4iKTtmLmJvZHk9bD9uZXcgVVJMU2VhcmNoUGFyYW1zKGUoZSh7fSx5KSx7cmVmcmVzaF90b2tlbjpifSkpLnRvU3RyaW5nKCk6SlNPTi5zdHJpbmdpZnkoZShlKHt9LHkpLHtyZWZyZXNoX3Rva2VuOmJ9KSl9ZD12b2lkIDAsImZ1bmN0aW9uIj09dHlwZW9mIEFib3J0Q29udHJvbGxlciYmKGQ9bmV3IEFib3J0Q29udHJvbGxlcixmLnNpZ25hbD1kLnNpZ25hbCksdj12b2lkIDAsdC5sYWJlbD0yO2Nhc2UgMjpyZXR1cm4gdC50cnlzLnB1c2goWzIsNCwsNV0pLFs0LFByb21pc2UucmFjZShbKG09aSxuZXcgUHJvbWlzZSgoZnVuY3Rpb24oZSl7cmV0dXJuIHNldFRpbWVvdXQoZSxtKX0pKSksZmV0Y2goYyxlKHt9LGYpKV0pXTtjYXNlIDM6cmV0dXJuIHY9dC5zZW50KCksWzMsNV07Y2FzZSA0OnJldHVybiB3PXQuc2VudCgpLGgucG9zdE1lc3NhZ2Uoe2Vycm9yOncubWVzc2FnZX0pLFsyXTtjYXNlIDU6cmV0dXJuIHY/WzQsdi5qc29uKCldOihkJiZkLmFib3J0KCksaC5wb3N0TWVzc2FnZSh7ZXJyb3I6IlRpbWVvdXQgd2hlbiBleGVjdXRpbmcgJ2ZldGNoJyJ9KSxbMl0pO2Nhc2UgNjpyZXR1cm4ocj10LnNlbnQoKSkucmVmcmVzaF90b2tlbj8oZnVuY3Rpb24oZSxyLHQpe25bbyhyLHQpXT1lfShyLnJlZnJlc2hfdG9rZW4scyxwKSxkZWxldGUgci5yZWZyZXNoX3Rva2VuKTpmdW5jdGlvbihlLHIpe2RlbGV0ZSBuW28oZSxyKV19KHMscCksaC5wb3N0TWVzc2FnZSh7b2s6di5vayxqc29uOnJ9KSxbMyw4XTtjYXNlIDc6cmV0dXJuIGc9dC5zZW50KCksaC5wb3N0TWVzc2FnZSh7b2s6ITEsanNvbjp7ZXJyb3JfZGVzY3JpcHRpb246Zy5tZXNzYWdlfX0pLFszLDhdO2Nhc2UgODpyZXR1cm5bMl19dmFyIG0sayxTLF99KSl9KSl9KSl9KCk7Cgo=",za=null,Ya=!1,function(e){return Ja=Ja||Xa(Da,za,Ya),new Worker(Ja,e)}),Ga={},Ma=function(){function e(e,t){this.cache=e,this.clientId=t,this.manifestKey=this.createManifestKeyFrom(this.clientId);}return e.prototype.add=function(e){var t;return o(this,void 0,void 0,(function(){var n,r;return i(this,(function(o){switch(o.label){case 0:return r=Set.bind,[4,this.cache.get(this.manifestKey)];case 1:return (n=new(r.apply(Set,[void 0,(null===(t=o.sent())||void 0===t?void 0:t.keys)||[]]))).add(e),[4,this.cache.set(this.manifestKey,{keys:c([],a(n),!1)})];case 2:return o.sent(),[2]}}))}))},e.prototype.remove=function(e){return o(this,void 0,void 0,(function(){var t,n;return i(this,(function(r){switch(r.label){case 0:return [4,this.cache.get(this.manifestKey)];case 1:return (t=r.sent())?((n=new Set(t.keys)).delete(e),n.size>0?[4,this.cache.set(this.manifestKey,{keys:c([],a(n),!1)})]:[3,3]):[3,5];case 2:return [2,r.sent()];case 3:return [4,this.cache.remove(this.manifestKey)];case 4:return [2,r.sent()];case 5:return [2]}}))}))},e.prototype.get=function(){return this.cache.get(this.manifestKey)},e.prototype.clear=function(){return this.cache.remove(this.manifestKey)},e.prototype.createManifestKeyFrom=function(e){return "@@auth0spajs@@::"+e},e}(),Ha=new $i,qa={memory:function(){return (new Ca).enclosedCache},localstorage:function(){return new xa}},Qa=function(e){return qa[e]},$a=function(){return !/Trident.*rv:11\.0/.test(navigator.userAgent)},ec=function(){function e(e){var t,n,o;if(this.options=e,"undefined"!=typeof window&&function(){if(!fa())throw new Error("For security reasons, `window.crypto` is required to run `auth0-spa-js`.");if(void 0===da())throw new Error("\n      auth0-spa-js must run on a secure origin. See https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md#why-do-i-get-auth0-spa-js-must-run-on-a-secure-origin for more information.\n    ")}(),e.cache&&e.cacheLocation&&console.warn("Both `cache` and `cacheLocation` options have been specified in the Auth0Client configuration; ignoring `cacheLocation` and using `cache`."),e.cache)o=e.cache;else {if(this.cacheLocation=e.cacheLocation||"memory",!Qa(this.cacheLocation))throw new Error('Invalid cache location "'+this.cacheLocation+'"');o=Qa(this.cacheLocation)();}this.cookieStorage=!1===e.legacySameSiteCookie?Za:Va,this.orgHintCookieName="auth0."+this.options.client_id+".organization_hint",this.isAuthenticatedCookieName=function(e){return "auth0."+e+".is.authenticated"}(this.options.client_id),this.sessionCheckExpiryDays=e.sessionCheckExpiryDays||1;var i,a=e.useCookiesForTransactions?this.cookieStorage:Na;this.scope=this.options.scope,this.transactionManager=new Fa(a,this.options.client_id),this.nowProvider=this.options.nowProvider||ra,this.cacheManager=new Ra(o,o.allKeys?null:new Ma(o,this.options.client_id),this.nowProvider),this.domainUrl=(i=this.options.domain,/^https?:\/\//.test(i)?i:"https://"+i),this.tokenIssuer=function(e,t){return e?e.startsWith("https://")?e:"https://"+e+"/":t+"/"}(this.options.issuer,this.domainUrl),this.defaultScope=Oa("openid",void 0!==(null===(n=null===(t=this.options)||void 0===t?void 0:t.advancedOptions)||void 0===n?void 0:n.defaultScope)?this.options.advancedOptions.defaultScope:"openid profile email"),this.options.useRefreshTokens&&(this.scope=Oa(this.scope,"offline_access")),"undefined"!=typeof window&&window.Worker&&this.options.useRefreshTokens&&"memory"===this.cacheLocation&&$a()&&(this.worker=new Ba),this.customOptions=function(e){return e.advancedOptions,e.audience,e.auth0Client,e.authorizeTimeoutInSeconds,e.cacheLocation,e.client_id,e.domain,e.issuer,e.leeway,e.max_age,e.redirect_uri,e.scope,e.useRefreshTokens,e.useCookiesForTransactions,e.useFormData,r(e,["advancedOptions","audience","auth0Client","authorizeTimeoutInSeconds","cacheLocation","client_id","domain","issuer","leeway","max_age","redirect_uri","scope","useRefreshTokens","useCookiesForTransactions","useFormData"])}(e);}return e.prototype._url=function(e){var t=encodeURIComponent(btoa(JSON.stringify(this.options.auth0Client||na)));return ""+this.domainUrl+e+"&auth0Client="+t},e.prototype._getParams=function(e,t,o,i,a){var c=this.options;c.useRefreshTokens,c.useCookiesForTransactions,c.useFormData,c.auth0Client,c.cacheLocation,c.advancedOptions,c.detailedResponse,c.nowProvider,c.authorizeTimeoutInSeconds,c.legacySameSiteCookie,c.sessionCheckExpiryDays,c.domain,c.leeway;var s=r(c,["useRefreshTokens","useCookiesForTransactions","useFormData","auth0Client","cacheLocation","advancedOptions","detailedResponse","nowProvider","authorizeTimeoutInSeconds","legacySameSiteCookie","sessionCheckExpiryDays","domain","leeway"]);return n(n(n({},s),e),{scope:Oa(this.defaultScope,this.scope,e.scope),response_type:"code",response_mode:"query",state:t,nonce:o,redirect_uri:a||this.options.redirect_uri,code_challenge:i,code_challenge_method:"S256"})},e.prototype._authorizeUrl=function(e){return this._url("/authorize?"+ya(e))},e.prototype._verifyIdToken=function(e,t,n){return o(this,void 0,void 0,(function(){var r;return i(this,(function(o){switch(o.label){case 0:return [4,this.nowProvider()];case 1:return r=o.sent(),[2,Ua({iss:this.tokenIssuer,aud:this.options.client_id,id_token:e,nonce:t,organizationId:n,leeway:this.options.leeway,max_age:this._parseNumber(this.options.max_age),now:r})]}}))}))},e.prototype._parseNumber=function(e){return "string"!=typeof e?e:parseInt(e,10)||void 0},e.prototype._processOrgIdHint=function(e){e?this.cookieStorage.save(this.orgHintCookieName,e):this.cookieStorage.remove(this.orgHintCookieName);},e.prototype.buildAuthorizeUrl=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,o,a,c,s,u,l,f,d,h,p,y;return i(this,(function(i){switch(i.label){case 0:return t=e.redirect_uri,o=e.appState,a=r(e,["redirect_uri","appState"]),c=pa(ha()),s=pa(ha()),u=ha(),[4,va(u)];case 1:return l=i.sent(),f=ga(l),d=e.fragment?"#"+e.fragment:"",h=this._getParams(a,c,s,f,t),p=this._authorizeUrl(h),y=e.organization||this.options.organization,this.transactionManager.create(n({nonce:s,code_verifier:u,appState:o,scope:h.scope,audience:h.audience||"default",redirect_uri:h.redirect_uri,state:c},y&&{organizationId:y})),[2,p+d]}}))}))},e.prototype.loginWithPopup=function(e,t){return o(this,void 0,void 0,(function(){var o,a,c,s,u,l,f,d,h,p,y,v,m;return i(this,(function(i){switch(i.label){case 0:return e=e||{},(t=t||{}).popup||(t.popup=function(e){var t=window.screenX+(window.innerWidth-400)/2,n=window.screenY+(window.innerHeight-600)/2;return window.open(e,"auth0:authorize:popup","left="+t+",top="+n+",width=400,height=600,resizable,scrollbars=yes,status=1")}("")),o=r(e,[]),a=pa(ha()),c=pa(ha()),s=ha(),[4,va(s)];case 1:return u=i.sent(),l=ga(u),f=this._getParams(o,a,c,l,this.options.redirect_uri||window.location.origin),d=this._authorizeUrl(n(n({},f),{response_mode:"web_message"})),t.popup.location.href=d,[4,la(n(n({},t),{timeoutInSeconds:t.timeoutInSeconds||this.options.authorizeTimeoutInSeconds||60}))];case 2:if(h=i.sent(),a!==h.state)throw new Error("Invalid state");return [4,Ia({audience:f.audience,scope:f.scope,baseUrl:this.domainUrl,client_id:this.options.client_id,code_verifier:s,code:h.code,grant_type:"authorization_code",redirect_uri:f.redirect_uri,auth0Client:this.options.auth0Client,useFormData:this.options.useFormData},this.worker)];case 3:return p=i.sent(),y=e.organization||this.options.organization,[4,this._verifyIdToken(p.id_token,c,y)];case 4:return v=i.sent(),m=n(n({},p),{decodedToken:v,scope:f.scope,audience:f.audience||"default",client_id:this.options.client_id}),[4,this.cacheManager.set(m)];case 5:return i.sent(),this.cookieStorage.save(this.isAuthenticatedCookieName,!0,{daysUntilExpire:this.sessionCheckExpiryDays}),this._processOrgIdHint(v.claims.org_id),[2]}}))}))},e.prototype.getUser=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,n,r;return i(this,(function(o){switch(o.label){case 0:return t=e.audience||this.options.audience||"default",n=Oa(this.defaultScope,this.scope,e.scope),[4,this.cacheManager.get(new Ea({client_id:this.options.client_id,audience:t,scope:n}))];case 1:return [2,(r=o.sent())&&r.decodedToken&&r.decodedToken.user]}}))}))},e.prototype.getIdTokenClaims=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,n,r;return i(this,(function(o){switch(o.label){case 0:return t=e.audience||this.options.audience||"default",n=Oa(this.defaultScope,this.scope,e.scope),[4,this.cacheManager.get(new Ea({client_id:this.options.client_id,audience:t,scope:n}))];case 1:return [2,(r=o.sent())&&r.decodedToken&&r.decodedToken.claims]}}))}))},e.prototype.loginWithRedirect=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,n,o;return i(this,(function(i){switch(i.label){case 0:return t=e.redirectMethod,n=r(e,["redirectMethod"]),[4,this.buildAuthorizeUrl(n)];case 1:return o=i.sent(),window.location[t||"assign"](o),[2]}}))}))},e.prototype.handleRedirectCallback=function(e){return void 0===e&&(e=window.location.href),o(this,void 0,void 0,(function(){var t,r,o,c,s,u,l,f,d,h;return i(this,(function(i){switch(i.label){case 0:if(0===(t=e.split("?").slice(1)).length)throw new Error("There are no query params available for parsing.");if(r=function(e){e.indexOf("#")>-1&&(e=e.substr(0,e.indexOf("#")));var t=e.split("&"),n={};return t.forEach((function(e){var t=a(e.split("="),2),r=t[0],o=t[1];n[r]=decodeURIComponent(o);})),n.expires_in&&(n.expires_in=parseInt(n.expires_in)),n}(t.join("")),o=r.state,c=r.code,s=r.error,u=r.error_description,!(l=this.transactionManager.get()))throw new Error("Invalid state");if(this.transactionManager.remove(),s)throw new ia(s,u,o,l.appState);if(!l.code_verifier||l.state&&l.state!==o)throw new Error("Invalid state");return f={audience:l.audience,scope:l.scope,baseUrl:this.domainUrl,client_id:this.options.client_id,code_verifier:l.code_verifier,grant_type:"authorization_code",code:c,auth0Client:this.options.auth0Client,useFormData:this.options.useFormData},void 0!==l.redirect_uri&&(f.redirect_uri=l.redirect_uri),[4,Ia(f,this.worker)];case 1:return d=i.sent(),[4,this._verifyIdToken(d.id_token,l.nonce,l.organizationId)];case 2:return h=i.sent(),[4,this.cacheManager.set(n(n(n(n({},d),{decodedToken:h,audience:l.audience,scope:l.scope}),d.scope?{oauthTokenScope:d.scope}:null),{client_id:this.options.client_id}))];case 3:return i.sent(),this.cookieStorage.save(this.isAuthenticatedCookieName,!0,{daysUntilExpire:this.sessionCheckExpiryDays}),this._processOrgIdHint(h.claims.org_id),[2,{appState:l.appState}]}}))}))},e.prototype.checkSession=function(e){return o(this,void 0,void 0,(function(){var t;return i(this,(function(n){switch(n.label){case 0:if(!this.cookieStorage.get(this.isAuthenticatedCookieName)){if(!this.cookieStorage.get("auth0.is.authenticated"))return [2];this.cookieStorage.save(this.isAuthenticatedCookieName,!0,{daysUntilExpire:this.sessionCheckExpiryDays}),this.cookieStorage.remove("auth0.is.authenticated");}n.label=1;case 1:return n.trys.push([1,3,,4]),[4,this.getTokenSilently(e)];case 2:return n.sent(),[3,4];case 3:if(t=n.sent(),!ta.includes(t.error))throw t;return [3,4];case 4:return [2]}}))}))},e.prototype.getTokenSilently=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,o,a,c=this;return i(this,(function(i){return t=n(n({audience:this.options.audience,ignoreCache:!1},e),{scope:Oa(this.defaultScope,this.scope,e.scope)}),o=t.ignoreCache,a=r(t,["ignoreCache"]),[2,(s=function(){return c._getTokenSilently(n({ignoreCache:o},a))},u=this.options.client_id+"::"+a.audience+"::"+a.scope,l=Ga[u],l||(l=s().finally((function(){delete Ga[u],l=null;})),Ga[u]=l),l)];var s,u,l;}))}))},e.prototype._getTokenSilently=function(e){return void 0===e&&(e={}),o(this,void 0,void 0,(function(){var t,a,c,s,u,l,f,d,h;return i(this,(function(p){switch(p.label){case 0:return t=e.ignoreCache,a=r(e,["ignoreCache"]),t?[3,2]:[4,this._getEntryFromCache({scope:a.scope,audience:a.audience||"default",client_id:this.options.client_id,getDetailedEntry:e.detailedResponse})];case 1:if(c=p.sent())return [2,c];p.label=2;case 2:return [4,(y=function(){return Ha.acquireLock("auth0.lock.getTokenSilently",5e3)},v=10,void 0===v&&(v=3),o(void 0,void 0,void 0,(function(){var e;return i(this,(function(t){switch(t.label){case 0:e=0,t.label=1;case 1:return e<v?[4,y()]:[3,4];case 2:if(t.sent())return [2,!0];t.label=3;case 3:return e++,[3,1];case 4:return [2,!1]}}))})))];case 3:if(!p.sent())return [3,15];p.label=4;case 4:return p.trys.push([4,,12,14]),t?[3,6]:[4,this._getEntryFromCache({scope:a.scope,audience:a.audience||"default",client_id:this.options.client_id,getDetailedEntry:e.detailedResponse})];case 5:if(c=p.sent())return [2,c];p.label=6;case 6:return this.options.useRefreshTokens?[4,this._getTokenUsingRefreshToken(a)]:[3,8];case 7:return u=p.sent(),[3,10];case 8:return [4,this._getTokenFromIFrame(a)];case 9:u=p.sent(),p.label=10;case 10:return s=u,[4,this.cacheManager.set(n({client_id:this.options.client_id},s))];case 11:return p.sent(),this.cookieStorage.save(this.isAuthenticatedCookieName,!0,{daysUntilExpire:this.sessionCheckExpiryDays}),e.detailedResponse?(l=s.id_token,f=s.access_token,d=s.oauthTokenScope,h=s.expires_in,[2,n(n({id_token:l,access_token:f},d?{scope:d}:null),{expires_in:h})]):[2,s.access_token];case 12:return [4,Ha.releaseLock("auth0.lock.getTokenSilently")];case 13:return p.sent(),[7];case 14:return [3,16];case 15:throw new aa;case 16:return [2]}var y,v;}))}))},e.prototype.getTokenWithPopup=function(e,t){return void 0===e&&(e={}),void 0===t&&(t={}),o(this,void 0,void 0,(function(){return i(this,(function(r){switch(r.label){case 0:return e.audience=e.audience||this.options.audience,e.scope=Oa(this.defaultScope,this.scope,e.scope),t=n(n({},ea),t),[4,this.loginWithPopup(e,t)];case 1:return r.sent(),[4,this.cacheManager.get(new Ea({scope:e.scope,audience:e.audience||"default",client_id:this.options.client_id}))];case 2:return [2,r.sent().access_token]}}))}))},e.prototype.isAuthenticated=function(){return o(this,void 0,void 0,(function(){return i(this,(function(e){switch(e.label){case 0:return [4,this.getUser()];case 1:return [2,!!e.sent()]}}))}))},e.prototype.buildLogoutUrl=function(e){void 0===e&&(e={}),null!==e.client_id?e.client_id=e.client_id||this.options.client_id:delete e.client_id;var t=e.federated,n=r(e,["federated"]),o=t?"&federated":"";return this._url("/v2/logout?"+ya(n))+o},e.prototype.logout=function(e){var t=this;void 0===e&&(e={});var n=e.localOnly,o=r(e,["localOnly"]);if(n&&o.federated)throw new Error("It is invalid to set both the `federated` and `localOnly` options to `true`");var i=function(){if(t.cookieStorage.remove(t.orgHintCookieName),t.cookieStorage.remove(t.isAuthenticatedCookieName),!n){var e=t.buildLogoutUrl(o);window.location.assign(e);}};if(this.options.cache)return this.cacheManager.clear().then((function(){return i()}));this.cacheManager.clearSync(),i();},e.prototype._getTokenFromIFrame=function(e){return o(this,void 0,void 0,(function(){var t,o,a,c,s,u,l,f,d,h,p,y,v,m,g,b,w;return i(this,(function(i){switch(i.label){case 0:return t=pa(ha()),o=pa(ha()),a=ha(),[4,va(a)];case 1:c=i.sent(),s=ga(c),u=r(e,["detailedResponse"]),l=this._getParams(u,t,o,s,e.redirect_uri||this.options.redirect_uri||window.location.origin),(f=this.cookieStorage.get(this.orgHintCookieName))&&!l.organization&&(l.organization=f),d=this._authorizeUrl(n(n({},l),{prompt:"none",response_mode:"web_message"})),h=e.timeoutInSeconds||this.options.authorizeTimeoutInSeconds,i.label=2;case 2:if(i.trys.push([2,6,,7]),window.crossOriginIsolated)throw new oa("login_required","The application is running in a Cross-Origin Isolated context, silently retrieving a token without refresh token is not possible.");return [4,(S=d,_=this.domainUrl,k=h,void 0===k&&(k=60),new Promise((function(e,t){var n=window.document.createElement("iframe");n.setAttribute("width","0"),n.setAttribute("height","0"),n.style.display="none";var r,o=function(){window.document.body.contains(n)&&(window.document.body.removeChild(n),window.removeEventListener("message",r,!1));},i=setTimeout((function(){t(new aa),o();}),1e3*k);r=function(n){if(n.origin==_&&n.data&&"authorization_response"===n.data.type){var a=n.source;a&&a.close(),n.data.response.error?t(oa.fromPayload(n.data.response)):e(n.data.response),clearTimeout(i),window.removeEventListener("message",r,!1),setTimeout(o,2e3);}},window.addEventListener("message",r,!1),window.document.body.appendChild(n),n.setAttribute("src",S);})))];case 3:if(p=i.sent(),t!==p.state)throw new Error("Invalid state");return y=e.scope,v=e.audience,m=r(e,["scope","audience","redirect_uri","ignoreCache","timeoutInSeconds","detailedResponse"]),[4,Ia(n(n(n({},this.customOptions),m),{scope:y,audience:v,baseUrl:this.domainUrl,client_id:this.options.client_id,code_verifier:a,code:p.code,grant_type:"authorization_code",redirect_uri:l.redirect_uri,auth0Client:this.options.auth0Client,useFormData:this.options.useFormData}),this.worker)];case 4:return g=i.sent(),[4,this._verifyIdToken(g.id_token,o)];case 5:return b=i.sent(),this._processOrgIdHint(b.claims.org_id),[2,n(n({},g),{decodedToken:b,scope:l.scope,oauthTokenScope:g.scope,audience:l.audience||"default"})];case 6:throw "login_required"===(w=i.sent()).error&&this.logout({localOnly:!0}),w;case 7:return [2]}var S,_,k;}))}))},e.prototype._getTokenUsingRefreshToken=function(e){return o(this,void 0,void 0,(function(){var t,o,a,c,s,u,l,f,d;return i(this,(function(i){switch(i.label){case 0:return e.scope=Oa(this.defaultScope,this.options.scope,e.scope),[4,this.cacheManager.get(new Ea({scope:e.scope,audience:e.audience||"default",client_id:this.options.client_id}))];case 1:return (t=i.sent())&&t.refresh_token||this.worker?[3,3]:[4,this._getTokenFromIFrame(e)];case 2:return [2,i.sent()];case 3:o=e.redirect_uri||this.options.redirect_uri||window.location.origin,c=e.scope,s=e.audience,u=r(e,["scope","audience","ignoreCache","timeoutInSeconds","detailedResponse"]),l="number"==typeof e.timeoutInSeconds?1e3*e.timeoutInSeconds:null,i.label=4;case 4:return i.trys.push([4,6,,9]),[4,Ia(n(n(n(n(n({},this.customOptions),u),{audience:s,scope:c,baseUrl:this.domainUrl,client_id:this.options.client_id,grant_type:"refresh_token",refresh_token:t&&t.refresh_token,redirect_uri:o}),l&&{timeout:l}),{auth0Client:this.options.auth0Client,useFormData:this.options.useFormData}),this.worker)];case 5:return a=i.sent(),[3,9];case 6:return "The web worker is missing the refresh token"===(f=i.sent()).message||f.message&&f.message.indexOf("invalid refresh token")>-1?[4,this._getTokenFromIFrame(e)]:[3,8];case 7:return [2,i.sent()];case 8:throw f;case 9:return [4,this._verifyIdToken(a.id_token)];case 10:return d=i.sent(),[2,n(n({},a),{decodedToken:d,scope:e.scope,oauthTokenScope:a.scope,audience:e.audience||"default"})]}}))}))},e.prototype._getEntryFromCache=function(e){var t=e.scope,r=e.audience,a=e.client_id,c=e.getDetailedEntry,s=void 0!==c&&c;return o(this,void 0,void 0,(function(){var e,o,c,u,l;return i(this,(function(i){switch(i.label){case 0:return [4,this.cacheManager.get(new Ea({scope:t,audience:r,client_id:a}),60)];case 1:return (e=i.sent())&&e.access_token?s?(o=e.id_token,c=e.access_token,u=e.oauthTokenScope,l=e.expires_in,[2,n(n({id_token:o,access_token:c},u?{scope:u}:null),{expires_in:l})]):[2,e.access_token]:[2]}}))}))},e}();function nc(e){return o(this,void 0,void 0,(function(){var t;return i(this,(function(n){switch(n.label){case 0:return [4,(t=new ec(e)).checkSession()];case 1:return n.sent(),[2,t]}}))}))}

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /** Store for your data. 
    This assumes the data you're pulling back will be an array.
    If it's going to be an object, default this to an empty object.
    **/
    const apiData = writable([]);

    /** Data transformation.
    For our use case, we only care about the drink names, not the other information.
    Here, we'll create a derived store to hold the drink names.
    **/
    const spinners = derived(apiData, ($apiData) => {
      console.log($apiData);
      if ($apiData) {
        return $apiData
      }
      return []
    });

    const isAuthenticated = writable(false);
    const user = writable({});
    const popupOpen = writable(false);

    const tasks = writable([]);

    const user_tasks = derived([tasks, user], ([$tasks, $user]) => {
      let logged_in_user_tasks = [];

      if ($user && $user.email) {
        logged_in_user_tasks = $tasks.filter((task) => task.user === $user.email);
      }

      return logged_in_user_tasks
    });

    const config = {
        domain: "dev-094y38d9.us.auth0.com",
        clientId: "zTG0TmXS3lbEnLIBsTHt2GaRUBBBa9CN"
      };

    async function createClient() {
      let auth0Client = await nc({
        domain: config.domain,
        client_id: config.clientId
      });

      return auth0Client;
    }

    async function loginWithPopup(client, options) {
      popupOpen.set(true);
      try {
        await client.loginWithPopup(options);

        user.set(await client.getUser());
        isAuthenticated.set(true);
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      } finally {
        popupOpen.set(false);
      }
    }

    function logout(client) {
      return client.logout();
    }

    const auth = {
      createClient,
      loginWithPopup,
      logout
    };

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.44.2 */

    function create_fragment$9(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.44.2 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.44.2 */
    const file$7 = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$7(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$7, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelte-app\Components\SpinnerItem.svelte generated by Svelte v3.44.2 */

    const { console: console_1$4 } = globals;
    const file$6 = "svelte-app\\Components\\SpinnerItem.svelte";

    // (28:1) <Link to="/spinner/{id}">
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Details");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(28:1) <Link to=\\\"/spinner/{id}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let hr;
    	let t0;
    	let h1;
    	let t1;
    	let t2;
    	let small;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let link;
    	let t7;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	link = new Link({
    			props: {
    				to: "/spinner/" + /*id*/ ctx[1],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			hr = element("hr");
    			t0 = space();
    			h1 = element("h1");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = space();
    			small = element("small");
    			t3 = text("(");
    			t4 = text(/*id*/ ctx[1]);
    			t5 = text(")");
    			t6 = space();
    			create_component(link.$$.fragment);
    			t7 = space();
    			button = element("button");
    			button.textContent = "Delete";
    			add_location(hr, file$6, 24, 1, 414);
    			add_location(small, file$6, 25, 12, 433);
    			add_location(h1, file$6, 25, 1, 422);
    			add_location(button, file$6, 28, 1, 507);
    			add_location(div, file$6, 23, 0, 406);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, hr);
    			append_dev(div, t0);
    			append_dev(div, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, small);
    			append_dev(small, t3);
    			append_dev(small, t4);
    			append_dev(small, t5);
    			append_dev(div, t6);
    			mount_component(link, div, null);
    			append_dev(div, t7);
    			append_dev(div, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*deleteMe*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    			if (!current || dirty & /*id*/ 2) set_data_dev(t4, /*id*/ ctx[1]);
    			const link_changes = {};
    			if (dirty & /*id*/ 2) link_changes.to = "/spinner/" + /*id*/ ctx[1];

    			if (dirty & /*$$scope*/ 32) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(link);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SpinnerItem', slots, []);
    	const dispatch = createEventDispatcher();

    	function deleteMe() {
    		dispatch('delete', { spinnerId: id });
    	}

    	onMount(async () => {
    		console.log('spinner', spinner);
    	});

    	let { name } = $$props;
    	let { id } = $$props;
    	let { spinner } = $$props;
    	const writable_props = ['name', 'id', 'spinner'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<SpinnerItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('spinner' in $$props) $$invalidate(3, spinner = $$props.spinner);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		Router,
    		Link,
    		Route,
    		dispatch,
    		deleteMe,
    		name,
    		id,
    		spinner
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('spinner' in $$props) $$invalidate(3, spinner = $$props.spinner);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, id, deleteMe, spinner];
    }

    class SpinnerItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { name: 0, id: 1, spinner: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpinnerItem",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console_1$4.warn("<SpinnerItem> was created without expected prop 'name'");
    		}

    		if (/*id*/ ctx[1] === undefined && !('id' in props)) {
    			console_1$4.warn("<SpinnerItem> was created without expected prop 'id'");
    		}

    		if (/*spinner*/ ctx[3] === undefined && !('spinner' in props)) {
    			console_1$4.warn("<SpinnerItem> was created without expected prop 'spinner'");
    		}
    	}

    	get name() {
    		throw new Error("<SpinnerItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<SpinnerItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<SpinnerItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<SpinnerItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spinner() {
    		throw new Error("<SpinnerItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spinner(value) {
    		throw new Error("<SpinnerItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelte-app\Components\SpinnerForm.svelte generated by Svelte v3.44.2 */
    const file$5 = "svelte-app\\Components\\SpinnerForm.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let small;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let input;
    	let t6;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(/*name*/ ctx[1]);
    			t1 = space();
    			small = element("small");
    			t2 = text("(");
    			t3 = text(/*id*/ ctx[0]);
    			t4 = text(")");
    			t5 = space();
    			input = element("input");
    			t6 = space();
    			button = element("button");
    			button.textContent = "Save";
    			add_location(small, file$5, 30, 13, 638);
    			add_location(h1, file$5, 30, 2, 627);
    			add_location(input, file$5, 31, 2, 668);
    			add_location(button, file$5, 32, 2, 699);
    			add_location(div, file$5, 29, 0, 618);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, small);
    			append_dev(small, t2);
    			append_dev(small, t3);
    			append_dev(small, t4);
    			append_dev(div, t5);
    			append_dev(div, input);
    			set_input_value(input, /*name*/ ctx[1]);
    			append_dev(div, t6);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(button, "click", /*handleUpsert*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 2) set_data_dev(t0, /*name*/ ctx[1]);
    			if (dirty & /*id*/ 1) set_data_dev(t3, /*id*/ ctx[0]);

    			if (dirty & /*name*/ 2 && input.value !== /*name*/ ctx[1]) {
    				set_input_value(input, /*name*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SpinnerForm', slots, []);
    	const dispatch = createEventDispatcher();

    	function handleUpsert(event) {
    		const payload = {
    			name,
    			ownerEmail: "jonas@example.com",
    			ownerName: "jonas"
    		};

    		return fetch("/api/spinner", {
    			method: "POST",
    			body: JSON.stringify(payload),
    			headers: { "content-type": "application/json" }
    		}).then(response => response.json()).then(s => {
    			dispatch("append", { spinner: s });
    		});
    	}

    	let name;
    	let { id } = $$props;
    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SpinnerForm> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(1, name);
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		handleUpsert,
    		name,
    		id
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, name, handleUpsert, input_input_handler];
    }

    class SpinnerForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpinnerForm",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<SpinnerForm> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<SpinnerForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<SpinnerForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelte-app\Components\SpinnerList.svelte generated by Svelte v3.44.2 */

    const { console: console_1$3 } = globals;
    const file$4 = "svelte-app\\Components\\SpinnerList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (37:2) {#each $spinners as spinner}
    function create_each_block$1(ctx) {
    	let spinneritem;
    	let current;

    	spinneritem = new SpinnerItem({
    			props: {
    				spinner: /*spinner*/ ctx[3],
    				name: /*spinner*/ ctx[3].name,
    				id: /*spinner*/ ctx[3].id
    			},
    			$$inline: true
    		});

    	spinneritem.$on("delete", /*handleDelete*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(spinneritem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinneritem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const spinneritem_changes = {};
    			if (dirty & /*$spinners*/ 1) spinneritem_changes.spinner = /*spinner*/ ctx[3];
    			if (dirty & /*$spinners*/ 1) spinneritem_changes.name = /*spinner*/ ctx[3].name;
    			if (dirty & /*$spinners*/ 1) spinneritem_changes.id = /*spinner*/ ctx[3].id;
    			spinneritem.$set(spinneritem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinneritem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinneritem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinneritem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(37:2) {#each $spinners as spinner}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let h2;
    	let t1;
    	let t2;
    	let hr;
    	let t3;
    	let spinnerform;
    	let current;
    	let each_value = /*$spinners*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	spinnerform = new SpinnerForm({ $$inline: true });
    	spinnerform.$on("append", /*handleAppend*/ ctx[2]);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Spinners:";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			hr = element("hr");
    			t3 = space();
    			create_component(spinnerform.$$.fragment);
    			add_location(h2, file$4, 35, 2, 943);
    			add_location(hr, file$4, 45, 2, 1135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(spinnerform, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$spinners, handleDelete*/ 3) {
    				each_value = /*$spinners*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t2.parentNode, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(spinnerform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(spinnerform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t3);
    			destroy_component(spinnerform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $spinners;
    	validate_store(spinners, 'spinners');
    	component_subscribe($$self, spinners, $$value => $$invalidate(0, $spinners = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SpinnerList', slots, []);

    	onMount(async () => {
    		fetch("/api/spinner").then(response => response.json()).then(data => {
    			apiData.set(data);
    		}).catch(error => {
    			console.log(error);
    			return [];
    		});
    	});

    	function handleDelete(event) {
    		var state = $spinners.filter(s => s.id !== event.detail.spinnerId);
    		apiData.set(state);
    		return fetch(`/api/spinner/${event.detail.spinnerId}`, { method: "DELETE" }).then(response => response.json());
    	}

    	function handleAppend(event) {
    		console.log(event.detail.spinner);
    		var state = $spinners.concat([event.detail.spinner]);
    		apiData.set(state);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<SpinnerList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		apiData,
    		spinners,
    		SpinnerItem,
    		SpinnerForm,
    		handleDelete,
    		handleAppend,
    		$spinners
    	});

    	return [$spinners, handleDelete, handleAppend];
    }

    class SpinnerList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpinnerList",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* svelte-app\Components\DinnerItem.svelte generated by Svelte v3.44.2 */

    const { console: console_1$2 } = globals;
    const file$3 = "svelte-app\\Components\\DinnerItem.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let h2;
    	let t0_value = /*dinner*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "Delete";
    			add_location(h2, file$3, 20, 1, 326);
    			add_location(button, file$3, 22, 1, 354);
    			add_location(div, file$3, 19, 0, 318);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*deleteMe*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dinner*/ 1 && t0_value !== (t0_value = /*dinner*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DinnerItem', slots, []);
    	const dispatch = createEventDispatcher();

    	function deleteMe() {
    		dispatch('delete', { dinnerId: dinner.id });
    	}

    	onMount(async () => {
    		console.log('dinner', dinner);
    	});

    	let { dinner } = $$props;
    	const writable_props = ['dinner'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<DinnerItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('dinner' in $$props) $$invalidate(0, dinner = $$props.dinner);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		dispatch,
    		deleteMe,
    		dinner
    	});

    	$$self.$inject_state = $$props => {
    		if ('dinner' in $$props) $$invalidate(0, dinner = $$props.dinner);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dinner, deleteMe];
    }

    class DinnerItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { dinner: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DinnerItem",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*dinner*/ ctx[0] === undefined && !('dinner' in props)) {
    			console_1$2.warn("<DinnerItem> was created without expected prop 'dinner'");
    		}
    	}

    	get dinner() {
    		throw new Error("<DinnerItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dinner(value) {
    		throw new Error("<DinnerItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelte-app\Components\DinnerForm.svelte generated by Svelte v3.44.2 */
    const file$2 = "svelte-app\\Components\\DinnerForm.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let small;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let input;
    	let t6;
    	let textarea;
    	let t7;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			small = element("small");
    			t2 = text("(");
    			t3 = text(/*id*/ ctx[1]);
    			t4 = text(")");
    			t5 = space();
    			input = element("input");
    			t6 = space();
    			textarea = element("textarea");
    			t7 = space();
    			button = element("button");
    			button.textContent = "Save";
    			add_location(small, file$2, 29, 13, 615);
    			add_location(h1, file$2, 29, 2, 604);
    			add_location(input, file$2, 30, 2, 645);
    			add_location(textarea, file$2, 31, 2, 676);
    			add_location(button, file$2, 32, 2, 701);
    			add_location(div, file$2, 28, 0, 595);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, small);
    			append_dev(small, t2);
    			append_dev(small, t3);
    			append_dev(small, t4);
    			append_dev(div, t5);
    			append_dev(div, input);
    			set_input_value(input, /*name*/ ctx[0]);
    			append_dev(div, t6);
    			append_dev(div, textarea);
    			append_dev(div, t7);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(button, "click", /*handleUpsert*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);
    			if (dirty & /*id*/ 2) set_data_dev(t3, /*id*/ ctx[1]);

    			if (dirty & /*name*/ 1 && input.value !== /*name*/ ctx[0]) {
    				set_input_value(input, /*name*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DinnerForm', slots, []);
    	const dispatch = createEventDispatcher();

    	function handleUpsert(event) {
    		const payload = { name, ingredients: [] };

    		return fetch(`/api/spinner/${id}/dinners`, {
    			method: "POST",
    			body: JSON.stringify(payload),
    			headers: { "content-type": "application/json" }
    		}).then(response => response.json()).then(d => {
    			dispatch("append", { spinner: d });
    		});
    	}

    	let { name } = $$props;
    	let { id } = $$props;
    	const writable_props = ['name', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DinnerForm> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		handleUpsert,
    		name,
    		id
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, id, handleUpsert, input_input_handler];
    }

    class DinnerForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { name: 0, id: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DinnerForm",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<DinnerForm> was created without expected prop 'name'");
    		}

    		if (/*id*/ ctx[1] === undefined && !('id' in props)) {
    			console.warn("<DinnerForm> was created without expected prop 'id'");
    		}
    	}

    	get name() {
    		throw new Error("<DinnerForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<DinnerForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<DinnerForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<DinnerForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelte-app\Components\SpinnerDetails.svelte generated by Svelte v3.44.2 */

    const { console: console_1$1 } = globals;
    const file$1 = "svelte-app\\Components\\SpinnerDetails.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (43:2) {#each dinners as dinner}
    function create_each_block(ctx) {
    	let dinneritem;
    	let current;

    	dinneritem = new DinnerItem({
    			props: { dinner: /*dinner*/ ctx[8] },
    			$$inline: true
    		});

    	dinneritem.$on("delete", /*handleUpdate*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(dinneritem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dinneritem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dinneritem_changes = {};
    			if (dirty & /*dinners*/ 2) dinneritem_changes.dinner = /*dinner*/ ctx[8];
    			dinneritem.$set(dinneritem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dinneritem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dinneritem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dinneritem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(43:2) {#each dinners as dinner}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let small;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let hr0;
    	let t6;
    	let t7;
    	let hr1;
    	let t8;
    	let dinnerform;
    	let current;
    	let each_value = /*dinners*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	dinnerform = new DinnerForm({
    			props: { id: /*id*/ ctx[0] },
    			$$inline: true
    		});

    	dinnerform.$on("append", /*handleAppend*/ ctx[3]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[2]);
    			t1 = space();
    			small = element("small");
    			t2 = text("(");
    			t3 = text(/*id*/ ctx[0]);
    			t4 = text(")");
    			t5 = space();
    			hr0 = element("hr");
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			hr1 = element("hr");
    			t8 = space();
    			create_component(dinnerform.$$.fragment);
    			add_location(small, file$1, 39, 14, 889);
    			add_location(h1, file$1, 39, 2, 877);
    			add_location(hr0, file$1, 40, 2, 919);
    			add_location(hr1, file$1, 49, 2, 1046);
    			add_location(div, file$1, 38, 0, 868);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, small);
    			append_dev(small, t2);
    			append_dev(small, t3);
    			append_dev(small, t4);
    			append_dev(div, t5);
    			append_dev(div, hr0);
    			append_dev(div, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t7);
    			append_dev(div, hr1);
    			append_dev(div, t8);
    			mount_component(dinnerform, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 4) set_data_dev(t0, /*title*/ ctx[2]);
    			if (!current || dirty & /*id*/ 1) set_data_dev(t3, /*id*/ ctx[0]);

    			if (dirty & /*dinners, handleUpdate*/ 18) {
    				each_value = /*dinners*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t7);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const dinnerform_changes = {};
    			if (dirty & /*id*/ 1) dinnerform_changes.id = /*id*/ ctx[0];
    			dinnerform.$set(dinnerform_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(dinnerform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(dinnerform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			destroy_component(dinnerform);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let title;
    	let dinners;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SpinnerDetails', slots, []);
    	const dispatch = createEventDispatcher();

    	function getDetails() {
    		return fetch(`/api/spinner/${id}`).then(response => response.json()).then(s => {
    			$$invalidate(5, spinner = s);
    		});
    	}

    	onMount(async () => {
    		await getDetails();
    	});

    	function handleAppend(event) {
    		console.log("event", event);
    		$$invalidate(5, spinner = event.detail.spinner);
    	}

    	function handleUpdate(event) {
    		console.log("event", event);
    		$$invalidate(5, spinner = event.detail.spinner);
    	}

    	let spinner = null;
    	let { id } = $$props;
    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<SpinnerDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		DinnerItem,
    		DinnerForm,
    		dispatch,
    		getDetails,
    		handleAppend,
    		handleUpdate,
    		spinner,
    		id,
    		dinners,
    		title
    	});

    	$$self.$inject_state = $$props => {
    		if ('spinner' in $$props) $$invalidate(5, spinner = $$props.spinner);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('dinners' in $$props) $$invalidate(1, dinners = $$props.dinners);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*spinner*/ 32) {
    			$$invalidate(2, title = spinner && spinner.name || "Loading...");
    		}

    		if ($$self.$$.dirty & /*spinner*/ 32) {
    			$$invalidate(1, dinners = spinner && spinner.dinners || []);
    		}
    	};

    	return [id, dinners, title, handleAppend, handleUpdate, spinner];
    }

    class SpinnerDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpinnerDetails",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console_1$1.warn("<SpinnerDetails> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<SpinnerDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<SpinnerDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelte-app\App.svelte generated by Svelte v3.44.2 */

    const { console: console_1 } = globals;
    const file = "svelte-app\\App.svelte";

    // (65:2) {:else}
    function create_else_block_1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = " ";
    			add_location(span, file, 64, 9, 1641);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(65:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:2) {#if $isAuthenticated}
    function create_if_block_1(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*$user*/ ctx[3].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*$user*/ ctx[3].email + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("  ");
    			t1 = text(t1_value);
    			t2 = text(" (");
    			t3 = text(t3_value);
    			t4 = text(")");
    			attr_dev(span, "class", "text-white");
    			add_location(span, file, 63, 2, 1558);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$user*/ 8 && t1_value !== (t1_value = /*$user*/ ctx[3].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$user*/ 8 && t3_value !== (t3_value = /*$user*/ ctx[3].email + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(63:2) {#if $isAuthenticated}",
    		ctx
    	});

    	return block;
    }

    // (70:2) {:else}
    function create_else_block(ctx) {
    	let li;
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			a.textContent = "Log In";
    			attr_dev(a, "class", "nav-link");
    			attr_dev(a, "href", "/#");
    			add_location(a, file, 71, 4, 1834);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file, 70, 2, 1807);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*login*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(70:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (66:2) {#if $isAuthenticated}
    function create_if_block(ctx) {
    	let li;
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			a.textContent = "Log Out";
    			attr_dev(a, "class", "nav-link");
    			attr_dev(a, "href", "/#");
    			add_location(a, file, 67, 4, 1722);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file, 66, 2, 1695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*logout*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(66:2) {#if $isAuthenticated}",
    		ctx
    	});

    	return block;
    }

    // (79:6) <Link to="/">
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(79:6) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (82:6) <Route path="spinner/:id" let:params>
    function create_default_slot_1(ctx) {
    	let spinnerdetails;
    	let current;

    	spinnerdetails = new SpinnerDetails({
    			props: { id: /*params*/ ctx[10].id },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(spinnerdetails.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinnerdetails, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const spinnerdetails_changes = {};
    			if (dirty & /*params*/ 1024) spinnerdetails_changes.id = /*params*/ ctx[10].id;
    			spinnerdetails.$set(spinnerdetails_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinnerdetails.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinnerdetails.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinnerdetails, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(82:6) <Route path=\\\"spinner/:id\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (77:2) <Router {url}>
    function create_default_slot(ctx) {
    	let nav;
    	let link;
    	let t0;
    	let div;
    	let route0;
    	let t1;
    	let route1;
    	let current;

    	link = new Link({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route({
    			props: {
    				path: "spinner/:id",
    				$$slots: {
    					default: [
    						create_default_slot_1,
    						({ params }) => ({ 10: params }),
    						({ params }) => params ? 1024 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: { path: "/", component: SpinnerList },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			create_component(link.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t1 = space();
    			create_component(route1.$$.fragment);
    			add_location(nav, file, 77, 4, 1939);
    			add_location(div, file, 80, 4, 1994);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			mount_component(link, nav, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t1);
    			mount_component(route1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			const route0_changes = {};

    			if (dirty & /*$$scope, params*/ 3072) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(77:2) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let router;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*$isAuthenticated*/ ctx[2]) return create_if_block_1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*$isAuthenticated*/ ctx[2]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[1],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text("Hello ");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = text("!");
    			t3 = space();
    			if_block0.c();
    			t4 = space();
    			if_block1.c();
    			t5 = space();
    			create_component(router.$$.fragment);
    			add_location(h1, file, 61, 2, 1506);
    			attr_dev(main, "class", "svelte-11721hq");
    			add_location(main, file, 60, 0, 1496);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(main, t3);
    			if_block0.m(main, null);
    			append_dev(main, t4);
    			if_block1.m(main, null);
    			append_dev(main, t5);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(main, t4);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(main, t5);
    				}
    			}

    			const router_changes = {};
    			if (dirty & /*url*/ 2) router_changes.url = /*url*/ ctx[1];

    			if (dirty & /*$$scope*/ 2048) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block0.d();
    			if_block1.d();
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $spinners;
    	let $isAuthenticated;
    	let $user;
    	validate_store(spinners, 'spinners');
    	component_subscribe($$self, spinners, $$value => $$invalidate(7, $spinners = $$value));
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(2, $isAuthenticated = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(3, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let auth0Client;

    	onMount(async () => {
    		auth0Client = await auth.createClient();
    		console.log('auth0Client', auth0Client);
    		isAuthenticated.set(await auth0Client.isAuthenticated());
    		user.set(await auth0Client.getUser());

    		fetch("/api/spinner").then(response => response.json()).then(data => {
    			apiData.set(data);
    		}).catch(error => {
    			console.log(error);
    			return [];
    		});
    	});

    	function login() {
    		auth.loginWithPopup(auth0Client);
    	}

    	function logout() {
    		auth.logout(auth0Client);
    	}

    	function handleDelete(event) {
    		var state = $spinners.filter(s => s.id !== event.detail.spinnerId);
    		apiData.set(state);
    		return fetch(`/api/spinner/${event.detail.spinnerId}`, { method: "DELETE" }).then(response => response.json());
    	}

    	function handleAppend(event) {
    		console.log(event.detail.spinner);
    		var state = $spinners.concat([event.detail.spinner]);
    		apiData.set(state);
    	}

    	let { name } = $$props;
    	let { url = "" } = $$props;
    	const writable_props = ['name', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('url' in $$props) $$invalidate(1, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		auth,
    		apiData,
    		spinners,
    		isAuthenticated,
    		user,
    		user_tasks,
    		tasks,
    		Router,
    		Link,
    		Route,
    		SpinnerList,
    		SpinnerDetails,
    		auth0Client,
    		login,
    		logout,
    		handleDelete,
    		handleAppend,
    		name,
    		url,
    		$spinners,
    		$isAuthenticated,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('auth0Client' in $$props) auth0Client = $$props.auth0Client;
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('url' in $$props) $$invalidate(1, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, url, $isAuthenticated, $user, login, logout];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0, url: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console_1.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'xing zen app'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
