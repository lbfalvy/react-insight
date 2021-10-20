# Visitor UI

Select your UI components based on the types you're rendering.
This package helps with building debug UIs, by providing a flexible
framework to describe how things should be rendered. It also provides a
handy set of defaults to render primitives, objects, arrays and some
standard library classes.

## Basic Usage

Use the `Render` exported component to render any variable, recursively
resolving the appropriate components.

```tsx
<Render data={myObject} />
```

## Defining custom renderers

Write a `TypemapConfig` object that contains your custom settings.

```tsx
const tmconfig = {
  test: [
    f => f && typeof f == 'object' && f.someCustomTest == 'someValue',
    [
      ({ data, tm }) => <>SomeCustomReact</>,
      (data, tm, length) => 'Some custom string representation not longer than {length}'
    ]
  ],
  instanceof: [MyClass, [... /* same tuple as above */ ]]
}
```
Notes:
 - tm is the typemap for recursive rendering
 - too long strings will be ellipsised
 - Either the component or the string function can be omitted

## Using custom configs (context)

First, change your `Render` call to be
```tsx
const typemap = useTypemap()
...
<Render data={myObject} tm={typemap}>
```

Then, link the custom configs using the `Provider` component, which works
exactly like a context provider only it combines the previous value with
the current one. For finer control, you can also use `Extender` which
takes a callback, and `merge` which combines two configs such that the
second one overrides the first.
```tsx
<Extender callback={cfg => merge({ /* fallback config (overridden by previous) */ }, cfg)}>
```

## Using custom configs (advanced)

If you don't want to use React Context, you can also manipulate configs
in any other way. Once you have your final config, use `compileTypemap`
to turn it into a typemap that can be passed to Render.

`compileTypemap` is a bit too long to be run on every render so we
suggest persisting the result.

## Contribution

Default renderers for standard library classes and interfaces are always
welcome.